import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import BottomNavbarUser from "../../components/BottomNavbarUser";
import { fetchUserProfile, fetchUserRole } from "../../services/userService";
import profileImage from "../../assets/images/avatar-de-usuario.png";

// Define los tipos para los datos del perfil y del rol
type UserProfileData = {
  id: number;
  nombre: string;
  email: string;
  roles_id: number;
  fecha_creacion: string;
};

type RoleData = {
  id: number;
  nombre_rol: string;
  descripcion: string;
};

export default function UserProfile() {
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [userRole, setUserRole] = useState<RoleData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getUserIdFromStorage = async (): Promise<number | null> => {
    try {
      const id = await AsyncStorage.getItem("userId");
      return id ? parseInt(id, 10) : null;
    } catch (error) {
      console.error("Failed to get user ID:", error);
      return null;
    }
  };

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const userId = await getUserIdFromStorage();
      if (!userId) {
        Alert.alert("Error", "User ID not found.");
        router.replace("/");
        return;
      }

      const userData = await fetchUserProfile(userId);
      if (userData) {
        setUserProfile(userData);

        // Obtener la información del rol usando el ID del rol
        const roleData = await fetchUserRole(userData.roles_id);
        setUserRole(roleData);
      } else {
        Alert.alert("Error", "User data not found.");
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MI PERFIL</Text>
      <View style={styles.profileContainer}>
        {/* Imagen de usuario */}

        <Image source={profileImage} style={styles.profileImage} />

        {/* Información del usuario */}
        <View style={styles.infoContainer}>
          <Text style={styles.label}>NOMBRE USUARIO:</Text>
          <Text style={styles.infoText}>{userProfile?.nombre}</Text>

          <Text style={styles.label}>CORREO ELECTRÓNICO:</Text>
          <Text style={styles.infoText}>{userProfile?.email}</Text>

          <Text style={styles.label}>ROL ACTUAL:</Text>
          <Text style={styles.infoText}>{userRole?.nombre_rol}</Text>

          <Text style={styles.label}>DESCRIPCIÓN DEL ROL:</Text>
          <Text style={styles.infoText}>{userRole?.descripcion}</Text>
        </View>
      </View>
      <BottomNavbarUser />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
    paddingBottom: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  profileContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  infoContainer: {
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: "#e9e9e9",
    padding: 10,
    borderRadius: 5,
  },
});
