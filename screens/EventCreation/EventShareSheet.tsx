import { ComponentProps } from 'react';
import { Button, Text } from 'react-native-magnus';
import QRCode from 'react-native-qrcode-svg';
import { shareEvent } from 'utils/shareEvent';

import { BottomSheet } from '../../components/BottomSheet';
import { Card } from '../../components/Card';
import { View } from '../../components/View';

type EventShareSheetProps = {
  eventId: string;
} & Omit<ComponentProps<typeof BottomSheet>, 'children'>;

export const EventShareSheet = ({ eventId, ...props }: EventShareSheetProps) => {
  return (
    <BottomSheet enableDynamicSizing {...props}>
      <View justifyContent="center" alignItems="center" gap={16}>
        <Text fontSize="xl" fontFamily="Bold">
          Dein Event ist bereit geteilt zu werden!
        </Text>
        <Text>Lass deine Freunde mit diesem QR Code an deinem Event teilnehmen</Text>
        <Card shadow="lg" p="lg" rounded="xl">
          <QRCode
            value="https://events-with-friends-9e33b.web.app?eventId=0J4R6c83WiESCH4eXJVr"
            size={150}
          />
        </Card>
        <Text>oder</Text>
        <Button
          borderWidth={0}
          p="md"
          onPress={async () => await shareEvent(eventId)}
          alignSelf="center">
          <Text fontFamily="Bold" color="white">
            Teile dein Event mit deinen Freunden
          </Text>
        </Button>
      </View>
    </BottomSheet>
  );
};
