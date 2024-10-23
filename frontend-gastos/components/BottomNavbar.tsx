import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

// Define los tipos de las propiedades que acepta el componente
type BottomNavbarProps = {
  actionLabel?: string;
  actionPath?: string;
};

export default function BottomNavbar({
  actionLabel = "Nuevo Grupo",
  actionPath = "./CreateGroup", // Valor por defecto si no se proporciona
}: BottomNavbarProps) {
  const router = useRouter();

  return (
    <View style={styles.navbar}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push({ pathname: "./profile" })}
      >
        <FontAwesome name="user" size={24} color="black" />
        <Text style={styles.navText}>Mi perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push({ pathname: actionPath as `./${string}` })}
      >
        <FontAwesome name="plus-circle" size={24} color="black" />
        <Text style={styles.navText}>{actionLabel}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push({ pathname: "./more" })}
      >
        <FontAwesome name="ellipsis-h" size={24} color="black" />
        <Text style={styles.navText}>Más</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontSize: 12,
    marginTop: 5,
  },
});
