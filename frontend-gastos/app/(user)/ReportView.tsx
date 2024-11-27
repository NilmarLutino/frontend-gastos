import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";

type ReportViewProps = {
  reportType: "Evento" | "Usuario";
  data: any[];
};

export default function ReportView({ data }: ReportViewProps) {
  const { reportType } = useLocalSearchParams();
  console.log("Report Type:", reportType);
  const isEventoReport = reportType === "Evento";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reporte de {reportType}</Text>
      <View style={styles.table}>
        {/* Cabecera de la tabla */}
        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>Número</Text>
          <Text style={styles.headerCell}>
            {isEventoReport ? "Nombre Usuario" : "Nombre evento"}
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
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <View style={[styles.tableRow, index % 2 === 0 && styles.rowEven]}>
              <Text style={styles.cell}>{index + 1}</Text>
              <Text style={styles.cell}>
                {isEventoReport ? item.nombreEvento : item.nombreUsuario}
              </Text>
              <Text style={styles.cell}>{item.gasto}</Text>
              {isEventoReport && (
                <Text style={styles.cell}>{item.gastoDetalles}</Text>
              )}
              <Text style={styles.cell}>{item.fechaPago}</Text>
              <Text style={styles.cell}>{item.pagado ? "✔" : "✘"}</Text>
              <Text
                style={[styles.cell, styles.link]}
                onPress={() => console.log("Abrir comprobante")}
              >
                Comprobante
              </Text>
            </View>
          )}
        />
      </View>
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
});
