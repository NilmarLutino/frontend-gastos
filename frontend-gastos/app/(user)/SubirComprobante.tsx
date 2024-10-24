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
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Seleccionar Imagen</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={uploadImage}>
          <Text style={styles.buttonText}>Subir Imagen</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
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
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  placeholderText: {
    color: "#999",
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  button: {
    backgroundColor: "#4285F4",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
    flex: 1,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
});
