// File: ComprobantesList.tsx
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

const ComprobantesList = () => {
  const router = useRouter();

  const comprobantes = [
    {
      id: "1",
      name: "Integrante 1",
      imageUrl: "https://via.placeholder.com/150", // Reemplaza con la URL de la imagen real
    },
    {
      id: "2",
      name: "Integrante 2",
      imageUrl: "https://via.placeholder.com/150", // Reemplaza con la URL de la imagen real
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>COMPROBANTES</Text>
      {comprobantes.map((comprobante) => (
        <View key={comprobante.id} style={styles.comprobanteContainer}>
          <Text style={styles.name}>{comprobante.name}</Text>
          <Image
            source={{ uri: comprobante.imageUrl }}
            style={styles.image}
          />
        </View>
      ))}
      <Button
        title="Cerrar"
        onPress={() => router.back()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  comprobanteContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
});

export default ComprobantesList;
