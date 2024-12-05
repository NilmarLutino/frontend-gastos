import React, { useState } from "react";
import { View, Text, TextInput, Modal, StyleSheet, TouchableOpacity } from "react-native";

interface AddConceptProps {
  visible: boolean;
  onClose: () => void;
  onRepartir: (concepto: string) => void; // Callback para repartir los gastos
}

const AddConcepts: React.FC<AddConceptProps> = ({ visible, onClose, onRepartir }) => {
  const [concepto, setConcepto] = useState("");

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
          
          <View style={styles.buttonContainer}>
            {/* Botón Repartir */}
            <TouchableOpacity style={styles.button} onPress={() => onRepartir(concepto)}>
              <Text style={styles.buttonText}>Repartir</Text>
            </TouchableOpacity>

            {/* Botón Cerrar */}
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

export default AddConcepts;
