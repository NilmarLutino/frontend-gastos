import * as React from 'react';
import { TextInput, Button, View, StyleSheet, Text } from 'react-native';
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
      <Text style={styles.logoText}>LOGO</Text>
      <TextInput
        style={styles.input}
        value={code}
        placeholder="Verification Code..."
        onChangeText={(code) => setCode(code)}
      />
      <Button title="Verify Email" onPress={onPressVerify} />
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
