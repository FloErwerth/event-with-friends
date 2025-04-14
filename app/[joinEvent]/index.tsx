import { collection, getDoc, getFirestore } from '@react-native-firebase/firestore';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, Text } from 'react-native-magnus';

import { EventData, useJoinEventsMutation } from '../../api/query/events';
import { ScreenContainer } from '../../components/ScreenContainer/ScreenContainer';
import { View } from '../../components/View';

const getEvent = async (eventId: string) => {
  return await getDoc(collection(getFirestore(), 'events').doc(eventId));
};

export default function JoinEvent() {
  const { eventId } = useLocalSearchParams();
  const { mutate: joinEvent } = useJoinEventsMutation();
  const [event, setEvent] = useState<EventData | undefined>();

  useEffect(() => {
    (async () => {
      if (!eventId || typeof eventId !== 'string') {
        return;
      }
      const dataSnapshot = await getEvent(eventId);
      if (dataSnapshot.exists) {
        const data = dataSnapshot.data();
        if (data) {
          setEvent(data as EventData);
        }
      }
    })();
  }, [eventId]);

  if (!event || !eventId || typeof eventId !== 'string') {
    return (
      <View>
        <Button onPress={() => router.replace('/')}>Nav back</Button>
      </View>
    );
  }

  return (
    <ScreenContainer enableGoBack={false}>
      <Text fontSize="xl" fontFamily="Bold">
        Du wurdest zu einem Event eingeladen!
      </Text>
      <Text>{event?.name}</Text>
      <Button
        onPress={() => {
          joinEvent(eventId ?? '', { onSuccess: () => router.replace('/') });
        }}>
        Einladung annehmen
      </Button>
      <Button onPress={() => router.replace('/')}>Einladung ablehnen</Button>
    </ScreenContainer>
  );
}
