import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth } from "@clerk/clerk-expo";


interface BottomNavbarGroupViewProps {
  actionLabel: string;
  onAction: () => void;
  onAddMember?: () => void;
}
  
  

export default function BottomNavbarGroupView({
  onAddMember,
}: BottomNavbarGroupViewProps) {

  const { signOut } = useAuth(); // Obtén la función de cierre de sesión
  const router = useRouter();
  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/"); // Redirige a la página principal u otra página después de cerrar sesión
    } catch (error) {
      console.error("Error during sign out:", error);
      Alert.alert("Error", "Ocurrió un error al cerrar la sesión.");
    }
  };
  return (
    <View style={styles.navbar}>
      <TouchableOpacity style={styles.navItem }         
        onPress={() => router.push({ pathname: "/(user)/myGroups" })}>

        <FontAwesome name="users" size={24} color="black" />
        <Text style={styles.navText}>Mis grupos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={() => onAddMember?.()}>
  <FontAwesome name="user-plus" size={24} color="black" />
  <Text style={styles.navText}>Añadir participante</Text>
</TouchableOpacity>


      <TouchableOpacity style={styles.navItem} onPress={handleSignOut}>
        <FontAwesome name="sign-out" size={24} color="black" />
        <Text style={styles.navText}>Cerrar sesión</Text>
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
