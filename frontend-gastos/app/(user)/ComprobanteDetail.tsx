import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

const ComprobanteDetail = () => {
  const router = useRouter();
  const { eventoId, participanteId, userRole } = useLocalSearchParams<{
    eventoId: string;
    participanteId: string;
    userRole: string;
  }>();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchComprobante = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/pagos/evento/${eventoId}/participante/${participanteId}`
        );
        const data = await response.json();

        if (
          data.result &&
          data.result.length > 0 &&
          data.result[0].files &&
          data.result[0].files.length > 0
        ) {
          setImageUrl(data.result[0].files[0]);
        }
      } catch (error) {
        console.error("Error al obtener los comprobantes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComprobante();
  }, [eventoId, participanteId]);

  const handleVerificarPago = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/participantes/${participanteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ ha_pagado: true }),
      });

      if (!response.ok) {
        throw new Error("Error al verificar el pago.");
      }

      // Vuelve a la página anterior y refresca los datos
      router.back();
    } catch (error) {
      console.error("Error al verificar el pago:", error);
    }
  };

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
        {userRole === "Propietario" && (
          <TouchableOpacity style={styles.verifyButton} onPress={handleVerificarPago}>
            <Text style={styles.buttonText}>Verificar pago</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ece2d9", // Color de fondo para consistencia
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#262626", // Texto oscuro para destacar
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: "#262626", // Texto oscuro
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 15, // Bordes más redondeados
    marginBottom: 20,
    borderColor: "#BF0413",
    borderWidth: 2, // Borde para que la imagen resalte
  },
  errorText: {
    color: "#BF0413", // Rojo para mensajes de error
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginTop: 20,
  },
  verifyButton: {
    backgroundColor: "#BF0413", // Rojo para el botón de verificar
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    alignItems: "center",
    marginRight: 10,
  },
  closeButton: {
    backgroundColor: "#BF0413", // Botón negro para cerrar
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    alignItems: "center",
  },
  buttonText: {
    color: "#f2f2f2", // Texto blanco en los botones
    fontSize: 16,
    fontWeight: "700",
  },
});

export default ComprobanteDetail;
