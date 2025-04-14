import { EventData } from 'api/query/events';
import { Share2 } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Pressable } from 'react-native';
import { Text } from 'react-native-magnus';

import { EventShareSheet } from '../../screens/EventCreation/EventShareSheet';
import { calcTimeUntilDate, formatToTime } from '../../utils';
import { useBottomSheetControls } from '../BottomSheet';
import { Card } from '../Card';
import { View } from '../View';

const TimeUntilDisplay = ({ timestamp }: { timestamp: number }) => {
  const timerRef = useRef<number>(-1);
  const [timeString, setTimeString] = useState<string>();

  useEffect(() => {
    setTimeString(calcTimeUntilDate(timestamp));
    // --- Function to schedule the next update ---
    const scheduleNextUpdate = () => {
      // Clear any existing timeout before scheduling a new one
      // (important for the initial setup and if targetDate changes)
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      // Calculate milliseconds until the *next* minute starts
      const now = new Date();
      const seconds = now.getSeconds();
      const milliseconds = now.getMilliseconds();
      // Milliseconds remaining in the current minute
      const delayUntilNextMinute = 60000 - (seconds * 1000 + milliseconds);

      // Ensure the delay is positive; if calculated exactly on the minute, wait a full minute.
      // Adding a tiny offset (e.g., 50ms) might sometimes be useful if exact :00 is problematic,
      // but typically aiming for :00 works well.
      const effectiveDelay =
        delayUntilNextMinute <= 0 ? delayUntilNextMinute + 60000 : delayUntilNextMinute;

      // Schedule the update function to run at the start of the next minute
      timerRef.current = setTimeout(() => {
        // 1. Update the time display state
        setTimeString(calcTimeUntilDate(timestamp));

        // 2. Schedule the *following* update recursively
        scheduleNextUpdate();
      }, effectiveDelay) as unknown as number; // Wait exactly until the next minute starts
    };

    // --- Initial Setup ---
    // Set the initial state immediately (already done by useState)
    // And schedule the first update to happen at the start of the upcoming minute.
    scheduleNextUpdate();

    // --- Cleanup Function ---
    // This runs when the component unmounts or when targetDate changes (before the effect runs again)
    return () => {
      // Clear the scheduled timeout to prevent updates after unmounting
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timerRef]);

  return <Text>{timeString}</Text>;
};

export const Event = ({
  data: { id, name, dateTimestamp, address },
  isAdmin,
}: {
  data: EventData;
  isAdmin?: boolean;
}) => {
  const { bottomSheetRef, openSheet } = useBottomSheetControls();

  const calculatedString = calcTimeUntilDate(dateTimestamp);
  const isInPast = calculatedString === undefined;

  return (
    <Card flexDir="row" gap={8}>
      <View flex={1} justifyContent="center" gap={4}>
        <Text fontFamily="Bold" fontSize="md">
          {name}
        </Text>

        <TimeUntilDisplay timestamp={dateTimestamp} />
        <View flexDir="row" gap={4} left={-1}>
          <Text>{address.streetHouseNr},</Text>
          <Text>{address.zipCity}</Text>
        </View>
        <Text>{formatToTime(dateTimestamp)} Uhr</Text>
      </View>
      {id && isAdmin && !isInPast && (
        <>
          <EventShareSheet eventId={id} reference={bottomSheetRef} />
          <View bg="gray100" shadow="sm" w={32} h={32} rounded={16}>
            <Pressable style={{ padding: 8, width: 32, height: 32 }} onPress={openSheet}>
              <Share2 style={{ top: 1 }} size={14} />
            </Pressable>
          </View>
        </>
      )}
    </Card>
  );
};
