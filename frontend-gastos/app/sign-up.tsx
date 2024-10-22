import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function SignUpScreen() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logoText}>LOGO</Text>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Crear cuenta</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogin}>
        <Text style={styles.loginText}>
          Ya tienes una cuenta? Inicia sesión
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  loginText: {
    color: "#0000FF",
    textDecorationLine: "underline",
  },
});
