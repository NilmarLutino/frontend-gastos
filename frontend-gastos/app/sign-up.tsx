import * as React from "react";
import {
  TextInput,
  Button,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useSignUp, useOAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";

export default function SignUpScreen() {
  const { isLoaded, signUp } = useSignUp();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const router = useRouter();
  const [emailAddress, setEmailAddress] = React.useState("");

  const handleSignUpWithGoogle = async () => {
    try {
      const { createdSessionId, setActive, signUp } = await startOAuthFlow({
        redirectUrl: Linking.createURL("/username", { scheme: "myapp" }),
      });

      if (signUp && signUp.emailAddress) {
        setEmailAddress(signUp.emailAddress);
        router.push({ pathname: '/username', params: { email: signUp.emailAddress } });
      } else {
        console.error("OAuth registration was not completed.");
      }
    } catch (error) {
      console.error("OAuth error:", error);
    }
  };

  const handleSignUpWithEmail = async () => {
    if (!isLoaded || !emailAddress) return;

    try {
      await signUp.create({ emailAddress });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      router.push("/verify-email");
    } catch (error) {
      console.error("Error during sign-up with email:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.logoText}>LOGO</Text>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Email..."
          onChangeText={(email) => setEmailAddress(email)}
        />
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleSignUpWithEmail}
          >
            <Text style={styles.buttonText}>Sign Up with Email</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={handleSignUpWithGoogle}
          >
            <Text style={styles.buttonText}>
              Sign Up with Google
              <FontAwesome
                style={styles.icon}
                name="google"
                size={16}
                color="#f2f2f2"
              />
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#ece2d9", // Similar al color de fondo de la imagen
  },
  logoText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#262626",
    marginBottom: 20,
    alignSelf: "center",
  },
  input: {
    width: "100%",
    padding: 10,
    marginVertical: 10,
    borderColor: "#ccc",
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: "#f2f2f2",
  },

  button: {
    backgroundColor: "#BF0413", // Botones rojos
    paddingVertical: 10,
    borderRadius: 50, // Bordes redondeados para los botones
    alignItems: "center",
    marginBottom: 15,
    width: "70%", // Tamaño más grande como en la imagen
  },
  buttonText: {
    color: "#f2f2f2", // Texto blanco
    fontSize: 16,
    fontWeight: "700",
  },
  icon: {
    marginLeft: 10,
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
    alignItems: "center",
  },
  actions: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    width: "40%",
    gap: 20,
  },
});
