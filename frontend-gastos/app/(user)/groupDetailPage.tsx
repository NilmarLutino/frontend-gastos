import React, { useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator, Alert, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GroupDetails from "../../components/GroupDetails";
import BottomNavbar from "../../components/BottomNavbarGroupView";
import AddMember from "../../components/modals/addMember";
import ModalError from "../../components/modals/modalError";
import { fetchEventSummary, fetchEventParticipants, fetchEventParticipantExpenses, addParticipant, fetchUserByEmail } from "../../services/eventService"; // Asegúrate de tener estas funciones
import BottomNavbarGroupView from "../../components/BottomNavbarGroupView";

// Definición de GroupData
type GroupData = {
  groupName: string;
  date: string;
  membersCount: number;
  totalExpenses: number;
  paidCount: number;
  description: string;
  members: { id: string; name: string; balance: number; expenses: { item: string; amount: number }[] }[];
};

export default function GroupDetailPage() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const [groupData, setGroupData] = useState<GroupData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isAddMemberVisible, setAddMemberVisible] = useState<boolean>(false);
  const [isModalErrorVisible, setModalErrorVisible] = useState<boolean>(false);
  const [userId, setUserId] = useState<number | null>(null);

  // Función para obtener el userId de AsyncStorage
  const getUserId = async () => {
    try {
      const id = await AsyncStorage.getItem("userId");
      if (id) {
        setUserId(parseInt(id, 10));
        console.log("User ID retrieved from storage:", id);
      }
    } catch (error) {
      console.error("Failed to get user ID:", error);
    }
  };

  // Función para cargar los datos del grupo
  const fetchGroupData = async () => {
    try {
      setLoading(true);
      if (!groupId) throw new Error("Group ID is missing");
      if (!userId) throw new Error("User ID is missing");

      const eventSummary = await fetchEventSummary(groupId, userId);
      const participants = await fetchEventParticipants(groupId);

      const members = await Promise.all(
        participants.map(async (participant: any) => {
          const expenses = await fetchEventParticipantExpenses(participant.participante_id, groupId);
          const balance = expenses.reduce((total: number, expense: any) => total + parseFloat(expense.monto_gasto), 0);

          return {
            id: participant.participante_id.toString(),
            name: participant.nombre_usuario,
            balance,
            expenses: expenses.map((expense: any) => ({
              item: expense.descripcion_gasto,
              amount: parseFloat(expense.monto_gasto),
            })),
          };
        })
      );

      const totalExpenses = members.reduce((total, member) => total + member.balance, 0);

      const mappedData: GroupData = {
        groupName: eventSummary.nombre_evento,
        date: "2024-11-01",
        membersCount: eventSummary.cantidad_integrantes,
        totalExpenses,
        paidCount: eventSummary.cantidad_pagados,
        description: eventSummary.descripcion || "",
        members,
      };

      setGroupData(mappedData);
    } catch (error) {
      console.error("Error fetching group summary:", error);
      setErrorMessage("Error al obtener los detalles del evento.");
    } finally {
      setLoading(false);
    }
  };

  // Función para recargar los datos del grupo
  const onRefresh = () => {
    fetchGroupData();
  };

  // Función para buscar y agregar un participante por correo
  const handleBuscarUsuario = async (email: string) => {
    try {
      const user = await fetchUserByEmail(email);
      if (user) {
        await addParticipant(groupId, user.id, 4); // Ajusta el roles_id según tu necesidad.
        setAddMemberVisible(false);
        onRefresh();
        Alert.alert("Éxito", "Participante añadido correctamente");
      } else {
        setErrorMessage("Usuario no encontrado, verifique si el correo es correcto");
        setModalErrorVisible(true);
      }
    } catch (error) {
      setErrorMessage("Error al añadir el participante");
      setModalErrorVisible(true);
    }
  };

  useEffect(() => {
    getUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchGroupData();
    }
  }, [userId, groupId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!groupData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Error al cargar los detalles del grupo</Text>
      </View>
    );
  }

  return (
    <View style={styles.pageContainer}>
      <GroupDetails
        groupData={groupData}
        members={groupData.members}
        onRefresh={onRefresh}
      />
      <AddMember
        visible={isAddMemberVisible}
        onClose={() => setAddMemberVisible(false)}
        onBuscar={handleBuscarUsuario}
      />
      <ModalError
        visible={isModalErrorVisible}
        onClose={() => setModalErrorVisible(false)}
        message={errorMessage}
      />
      <BottomNavbarGroupView
  actionLabel="Añadir participante"
  onAction={() => setAddMemberVisible(true)}
  onAddMember={() => setAddMemberVisible(true)} // Asegúrate de pasar esta función.
/>

    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingBottom: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
