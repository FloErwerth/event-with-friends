import { EventData } from 'api/query/events';
import { Image } from 'react-native';
import { Text } from 'react-native-magnus';

import { formatToTime } from '../../utils';
import { Card } from '../Card';
import { View } from '../View';

export const AdminEvent = ({ data: { name, dateTimestamp, address } }: { data: EventData }) => {
  return (
    <Card flexDir="row" gap={8}>
      <Image
        style={{ borderRadius: 8 }}
        source={{ uri: 'https://picsum.photos/100/75', width: 100, height: 75 }}
      />
      <View justifyContent="center" gap={4}>
        <Text fontFamily="Bold" fontSize="md">
          {name}
        </Text>
        <View flexDir="row" gap={4} left={-1}>
          <Text>{address.streetHouseNr},</Text>
          <Text>{address.zipCity}</Text>
        </View>
        <Text>{formatToTime(dateTimestamp)} Uhr</Text>
      </View>
    </Card>
  );
};
