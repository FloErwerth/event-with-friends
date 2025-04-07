import * as ImagePicker from 'expo-image-picker';
import { MapPin } from 'lucide-react-native';
import { useState } from 'react';
import { Button, Input, Text } from 'react-native-magnus';

import { eventOperations } from '../../api/firebase';
import { BottomSheet, useBottomSheetControls } from '../../components/BottomSheet';
import { Calendar } from '../../components/Calendar/Calendar';
import { View } from '../../components/View';

export const EventCreationSheet = () => {
  const [image, setImage] = useState<string | null>(null);
  const { bottomSheetRef, openSheet, closeSheet } = useBottomSheetControls();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState<Date>();
  const [description, setDescription] = useState('');

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleCreateEvent = async () => {
    if (name && date && location) {
      eventOperations
        .createEvent({ name, dateTimestamp: date.valueOf(), description, address: location })
        .then(closeSheet);
    }
  };

  return (
    <>
      <Button m="auto" rounded="circle" px="lg" onPress={openSheet} fontSize="xl" p="md">
        Event erstellen
      </Button>
      <BottomSheet
        title="Neues Event veranstalten"
        enableDynamicSizing={false}
        enablePanDownToClose={false}
        reference={bottomSheetRef}>
        <View gap={16} flex={1}>
          <Input bg="gray200" onChangeText={setName} placeholder="Eventname" variant="medium" />
          <Input
            bg="gray200"
            onChangeText={setLocation}
            placeholder="Ort"
            variant="medium"
            suffix={<MapPin />}
          />
          <Calendar onDateSelected={setDate} />
          {/*<Button bg="gray200" borderColor="transparent" onPress={pickImage} w="100%" p="md">
            <Text>Bild hochladen</Text>
          </Button>*/}
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
    </>
  );
};
