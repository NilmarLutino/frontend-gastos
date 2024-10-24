import React from "react";
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity } from "react-native";
import MemberCard from "./MemberCard";
import { useRouter, useLocalSearchParams } from "expo-router";


type GroupDetailsProps = {
  groupData: {
    groupName: string;
    date: string;
    membersCount: number;
    totalExpenses: number;
    paidCount: number;
    description: string;
    
  };
  members: {
    id: string;
    name: string;
    balance: number;
    expenses: { item: string; amount: number }[];
  }[];
  onRefresh: () => void; // Añade esta prop
  groupId: string; // Añade groupId aquí para pasarlo a MemberCard
  participanteId: string;
};

export default function GroupDetails({ groupData, members, onRefresh, groupId, participanteId  }: GroupDetailsProps) {
  const router = useRouter();
  const { userRole } = useLocalSearchParams<{ userRole: string }>(); // Recibe el userRole de los parámetros

  console.log("Vista de GroupDetails, USER ROLES:", userRole );

  return (
    <View style={styles.container}>
      <Text style={styles.groupTitle}>{groupData.groupName}</Text>
      <Text style={styles.details}>Integrantes: {groupData.membersCount}</Text>
      <Text style={styles.details}>Gastos totales: {groupData.totalExpenses}$</Text>
      <Text style={styles.details}>Pagados: {groupData.paidCount}</Text>
      <Text style={styles.details}>Descripción: {groupData.description}</Text>

      {/* Mostrar botones solo si el usuario es propietario */}
      {userRole === "Propietario" && (
        <TouchableOpacity
          onPress={() => router.push({
            pathname: "../(admin)/ComprobantesList",
            params: {
              groupId: groupId,
              participanteIds: members.map((member) => member.id).join(","),
              participanteNombres: members.map((member) => member.name).join(","),
            },
          })}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Comprobantes</Text>
        </TouchableOpacity>

      )}

      {/* Mostrar botones solo si el usuario es "Invitado" */}
      {userRole === "Invitado" && (
        <>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "../(user)/SubirComprobante",
                params: {
                  eventoId: groupId,
                  participanteId: participanteId,
                },
              })
            }
            style={styles.button}
          >
            <Text style={styles.buttonText}>Añadir Comprobante</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "../(admin)/ComprobanteDetail",
                params: {
                  eventoId: groupId,
                  participanteId: participanteId,
                },
              })
            }
            style={styles.button}
          >
            <Text style={styles.buttonText}>Ver Comprobante subido</Text>
          </TouchableOpacity>
        </>
      )}


      <FlatList
        data={members}
        renderItem={({ item }) => (
          <MemberCard
            member={item}
            groupId={groupId} // Pasa el groupId a cada MemberCard
            onRefresh={onRefresh}
            userRole={userRole}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ECE2D9",
  },
  groupTitle: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  details: {
    marginVertical: 5,
    fontSize: 18,
    fontWeight: "600",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#BF0413",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    textAlign: "center",
    color: "#f2f2f2",
    fontSize: 16,
    fontWeight: 600,
  },
  description: {
    display: "flex",
    flexDirection: "column",
    fontSize: 18,
    fontWeight: "600",
    gap: 5,
  },
  descriptionContent: {
    color: "#555",
    fontWeight: "400",
    fontSize: 16,
  },
  ammo: {
    color: "#262626",
  },
});
