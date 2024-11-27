import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import DateRangeModal from "../components/modals/generateReport";

export default function BottomNavbarUser() {
  const router = useRouter();

  const [isModalVisible, setModalVisible] = useState(false);

  const handleViewReport = (startDate: Date, endDate: Date) => {
    setModalVisible(false); // Cerrar el modal
    console.log("Generando reporte desde:", startDate, "hasta:", endDate);
    // Aquí puedes agregar la lógica para navegar a la pantalla de reportes o realizar otra acción
  };

  return (
    <View style={styles.navbar}>
      <TouchableOpacity
        style={styles.navItemFirst}
        onPress={() => router.push({ pathname: "./myGroups" })}
      >
        <FontAwesome name="user" size={24} color="#262626" />
        <Text style={styles.navText}>Mis grupos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItemFirst}
        onPress={() => router.push({ pathname: "./" })}
      >
        <FontAwesome name="plus-circle" size={24} color="#262626" />
        <Text style={styles.navText}>Más opciones</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItemLast}
        onPress={() => setModalVisible(true)} 
      >
        <FontAwesome name="file" size={24} color="#262626" />
        <Text style={styles.navText}>Reportes</Text>
      </TouchableOpacity>

      {/* Modal para seleccionar rango de fechas */}
      <DateRangeModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onViewReport={(startDate, endDate, user) =>
          router.push({
            pathname: "/",
            params: { startDate, endDate, user },
          })
        }
      />

    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    display: "flex",
    flex: 3,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  navItemFirst: {
    flex: 1,
    alignItems: "center",
    borderColor: "#ddd",
    borderRightWidth: 2,
  },
  navItemLast: {
    flex: 1,
    alignItems: "center",
  },
  navText: {
    fontSize: 12,
    color: "#262626", // Color del texto
    fontWeight: "600",
    marginTop: 5,
  },
});
