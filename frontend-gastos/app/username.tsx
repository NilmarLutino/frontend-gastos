import * as React from 'react';
import { TextInput, Button, View, StyleSheet, Text } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

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
      // Completar el registro con el `username` y `password`.
      const completeSignUp = await signUp.update({
        username,
        password,
      });

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace('/(user)/myGroups');
      } else {
        console.error('Sign-up completion failed:', JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err) {
      console.error('Error completing sign-up:', JSON.stringify(err, null, 2));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logoText}>LOGO</Text>
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000',
  },
  logoText: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
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
});
