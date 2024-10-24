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
      <View style={styles.formContainer}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#ece2d9", // Similar al color de fondo de los otros componentes
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#262626",
    marginBottom: 20,
    alignSelf: "center",
  },
  input: {
    width: "100%",
    padding: 10,
    marginVertical: 10,
    borderColor: "#ccc",
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: "#f2f2f2",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  createButton: {
    backgroundColor: "#BF0413", // Botón rojo como en los otros componentes
    paddingVertical: 10,
    borderRadius: 50, // Bordes redondeados
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: "#BF0413", // Misma estética para ambos botones
    paddingVertical: 10,
    borderRadius: 50, // Bordes redondeados
    alignItems: "center",
    flex: 1,
    marginLeft: 10,
  },
  buttonText: {
    color: "#f2f2f2", // Texto blanco
    fontSize: 16,
    fontWeight: "700",
  },
  formContainer: {
    backgroundColor: "#f2f2f2",
    padding: 20,
    borderRadius: 20,
    width: "70%",
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    alignItems: "center",
  },
});
