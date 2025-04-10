import { createUserWithEmailAndPassword, getAuth } from '@react-native-firebase/auth';
import { useState } from 'react';
import { Button, Input } from 'react-native-magnus';
import { z } from 'zod';

import { useCreateUserMutation, useLoginUserMutation } from '../api/query/user';
import { ScreenContainer } from '../components/ScreenContainer/ScreenContainer';
import { View } from '../components/View';

const emailSchema = z.string().email().trim();

export default function Authentication() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutate: createUser } = useCreateUserMutation();
  const { mutate: loginUser } = useLoginUserMutation();

  const register = async () => {
    if (email && password) {
      const parsedEmail = emailSchema.parse(email);
      createUserWithEmailAndPassword(getAuth(), parsedEmail, password)
        .then((response) => createUser({ id: response.user.uid, email }))
        .catch((e) => {
          const key = e.message.split('[')[1].split(']')[0];
          switch (key) {
            case 'auth/email-already-in-use':
              loginUser({ email: parsedEmail, password });
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
