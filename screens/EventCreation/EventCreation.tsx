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
    if (name) {
      eventOperations.createEvent({ name }).then(closeSheet);
    }
  };

  return (
    <>
      <Button m="auto" rounded="circle" px="lg" onPress={openSheet} fontSize="xl" p="md">
        Event erstellen
      </Button>
      <BottomSheet
        title="Dein neues Event"
        enableDynamicSizing={false}
        enablePanDownToClose={false}
        reference={bottomSheetRef}>
        <Input onChangeText={setName} placeholder="Eventname" variant="medium" />
        <Input onChangeText={setLocation} placeholder="Ort" variant="medium" suffix={<MapPin />} />
        <Calendar />
        <Button borderColor="transparent" onPress={pickImage} w="100%" p="md" bg="white">
          <Text>Bild hochladen</Text>
        </Button>
        <Input
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
      </BottomSheet>
    </>
  );
};
