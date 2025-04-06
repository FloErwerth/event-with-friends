import { ActivityIndicator } from 'react-native';

import { NormalEventList } from './NormalEventList';
import { useEventsQuery } from '../../api/query/events';
import { View } from '../../components/View';

export const EventList = () => {
  const { data, isLoading } = useEventsQuery();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (!data) {
    return null;
  }

  return (
    <View gap={12}>
      <NormalEventList />
    </View>
  );
};
