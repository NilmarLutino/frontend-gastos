import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AddExpenses from "./modals/addExpenses";
import DeleteExpenses from "./modals/deleteExpenses";
import DeleteMember from "./modals/deleteMember";
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
  const [isDeleteExpenseVisible, setDeleteExpenseVisible] = useState(false);
  const [isDeleteMemberVisible, setDeleteMemberVisible] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [selectedMember, setSelectedMember] = useState<any>(null);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleAgregarGasto = async (concepto: string, monto: string) => {
    try {
      if (!concepto || !monto || isNaN(parseFloat(monto))) {
        console.error("Por favor, ingresa un concepto y un monto válido.");
        return;
      }

      const participantDetails = await fetchParticipantById(member.id);
      const usuarioId = participantDetails.usuario_id;

      await createExpense(
        parseInt(groupId),
        parseFloat(monto),
        "Alimentación",
        concepto,
        usuarioId
      );

      setAddExpensesVisible(false);
      onRefresh();
      Alert.alert("Éxito", "Gasto añadido correctamente");
    } catch (error) {
      console.error("Error al agregar gasto:", error);
      Alert.alert("Error", "Hubo un problema al agregar el gasto.");
    }
  };

  const handleDeleteExpense = async () => {
    try {
      if (!selectedExpense) return;

      // Aquí deberías llamar a tu API para eliminar el gasto seleccionado
      console.log(`Eliminando gasto: ${selectedExpense.item}`);
      setDeleteExpenseVisible(false);
      onRefresh();
      Alert.alert("Éxito", "Gasto eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar gasto:", error);
      Alert.alert("Error", "Hubo un problema al eliminar el gasto.");
    }
  };

  const handleDeleteMember = async () => {
    try {
      if (!selectedMember) return;

      // Aquí deberías llamar a tu API para eliminar el miembro seleccionado
      console.log(`Eliminando miembro: ${member.name}`);
      setDeleteMemberVisible(false);
      onRefresh();
      Alert.alert("Éxito", "Miembro eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar miembro:", error);
      Alert.alert("Error", "Hubo un problema al eliminar el miembro.");
    }
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.delete_member}
        onPress={() => {
          setSelectedMember(member);
          setDeleteMemberVisible(true)
        }}
      >
        <FontAwesome name="trash" size={20} color="#BF0413" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.header} onPress={toggleExpand}>
        <Text style={styles.memberName}>{member.name}</Text>
        <Text style={styles.balance}>{member.balance} Bs.</Text>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.expandedContent}>
          <FlatList
            data={member.expenses}
            renderItem={({ item }) => (
              <View style={styles.expenseItem}>
                <Text style={styles.expenseText}>{item.item}</Text>
                <Text style={styles.expenseText}>{item.amount} Bs.</Text>
                <TouchableOpacity
                  style={styles.delete_expense}
                  onPress={() => {
                    setSelectedExpense(item);
                    setDeleteExpenseVisible(true);
                  }}
                >
                  <FontAwesome name="trash" size={20} color="#BF0413" />
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />

          {userRole === "Propietario" && (
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  router.push({
                    pathname: "../(user)/ComprobanteDetail",
                    params: {
                      eventoId: groupId,
                      participanteId: member.id,
                      userRole: "Propietario",
                    },
                  })
                }
              >
                <Text style={styles.buttonText}>Ver Comprobante</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setAddExpensesVisible(true)}
              >
                <Text style={styles.buttonText}>Añadir Gasto</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      <TouchableOpacity style={styles.deploy} onPress={toggleExpand}>
        <FontAwesome
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={18}
          color="#f2f2f2"
        />
      </TouchableOpacity>

      {/* Modal para añadir gastos */}
      <AddExpenses
        visible={isAddExpensesVisible}
        onClose={() => setAddExpensesVisible(false)}
        onAgregar={handleAgregarGasto}
      />

      {/* Modal para confirmar eliminación de gasto */}
      <DeleteExpenses
        visible={isDeleteExpenseVisible}
        onClose={() => setDeleteExpenseVisible(false)}
        onConfirm={handleDeleteExpense}
        message={`¿Estás seguro de que deseas eliminar el gasto "${selectedExpense?.item}"?`}
      />

      {/* Modal para confirmar eliminación de miembro */}
      <DeleteMember
        visible={isDeleteMemberVisible}
        onClose={() => setDeleteMemberVisible(false)}
        onConfirm={handleDeleteMember}
        message={`¿Estás seguro de que deseas eliminar a ${member.name}?`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f2f2f2",
    margin: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  memberName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#262626",
  },
  balance: {
    fontSize: 16,
    color: "#262626",
    fontWeight: "700",
  },
  expandedContent: {
    marginTop: 20,
    width: "100%",
  },
  expenseItem: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 5,
    paddingHorizontal: 30,
    width: "100%",
  },
  expenseText: {
    fontSize: 15,
    color: "#262626",
  },
  actions: {
    display: "flex",
    flex: 2,
    flexDirection: "row",
    justifyContent: "space-around",
    alignSelf: "center",
    marginVertical: 20,
    width: "90%",
    gap: 20,
  },
  button: {
    flex: 1,
    backgroundColor: "#BF0413",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
    textAlign: "center",
    width: "60%",
  },
  buttonText: {
    color: "#f2f2f2",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  deploy: {
    backgroundColor: "#BF0413",
    width: "100%",
    alignItems: "center",
    paddingVertical: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  delete_member: {
    alignSelf: "flex-end",
    paddingRight: 10,
    paddingTop: 10,
  },
  delete_expense: {
    alignSelf: "flex-end",
    paddingRight: 10,
  },
});
