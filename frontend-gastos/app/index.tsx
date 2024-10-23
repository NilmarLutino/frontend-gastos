import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useOAuth, useUser, useSession } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import axios from "axios";
import { EmailAddressResource } from "@clerk/types";

export default function LoginScreen() {
  const router = useRouter();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const { user, isSignedIn } = useUser();
  const { session } = useSession();
  const [loading, setLoading] = useState(false);

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

  const handleSignUp = () => {
    router.push("/sign-up");
  };

  useEffect(() => {
    const fetchUserFromBackend = async (email: string) => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/api/usuarios/email/${email}`);
        console.log("User data from backend:", response.data);

        if (response.data) {
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

      // Llamada al backend para obtener la información del usuario usando el email
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
      <Text style={styles.logoText}>LOGO</Text>
      <TouchableOpacity style={styles.button} onPress={handleLoginWithGoogle} disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? "Signing in..." : "Sign in with Google"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
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
    backgroundColor: "#4285F4",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
