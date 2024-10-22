import { useUser, useAuth } from "@clerk/clerk-expo";
import { Text, View, Button, StyleSheet } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

export default function MyGroups() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/");
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>
        Welcome to My Groups, {user?.emailAddresses[0].emailAddress}
      </Text>
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 20,
  },
});
