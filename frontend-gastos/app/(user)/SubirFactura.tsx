import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter, useLocalSearchParams } from "expo-router";
import LoadReceipt from "@/components/modals/loadReceipt";
import AddConcepts from "@/components/modals/addConcept";

export default function SubirFactura() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // Controla la visibilidad del modal
  const [isAddConceptsModalVisible, setIsAddConceptsModalVisible] = useState(false); // Modal para agregar conceptos

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
        setImageUri(result.assets[0].uri); // URI para mostrar la vista previa
      }
    } catch (error) {
      console.error("Error al seleccionar la imagen:", error);
      Alert.alert("Error", "No se pudo acceder a la galería.");
    }
  };

  const uploadImage = () => {
    // if (!imageUri) {
    //   Alert.alert("Advertencia", "Primero selecciona una imagen.");
    //   return;
    // }
    setIsModalVisible(true); // Muestra el modal
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subir Factura</Text>
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

      {/* Modal */}
      <LoadReceipt
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)} // Oculta el modal
        onSplitEqually={() => {
          setIsModalVisible(false); // Cierra el modal de LoadReceipt
          setIsAddConceptsModalVisible(true); // Abre el modal de Agregar Conceptos
        }}
        onAssignIndividually={() => {
          setIsModalVisible(false); // Oculta el modal
          router.push({
            pathname: "../(user)/AsignacionIndividual",
            params: {
              eventoId,
              participanteId,
              tipoAsignacion: "equitativa", // Puedes agregar más parámetros según sea necesario
            },
          });
          console.log("Asignar gastos de manera individual");
        }}
      />

       {/* Modal AddConcepts */}
      <AddConcepts
        visible={isAddConceptsModalVisible}
        onClose={() => setIsAddConceptsModalVisible(false)} // Cierra el modal de Agregar Conceptos
        onRepartir={() => {
          // Aquí puedes manejar la lógica para agregar el concepto y monto
          setIsAddConceptsModalVisible(false); // Cierra el modal después de agregar
        }}
      />
      
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
