// File: ComprobanteDetail.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

const ComprobanteDetail = () => {
  const router = useRouter();
  const { eventoId, participanteId, userRole } = useLocalSearchParams<{
    eventoId: string;
    participanteId: string;
    userRole: string;
  }>();
  console.log("EventoID:" ,eventoId);
  console.log("participanteId:" ,participanteId);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchComprobante = async () => {
      try {
        // Realiza la solicitud al backend para obtener los pagos y comprobantes
        const response = await fetch(
          `http://localhost:3000/api/pagos/evento/${eventoId}/participante/${participanteId}`
        );
        const data = await response.json();

        // Verifica si hay resultados y si la propiedad 'files' contiene URLs
        if (
          data.result &&
          data.result.length > 0 &&
          data.result[0].files &&
          data.result[0].files.length > 0
        ) {
          // Tomamos la primera URL de la lista de comprobantes
          setImageUrl(data.result[0].files[0]);
        } else {
          Alert.alert("Error", "No se encontraron comprobantes para este pago.");
        }
      } catch (error) {
        console.error("Error al obtener los comprobantes:", error);
        Alert.alert("Error", "Hubo un problema al obtener los comprobantes.");
      } finally {
        setLoading(false);
      }
    };

    fetchComprobante();
  }, [eventoId, participanteId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>COMPROBANTES</Text>
      <Text style={styles.label}>Comprobante subido:</Text>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        <Text style={styles.errorText}>No se encontró ninguna imagen de comprobante.</Text>
      )}
      <View style={styles.buttonContainer}>
        <Button
          title="Verificar página"
          onPress={() => router.push("/")} // Redirige a la página de verificación
        />
        <Button
          title="Cerrar"
          onPress={() => router.back()}// Vuelve a la página anterior
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
    width: 300, // Ajusta el tamaño de la imagen según lo que necesites
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    fontSize: 16,
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
