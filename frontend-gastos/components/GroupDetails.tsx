import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import MemberCard from "./MemberCard";
import { useRouter, useLocalSearchParams } from "expo-router";
import ModalRepartir from "./modals/repartirModal"; // Importa el modal creado

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
  onRefresh: () => void;
  groupId: string;
  participanteId: string;
};

export default function GroupDetails({
  groupData,
  members,
  onRefresh,
  groupId,
  participanteId,
}: GroupDetailsProps) {
  const router = useRouter();
  const { userRole } = useLocalSearchParams<{ userRole: string }>(); // Recibe el userRole de los parámetros

  const [modalVisible, setModalVisible] = useState(false); // Estado para controlar el modal
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh(); // Llama al callback para actualizar datos
    setIsRefreshing(false);
  };

  console.log("Vista de GroupDetails, USER ROLES:", userRole);

  return (
    
    <View style={styles.container}>
    {isRefreshing ? (
        <ActivityIndicator size="large" color="#BF0413" />
      ) : (
        <>
      <Text style={styles.groupTitle}>{groupData.groupName}</Text>
      <Text style={styles.details}>Integrantes: {groupData.membersCount}</Text>
      <Text style={styles.details}>
        Gastos totales: {groupData.totalExpenses}$
      </Text>
      <Text style={styles.details}>Pagados: {groupData.paidCount}</Text>
      <Text style={styles.details}>Descripción: {groupData.description}</Text>

      {/* Mostrar botones solo si el usuario es propietario */}
      {userRole === "Propietario" && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: 10,
          }}
        >
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "../(user)/SubirFactura",
                params: {
                  groupId: groupId,
                  participanteIds: members
                    .map((member) => member.id)
                    .join(","),
                  participanteNombres: members
                    .map((member) => member.name)
                    .join(","),
                },
              })
            }
            style={[styles.button, { flex: 1, marginRight: 5 }]}
          >
            <Text style={styles.buttonText}>Importar Factura</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "../(user)/ComprobantesList",
                params: {
                  groupId: groupId,
                  participanteIds: members
                    .map((member) => member.id)
                    .join(","),
                  participanteNombres: members
                    .map((member) => member.name)
                    .join(","),
                },
              })
            }
            style={[styles.button, { flex: 1, marginRight: 5 }]}
          >
            <Text style={styles.buttonText}>Comprobantes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "../(user)/ReportView",
                params: {
                  eventoId: groupId,
                  reportType: "Evento",
                },
              })
            }
            style={[styles.button, { flex: 1, marginLeft: 5, marginRight: 5 }]}
          >
            <Text style={styles.buttonText}>Ver Reporte</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setModalVisible(true)} // Abre el modal
            style={[styles.button, { flex: 1, marginLeft: 5 }]}
          >
            <Text style={styles.buttonText}>Repartir</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal para repartir gastos */}
      <ModalRepartir
  visible={modalVisible}
  onClose={() => setModalVisible(false)}
  groupData={groupData}
  groupId={groupId} // Pasa el ID del grupo al modal
  onRefresh={handleRefresh}
/>


      {userRole === "Invitado" && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: 10,
          }}
        >
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
            style={[styles.button, { flex: 1, marginRight: 5 }]} // Espaciado entre botones
          >
            <Text style={styles.buttonText}>Añadir Comprobante</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "../(user)/ComprobanteDetail",
                params: {
                  eventoId: groupId,
                  participanteId: participanteId,
                  userRole: "Invitado",
                },
              })
            }
            style={[styles.button, { flex: 1, marginHorizontal: 5 }]} // Espaciado uniforme
          >
            <Text style={styles.buttonText}>Ver Comprobante</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "../(user)/ReportView",
                params: {
                  eventoId: groupId,
                  reportType: "Evento",
                },
              })
            }
            style={[styles.button, { flex: 1, marginLeft: 5 }]} // Espaciado entre botones
          >
            <Text style={styles.buttonText}>Ver Reporte</Text>
          </TouchableOpacity>
        </View>
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
        </>
      )}
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
    fontWeight: "600",
  },
});