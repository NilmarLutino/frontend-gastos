import React from "react";
import { View, Text, StyleSheet, Button, FlatList } from "react-native";
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

  return (
    <View style={styles.container}>
      <Text style={styles.groupTitle}>{groupData.groupName}</Text>
      <Text style={styles.details}>Integrantes: {groupData.membersCount}</Text>
      <Text style={styles.details}>Gastos totales: {groupData.totalExpenses}$</Text>
      <Text style={styles.details}>Pagados: {groupData.paidCount}</Text>
      <Text style={styles.details}>Descripción: {groupData.description}</Text>

      {/* Mostrar botones solo si el usuario es propietario */}
      {userRole === "Propietario" && (
        <Button
          title="Comprobantes"
          onPress={() => router.push("../(admin)/ComprobantesList")}
        />
      )}

      {/* Mostrar botones solo si el usuario es invitado */}
      {userRole === "Invitado" && (
        <>
          <Button
            title="Añadir"
            onPress={() => router.push("../(user)/SubirComprobante")}
          />
          <Button
            title="Ver Comprobante subido"
            onPress={() => router.push({ pathname: "../(admin)/ComprobanteDetail" })}
          />
        </>
      )}

      <Button
        title="Añadir Comprobante"
        onPress={() =>
          router.push({
            pathname: "../(user)/SubirComprobante",
            params: {
              eventoId: groupId,
              participanteId: participanteId?.toString(),
            },
          })
        }
      />
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
    backgroundColor: "#f9f9f9",
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  details: {
    marginVertical: 5,
    fontSize: 14,
  },
});
