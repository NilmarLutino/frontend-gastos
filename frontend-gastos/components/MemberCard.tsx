import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Button } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

type Expense = {
  item: string;
  amount: number;
};

type MemberCardProps = {
  member: {
    id: string;
    name: string;
    balance: number;
    expenses: Expense[];
  };
};

export default function MemberCard({ member }: MemberCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.header} onPress={toggleExpand}>
        <Text style={styles.memberName}>{member.name}</Text>
        <Text style={styles.balance}>{member.balance}$</Text>
        <FontAwesome name={isExpanded ? "chevron-up" : "chevron-down"} size={18} color="#000" />
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.expandedContent}>
          <FlatList
            data={member.expenses}
            renderItem={({ item }) => (
              <View style={styles.expenseItem}>
                <Text style={styles.expenseText}>{item.item}</Text>
                <Text style={styles.expenseText}>{item.amount}$</Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          <Button title="Comprobantes" onPress={() => console.log("Ver Comprobantes de", member.name)} />
          <Button title="Agregar Gasto" onPress={() => console.log("Agregar Gasto para", member.name)} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    marginVertical: 10,
    borderRadius: 5,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  memberName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  balance: {
    fontSize: 14,
    color: "#555",
  },
  expandedContent: {
    marginTop: 10,
  },
  expenseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  expenseText: {
    fontSize: 14,
    color: "#555",
  },
});
