import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  ActivityIndicator,
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
          <Button
            title="Verificar pago"
            onPress={handleVerificarPago}
          />
        )}
        <Button
          title="Cerrar"
          onPress={() => router.back()}
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
    width: 300,
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
