import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Calendar1, Clock3 } from 'lucide-react-native';
import { useState } from 'react';
import { Button, Text } from 'react-native-magnus';

import { formatToDate, formatToTime } from '../../utils';
import { View } from '../View';

type CalendarProps = {
  onDateSelected: (date?: Date) => void;
};

export const Calendar = ({ onDateSelected }: CalendarProps) => {
  const [date, setDate] = useState<Date>(new Date());
  const [calendarMode, setCalendarMode] = useState<'date' | 'time'>('date');
  const [showCalendar, setShowCalendar] = useState(false);

  const handleShowCalendar = () => {
    setCalendarMode('date');
    setShowCalendar(true);
  };

  const handleShowTime = () => {
    setCalendarMode('time');
    setShowCalendar(true);
  };

  const handleSelectDate = (event: DateTimePickerEvent, date?: Date) => {
    setShowCalendar(false);
    if (event.type === 'set' && date !== undefined) {
      onDateSelected(date);
      setDate(date);
    }
  };

  return (
    <View>
      <View flexDir="row" gap={8}>
        <Button flex={1} borderColor="transparent" onPress={handleShowCalendar} p="md" bg="gray200">
          <View flexDir="row" justifyContent="space-between">
            <Text flex={1}>{formatToDate(date) ?? 'Zeitpunkt auswählen'}</Text>
            <Calendar1 />
          </View>
        </Button>
        <Button flex={1} borderColor="transparent" onPress={handleShowTime} p="md" bg="gray200">
          <View flexDir="row" justifyContent="space-between">
            <Text flex={1}>{formatToTime(date)}</Text>
            <Clock3 />
          </View>
        </Button>
      </View>
      {showCalendar && (
        <DateTimePicker
          locale="de-DE"
          is24Hour
          onChange={handleSelectDate}
          mode={calendarMode}
          value={date}
        />
      )}
    </View>
  );
};
