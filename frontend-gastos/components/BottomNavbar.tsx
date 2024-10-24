import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useUser, useAuth } from "@clerk/clerk-expo";
import AsyncStorage from "@react-native-async-storage/async-storage";


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
  const { signOut } = useAuth();


  const handleSignOut = async () => {
    try {
      await signOut();
      await AsyncStorage.removeItem("userId"); // Elimina el userId de AsyncStorage
      console.log("User ID removed from storage.");
      router.replace("/"); // Redirige al usuario a la página principal o de inicio de sesión
    } catch (error) {
      console.error("Error during sign out:", error);
      Alert.alert("Error", "Failed to sign out. Please try again.");
    }
  };

  

  return (
    <View style={styles.navbar}>
      <TouchableOpacity
        style={styles.navItemFirst}
        onPress={() => router.push({ pathname: "./UserProfile" })}
      >
        <FontAwesome name="user" size={24} color="#262626" />
        <Text style={styles.navText}>Mi perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push({ pathname: actionPath as `./${string}` })}
      >
        <FontAwesome name="plus-circle" size={24} color="#262626" />
        <Text style={styles.navText}>{actionLabel}</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navItemLast}
        onPress={handleSignOut}>
        <FontAwesome name="sign-out" size={24} color="#262626" />
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
