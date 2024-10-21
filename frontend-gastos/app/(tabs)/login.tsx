import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>LOGO</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Iniciar Sesión</Text>

        <TextInput style={styles.input} placeholder="Usuario" placeholderTextColor="#ccc" />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#ccc"
          secureTextEntry
        />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Ingresar</Text>
        </TouchableOpacity>

        <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>

        <TouchableOpacity>
          <Text style={styles.registerText}>No tienes cuenta? Regístrate aquí</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Fondo negro como en la imagen
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 50,
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    color: '#fff', // Color blanco para el texto del logo
  },
  formContainer: {
    backgroundColor: '#fff', // Fondo blanco para el formulario
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    color: '#000',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#EAEAEA', // Color de fondo de los inputs
  },
  button: {
    width: '100%',
    backgroundColor: '#000', // Botón negro
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff', // Texto del botón en blanco
    fontSize: 16,
  },
  forgotText: {
    color: '#666', // Color gris para el texto de "¿Olvidaste tu contraseña?"
    marginBottom: 10,
  },
  registerText: {
    color: '#0000FF', // Azul para el texto de "Regístrate aquí"
    textDecorationLine: 'underline',
  },
});
