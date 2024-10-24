import { useUser, useAuth } from "@clerk/clerk-expo";
import { Text, View, Button, StyleSheet, FlatList } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import BottomNavbar from "../../components/BottomNavbar";
import GroupCard from "../../components/GroupCard";

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

  // Datos de ejemplo para los grupos
  const groups = [
    {
      groupId: "1",
      groupName: "Grupo #3 Salida TechZone",
      date: "Oct 10",
      members: 3,
      expenses: 15,
      paid: 2,
    },
    {
      groupId: "2",
      groupName: "Grupo #4 Salida Pollos Copacabana",
      date: "Oct 12",
      members: 5,
      expenses: 10,
      paid: 2,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>
        Welcome to My Groups, {user?.emailAddresses[0].emailAddress}
      </Text>
      <FlatList style={styles.groupList}
        data={groups}
        renderItem={({ item }) => (
          <GroupCard
            groupId={item.groupId}
            groupName={item.groupName}
            date={item.date}
            members={item.members}
            expenses={item.expenses}
            paid={item.paid}
          />
        )}
        keyExtractor={(item) => item.groupId}
        contentContainerStyle={styles.groupList}
      />
      <Button title="Sign Out" onPress={handleSignOut} />
      <BottomNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 60,
    backgroundColor: "#ECE2D9",
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "600",
    textAlign: "center",
    color: "#262626",
    paddingTop: 20,
  },
  groupList: {
    paddingLeft: 20,
    paddingRight: 20,
  },
});
