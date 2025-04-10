import { ActivityIndicator, SectionList } from 'react-native';
import { Text } from 'react-native-magnus';

import { useEventsQuery } from '../../api/query/events';
import { AdminEvent } from '../../components/AdminEvent';
import { View } from '../../components/View';
import { EventCreationSheet } from '../../screens/EventCreation';
import { formatToDate } from '../../utils';

export default function Host() {
  const { data, isLoading } = useEventsQuery();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (!data) {
    return null;
  }

  return (
    <View>
      <SectionList
        sections={data.adminEvents}
        contentContainerStyle={{ gap: 16, margin: 16 }}
        renderSectionHeader={({ section: { title } }) => (
          <View flexDir="row" gap={4} pt={16}>
            <Text fontSize="lg" fontFamily="Bold">
              {formatToDate(title)}
            </Text>
            <Text>in 2 Tagen</Text>
          </View>
        )}
        renderItem={(data) => <AdminEvent key={data.item.id} data={data.item} />}
      />
      <EventCreationSheet />
    </View>
  );
}
