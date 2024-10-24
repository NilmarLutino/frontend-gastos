import React, { useState } from "react";
import { View, Text, TextInput, Button, Modal, StyleSheet, TouchableOpacity } from "react-native";

interface AddMemberProps {
  visible: boolean;
  onClose: () => void;
  onBuscar: (email: string) => void;
}

const AddMember: React.FC<AddMemberProps> = ({ visible, onClose, onBuscar }) => {
  const [email, setEmail] = useState("");

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>AGREGAR PARTICIPANTE</Text>
          <Text style={styles.label}>EMAIL DEL USUARIO</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="correo@example.com"
          />
          <TouchableOpacity style={styles.button} onPress={() => onBuscar(email)}>
            <Text style={styles.buttonText}>Buscar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.button]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Cerrar</Text>
          </TouchableOpacity>
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
    width: 320,
    padding: 20,
    backgroundColor: "#FDF6F0",  // Fondo claro
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#262626",
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: "#262626",
  },
  input: {
    width: "100%",
    borderColor: "#B0B0B0",  // Borde gris claro
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  button: {
    width: "100%",
    padding: 12,
    backgroundColor: "#C1121F",  // Botón rojo
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",  // Texto blanco
    fontSize: 16,
    fontWeight: "bold",
  },
});


export default AddMember;
