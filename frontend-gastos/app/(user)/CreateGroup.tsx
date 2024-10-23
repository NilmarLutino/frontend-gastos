import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function CreateGroup() {
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [description, setDescription] = useState("");

  const router = useRouter();

  const handleCreateGroup = () => {
    // Aquí puedes manejar la lógica para crear el grupo, como llamar a una API
    console.log("Creating group with:", { groupName, members, eventDate, description });

    // Redirige a la página de MyGroups
    router.push({ pathname: "/(user)/myGroups" });
  };

  const handleCancel = () => {
    // Redirige a la página de MyGroups si se cancela
    router.push({ pathname: "/(user)/myGroups" });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CREAR GRUPO</Text>
      <TextInput
        style={styles.input}
        placeholder="NOMBRE GRUPO"
        value={groupName}
        onChangeText={setGroupName}
      />
      <TextInput
        style={styles.input}
        placeholder="CANTIDAD INTEGRANTES"
        value={members}
        onChangeText={setMembers}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="FECHA DEL EVENTO"
        value={eventDate}
        onChangeText={setEventDate}
      />
      <TextInput
        style={styles.input}
        placeholder="DESCRIPCIÓN"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.createButton} onPress={handleCreateGroup}>
          <Text style={styles.buttonText}>CREAR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.buttonText}>CANCELAR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#ffffff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  createButton: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginLeft: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
