import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MyGroupsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Grupos</Text>
      <Text style={styles.subtitle}>Aquí se mostrarán los grupos a los que perteneces.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
  },
});
