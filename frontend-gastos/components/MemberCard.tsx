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
  //console.log("miembro: ", member.id);
      

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
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  router.push({
                    pathname: "../(admin)/ComprobanteDetail",
                    params: { eventoId: groupId, participanteId: member.id },
                  })
                }
              >
                <Text style={styles.buttonText}>Añadir Comprobantes</Text>
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
    padding: 20,
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
    justifyContent: "space-between",
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
    width: "70%",
    gap: 20,
  },
  button: {
    flex: 1,
    backgroundColor: "#BF0413",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
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
});
