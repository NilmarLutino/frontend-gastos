// File: ComprobanteDetail.tsx
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
} from "react-native";
import { useRouter } from "expo-router";

const ComprobanteDetail = () => {
  const router = useRouter();
  const imageUrl = "https://via.placeholder.com/150"; // Reemplaza con la URL de la imagen real

  return (
    <View style={styles.container}>
      <Text style={styles.title}>COMPROBANTES</Text>
      <Text style={styles.label}>Comprobante subido:</Text>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.buttonContainer}>
        <Button
          title="Verificar página"
          onPress={() => router.push("/")} // Redirige a la página de verificación
        />
        <Button
          title="Cerrar"
          onPress={() => router.push("../(user)/myGroups")}// Vuelve a la página anterior
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 20,
  },
});

export default ComprobanteDetail;
