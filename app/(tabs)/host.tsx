import { ActivityIndicator } from 'react-native';
import { Text } from 'react-native-magnus';

import { useEventsQuery } from '../../api/query/events';
import { AdminEvent } from '../../components/AdminEvent';
import { ScreenContainer } from '../../components/ScreenContainer/ScreenContainer';
import { View } from '../../components/View';
import { EventCreationSheet } from '../../screens/EventCreation';

export default function Host() {
  const { data, isLoading } = useEventsQuery();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  const mappedEvents = data?.adminEvents.map((data) => {
    if (!data) {
      return null;
    }
    return <AdminEvent key={data.id} data={data} />;
  });

  return (
    <ScreenContainer enableGoBack={false}>
      <View>
        <Text>Deine veranstalteten Events</Text>
        {mappedEvents}
      </View>
      <EventCreationSheet />
    </ScreenContainer>
  );
}
