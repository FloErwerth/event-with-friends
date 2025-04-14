import { ActivityIndicator, SectionList } from 'react-native';
import { Text } from 'react-native-magnus';

import { useEventsQuery } from '../../api/query/events';
import { Event } from '../../components/Event';
import { ScreenContainer } from '../../components/ScreenContainer/ScreenContainer';
import { View } from '../../components/View';
import { EventCreation } from '../../screens/EventCreation';
import { formatToDate } from '../../utils';

export default function Host() {
  const { data, isLoading } = useEventsQuery();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (!data?.adminEvents) {
    return null;
  }

  return (
    <ScreenContainer enableGoBack={false}>
      <View flex={1} justifyContent="center">
        <SectionList
          style={{ flex: 1 }}
          sections={data.adminEvents}
          contentContainerStyle={{ gap: 8, margin: 16 }}
          renderSectionHeader={({ section: { title } }) => {
            return (
              <View flexDir="row" gap={4} pt={16}>
                <Text fontSize="lg" fontFamily="Bold">
                  {formatToDate(title)}
                </Text>
              </View>
            );
          }}
          renderItem={(data) => <Event key={data.item.id} data={data.item} isAdmin />}
        />
      </View>
      <EventCreation />
    </ScreenContainer>
  );
}
