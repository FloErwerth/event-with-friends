import { ActivityIndicator, Share } from 'react-native';
import { Button, Text } from 'react-native-magnus';
import QRCode from 'react-native-qrcode-svg';

import { useEventsQuery } from '../../api/query/events';
import { Card } from '../../components/Card';
import { ScreenContainer } from '../../components/ScreenContainer/ScreenContainer';
import { View } from '../../components/View';
import { EventCreation } from '../../screens/EventCreation';

export default function Host() {
  const { data, isLoading } = useEventsQuery();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (!data?.adminEvents) {
    return null;
  }

  const shareEvent = async () => {
    await Share.share({
      title: 'Dein Event teilen',
      message: 'planbuddy//joinEvent/faf1489h0fdaf',
    });
  };

  return (
    <ScreenContainer enableGoBack={false}>
      <View flex={1} justifyContent="center">
        <View justifyContent="center" alignItems="center" gap={16}>
          <Text fontSize="xl" fontFamily="Bold">
            Dein Event ist bereit geteilt zu werden!
          </Text>
          <Card shadow="lg" p="lg" rounded="xl">
            <QRCode value="afdjnsfioadsbfaisopfbdiaspfbs" size={150} />
          </Card>
          <Button onPress={shareEvent} alignSelf="center">
            Event teilen
          </Button>
        </View>
        {/*<SectionList
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
        renderItem={(data) => <Event key={data.item.id} data={data.item} />}
      />*/}
      </View>
      <EventCreation />
    </ScreenContainer>
  );
}
