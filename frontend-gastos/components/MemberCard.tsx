import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Button,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AddExpenses from "./modals/addExpenses";
import { createExpense, fetchParticipantById } from "../services/eventService";
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
  groupId: string;
  onRefresh: () => void;
  userRole: string;
};

export default function MemberCard({
  member,
  groupId,
  onRefresh,
  userRole,
}: MemberCardProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddExpensesVisible, setAddExpensesVisible] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleAgregarGasto = async (concepto: string, monto: string) => {
    try {
      if (!concepto || !monto || isNaN(parseFloat(monto))) {
        console.error("Por favor, ingresa un concepto y un monto válido.");
        return;
      }

      // Obtener el detalle del participante para extraer el usuario_id
      const participantDetails = await fetchParticipantById(member.id);
      const usuarioId = participantDetails.usuario_id;

      // Llama a la API para crear el nuevo gasto usando usuarioId
      await createExpense(
        parseInt(groupId),
        parseFloat(monto),
        "Alimentación",
        concepto,
        usuarioId // Usar el usuario_id obtenido
      );

      setAddExpensesVisible(false);
      onRefresh();
      Alert.alert("Éxito", "Gasto añadido correctamente");
    } catch (error) {
      console.error("Error al agregar gasto:", error);
      Alert.alert("Error", "Hubo un problema al agregar el gasto.");
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
            data={member.expenses}
            renderItem={({ item }) => (
              <View style={styles.expenseItem}>
                <Text style={styles.expenseText}>{item.item}</Text>
                <Text style={styles.expenseText}>{item.amount}$</Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />

          {/* Mostrar botones solo si el usuario es "Propietario" */}
          {userRole === "Propietario" && (
            <>
              <Button
                title="Comprobante"
                onPress={() =>
                  router.push({
                    pathname: "../(admin)/ComprobanteDetail",
                    params: { eventoId: groupId, participanteId: member.id },
                  })
                }
              />
              <Button title="Agregar Gasto" onPress={() => setAddExpensesVisible(true)} />
            </>
          )}
        </View>
      )}

      <AddExpenses
        visible={isAddExpensesVisible}
        onClose={() => setAddExpensesVisible(false)}
        onAgregar={handleAgregarGasto}
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
