import { StackScreenProps } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-magnus';

import { ScreenContainer } from '../components/ScreenContainer/ScreenContainer';
import { View } from '../components/View';
import { RootStackParamList } from '../navigation';

type OverviewProps = StackScreenProps<RootStackParamList, 'Overview'>;

export default function Overview({ navigation: { navigate } }: OverviewProps) {
  return (
    <ScreenContainer enableGoBack={false}>
      <View gap={12} m="auto" alignItems="center" justifyContent="center">
        <Text textAlign="center">
          Es scheint als hättest Du noch kein Event erstellt. Drücke hier, um dein neues Event zu
          planen!
        </Text>
        <Button
          m="auto"
          onPress={() => navigate('CreateEvent')}
          rounded="circle"
          px="lg"
          fontSize="xl"
          p="md">
          Event erstellen
        </Button>
      </View>
    </ScreenContainer>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
