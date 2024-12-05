import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import axios from "axios";
import { API_BASE_URL } from "../../services/apiConfig";

interface ModalRepartirProps {
  visible: boolean;
  onClose: () => void;
  groupData: {
    groupName: string;
    date: string;
    membersCount: number;
    totalExpenses: number;
    paidCount: number;
    description: string;
  };
  groupId: string;
  onRefresh: () => void; // Callback para recargar datos
}

const ModalRepartir: React.FC<ModalRepartirProps> = ({
  visible,
  onClose,
  groupData,
  groupId,
  onRefresh,
}) => {
  const [totalAmount, setTotalAmount] = useState("");
  const [description, setDescription] = useState("");

  const handleRepartir = async () => {
    if (!totalAmount || isNaN(Number(totalAmount)) || Number(totalAmount) <= 0) {
      Alert.alert("Error", "Por favor, ingresa un monto válido.");
      return;
    }
    if (!description.trim()) {
      Alert.alert("Error", "Por favor, ingresa una descripción.");
      return;
    }

    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/eventos/distribute/${groupId}`,
        {
          totalGasto: Number(totalAmount),
          descripcionGasto: description.trim(),
        }
      );

      if (response.status === 200) {
        Alert.alert("Éxito", "El gasto se ha distribuido correctamente.");
        await onRefresh(); // Recarga los datos tras la operación
        onClose();
      } else {
        Alert.alert("Error", "No se pudo realizar la operación. Inténtalo nuevamente.");
      }
    } catch (error) {
      console.error("Error al repartir gastos:", error);
      Alert.alert(
        "Error",
        "Ocurrió un error al repartir los gastos. Por favor, intenta nuevamente."
      );
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>REPARTICIÓN GASTOS</Text>
          <Text style={styles.label}>Ingrese el gasto total:</Text>
          <TextInput
            style={styles.input}
            placeholder="Monto total"
            keyboardType="numeric"
            value={totalAmount}
            onChangeText={setTotalAmount}
          />
          <Text style={styles.label}>Descripción del gasto:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ejemplo: Pizza para todos"
            value={description}
            onChangeText={setDescription}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleRepartir}>
              <Text style={styles.buttonText}>Repartir</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    padding: 20,
    backgroundColor: "#FDF6F0",
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#262626",
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: "#262626",
  },
  input: {
    borderColor: "#B0B0B0",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#BF0413",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ModalRepartir;
