import { useEventsQuery } from "../../api/query/events";
import { View } from "../../components/View";
import { AdminEvent } from "../../components/AdminEvent";
import { Text } from "react-native-magnus";
import { ActivityIndicator } from "react-native";

export default function Host() {
  const { data, isLoading } = useEventsQuery();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (!data?.adminEvents || data.adminEvents.length === 0) {
    return null;
  }

  return (
    <View bg="grey" p="md">
      <Text>Deine veranstalteten Events</Text>
      {data.adminEvents.map((data) => (
        <AdminEvent key={data.id} data={data} />
      ))}
    </View>
  );
}