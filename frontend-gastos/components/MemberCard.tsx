import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Button } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AddExpenses from "./modals/addExpenses";

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
  const [isAddExpensesVisible, setAddExpensesVisible] = useState(false); // Estado para el modal
  const [newExpenses, setNewExpenses] = useState<Expense[]>([]); // Estado para manejar los nuevos gastos

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Función para manejar la adición de un nuevo gasto
  const handleAgregarGasto = (concepto: string, monto: string) => {
    const newExpense: Expense = { item: concepto, amount: parseFloat(monto) };
    setNewExpenses([...newExpenses, newExpense]); // Actualizar la lista de gastos
    setAddExpensesVisible(false); // Cerrar el modal
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
            data={[...member.expenses, ...newExpenses]} // Mostrar tanto los gastos originales como los nuevos
            renderItem={({ item }) => (
              <View style={styles.expenseItem}>
                <Text style={styles.expenseText}>{item.item}</Text>
                <Text style={styles.expenseText}>{item.amount}$</Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          <Button title="Comprobantes" onPress={() => console.log("Ver Comprobantes de", member.name)} />
          <Button title="Agregar Gasto" onPress={() => setAddExpensesVisible(true)} /> {/* Abre el modal */}
        </View>
      )}
      
      {/* Modal para añadir gastos */}
      <AddExpenses
        visible={isAddExpensesVisible}
        onClose={() => setAddExpensesVisible(false)} // Cerrar el modal
        onAgregar={handleAgregarGasto} // Manejar la adición de gastos
      />
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
