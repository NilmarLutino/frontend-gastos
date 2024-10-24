import React, { useState } from "react";
import { View, Text, TextInput, Button, Modal, StyleSheet, TouchableOpacity } from "react-native";

interface AddExpensesProps {
  visible: boolean;
  onClose: () => void;
  onAgregar: (concepto: string, monto: string) => void;
}

const AddExpenses: React.FC<AddExpensesProps> = ({ visible, onClose, onAgregar }) => {
  const [concepto, setConcepto] = useState("");
  const [monto, setMonto] = useState("");

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>AGREGAR GASTOS</Text>
          <Text>CONCEPTO</Text>
          <TextInput
            style={styles.input}
            value={concepto}
            onChangeText={setConcepto}
          />
          <Text>MONTO</Text>
          <TextInput
            style={styles.input}
            value={monto}
            keyboardType="numeric"
            onChangeText={setMonto}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => onAgregar(concepto, monto)}>
              <Text style={styles.buttonText}>Añadir</Text>
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
});



export default AddExpenses;
