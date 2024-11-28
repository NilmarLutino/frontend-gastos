import React, { useState } from "react";
import { API_BASE_URL } from "../../services/apiConfig";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function UploadImage() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null); // Imagen en base64
  const router = useRouter();
  const { eventoId, participanteId } = useLocalSearchParams();

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso denegado", "Se requiere acceso a la galería.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        base64: true, // Esto incluye la imagen en base64
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri); // URI para mostrar la vista previa
        setBase64Image(result.assets[0].base64 ?? null); // Imagen en base64
      }
    } catch (error) {
      console.error("Error al seleccionar la imagen:", error);
      Alert.alert("Error", "No se pudo acceder a la galería.");
    }
  };

  const uploadImage = async () => {
    if (!base64Image || !eventoId || !participanteId) {
      Alert.alert(
        "Error",
        "Por favor, selecciona una imagen y asegúrate de que los datos sean válidos."
      );
      return;
    }

    try {
      const payload = {
        evento_id: eventoId,
        participante_id: participanteId,
        monto: "0",
        fecha_pago: new Date().toISOString().split("T")[0],
        image: `data:image/jpeg;base64,${base64Image}`, // Enviar la imagen en formato base64
      };

      console.log("Enviando payload:", payload);

      const response = await fetch(`${API_BASE_URL}/api/pagos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Respuesta del servidor:", data);

      if (data.result && data.result.url_comprobante) {
        Alert.alert(
          "Éxito",
          `Imagen subida y URL almacenada: ${data.result.url_comprobante[0]}`
        );
        router.back();
      } else {
        throw new Error(
          "La respuesta del servidor no contiene una URL válida."
        );
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
        <TouchableOpacity
          style={styles.redButton}
          onPress={() => router.back()}
        >
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
    backgroundColor: "#ece2d9",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#262626",
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    borderColor: "#BF0413",
    borderWidth: 2,
    marginBottom: 20,
  },
  placeholderText: {
    color: "#999",
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },
  redButton: {
    backgroundColor: "#BF0413",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: "center",
    width: "80%",
  },
  buttonText: {
    color: "#f2f2f2",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
