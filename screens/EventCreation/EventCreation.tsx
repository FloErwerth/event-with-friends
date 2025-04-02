import * as ImagePicker from 'expo-image-picker';
import { MapPin } from 'lucide-react-native';
import { useState } from 'react';
import { Button, Input, Text } from 'react-native-magnus';

import { Calendar } from '../../components/Calendar/Calendar';
import { ScreenContainer } from '../../components/ScreenContainer/ScreenContainer';
import { View } from '../../components/View';

export const EventCreation = () => {
  const [image, setImage] = useState<string | null>(null);

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

  return (
    <ScreenContainer title="Dein neues Event">
      <View gap={16} flex={1}>
        <Input placeholder="Eventname" variant="medium" />
        <Input placeholder="Ort" variant="medium" suffix={<MapPin />} />
        <Calendar />
        <Button borderColor="transparent" onPress={pickImage} w="100%" p="md" bg="white">
          <Text>Bild hochladen</Text>
        </Button>
        <Input
          placeholder="Beschreibung"
          variant="medium"
          numberOfLines={8}
          textAlignVertical="top"
          multiline
          p={4}
        />
        <View flex={1} />
        <Button w="100%" py="md" px="lg">
          <Text color="white" variant="lg">
            Erstellen
          </Text>
        </Button>
      </View>
    </ScreenContainer>
  );
};
