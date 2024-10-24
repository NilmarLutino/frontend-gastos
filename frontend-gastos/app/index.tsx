import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useOAuth, useUser } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { FontAwesome } from "@expo/vector-icons";

export default function LoginScreen() {
  const router = useRouter();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const { user, isSignedIn } = useUser();

  const handleLoginWithGoogle = async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL("/(user)/myGroups", { scheme: "myapp" }),
      });

      if (createdSessionId) {
        await setActive!({ session: createdSessionId });
        console.log("User Info:", user);
        router.push("/(user)/myGroups");
      } else {
        console.error("OAuth login was not completed.");
      }
    } catch (error) {
      console.error("OAuth error:", error);
    }
  };

  const handleSignUp = () => {
    router.push("/sign-up");
  };

  React.useEffect(() => {
    if (isSignedIn) {
      router.push("/(user)/myGroups");
    }
  }, [isSignedIn]);

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.logoText}>LOGO</Text>
        <Text style={styles.labelText}>Correo:</Text>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Ingrese su correo..."
          placeholderTextColor={"#ccc"}
        />
        <Text style={styles.labelText}>Contraseña:</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          autoCapitalize="none"
          placeholder="Ingrese su contraseña..."
          placeholderTextColor={"#ccc"}
        />
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleLoginWithGoogle}>
        <Text style={styles.buttonText}>Ingresar con Google
        <FontAwesome style={styles.icon} name="google" size={16} color="#f2f2f2" />
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSignUp}>
        <Text style={styles.registerText}>
          No tienes cuenta? Regístrate aquí
        </Text>
      </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    backgroundColor: "#ece2d9",
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#262626",
    marginBottom: 20,
    alignSelf: "center",
  },
  labelText: {
    fontSize: 16,
    color: "#262626",
    marginBottom: 5,
    fontWeight: "500",
    textAlign: "left",
  },
  formContainer: {
    backgroundColor: "#f2f2f2",
    padding: 20,
    borderRadius: 20,
    width: "70%",
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  input: {
    width: "100%",
    height: 40,
    alignSelf: "center",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: "#f2f2f2",
    borderColor: "#ccc",
    borderWidth: 2,
  },
  button: {
    backgroundColor: "#BF0413",
    paddingVertical: 10,
    borderRadius: 50,
    alignItems: "center",
    alignSelf: "center",
    width: "90%",
    marginTop: 20,
  },
  buttonText: {
    color: "#f2f2f2",
    fontWeight: "700",
    fontSize: 16,
  },
  registerText: {
    color: "blue",
    textDecorationLine: "underline",
    padding: 30,
    alignSelf: "center",
  },
  icon: {
    marginLeft: 10,
  },
});
