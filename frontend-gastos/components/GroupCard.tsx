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
  creadoPor: number;
  userId: number;
};

export default function GroupCard({
  groupId,
  groupName,
  date,
  members,
  expenses,
  paid,
  creadoPor,
  userId,
}: GroupCardProps) {
  const router = useRouter();

  const handleDetails = () => {
    router.push({ pathname: "/(user)/groupDetailPage", params: { groupId } });
    console.log(groupId);
  };

  // Determinar si el usuario es el propietario o un invitado
  const userRole = userId === creadoPor ? "Propietario" : "Invitado";

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.groupTitle}>{groupName}</Text>
        <View style={styles.dateContainer}>
          <Text style={styles.date}>{date}</Text>
          <Text style={styles.roleText}>{userRole}</Text>
        </View>
      </View>
      <Text style={styles.details}>Integrantes: {members}</Text>
      <Text style={styles.details}>Gastos totales: {expenses}$</Text>
      <Text style={styles.details}>Pagados: {paid}</Text>
      <TouchableOpacity style={styles.detailsButton} onPress={handleDetails}>
        <Text style={styles.detailsButtonText}>Ver detalles</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: "relative",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  dateContainer: {
    alignItems: "flex-end",
  },
  date: {
    fontSize: 12,
    color: "#888",
  },
  roleText: {
    fontSize: 12,
    color: "#555",
    marginTop: 2,
  },
  details: {
    marginTop: 10,
    marginBottom: 5,
    fontSize: 14,
    color: "#555",
  },
  detailsButton: {
    backgroundColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignSelf: "flex-start",
    marginTop: 10,
  },
  detailsButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  favoriteIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});
