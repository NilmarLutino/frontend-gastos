import React, { useState } from "react";
import {View,Text,TextInput,StyleSheet,TouchableOpacity,Alert} from "react-native";
import { useRouter } from "expo-router";
import { createEvent } from "../../services/eventService";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CreateGroup() {
  const [groupName, setGroupName] = useState("");
  const [eventDate, setEventDate] = useState<string>(""); // Cambia a string
  const [description, setDescription] = useState("");
  const router = useRouter();

  const handleCreateGroup = async () => {
    try {
      if (!groupName || !eventDate) {
        Alert.alert("Error", "El nombre del grupo y la fecha son obligatorios.");
        console.log("Error", "El nombre del grupo y la fecha son obligatorios.");
        return;
      }

      // Validar que la fecha tenga el formato correcto y sea válida
      if (!isValidDate(eventDate)) {
        Alert.alert("Error", "La fecha debe ser válida y tener el formato YYYY-MM-DD.");
        console.log("Error", "La fecha debe ser válida y tener el formato YYYY-MM-DD.");
        return;
      }

      const userId = await AsyncStorage.getItem("userId");

      if (!userId) {
        throw new Error("User ID not found");
      }

      const eventData = {
        nombre_evento: groupName,
        fecha: eventDate,
        creado_por: parseInt(userId, 10),
        descripcion: description,
      };

      await createEvent(eventData);
      console.log("Evento creado con éxito");

      // Redirige a la página de MyGroups
      router.push({ pathname: "/(user)/myGroups" });
    } catch (error) {
      console.error("Error al crear el grupo:", error);
    }
  };

  const handleCancel = () => {
    router.push({ pathname: "/(user)/myGroups" });
  };

  const isValidDate = (date: string): boolean => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return false;
    }

    const [year, month, day] = date.split("-").map(Number);
    const currentYear = new Date().getFullYear();

    // Validar rango del año, mes y día
    if (year < 1900 || year > currentYear) return false;
    if (month < 1 || month > 12) return false;

    // Validar el número de días según el mes
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > daysInMonth) return false;

    return true;
  };

  const formatDateInput = (text: string) => {
    // Remover cualquier carácter que no sea un número
    const cleaned = text.replace(/[^0-9]/g, "");

    // Aplicar formato YYYY-MM-DD
    let formatted = cleaned;
    if (cleaned.length >= 4) {
      formatted = cleaned.slice(0, 4) + "-" + cleaned.slice(4);
    }
    if (cleaned.length >= 6) {
      formatted = formatted.slice(0, 7) + "-" + cleaned.slice(6);
    }

    setEventDate(formatted);
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>CREAR GRUPO</Text>

        <TextInput
          style={styles.input}
          placeholder="NOMBRE GRUPO"
          value={groupName}
          onChangeText={setGroupName}
        />

        {/* Campo de entrada de fecha */}
        <TextInput
          style={styles.input}
          placeholder="FECHA DEL EVENTO (YYYY-MM-DD)"
          value={eventDate}
          onChangeText={formatDateInput}
          keyboardType="numeric"
          maxLength={10} // Limitar a 10 caracteres para YYYY-MM-DD
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
    backgroundColor: "#f0f0f0",
  },
  innerContainer: {
    width: "90%",
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#ffffff",
    fontSize: 16,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  createButton: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginLeft: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
