import React, { useState } from "react";
import { View, Text, TextInput, Button, Modal, StyleSheet, TouchableOpacity } from "react-native";

interface AddMemberProps {
  visible: boolean;
  onClose: () => void;
  onBuscar: (username: string) => void;
}

const AddMember: React.FC<AddMemberProps> = ({ visible, onClose, onBuscar }) => {
  const [username, setUsername] = useState("");

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>AGREGAR PARTICIPANTE</Text>
          <Text style={styles.label}>NOMBRE DE USUARIO</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="JuanPerez123"
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => onBuscar(username)}
          >
            <Text style={styles.buttonText}>Buscar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.closeButton]}
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
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    width: "100%",
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    width: "100%",
    padding: 12,
    backgroundColor: "#000",
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: "#555",
  },
});

export default AddMember;
