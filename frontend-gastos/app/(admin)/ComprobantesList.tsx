import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

const ComprobantesList = () => {
  const router = useRouter();
  const { groupId, participanteIds, participanteNombres } = useLocalSearchParams<{
    groupId: string;
    participanteIds: string;
    participanteNombres: string;
  }>();
  const [comprobantes, setComprobantes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchComprobantes = async () => {
      try {
        if (!participanteIds || !groupId || !participanteNombres) {
          console.error("Faltan participanteIds, groupId, o participanteNombres");
          return;
        }

        const ids = participanteIds.split(","); // Suponiendo que `participanteIds` se pasa como una lista separada por comas
        const nombres = participanteNombres.split(","); // Suponiendo que `participanteNombres` se pasa como una lista separada por comas

        // Emparejamos cada id con su respectivo nombre
        const comprobantesPromises = ids.map(async (id, index) => {
          try {
            const response = await fetch(
              `http://localhost:3000/api/pagos/evento/${groupId}/participante/${id}`
            );
            const data = await response.json();
            return {
              participanteId: id,
              nombre: nombres[index] || "Desconocido", // Tomar el nombre correspondiente
              files: data.result[0]?.files || [],
            };
          } catch (error) {
            console.error(`Error fetching comprobantes for participanteId ${id}:`, error);
            return null;
          }
        });

        const results = await Promise.all(comprobantesPromises);
        const filteredResults = results.filter((result) => result !== null);
        setComprobantes(filteredResults);
      } catch (error) {
        console.error("Error fetching comprobantes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComprobantes();
  }, [groupId, participanteIds, participanteNombres]);

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
      {comprobantes.map((comprobante) => (
        <View key={comprobante.participanteId} style={styles.comprobanteContainer}>
          <Text style={styles.name}>{comprobante.nombre}</Text>
          {comprobante.files.length > 0 ? (
            comprobante.files.map((fileUrl: string, index: number) => (
              <Image
                key={index}
                source={{ uri: fileUrl }}
                style={styles.image}
              />
            ))
          ) : (
            <Text>No hay imagen disponible</Text>
          )}
        </View>
      ))}
      <TouchableOpacity style={styles.redButton} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Cerrar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ece2d9", // Consistente con los otros componentes
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#262626", // Color oscuro para el título
    marginBottom: 20,
  },
  comprobanteContainer: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#f2f2f2", // Fondo claro para diferenciar cada comprobante
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#262626", // Texto oscuro para el nombre
    marginBottom: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: "#BF0413", // Borde rojo en la imagen
    borderWidth: 2,
  },
  redButton: {
    backgroundColor: "#BF0413", // Botón rojo
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#f2f2f2", // Texto blanco en los botones
    fontSize: 16,
    fontWeight: "700",
  },
});

export default ComprobantesList;
