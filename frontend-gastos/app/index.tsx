import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Image
} from "react-native";
import { useRouter } from "expo-router";
import { useOAuth, useUser, useSession, useSignIn } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import axios from "axios";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LogoImage from "../assets/images/gastos.png";

export default function LoginScreen() {
  const router = useRouter();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const { user, isSignedIn } = useUser();
  const { session } = useSession();
  const { signIn, setActive, isLoaded } = useSignIn();
  const [loading, setLoading] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginWithGoogle = async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL("/(user)/myGroups", { scheme: "myapp" }),
      });

      if (createdSessionId) {
        await setActive!({ session: createdSessionId });
        console.log("Session set, waiting for user data...");
      } else {
        console.error("OAuth login was not completed.");
      }
    } catch (error) {
      console.error("OAuth error:", error);
    }
  };

  const handleSignIn = useCallback(async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        console.log("User signed in successfully.");
        router.push("/(user)/myGroups");
      } else {
        console.error("Sign-in attempt incomplete:", JSON.stringify(signInAttempt, null, 2));
      }
    } catch (error) {
      console.error("Error during sign-in:", JSON.stringify(error, null, 2));
      Alert.alert("Error", "Failed to sign in. Please check your credentials.");
    }
  }, [isLoaded, emailAddress, password]);

  const handleSignUp = () => {
    router.push("/sign-up");
  };

  useEffect(() => {
    const saveUserId = async (id: number) => {
      try {
        await AsyncStorage.setItem("userId", id.toString());
        console.log("User ID saved to storage:", id);
      } catch (error) {
        console.error("Failed to save user ID:", error);
      }
    };

    const fetchUserFromBackend = async (email: string) => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/api/usuarios/email/${email}`);
        console.log("User data from backend:", response.data);

        if (response.data) {
          const userId = response.data.result.id;
          await saveUserId(userId);
          console.log("User data found:", response.data);
          router.push("/(user)/myGroups");
        } else {
          Alert.alert("Error", "User data not found in backend.");
        }
      } catch (error) {
        console.error("Error fetching user from backend:", error);
        Alert.alert("Error", "Failed to fetch user data from backend.");
      } finally {
        setLoading(false);
      }
    };

    if (isSignedIn && user) {
      console.log("User Info:", {
        id: user.id,
        primaryEmailAddress: user.primaryEmailAddress,
        username: user.username,
        createdAt: user.createdAt,
        publicMetadata: user.publicMetadata,
      });

      const email = user.primaryEmailAddress?.emailAddress;
      if (email) {
        fetchUserFromBackend(email);
      }
    } else if (session && !user) {
      console.log("Session is active but user data is not yet loaded.");
    }
  }, [isSignedIn, user, session]);

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.logoContainer}>
            <Image
              source={LogoImage} 
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.logoText}>GASTOS COMPARTIDOS</Text>
        </View>
        <Text style={styles.labelText}>Correo:</Text>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Ingrese su correo..."
          placeholderTextColor={"#ccc"}
          value={emailAddress}
          onChangeText={setEmailAddress}
        />
        <Text style={styles.labelText}>Contraseña:</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          autoCapitalize="none"
          placeholder="Ingrese su contraseña..."
          placeholderTextColor={"#ccc"}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleSignIn} disabled={loading}>
          <Text style={styles.buttonText}>
            {loading ? "Signing in..." : "Iniciar Sesión"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLoginWithGoogle} disabled={loading}>
          <Text style={styles.buttonText}>
            {loading ? "Signing in..." : "Ingresar con Google"}
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
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logoImage: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  logoText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#262626",
  },
});
