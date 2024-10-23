import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "@clerk/clerk-expo";
import { Text, View, StyleSheet, FlatList, ActivityIndicator, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import BottomNavbar from "../../components/BottomNavbar";
import GroupCard from "../../components/GroupCard";
import { fetchUserEvents, fetchEventDate } from "../../services/eventService";

// Define el tipo para los grupos
type Group = {
  groupId: string;
  groupName: string;
  date: string;
  members: number;
  expenses: number;
  paid: number;
};

export default function MyGroups() {
  const { user } = useUser();
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
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

  // Función para obtener los datos de los grupos y luego la fecha de cada uno
  const fetchGroups = async () => {
    try {
      setLoading(true);
      if (!userId) throw new Error("User ID not found");

      // Obtén los eventos del usuario
      const events = await fetchUserEvents(userId);

      // Mapea los eventos al formato esperado
      const mappedGroups: Group[] = events.map((item: any) => ({
        groupId: item.evento_id.toString(),
        groupName: item.nombre_evento,
        date: "", // Deja la fecha vacía inicialmente
        members: item.cantidad_participantes,
        expenses: item.cantidad_gastos,
        paid: item.cantidad_pagos,
      }));

      // Realiza una solicitud adicional para obtener la fecha de cada evento
      const groupsWithDates = await Promise.all(
        mappedGroups.map(async (group): Promise<Group> => {
          const date = await fetchEventDate(group.groupId);
          return {
            ...group,
            date, // Actualiza la fecha obtenida
          };
        })
      );

      // Actualiza el estado de los grupos solo cuando todas las fechas estén disponibles
      setGroups(groupsWithDates);
    } catch (error) {
      console.error("Error fetching groups:", error);
      Alert.alert("Error", "Ocurrió un error al obtener los grupos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserId(); // Recupera el userId de AsyncStorage al montar el componente
  }, []);

  useEffect(() => {
    if (userId) {
      fetchGroups(); // Solo llama a fetchGroups si el userId está disponible
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
      <FlatList
        data={groups}
        renderItem={({ item }) => (
          <GroupCard
            groupId={item.groupId}
            groupName={item.groupName}
            date={item.date}
            members={item.members}
            expenses={item.expenses}
            paid={item.paid}
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
    padding: 10,
    paddingBottom: 60,
    backgroundColor: "#ffffff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  groupList: {
    paddingBottom: 20,
  },
});
