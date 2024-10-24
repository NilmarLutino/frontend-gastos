import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";


interface BottomNavbarGroupViewProps {
  actionLabel: string;
  onAction: () => void;
  onAddMember: () => void;
}
  
  

export default function BottomNavbarGroupView({
  onAddMember,
}: BottomNavbarGroupViewProps) {
  return (
    <View style={styles.navbar}>
      <TouchableOpacity style={styles.navItemFirst}>
        <FontAwesome name="user" size={24} color="black" />
        <Text style={styles.navText}>Mi perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={onAddMember}>
        <FontAwesome name="user-plus" size={24} color="black" />
        <Text style={styles.navText}>Añadir participante</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItemLast}>
        <FontAwesome name="sign-out" size={24} color="black" />
        <Text style={styles.navText}>Cerrar sesión</Text>
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
  navItem: {
    flex: 1,
    alignItems: "center",
    borderColor: "#ddd",
    borderRightWidth: 2,
    borderLeftWidth: 2,
  },
  navItemFirst: {
    flex: 1,
    alignItems: "center",
  },
  navItemLast: {
    flex: 1,
    alignItems: "center",
  },
  navText: {
    fontSize: 12,
    color: "#262626",
    fontWeight: 600,
    marginTop: 5,
  },
});