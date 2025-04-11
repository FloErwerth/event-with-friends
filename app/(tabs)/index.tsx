import { getAuth } from '@react-native-firebase/auth';
import { useState } from 'react';
import { Button } from 'react-native-magnus';

import { useJoinEventsMutation } from '../../api/query/events';
import { ScreenContainer } from '../../components/ScreenContainer/ScreenContainer';
import { EventList } from '../../modules/EventList/EventList';

export default function Overview() {
  const [eventId, setEventId] = useState('');

  const { mutate: joinEvent } = useJoinEventsMutation();

  return (
    <ScreenContainer enableGoBack={false}>
      <EventList />
      <Button onPress={getAuth().signOut}>Logout</Button>
    </ScreenContainer>
  );
}
