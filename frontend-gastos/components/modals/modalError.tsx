import React from "react";
import { View, Text, Button, Modal, StyleSheet, TouchableOpacity } from "react-native";

interface ModalErrorProps {
  visible: boolean;
  onClose: () => void;
  message: string;
}

const ModalError: React.FC<ModalErrorProps> = ({ visible, onClose, message }) => {
  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Error</Text>
          <Text style={styles.errorMessage}>{message}</Text>
          <TouchableOpacity style={styles.button} onPress={onClose}>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",  // Fondo oscuro y transparente, igual que los otros modales
  },
  modalContent: {
    width: 320,
    padding: 20,
    backgroundColor: "#F2f2f2",  // Fondo claro para coherencia con otros componentes
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: "center",  // Centrar el contenido del modal
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#262626",  // Texto oscuro para consistencia
  },
  errorMessage: {
    color: "#262626",  // Color rojo para el mensaje de error, consistente con los botones
    fontSize: 16,
    marginBottom: 15,
    textAlign: "center",
  },
  button: {
    width: "100%",  // Ancho completo del botón para mejor visualización
    paddingVertical: 12,
    backgroundColor: "#C1121F",  // Botón rojo
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",  // Texto blanco
    fontSize: 16,
    fontWeight: "bold",
  },
});



export default ModalError;
