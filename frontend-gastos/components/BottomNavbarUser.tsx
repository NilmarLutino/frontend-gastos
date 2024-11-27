import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import DateRangeModal from "../components/modals/generateReport";

export default function BottomNavbarUser() {
  const router = useRouter();

  const [isModalVisible, setModalVisible] = useState(false);

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
        onViewReport={(startDate, endDate, reportType) =>
          router.push({
            pathname: "../(user)/ReportView",
            params: { startDate, endDate, reportType },
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
