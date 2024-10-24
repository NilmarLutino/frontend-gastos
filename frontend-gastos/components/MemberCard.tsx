import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Button } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AddExpenses from "./modals/addExpenses";
import { createExpense } from "../services/eventService";
import { useRouter } from "expo-router";

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
  groupId: string; // Asegúrate de recibir groupId aquí
  onRefresh: () => void;
};

export default function MemberCard({ member, groupId, onRefresh }: MemberCardProps) {
  const router = useRouter();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddExpensesVisible, setAddExpensesVisible] = useState(false); // Estado para el modal

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Función para manejar la adición de un nuevo gasto
  const handleAgregarGasto = async (concepto: string, monto: string) => {
    try {
      if (!concepto || !monto || isNaN(parseFloat(monto))) {
        console.error("Por favor, ingresa un concepto y un monto válido.");
        return;
      }

      // Llama a la API para crear el nuevo gasto
      await createExpense(
        parseInt(member.id), // ID del miembro (participante)
        parseFloat(monto),
        "Alimentación", // O ajusta la categoría según corresponda
        concepto,
        4 // Reemplaza con el ID del usuario que está agregando el gasto, puedes obtenerlo desde `userId`
      );

      setAddExpensesVisible(false); // Cierra el modal después de agregar el gasto
      console.log("Gasto añadido correctamente");

      // Llama a la función de refresco para actualizar los datos del grupo
      onRefresh();
    } catch (error) {
      console.error("Error al agregar gasto:", error);
    }
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
            data={member.expenses} // Mostrar la lista de gastos desde los datos actualizados
            renderItem={({ item }) => (
              <View style={styles.expenseItem}>
                <Text style={styles.expenseText}>{item.item}</Text>
                <Text style={styles.expenseText}>{item.amount}$</Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          <Button
  title="Comprobante"
  onPress={() =>
    router.push({
      pathname: "../(admin)/ComprobanteDetail",
      params: { eventoId: groupId, participanteId: member.id },
    })
  }
/>
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
