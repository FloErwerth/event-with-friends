import { ActivityIndicator, SectionList } from 'react-native';
import { Text } from 'react-native-magnus';

import { useEventsQuery } from '../../../api/query/events';
import { Event } from '../../../components/Event';
import { View } from '../../../components/View';
import { formatToDate } from '../../../utils';

export const NormalEventList = () => {
  const { data, isLoading } = useEventsQuery();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (!data?.normalEvents || data.normalEvents.length === 0) {
    return null;
  }

  return (
    <View flex={1}>
      <SectionList
        style={{ flex: 1 }}
        sections={data.normalEvents}
        contentContainerStyle={{ gap: 8 }}
        renderSectionHeader={({ section: { title } }) => {
          return (
            <View flexDir="row" gap={4} pt={16}>
              <Text fontSize="lg" fontFamily="Bold">
                {formatToDate(title)}
              </Text>
            </View>
          );
        }}
        renderItem={(data) => <Event key={data.item.id} data={data.item} />}
      />
    </View>
  );
};
