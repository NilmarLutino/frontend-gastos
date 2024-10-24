import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

export default function BottomNavbarUser() {
  const router = useRouter();

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
        style={styles.navItemLast}
        onPress={() => router.push({ pathname: "./" })}
      >
        <FontAwesome name="plus-circle" size={24} color="#262626" />
        <Text style={styles.navText}>Más opciones</Text>
      </TouchableOpacity>
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
