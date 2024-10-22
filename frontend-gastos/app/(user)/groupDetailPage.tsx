import React from "react";
import { View, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import GroupDetails from "../../components/GroupDetails";
import BottomNavbar from "../../components/BottomNavbar"; // Ajusta la ruta según tu estructura

export default function GroupDetailPage() {
  const { groupId } = useLocalSearchParams();

  // Datos estáticos de ejemplo
  const groupData = {
    groupName: "Salida TechZone",
    date: "Oct 10",
    membersCount: 5,
    totalExpenses: 124,
    paidCount: 2,
    description: "Evento por los juegos jugados",
  };

  const members = [
    {
      id: "1",
      name: "Integrante 1",
      balance: 57,
      expenses: [
        { item: "Coca-cola", amount: 5 },
        { item: "Hamburguesa", amount: 124 },
        { item: "Helado", amount: 2 },
      ],
    },
    { id: "2", name: "Integrante 2", balance: 57, expenses: [] },
    { id: "3", name: "Integrante 3", balance: 57, expenses: [] },
  ];

  return (
    <View style={styles.pageContainer}>
      <GroupDetails groupData={groupData} members={members} />
      <BottomNavbar
        actionLabel="Añadir participante"
        actionPath="./addParticipant"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingBottom: 60, // Ajuste para que el contenido no se superponga con el navbar
  },
});
