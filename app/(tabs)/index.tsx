import { getAuth } from '@react-native-firebase/auth';
import { Button } from 'react-native-magnus';

import { ScreenContainer } from '../../components/ScreenContainer/ScreenContainer';
import { EventList } from '../../modules/EventList/EventList';

export default function Overview() {
  return (
    <ScreenContainer enableGoBack={false}>
      <EventList />
      <Button onPress={getAuth().signOut}>Logout</Button>
    </ScreenContainer>
  );
}
