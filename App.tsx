import 'react-native-gesture-handler';
import {
  PlusJakartaSans_300Light,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { connectAuthEmulator, getAuth } from '@react-native-firebase/auth';
import { connectDatabaseEmulator, getDatabase } from '@react-native-firebase/database';
import { connectFirestoreEmulator, getFirestore } from '@react-native-firebase/firestore';
import { useFonts } from 'expo-font';

import RootStack from './navigation';

export default function App() {
  connectDatabaseEmulator(getDatabase(), 'http://127.0.0.1', 9000);
  getDatabase();
  connectAuthEmulator(getAuth(), 'http://127.0.0.1:9099');
  getAuth();
  connectFirestoreEmulator(getFirestore(), 'http://127.0.0.1', 8080);
  getFirestore();

  const [loaded] = useFonts({
    Bold: PlusJakartaSans_700Bold,
    Regular: PlusJakartaSans_400Regular,
    Light: PlusJakartaSans_300Light,
  });

  if (!loaded) {
    return null;
  }

  return (
    <>
      <RootStack />
    </>
  );
}
