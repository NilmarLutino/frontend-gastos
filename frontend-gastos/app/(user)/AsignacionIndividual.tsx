import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter, useLocalSearchParams } from "expo-router";

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
  onAssign: (selectedUsers: string[]) => void;
};

export default function InvoiceModal({ visible, onAssign }: InvoiceModalProps) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>(
    Array(staticData.length).fill("")
  );
  const router = useRouter();

  const users = ["Usuario 1", "Usuario 2", "Usuario 3"];

  const handleUserChange = (index: number, user: string) => {
    const updatedUsers = [...selectedUsers];
    updatedUsers[index] = user;
    setSelectedUsers(updatedUsers);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
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
            <TouchableOpacity
              style={styles.button}
              onPress={() => onAssign(selectedUsers)}
            >
              <Text style={styles.buttonText}>Asignar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => router.back()}>
              <Text style={styles.buttonText}>Cerrar</Text>
              
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  scroll: {
    maxHeight: 300,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
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
    justifyContent: "space-around",
    marginTop: 20,
  },
  button: {
    flex: 1,
    backgroundColor: "#BF0413",
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
