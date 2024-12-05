import React from "react";
import { View, Text, Modal, StyleSheet, TouchableOpacity } from "react-native";

interface DeleteMemberProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const DeleteMember: React.FC<DeleteMemberProps> = ({
  visible,
  onClose,
  onConfirm,
  message,
}) => {
  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Remover Miembro</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={onConfirm}>
              <Text style={styles.buttonText}>Eliminar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.buttonText}>Cancelar</Text>
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
    backgroundColor: "#FDF6F0", // Fondo claro
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
    color: "#262626", // Texto oscuro
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 15,
    color: "#262626",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  confirmButton: {
    backgroundColor: "#C1121F", // Botón rojo para confirmar
  },
  cancelButton: {
    backgroundColor: "#6C757D", // Botón gris para cancelar
  },
  buttonText: {
    color: "#fff", // Texto blanco
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default DeleteMember;
