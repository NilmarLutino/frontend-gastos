import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../../services/apiConfig";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

const ComprobanteDetail = () => {
  const router = useRouter();
  const { eventoId, participanteId, userRole } = useLocalSearchParams<{
    eventoId: string;
    participanteId: string;
    userRole: string;
  }>();
  const [imageUrls, setImageUrls] = useState<string[]>([]); // Manejo de múltiples imágenes
  const [loading, setLoading] = useState<boolean>(true);
  const { width } = useWindowDimensions(); // Hook para obtener el ancho de la pantalla

  useEffect(() => {
    const fetchComprobante = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/pagos/evento/${eventoId}/participante/${participanteId}`
        );
        const data = await response.json();

        if (
          data.result &&
          data.result.length > 0 &&
          data.result[0].files &&
          data.result[0].files.length > 0
        ) {
          setImageUrls(data.result[0].files); // Guardar todas las URLs en el estado
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
      const response = await fetch(
        `${API_BASE_URL}/api/participantes/${participanteId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ ha_pagado: true }),
        }
      );

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

  // Determinar el número de columnas basado en el ancho de pantalla
  const numColumns = width < 600 ? 1 : 3;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>COMPROBANTES</Text>
      <Text style={styles.label}>Comprobantes subidos:</Text>
      {imageUrls.length > 0 ? (
        <FlatList
          data={imageUrls}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item }}
              style={[
                styles.image,
                {
                  width: width / numColumns - 20, // Espacio proporcional según columnas
                  height: width / numColumns - 20, // Mantener proporción cuadrada
                },
              ]}
            />
          )}
          horizontal={numColumns === 1} // Carrusel en pantallas pequeñas
          numColumns={numColumns} // Cuadrícula en pantallas grandes
          key={numColumns.toString()} // Forzar renderizado al cambiar columnas
          showsHorizontalScrollIndicator={false}
        />
      ) : (
        <Text style={styles.errorText}>
          No se encontró ninguna imagen de comprobante.
        </Text>
      )}
      <View style={styles.buttonContainer}>
        {userRole === "Propietario" && (
          <TouchableOpacity
            style={styles.verifyButton}
            onPress={handleVerificarPago}
          >
            <Text style={styles.buttonText}>Verificar pago</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
        >
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
    backgroundColor: "#ece2d9",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#262626",
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: "#262626",
  },
  image: {
    borderRadius: 15,
    margin: 10,
    borderColor: "#BF0413",
    borderWidth: 2,
    resizeMode: "contain", // Asegura que se ajusten manteniendo proporciones
  },
  errorText: {
    color: "#BF0413",
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  verifyButton: {
    backgroundColor: "#BF0413",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    alignItems: "center",
    marginRight: 10,
  },
  closeButton: {
    backgroundColor: "#BF0413",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    alignItems: "center",
  },
  buttonText: {
    color: "#f2f2f2",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default ComprobanteDetail;
