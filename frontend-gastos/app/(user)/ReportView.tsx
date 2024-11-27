import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";

type ReportType = "Evento" | "Usuario";

export default function ReportView() {
  const { reportType, eventoId } = useLocalSearchParams();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log("EventoID reportes:", eventoId);

  // Asegurar que el tipo de reporte es válido
  const validReportType: ReportType = reportType === "Evento" || reportType === "Usuario"
    ? reportType
    : "Usuario"; // Valor predeterminado si no se define correctamente

  const isEventoReport = validReportType === "Evento";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Evento ID recibido:", eventoId);

        if (isEventoReport) {
          const response = await axios.get(`http://localhost:3000/api/reportes/evento/${eventoId}`);
          console.log("Respuesta del backend:", response.data);

          const detalles = response?.data?.result?.result?.detalles;

          if (Array.isArray(detalles)) {
            const eventDetails = detalles.map((item: any) => ({
              nombreUsuario: item.nombre_usuario,
              totalGasto: item.total_gasto,
              gastosDetalles: item.gastos.length > 0
                ? item.gastos.map((g: any) => `${g.descripcion}: ${g.monto}`).join(", ")
                : "Sin detalles",
              fechaPago: item.pagos.length > 0 ? item.pagos[0].fecha_pago : "N/A",
              pagado: item.ha_pagado,
              comprobantes: item.pagos.length > 0 ? item.pagos[0].comprobantes : [],
            }));
            console.log("Datos procesados para la tabla:", eventDetails);
            setData(eventDetails);
          } else {
            console.warn("El campo 'detalles' no es un array o está vacío:", detalles);
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
  }, [eventoId, reportType]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reporte de {validReportType}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#BF0413" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : data.length === 0 ? (
        <Text style={styles.error}>No hay datos para mostrar</Text>
      ) : (
        <View style={styles.table}>
          {/* Cabecera de la tabla */}
          <View style={styles.tableHeader}>
            <Text style={styles.headerCell}>Número</Text>
            <Text style={styles.headerCell}>
              {isEventoReport ? "Nombre Usuario" : "Nombre Evento"}
            </Text>
            <Text style={styles.headerCell}>Gasto</Text>
            {isEventoReport && <Text style={styles.headerCell}>Gastos Detalles</Text>}
            <Text style={styles.headerCell}>Fecha de Pago</Text>
            <Text style={styles.headerCell}>Pagado</Text>
            <Text style={styles.headerCell}>Comprobante</Text>
          </View>
          {/* Cuerpo de la tabla */}
          <FlatList
            data={data}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={[styles.tableRow, index % 2 === 0 && styles.rowEven]}>
                <Text style={styles.cell}>{index + 1}</Text>
                <Text style={styles.cell}>{item.nombreUsuario}</Text>
                <Text style={styles.cell}>{item.totalGasto}</Text>
                {isEventoReport && (
                  <Text style={styles.cell}>{item.gastosDetalles}</Text>
                )}
                <Text style={styles.cell}>{item.fechaPago}</Text>
                <Text style={styles.cell}>{item.pagado ? "✔" : "✘"}</Text>
                <Text
                  style={[styles.cell, styles.link]}
                  onPress={() => console.log("Abrir comprobante", item.comprobantes)}
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
