import React, { useState } from "react";
import { View, Text, TextInput, Modal, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { API_BASE_URL } from "../../services/apiConfig";

interface AddConceptProps {
  visible: boolean;
  onClose: () => void;
  onRepartir: () => void; // Callback para manejar la acción de repartir
  groupId: string; // El ID del grupo recibido
  totalAmount: number; // El total de la factura recibido
}

const AddConcepts: React.FC<AddConceptProps> = ({
  visible,
  onClose,
  onRepartir,
  groupId,
  totalAmount,
}) => {
  const [concepto, setConcepto] = useState("");

  const handleRepartir = async () => {
    if (!concepto.trim()) {
      Alert.alert("Advertencia", "Por favor, ingresa un concepto válido.");
      return;
    }
  
    try {
      const response = await fetch(`${API_BASE_URL}/api/eventos/distribute/${groupId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          totalGasto: Number(totalAmount),
          descripcionGasto: concepto.trim(),
        }),
      });
  
      if (response.ok) {
        Alert.alert("Éxito", "El gasto se ha distribuido correctamente.");
        await onRepartir(); // Recarga los datos tras la operación
        onClose(); // Cierra el modal
      } else {
        const errorText = await response.text(); // Leer texto de error del servidor
        console.error("Error en la respuesta:", errorText);
        Alert.alert("Error", "No se pudo realizar la operación. Inténtalo nuevamente.");
      }
    } catch (error) {
      console.error("Error al repartir gastos:", error);
      Alert.alert("Error", "Ocurrió un error al repartir los gastos. Por favor, intenta nuevamente.");
    }
  };
  

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Repartir Equitativamente</Text>

          {/* Muestra el ID del grupo y el monto total */}
          <Text style={styles.textamount}>Total: {totalAmount} Bs.</Text>

          {/* Entrada para el concepto */}
          <Text style={styles.title1}>Concepto</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. Gastos Comida"
            value={concepto}
            onChangeText={setConcepto}
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
    width: 300,
    padding: 20,
    backgroundColor: "#FDF6F0",  // Fondo claro
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#262626",  // Texto oscuro
  },

  title1: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#262626",  // Texto oscuro
  },

  textamount: {
    fontSize: 15,
    marginBottom: 10,
    padding: 2,
    alignSelf: "flex-start",
    color: "#262626",  // Texto oscuro
  },

  input: {
    borderColor: "#B0B0B0",  // Borde gris claro
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    padding: 8,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#C1121F",  // Color rojo intenso para el botón
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",  // Texto blanco
    fontWeight: "bold",
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    alignSelf: "flex-start",
    marginBottom: 5,
  },
});

export default AddConcepts;
