import { EventData } from 'api/query/events';
import { useEffect, useRef, useState } from 'react';
import { Text } from 'react-native-magnus';

import { calcTimeUntilDate, formatToTime } from '../../utils';
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

export const Event = ({ data: { name, dateTimestamp, address } }: { data: EventData }) => {
  return (
    <Card flexDir="row" gap={8}>
      <View justifyContent="center" gap={4}>
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
    </Card>
  );
};
