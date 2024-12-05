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

type InvoiceItem = {
  description: string;
  subtotal: number;
};

const staticData: InvoiceItem[] = [
  { description: "CREMA GEL LIGERA 5KIN 1004", subtotal: 248 },
  { description: "URIAGE HYSEAC PROTECTOR SOLAR SPF50 50ML", subtotal: 275 },
];

type InvoiceModalProps = {
  visible: boolean;
  onClose: () => void;
  onAssign: (selectedUsers: string[]) => void;
};

export default function InvoiceModal({
  visible,
  onClose,
  onAssign,
}: InvoiceModalProps) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>(
    Array(staticData.length).fill("")
  );

  const users = ["Usuario 1", "Usuario 2", "Usuario 3"];

  const handleUserChange = (index: number, user: string) => {
    const updatedUsers = [...selectedUsers];
    updatedUsers[index] = user;
    setSelectedUsers(updatedUsers);
  };

  const handleAssign = () => {
    if (selectedUsers.some((user) => user === "")) {
      Alert.alert("Error", "Por favor, selecciona un usuario para cada producto.");
      return;
    }
    onAssign(selectedUsers);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Detalles de la Factura</Text>
          <ScrollView style={styles.scroll}>
            {staticData.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.subtotal}>{item.subtotal} Bs.</Text>
                <Picker
                  selectedValue={selectedUsers[index]}
                  style={styles.picker}
                  onValueChange={(value) => handleUserChange(index, value)}
                >
                  <Picker.Item label="Selecciona un usuario" value="" />
                  {users.map((user, idx) => (
                    <Picker.Item key={idx} label={user} value={user} />
                  ))}
                </Picker>
              </View>
            ))}
          </ScrollView>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleAssign}>
              <Text style={styles.buttonText}>Asignar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onClose}>
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
    width: "90%",
    padding: 20,
    backgroundColor: "#FDF6F0",
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#262626",
  },
  scroll: {
    maxHeight: 300,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
  },
  description: {
    flex: 2,
    fontSize: 16,
    color: "#333",
  },
  subtotal: {
    flex: 1,
    fontSize: 16,
    color: "#555",
    textAlign: "right",
  },
  picker: {
    flex: 1.5,
    height: 40,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#BF0413",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
