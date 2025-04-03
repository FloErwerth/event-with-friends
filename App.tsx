import 'react-native-gesture-handler';
import {
  PlusJakartaSans_300Light,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { useFonts } from 'expo-font';

import RootStack from './navigation';

export default function App() {
  const [loaded] = useFonts({
    Bold: PlusJakartaSans_700Bold,
    Regular: PlusJakartaSans_400Regular,
    Light: PlusJakartaSans_300Light,
  });

  if (!loaded) {
    return null;
  }

  return <RootStack />;
}
