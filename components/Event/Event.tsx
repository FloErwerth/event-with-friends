import { Text } from 'react-native-magnus';

import { EventData } from '../../api/query/events';

export const Event = ({ data: { name, id } }: { data: EventData }) => {
  return <Text key={id}>{name}</Text>;
};
