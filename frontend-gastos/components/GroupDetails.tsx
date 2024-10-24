import React from "react";
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity } from "react-native";
import MemberCard from "./MemberCard"; // Asegúrate de ajustar la ruta según la estructura

type GroupDetailsProps = {
  groupData: {
    groupName: string;
    date: string;
    membersCount: number;
    totalExpenses: number;
    paidCount: number;
    description: string;
  };
  members: {
    id: string;
    name: string;
    balance: number;
    expenses: { item: string; amount: number }[];
  }[];
};

export default function GroupDetails({ groupData, members }: GroupDetailsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.groupTitle}>{groupData.groupName}</Text>
      <Text style={styles.details}>Integrantes: <Text style={styles.ammo}>{groupData.membersCount}</Text></Text>
      <Text style={styles.details}>Gastos totales: <Text style={styles.ammo}>{groupData.totalExpenses}$</Text></Text>
      <Text style={styles.details}>Pagados: <Text style={styles.ammo}>{groupData.paidCount}</Text></Text>
      <Text style={styles.description}>Descripción: 
        <Text style={styles.descriptionContent}>{groupData.description}</Text></Text>
      <TouchableOpacity onPress={() => console.log("Ver Comprobantes")} style={styles.button}>
      <Text style={styles.buttonText}>Comprobantes</Text>
      </TouchableOpacity>

      <FlatList
      data={members}
      renderItem={({ item }) => <MemberCard member={item} />}
      keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ECE2D9",
  },
  groupTitle: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  details: {
    marginVertical: 5,
    fontSize: 18,
    fontWeight: "600",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#BF0413",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    textAlign: "center",
    color: "#f2f2f2",
    fontSize: 16,
    fontWeight: 600,
  },
  description: {
    display: "flex",
    flexDirection: "column",
    fontSize: 18,
    fontWeight: "600",
    gap: 5,
  },
  descriptionContent: {
    color: "#555",
    fontWeight: "400",
    fontSize: 16,
  },
  ammo: {
    color: "#262626",
  },
});
