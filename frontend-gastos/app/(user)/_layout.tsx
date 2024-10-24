// app/(user)/_layout.tsx
import React from "react";
import { Stack } from "expo-router";

export default function UserLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="myGroups"
        options={{ title: "Mis Grupos" }} // Título para la pantalla myGroups
      />
      <Stack.Screen
        name="ComprobanteDetail"
        options={{ title: "Detalle del Comprobante" }} // Título para la pantalla ComprobanteDetail
      />
      <Stack.Screen
        name="ComprobantesList"
        options={{ title: "Lista de Comprobantes" }} // Título para la pantalla ComprobantesList
      />
      <Stack.Screen
        name="CreateGroup"
        options={{ title: "Crear Grupo" }} // Título para la pantalla CreateGroup
      />
      <Stack.Screen
        name="groupDetailPage"
        options={{ title: "Detalles del Grupo" }} // Título para la pantalla groupDetailPage
      />
      <Stack.Screen
        name="SubirComprobante"
        options={{ title: "Subir Comprobante" }} // Título para la pantalla SubirComprobante
      />
      <Stack.Screen
        name="UserProfile"
        options={{ title: "Perfil del Usuario" }} // Título para la pantalla UserProfile
      />
    </Stack>
  );
}
