import React, { useState } from "react";
import { View, Text, TextInput, Button, Modal, StyleSheet } from "react-native";

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
          <Button title="Añadir" onPress={() => onAgregar(concepto, monto)} />
          <Button title="Cerrar" onPress={onClose} />
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
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderColor: "#000",
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
  },
});

export default AddExpenses;
