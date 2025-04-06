import { Text } from 'react-native-magnus';

import { EventData } from '../../api/firebase';

export const Event = ({ data: { name, id } }: { data: EventData }) => {
  return <Text key={id}>{name}</Text>;
};
