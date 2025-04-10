import { getAuth } from '@react-native-firebase/auth';
import { Button } from 'react-native-magnus';

import { ScreenContainer } from '../../components/ScreenContainer/ScreenContainer';
import { View } from '../../components/View';
import { EventList } from '../../modules/EventList/EventList';

export default function Overview() {
  return (
    <ScreenContainer enableGoBack={false}>
      <View gap={12}>
        <EventList />
      </View>
      <Button onPress={getAuth().signOut}>Logout</Button>
    </ScreenContainer>
  );
}
