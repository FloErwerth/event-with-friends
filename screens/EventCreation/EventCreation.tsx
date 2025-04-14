import { MapPin } from 'lucide-react-native';
import { useState } from 'react';
import { Button, Input, Text } from 'react-native-magnus';

import { EventShareSheet } from './EventShareSheet';
import { useCreateEventMutation } from '../../api/query/events';
import { BottomSheet, useBottomSheetControls } from '../../components/BottomSheet';
import { Calendar } from '../../components/Calendar/Calendar';
import { View } from '../../components/View';

export const EventCreation = () => {
  const [name, setName] = useState('');
  const [streetHouseNr, setStreetHouseNr] = useState('');
  const [zipCity, setZipCity] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [description, setDescription] = useState('');
  const [id, setId] = useState('');
  const { bottomSheetRef: createRef, openSheet: openCreate } = useBottomSheetControls();
  const { bottomSheetRef: shareRef, openSheet: openShare } = useBottomSheetControls();

  const { mutateAsync: createEvent } = useCreateEventMutation();

  const handleCreateEvent = async () => {
    if (name && date && location) {
      const id = await createEvent({
        name,
        dateTimestamp: date.valueOf(),
        description,
        address: { streetHouseNr, zipCity },
      });
      if (id) {
        setId('neue Id');
        openShare();
      }
    }
  };

  return (
    <View>
      <Button m="auto" rounded="circle" px="lg" onPress={openCreate} fontSize="xl" p="md">
        Event erstellen
      </Button>
      <EventShareSheet eventId={id} reference={shareRef} />
      <BottomSheet
        title="Neues Event veranstalten"
        enableDynamicSizing={false}
        enablePanDownToClose={false}
        reference={createRef}>
        <View gap={16} flex={1}>
          <Input bg="gray200" onChangeText={setName} placeholder="Eventname" variant="medium" />
          <View flexDir="row" gap={8}>
            <Input
              flex={1}
              bg="gray200"
              onChangeText={setStreetHouseNr}
              placeholder="Strasse, Nr."
              variant="medium"
              suffix={<MapPin />}
            />
            <Input
              flex={1}
              bg="gray200"
              onChangeText={setZipCity}
              placeholder="Plz, Ort"
              variant="medium"
              suffix={<MapPin />}
            />
          </View>
          <Calendar date={date} onDateSelected={setDate} />
          <Input
            bg="gray200"
            placeholder="Beschreibung"
            variant="medium"
            onChangeText={setDescription}
            numberOfLines={8}
            textAlignVertical="top"
            multiline
            p={4}
          />
          <View flex={1} />
          <Button w="100%" py="md" px="lg" onPress={handleCreateEvent}>
            <Text color="white" variant="lg">
              Erstellen
            </Text>
          </Button>
        </View>
      </BottomSheet>
    </View>
  );
};
