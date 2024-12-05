import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { createExpense } from "../../services/eventService"; // Importa la función createExpense

type InvoiceModalProps = {
  visible: boolean;
  onClose: () => void;
  onAssign: (selectedUsers: { userId: string; userName: string }[]) => void;
  invoiceDetails: {
    groupId: string;
    participantes: { id: string; name: string }[];
    items: { description: string; subtotal: number }[];
  } | null;
};

export default function InvoiceModal({
  visible,
  onClose,
  invoiceDetails,
}: InvoiceModalProps) {
  const [selectedUsers, setSelectedUsers] = useState<
    { userId: string; userName: string }[]
  >(Array(invoiceDetails?.items?.length || 0).fill({ userId: "", userName: "" }));

  const handleUserChange = (index: number, userId: string) => {
    const selectedUser = invoiceDetails?.participantes.find(
      (user) => user.id === userId
    );

    if (!selectedUser) return;

    const updatedUsers = [...selectedUsers];
    updatedUsers[index] = { userId, userName: selectedUser.name };
    setSelectedUsers(updatedUsers);

    console.log(`Item ${index} asignado a usuario:`, {
      userId: selectedUser.id,
      userName: selectedUser.name,
    });
  };

  const handleAddExpense = async (itemIndex: number) => {
    const selectedUser = selectedUsers[itemIndex];
    const item = invoiceDetails?.items[itemIndex];
  
    if (!selectedUser || !item) {
      Alert.alert("Error", "Selecciona un usuario para este producto.");
      return;
    }
  
    try {
      console.log("Creando gasto:", {
        groupId: invoiceDetails.groupId,
        concepto: item.description,
        monto: item.subtotal,
        usuarioId: selectedUser.userId,
      });
  
      await createExpense(
        parseInt(invoiceDetails.groupId),
        item.subtotal,
        "Alimentación", // Categoría predeterminada
        item.description,
        parseInt(selectedUser.userId)
      );
  
      Alert.alert(
        "Éxito",
        `Gasto de "${item.description}" asignado a "${selectedUser.userName}" correctamente.`
      );
  
      console.log(
        `Gasto asignado: ${item.description} -> Usuario: ${selectedUser.userName}`
      );
    } catch (error) {
      console.error("Error al crear el gasto:", error);
      Alert.alert("Error", "Hubo un problema al agregar el gasto.");
    }
  };
  

  if (!invoiceDetails) {
    return null;
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Detalles de la Factura</Text>
          <ScrollView style={styles.scroll}>
            {invoiceDetails.items.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <Text style={styles.description}>{item.description}</Text>
                  <Text style={styles.subtotal}>{item.subtotal} Bs.</Text>
                </View>
                <Picker
                  selectedValue={selectedUsers[index]?.userId || ""}
                  style={styles.picker}
                  onValueChange={(value) => handleUserChange(index, value)}
                >
                  <Picker.Item label="Selecciona un usuario" value="" />
                  {invoiceDetails.participantes.map((user) => (
                    <Picker.Item key={user.id} label={user.name} value={user.id} />
                  ))}
                </Picker>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => handleAddExpense(index)}
                >
                  <Text style={styles.buttonText}>Agregar Gasto</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
          <View style={styles.footer}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  scroll: {
    flex: 1,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  itemInfo: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subtotal: {
    fontSize: 14,
    color: "#666",
  },
  picker: {
    flex: 1,
    height: 40,
  },
  addButton: {
    backgroundColor: "#BF0413",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  closeButton: {
    backgroundColor: "#BF0413",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
});
