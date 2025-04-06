import { ScreenContainer } from "../../components/ScreenContainer/ScreenContainer";
import { View } from "../../components/View";
import { EventList } from "../../modules/EventList/EventList";
import { Button } from "react-native-magnus";

export default function Overview() {
  return (
    <ScreenContainer enableGoBack={false}>
      <View gap={12}>
        <EventList />
        <Button
          m="auto"
          onPress={() => undefined/* todo: open sheet with event creation */}
          rounded="circle"
          px="lg"
          fontSize="xl"
          p="md">
          Event erstellen
        </Button>
      </View>
    </ScreenContainer>
  );
}