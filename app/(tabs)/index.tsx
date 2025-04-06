import { ScreenContainer } from '../../components/ScreenContainer/ScreenContainer';
import { View } from '../../components/View';
import { EventList } from '../../modules/EventList/EventList';

export default function Overview() {
  return (
    <ScreenContainer enableGoBack={false}>
      <View gap={12}>
        <EventList />
      </View>
    </ScreenContainer>
  );
}
