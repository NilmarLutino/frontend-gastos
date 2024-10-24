import React from "react";
import { View, Text, StyleSheet, Button, FlatList } from "react-native";
import MemberCard from "./MemberCard";

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
  onRefresh: () => void; // Añade esta prop
};

export default function GroupDetails({ groupData, members, onRefresh }: GroupDetailsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.groupTitle}>{groupData.groupName}</Text>
      <Text style={styles.details}>Integrantes: {groupData.membersCount}</Text>
      <Text style={styles.details}>Gastos totales: {groupData.totalExpenses}$</Text>
      <Text style={styles.details}>Pagados: {groupData.paidCount}</Text>
      <Text style={styles.details}>Descripción: {groupData.description}</Text>
      <Button title="Comprobantes" onPress={() => console.log("Ver Comprobantes")} />

      <FlatList
        data={members}
        renderItem={({ item }) => (
          <MemberCard member={item} onRefresh={onRefresh} /> // Pasa la prop onRefresh a cada MemberCard
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  details: {
    marginVertical: 5,
    fontSize: 14,
  },
});
