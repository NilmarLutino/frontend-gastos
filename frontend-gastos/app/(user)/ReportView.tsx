import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../services/apiConfig";

type ReportType = "Evento" | "Usuario";

export default function ReportView() {
  const { reportType, eventoId, fechaInicio, fechaFin } =
    useLocalSearchParams();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener el userId del almacenamiento local
  const getUserIdFromStorage = async (): Promise<number | null> => {
    try {
      const id = await AsyncStorage.getItem("userId");
      return id ? parseInt(id, 10) : null;
    } catch (error) {
      console.error("Failed to get user ID:", error);
      return null;
    }
  };

  console.log("Parámetros recibidos:");
  console.log("reportType:", reportType);
  console.log("eventoId:", eventoId);
  console.log("fechaInicio:", fechaInicio);
  console.log("fechaFin:", fechaFin);

  const isUsuarioReport = reportType === "Usuario";
  const isEventoReport = reportType === "Evento";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (isUsuarioReport) {
          console.log("Cargando reporte de usuarios...");

          const userId = await getUserIdFromStorage();
          if (!userId) {
            Alert.alert("Error", "User ID not found.");
            setLoading(false);
            return;
          }

          const response = await axios.get(
            `${API_BASE_URL}/api/reportes/usuario/${userId}`,
            { params: { fechaInicio, fechaFin } }
          );
          console.log("Respuesta de usuarios:", response.data);

          const { result } = response.data;
          if (Array.isArray(result)) {
            const formattedData = result.map((item, index) => ({
              id: index + 1,
              nombreUsuario: item.nombre_usuario,
              nombreEvento: item.nombre_evento,
              fechaCreacion: item.fecha_creacion
                ? item.fecha_creacion.split(" ")[0]
                : "N/A", // Extraer solo la fecha
              gasto: item.gasto || "Sin datos",
              fechaPago: item.fecha_pago || "N/A",
              pagado: item.pagado,
              linkComprobantePago: item.link_comprobante_pago || [],
            }));
            setData(formattedData);
          } else {
            setData([]);
          }
        } else if (isEventoReport) {
          console.log("Cargando reporte de eventos...");

          const response = await axios.get(
            `${API_BASE_URL}/api/reportes/evento/${eventoId}`
          );
          console.log("Respuesta de eventos:", response.data);

          const detalles = response?.data?.result?.result?.detalles;
          if (Array.isArray(detalles)) {
            const eventDetails = detalles.map((item: any) => ({
              nombreUsuario: item.nombre_usuario,
              totalGasto: item.total_gasto,
              gastosDetalles:
                item.gastos.length > 0
                  ? item.gastos
                      .map((g: any) => `${g.descripcion}: ${g.monto}`)
                      .join(", ")
                  : "Sin detalles",
              fechaPago:
                item.pagos.length > 0 ? item.pagos[0].fecha_pago : "N/A",
              pagado: item.ha_pagado,
              comprobantes:
                item.pagos.length > 0 ? item.pagos[0].comprobantes : [],
            }));
            setData(eventDetails);
          } else {
            setData([]);
          }
        }
      } catch (err: any) {
        setError("Error al cargar los datos del reporte.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventoId, reportType, fechaInicio, fechaFin]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reporte de {reportType}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#BF0413" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : data.length === 0 ? (
        <Text style={styles.error}>No hay datos para mostrar</Text>
      ) : (
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.headerCell}>Número</Text>
            <Text style={styles.headerCell}>
              {isEventoReport ? "Nombre Usuario" : "Nombre Evento"}
            </Text>
            {isUsuarioReport && (
              <Text style={styles.headerCell}>Fecha de Creación</Text>
            )}{" "}
            {/* Nueva columna */}
            <Text style={styles.headerCell}>Gasto</Text>
            {isEventoReport && (
              <Text style={styles.headerCell}>Gastos Detalles</Text>
            )}
            <Text style={styles.headerCell}>Fecha de Pago</Text>
            <Text style={styles.headerCell}>Pagado</Text>
            <Text style={styles.headerCell}>Comprobante</Text>
          </View>
          <FlatList
            data={data}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View
                style={[styles.tableRow, index % 2 === 0 && styles.rowEven]}
              >
                <Text style={styles.cell}>{index + 1}</Text>
                <Text style={styles.cell}>
                  {isEventoReport ? item.nombreUsuario : item.nombreEvento}
                </Text>
                {isUsuarioReport && (
                  <Text style={styles.cell}>
                    {item.fechaCreacion}
                  </Text> /* Datos para la columna */
                )}
                <Text style={styles.cell}>{item.gasto || item.totalGasto}</Text>
                {isEventoReport && (
                  <Text style={styles.cell}>{item.gastosDetalles}</Text>
                )}
                <Text style={styles.cell}>{item.fechaPago}</Text>
                <Text style={styles.cell}>{item.pagado ? "✔" : "✘"}</Text>
                <Text
                  style={[styles.cell, styles.link]}
                  onPress={() =>
                    console.log("Abrir comprobante", item.comprobantes)
                  }
                >
                  Ver Comprobante
                </Text>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ECE2D9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  table: {
    borderWidth: 1,
    borderColor: "#BF0413",
    borderRadius: 5,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#BF0413",
    padding: 10,
  },
  headerCell: {
    flex: 1,
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    padding: 10,
  },
  rowEven: {
    backgroundColor: "#F9F9F9",
  },
  cell: {
    flex: 1,
    textAlign: "center",
  },
  link: {
    color: "#BF0413",
    textDecorationLine: "underline",
  },
  error: {
    color: "#BF0413",
    textAlign: "center",
    fontSize: 18,
  },
});
