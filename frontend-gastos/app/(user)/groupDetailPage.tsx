import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import GroupDetails from "../../components/GroupDetails";
import BottomNavbar from "../../components/BottomNavbarGroupView";
import AddMember from "../../components/modals/addMember";
import ModalError from "../../components/modals/modalError";

export default function GroupDetailPage() {
  const { groupId } = useLocalSearchParams();

  // Datos estáticos de ejemplo
  const groupData = {
    groupName: "Salida TechZone",
    date: "Oct 10",
    membersCount: 5,
    totalExpenses: 124,
    paidCount: 2,
    description: "Evento por los juegos jugados",
  };

  const members = [
    { id: "1", name: "Integrante 1", balance: 57, expenses: [
      { item: "Comida", amount: 25 },
      { item: "Juegos", amount: 32 },
    ] },
    { id: "2", name: "Integrante 2", balance: 57, expenses: [
      { item: "Comida", amount: 25 },
      { item: "Juegos", amount: 32 },
    ] },
    { id: "3", name: "Integrante 3", balance: 57, expenses: [
      { item: "Comida", amount: 25 },
      { item: "Juegos", amount: 32 },
    ] },
  ];

  // Estados para controlar la visibilidad de los modales
  const [isAddMemberVisible, setAddMemberVisible] = useState(false);
  const [isModalErrorVisible, setModalErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Función para manejar la búsqueda de participantes
  const handleBuscarParticipante = (username: string) => {
    if (username === "JuanPerez123") {
      setModalErrorVisible(false); // Participante encontrado
    } else {
      setErrorMessage("Usuario no encontrado, verifique si el nombre es correcto");
      setModalErrorVisible(true); // Participante no encontrado
    }
  };

  return (
    <View style={styles.pageContainer}>
      <GroupDetails groupData={groupData} members={members} />

      {/* Modales */}
      <AddMember
        visible={isAddMemberVisible}
        onClose={() => setAddMemberVisible(false)}
        onBuscar={handleBuscarParticipante}
      />
      
      <ModalError
        visible={isModalErrorVisible}
        onClose={() => setModalErrorVisible(false)}
        message={errorMessage}
      />

      <BottomNavbar
        actionLabel="Añadir participante"
        onAction={() => setAddMemberVisible(true)} // Abrir modal de participante
        onAddMember={() => setAddMemberVisible(true)} // Añadir participante
      />
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingBottom: 60, // Ajuste para que el contenido no se superponga con el navbar
  },
  
});
