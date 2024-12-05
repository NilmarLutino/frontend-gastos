import React from "react";
import { View, Text, Modal, StyleSheet, TouchableOpacity } from "react-native";

interface LoadReceiptProps {
  visible: boolean;
  onClose: () => void;
  onSplitEqually: () => void;
  onAssignIndividually: () => void;
}

const LoadReceipt: React.FC<LoadReceiptProps> = ({
  visible,
  onClose,
  onSplitEqually,
  onAssignIndividually,
}) => {
  const dummyReceiptData = {
    mensaje: "Factura procesada exitosamente",
    datos: {
      items: [
        {
          description: "CREMA GEL LIGERA 5KIN 1004",
          quantity: 1,
          unit_price: 248,
          subtotal: 248,
        },
        {
          description: "URIAGE HYSEAC PROTECTOR SOLAR SPF50 50ML",
          quantity: 1,
          unit_price: 275,
          subtotal: 275,
        },
      ],
      total: 523,
    },
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Factura</Text>
          <Text style={styles.message}>{dummyReceiptData.mensaje}</Text>
          {dummyReceiptData.datos.items.map((item, index) => (
            <Text key={index} style={styles.itemText}>
              {item.quantity}x {item.description} - ${item.subtotal}
            </Text>
          ))}
          <Text style={styles.totalText}>Total: ${dummyReceiptData.datos.total}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.splitButton]}
              onPress={onSplitEqually}
            >
              <Text style={styles.buttonText}>Repartir Equitativamente</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.assignButton]}
              onPress={onAssignIndividually}
            >
              <Text style={styles.buttonText}>Asignar Individualmente</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
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
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  itemText: {
    fontSize: 14,
    marginVertical: 5,
  },
  totalText: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  splitButton: {
    backgroundColor: "#4CAF50",
  },
  assignButton: {
    backgroundColor: "#2196F3",
  },
  closeButton: {
    backgroundColor: "#BF0413",
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default LoadReceipt;
