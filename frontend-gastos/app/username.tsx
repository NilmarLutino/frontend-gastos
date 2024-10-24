import * as React from 'react';
import { TextInput, Button, View, StyleSheet, Text, Alert, Image } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import axios from 'axios';
import LogoImage from "../assets/images/gastos.png";

export default function UsernameScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const onCompleteSignUp = async () => {
    if (!isLoaded) return;

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const completeSignUp = await signUp.update({
        username,
        password,
      });

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });

        const userData = {
          nombre: username,
          email: completeSignUp.emailAddress, 
          contrasena: password,
          roles_id: 1, 
        };

        try {
          const response = await axios.post('http://localhost:3000/api/usuarios/', userData);
          console.log('User registered in backend:', response.data);
          Alert.alert('Success', 'User registered successfully!');
          router.replace('/(user)/myGroups');
        } catch (backendError) {
          console.error('Error registering user in backend:', backendError);
          Alert.alert('Error', 'Failed to register user in the backend.');
        }
      } else {
        console.error('Sign-up completion failed:', JSON.stringify(completeSignUp, null, 2));
      }
    } catch (error) {
      console.error('Error completing sign-up:', error);
      Alert.alert('Error', 'Failed to complete sign-up.');
    }
  };

  return (
    <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={LogoImage} 
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.logoText}>GASTOS COMPARTIDOS</Text>
        </View>
      <TextInput
        style={styles.input}
        value={username}
        placeholder="Username..."
        onChangeText={(username) => setUsername(username)}
      />
      <TextInput
        style={styles.input}
        value={password}
        placeholder="Password..."
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
      <TextInput
        style={styles.input}
        value={confirmPassword}
        placeholder="Confirm Password..."
        secureTextEntry={true}
        onChangeText={(confirmPassword) => setConfirmPassword(confirmPassword)}
      />
      <Button title="Complete Sign-Up" onPress={onCompleteSignUp} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000',
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#EAEAEA',
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logoImage: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  logoText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#262626",
  },
});
