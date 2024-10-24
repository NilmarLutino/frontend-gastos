import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function UploadImage() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const router = useRouter();
  const { eventoId, participanteId } = useLocalSearchParams();

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso denegado", "Se requiere acceso a la galería.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error al seleccionar la imagen:", error);
      Alert.alert("Error", "No se pudo acceder a la galería.");
    }
  };

  const uploadImage = async () => {
    if (!imageUri || !eventoId || !participanteId) {
      Alert.alert("Error", "Por favor, selecciona una imagen y asegúrate de que los datos sean válidos.");
      return;
    }

    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const formData = new FormData();

      formData.append("files", blob, "image.jpg");
      formData.append("evento_id", eventoId.toString());
      formData.append("participante_id", participanteId.toString());
      formData.append("monto", "0");
      formData.append("fecha_pago", new Date().toISOString().split("T")[0]);

      const uploadResponse = await fetch("http://localhost:3000/api/pagos", {
        method: "POST",
        body: formData,
      });

      const data = await uploadResponse.json();
      console.log("Respuesta del servidor:", data);

      if (data.result && data.result.url_comprobante) {
        Alert.alert("Éxito", `Imagen subida y URL almacenada: ${data.result.url_comprobante[0]}`);
        router.back();
      } else {
        throw new Error("La respuesta del servidor no contiene una URL válida.");
      }
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      Alert.alert("Error", "Hubo un problema al subir la imagen.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subir Comprobante</Text>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <Text style={styles.placeholderText}>Ninguna imagen seleccionada</Text>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.redButton} onPress={pickImage}>
          <Text style={styles.buttonText}>Seleccionar Imagen</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.redButton} onPress={uploadImage}>
          <Text style={styles.buttonText}>Subir Imagen</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.redButton} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ece2d9", // Consistente con las otras pantallas
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#262626", // Color del texto principal
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    borderColor: "#BF0413", // Borde rojo para la imagen
    borderWidth: 2,
    marginBottom: 20,
  },
  placeholderText: {
    color: "#999",
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "column", // Alineación vertical de los botones
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },
  redButton: {
    backgroundColor: "#BF0413", // Color de fondo rojo para los botones
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 8, // Espaciado entre botones
    alignItems: "center",
    width: "80%", // Botones más anchos
  },
  buttonText: {
    color: "#f2f2f2", // Texto blanco en los botones
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});

