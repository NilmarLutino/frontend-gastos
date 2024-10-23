import * as React from 'react';
import { TextInput, Button, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useSignUp, useOAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';

export default function SignUpScreen() {
  const { isLoaded, signUp } = useSignUp();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const router = useRouter();
  const [emailAddress, setEmailAddress] = React.useState('');

  const handleSignUpWithGoogle = async () => {
    try {
      const { createdSessionId, setActive, signUp } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/username', { scheme: 'myapp' }),
      });

      if (signUp && signUp.emailAddress) {
        setEmailAddress(signUp.emailAddress);
        router.push('/username');
      } else {
        console.error('OAuth registration was not completed.');
      }
    } catch (error) {
      console.error('OAuth error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logoText}>LOGO</Text>
      <TouchableOpacity style={styles.button} onPress={handleSignUpWithGoogle}>
        <Text style={styles.buttonText}>Sign up with Google</Text>
      </TouchableOpacity>
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
  button: {
    backgroundColor: '#4285F4',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
