import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, FlatList, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import BottomNavbar from "../../components/BottomNavbar";
import GroupCard from "../../components/GroupCard";
import { fetchUserEvents, fetchEventDetails, fetchEventParticipantExpenses, fetchEventParticipants } from "../../services/eventService";

type Group = {
  groupId: string;
  groupName: string;
  date: string;
  members: number;
  expenses: number;
  paid: number;
  creadoPor: number;
};

export default function MyGroups() {
  const { user } = useUser();
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);

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

  const fetchGroups = async () => {
    try {
      setLoading(true);
      if (!userId) throw new Error("User ID not found");
  
      const events = await fetchUserEvents(userId);
  
      const mappedGroups: Group[] = events.map((item: any) => ({
        groupId: item.evento_id.toString(),
        groupName: item.nombre_evento,
        date: "",
        members: item.cantidad_participantes,
        expenses: 0, // Inicializa en 0, se actualizará con la suma de gastos de los miembros
        paid: 0, // Inicializa en 0, se actualizará con la cantidad de pagos de los miembros
        creadoPor: 0,
      }));
  
      const groupsWithDatesAndExpenses = await Promise.all(
        mappedGroups.map(async (group): Promise<Group> => {
          const { fecha, creado_por } = await fetchEventDetails(group.groupId);
  
          // Obtenemos los participantes del evento y calculamos los gastos de cada uno
          const participants = await fetchEventParticipants(group.groupId);
          let totalExpenses = 0;
          let totalPaid = 0; // Variable para contar los pagos realizados
  
          await Promise.all(
            participants.map(async (participant: any) => {
              const expenses = await fetchEventParticipantExpenses(
                participant.participante_id,
                group.groupId
              );
  
              const balance = expenses.reduce(
                (sum: number, expense: any) => sum + parseFloat(expense.monto_gasto),
                0
              );
              totalExpenses += balance;
  
              // Incrementar el contador de pagos si el participante ha pagado
              if (participant.ha_pagado) {
                totalPaid += 1;
              }
            })
          );
  
          return {
            ...group,
            date: fecha,
            creadoPor: creado_por, // Actualiza el valor de creado_por
            expenses: totalExpenses,
            paid: totalPaid,
          };
        })
      );
  
      setGroups(groupsWithDatesAndExpenses);
    } catch (error) {
      console.error("Error fetching groups:", error);
      Alert.alert("Error", "Ocurrió un error al obtener los grupos.");
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    getUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchGroups();
    }
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>
        Welcome to My Groups, {user?.emailAddresses[0].emailAddress}
      </Text>
      <FlatList style={styles.groupList}
        data={groups}
        renderItem={({ item }) => (
          <GroupCard
            groupId={item.groupId}
            groupName={item.groupName}
            date={item.date}
            members={item.members}
            expenses={item.expenses}
            paid={item.paid}
            creadoPor={item.creadoPor} // Pasa el valor de creado_por al componente
            userId={userId || 0} // Pasa el userId del usuario actual
          />
        )}
        keyExtractor={(item) => item.groupId}
        contentContainerStyle={styles.groupList}
      />
      <BottomNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 60,
    backgroundColor: "#ECE2D9",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "600",
    textAlign: "center",
    color: "#262626",
    paddingTop: 20,
  },
  groupList: {
    paddingLeft: 20,
    paddingRight: 20,
  },
});
