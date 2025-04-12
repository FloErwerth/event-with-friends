import { ComponentProps } from 'react';
import { Text } from 'react-native-magnus';

import { BottomSheet } from '../../components/BottomSheet';
import { View } from '../../components/View';

export const EventShareSheet = (props: Omit<ComponentProps<typeof BottomSheet>, 'children'>) => {
  return (
    <BottomSheet {...props}>
      <View>
        <Text>Dein Event ist bereit, um geteilt zu werden!</Text>
      </View>
    </BottomSheet>
  );
};
