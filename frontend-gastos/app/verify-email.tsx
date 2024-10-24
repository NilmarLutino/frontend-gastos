import * as React from 'react';
import { TextInput, Button, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

export default function VerifyEmailScreen() {
  const { isLoaded, signUp } = useSignUp();
  const router = useRouter();
  const [code, setCode] = React.useState('');

  const onPressVerify = async () => {
    if (!isLoaded) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({ code });

      if (completeSignUp.status === 'missing_requirements') {
        router.push('/username');
      } else {
        console.error('Verification not complete:', JSON.stringify(completeSignUp, null, 2));
      }
    } catch (error) {
      console.error('Error during verification:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.logoText}>LOGO</Text>
        <TextInput
          style={styles.input}
          value={code}
          placeholder="Verification Code..."
          onChangeText={(code) => setCode(code)}
        />
        <TouchableOpacity style={styles.button} onPress={onPressVerify}>
          <Text style={styles.buttonText}>Verify Email</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ece2d9', // Similar al color de fondo de la imagen
  },
  logoText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#262626',
    marginBottom: 20,
    alignSelf: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderColor: '#ccc',
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
  },
  button: {
    backgroundColor: '#BF0413', // Botón rojo
    paddingVertical: 10,
    borderRadius: 50, // Bordes redondeados
    alignItems: 'center',
    marginBottom: 15,
    width: '70%', // Tamaño más grande como en el otro código
  },
  buttonText: {
    color: '#f2f2f2', // Texto blanco
    fontSize: 16,
    fontWeight: '700',
  },
  formContainer: {
    backgroundColor: '#f2f2f2',
    padding: 20,
    borderRadius: 20,
    width: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    alignItems: 'center',
  },
});
