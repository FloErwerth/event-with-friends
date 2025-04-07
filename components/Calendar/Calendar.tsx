import { Clock3 } from 'lucide-react-native';
import { useState } from 'react';
import { Button, Overlay, Text } from 'react-native-magnus';
import DateTimePicker, { useDefaultStyles } from 'react-native-ui-datepicker';
import { SingleChange } from 'react-native-ui-datepicker/lib/typescript/types';

import { View } from '../View';

type CalendarProps = {
  onDateSelected: (date: Date) => void;
};

export const Calendar = ({ onDateSelected }: CalendarProps) => {
  const defaultStyles = useDefaultStyles();
  const [date, setDate] = useState<Date>();
  const [displayDate, setDisplayDate] = useState<Date>();
  const [showCalendar, setShowCalendar] = useState(false);

  const handleSetDate: SingleChange = ({ date }) => {
    if (!date) {
      return;
    }

    const selectedDate = new Date(date.valueOf());
    setDate(selectedDate);
  };

  const closeCalendar = () => {
    setShowCalendar(false);
  };

  const handleConfirm = () => {
    setShowCalendar(false);
    setDisplayDate(date);
    if (date) {
      onDateSelected(date);
    }
  };

  const handleCancel = () => {
    setShowCalendar(false);
    setDate(undefined);
    setDisplayDate(undefined);
  };

  return (
    <View>
      <Button
        borderColor="transparent"
        onPress={() => setShowCalendar(true)}
        w="100%"
        p="md"
        bg="gray200">
        <View flexDir="row" justifyContent="space-between" w="100%">
          <Text>{displayDate?.toISOString() ?? 'Zeitpunkt auswählen'}</Text>
          <Clock3 />
        </View>
      </Button>
      <Overlay visible={showCalendar} onBackdropPress={closeCalendar}>
        <DateTimePicker mode="single" date={date} onChange={handleSetDate} styles={defaultStyles} />
        <View flexDir="row" justifyContent="space-between">
          <Button p="md" variant="secondary" onPress={handleCancel}>
            <Text variant="sm" color="blue700">
              Abbrechen
            </Text>
          </Button>
          <Button p="md" borderWidth={1} borderColor="blue600" onPress={handleConfirm}>
            <Text variant="sm" color="white">
              Bestätigen
            </Text>
          </Button>
        </View>
      </Overlay>
    </View>
  );
};
