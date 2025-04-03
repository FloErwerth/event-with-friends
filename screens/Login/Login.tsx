import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useState } from 'react';
import { Button, Input } from 'react-native-magnus';
import { z } from 'zod';

import { ScreenContainer } from '../../components/ScreenContainer/ScreenContainer';
import { View } from '../../components/View';
import db from '../../firebase';

const emailSchema = z.string().email().trim();

export const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const createInitialDBEntry = async (credential: FirebaseAuthTypes.UserCredential) => {
    if (!credential.user) {
      throw new Error('User was not created successfully.');
    }
    await db().ref(`/users/${credential.user.uid}`).set({ email: credential.user.email });
  };

  const register = async () => {
    try {
      if (email && password) {
        const parsedEmail = emailSchema.parse(email);

        const response = await auth().createUserWithEmailAndPassword(parsedEmail, password);

        await createInitialDBEntry(response);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ScreenContainer>
      <View gap={12}>
        <Input onChangeText={setEmail} placeholder="Email" />
        <Input onChangeText={setPassword} placeholder="Password" />
        <Button onPress={register}>Einloggen / Registrieren</Button>
      </View>
    </ScreenContainer>
  );
};
