import { MapPin } from 'lucide-react-native';
import { useState } from 'react';
import { Button, Input, Text } from 'react-native-magnus';

import { useCreateEventMutation } from '../../api/query/events';
import { BottomSheet, useBottomSheetControls } from '../../components/BottomSheet';
import { Calendar } from '../../components/Calendar/Calendar';
import { View } from '../../components/View';

type EventCreationSheetProps = {
  openShare: () => void;
};

export const EventCreationSheet = ({ openShare }: EventCreationSheetProps) => {
  const [name, setName] = useState('');
  const [streetHouseNr, setStreetHouseNr] = useState('');
  const [zipCity, setZipCity] = useState('');
  const [date, setDate] = useState<Date>();
  const [description, setDescription] = useState('');
  const { bottomSheetRef: createRef, openSheet: openCreate } = useBottomSheetControls();

  const { mutateAsync: createEvent } = useCreateEventMutation();

  const handleCreateEvent = async () => {
    if (name && date && location) {
      createEvent({
        name,
        dateTimestamp: date.valueOf(),
        description,
        address: { streetHouseNr, zipCity },
      }).then(openShare);
    }
  };

  return (
    <View>
      <Button m="auto" rounded="circle" px="lg" onPress={openCreate} fontSize="xl" p="md">
        Event erstellen
      </Button>
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
          <Calendar onDateSelected={setDate} />
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
