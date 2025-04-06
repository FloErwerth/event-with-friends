import { Text } from 'react-native-magnus';

import { EventData } from '../../api/firebase';
import { View } from '../View';

export const AdminEvent = ({ data: { name } }: { data: EventData }) => {
  return (
    <View p="md">
      <Text>{name}</Text>
    </View>
  );
};
