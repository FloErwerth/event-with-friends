import {
  createUserWithEmailAndPassword,
  FirebaseAuthTypes,
  getAuth,
  signInWithEmailAndPassword,
} from '@react-native-firebase/auth';
import { useState } from 'react';
import { Button, Input } from 'react-native-magnus';
import { z } from 'zod';

import { userOperations } from '../api/firebase';
import { ScreenContainer } from '../components/ScreenContainer/ScreenContainer';
import { View } from '../components/View';

const emailSchema = z.string().email().trim();

export default function Authentication() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const createInitialDBEntry = async (credential: FirebaseAuthTypes.UserCredential) => {
    if (!credential.user) {
      throw new Error('User was not created successfully.');
    }
    userOperations
      .createUser({
        id: credential.user.uid,
        email: credential.user.email ?? undefined,
      })
      .catch((e) => console.log(e));
  };

  const tryLogin = (email: string, password: string) => {
    signInWithEmailAndPassword(getAuth(), email, password)
      .then(async (response) => {
        await createInitialDBEntry(response);
      })
      .catch(() => {
        console.error('Login not successful.');
      });
  };

  const register = async () => {
    if (email && password) {
      const parsedEmail = emailSchema.parse(email);
      createUserWithEmailAndPassword(getAuth(), parsedEmail, password)
        .then(async (response) => await createInitialDBEntry(response))
        .catch((e) => {
          const key = e.message.split('[')[1].split(']')[0];
          switch (key) {
            case 'auth/email-already-in-use':
              tryLogin(parsedEmail, password);
              break;
            case 'auth/invalid-email':
              console.log('invalid mail');
              break;
            case 'auth/ weak-password':
              console.log('weak password');
              break;
          }
        });
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
}
