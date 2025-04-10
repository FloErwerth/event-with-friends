import { ActivityIndicator } from 'react-native';
import { Text } from 'react-native-magnus';

import { useEventsQuery } from '../../../api/query/events';
import { View } from '../../../components/View';

export const NormalEventList = () => {
  const { data, isLoading } = useEventsQuery();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (!data?.normalEvents || data.normalEvents.length === 0) {
    return null;
  }

  return (
    <View gap={8}>
      <Text>Deine Events</Text>
    </View>
  );
};
