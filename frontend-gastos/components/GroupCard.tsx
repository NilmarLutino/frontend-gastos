import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

type GroupCardProps = {
  groupId: string;
  groupName: string;
  date: string;
  members: number;
  expenses: number;
  paid: number;
};

export default function GroupCard({
  groupId,
  groupName,
  date,
  members,
  expenses,
  paid,
}: GroupCardProps) {
  const router = useRouter();

  const handleDetails = () => {
    // Navega a la página de detalles del grupo con el groupId
    router.push({ pathname: "/(user)/groupDetailPage", params: { groupId } });
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.groupTitle}>{groupName}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <Text style={styles.details}>Integrantes: <Text style={styles.ammo}>{members}</Text></Text>
      <Text style={styles.details}>Gastos totales: <Text style={styles.ammo}>{expenses}$</Text></Text>
      <Text style={styles.details}>Pagados: <Text style={styles.ammo}>{paid}</Text></Text>
      <TouchableOpacity style={styles.detailsButton} onPress={handleDetails}>
        <Text style={styles.detailsButtonText}>Ver detalles</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f2f2f2",
    paddingTop: 20,
    marginVertical: 10,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
    position: "relative",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#262626",
  },
  date: {
    fontSize: 12,
    color: "#555",
  },
  details: {
    display: "flex",
    paddingHorizontal: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    fontSize: 16,
    fontWeight: "500",
    color: "#262626",
  },
  ammo: {
    color: "#262626",
  },
  detailsButton: {
    backgroundColor: "#BF0413",
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: "100%",
    alignSelf: "flex-end",
    marginTop: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  detailsButtonText: {
    color: "#f2f2f2",
    fontSize: 16,
    textAlign: "center",
    fontWeight: 500,
  },
});
