import React from "react";
import { View, Text, Button, Modal, StyleSheet } from "react-native";

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
  errorMessage: {
    color: "red",
    marginBottom: 10,
  },
});

export default ModalError;
