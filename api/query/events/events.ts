import { getAuth } from '@react-native-firebase/auth';
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getFirestore,
  updateDoc,
} from '@react-native-firebase/firestore';
import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { EventData, eventDataSchema } from './types';
import { userOperations } from '../../firebase';

const CREATE_EVENT_MUTATION_KEY = 'CREATE_EVENT_MUTATION_KEY';
const EVENT_QUERY_KEY = 'EVENT_QUERY_KEY';
const mapEvents = (data: (EventData | undefined)[]) =>
  data
    .sort((eventA, eventB) => {
      if (!eventA && !eventB) {
        return 0;
      }
      if (!eventA) {
        return -1;
      }
      if (!eventB) {
        return -1;
      }
      return eventA.dateTimestamp - eventB.dateTimestamp;
    })
    .reduce(
      (mappedEvents, currentEvent) => {
        if (!currentEvent) {
          return mappedEvents;
        }
        const date = new Date(currentEvent.dateTimestamp).toISOString().split('T')[0];
        const currentDataIndex = mappedEvents.findIndex(({ title }) => title === date);
        if (currentDataIndex === -1) {
          const newEvents = [...mappedEvents];
          newEvents.push({ title: date, data: [currentEvent] });
          return newEvents;
        }

        mappedEvents[currentDataIndex].data.push(currentEvent);

        return mappedEvents;
      },
      [] as { title: string; data: EventData[] }[]
    );

const getEventData = async (eventId: string) => {
  const eventSnapshot = await getDoc(doc(getFirestore(), 'events', eventId));
  if (eventSnapshot.exists) {
    return eventDataSchema.parse({ id: eventId, ...eventSnapshot.data() });
  }

  return undefined;
};

export const useEventsQuery = () => {
  return useQuery({
    queryFn: async () => {
      const events = await userOperations.getEventIDs();

      const adminEvents = await Promise.all(events.adminEventIds.map(getEventData));
      const normalEvents = await Promise.all(events.eventIds.map(getEventData));

      const sortedAdminEvents = mapEvents(adminEvents);
      const sortedNormalEvents = mapEvents(normalEvents);

      return {
        adminEvents: sortedAdminEvents,
        normalEvents: sortedNormalEvents,
      };
    },
    queryKey: [EVENT_QUERY_KEY],
  });
};

export const useCreateEventMutation = () => {
  const queryClient = useQueryClient();
  const doCreateEvent = useCallback(async (data: EventData) => {
    const userId = getAuth().currentUser?.uid;

    if (userId) {
      const result = await addDoc(collection(getFirestore(), 'events'), {
        ...data,
      });

      return updateDoc(doc(getFirestore(), 'users', userId), {
        adminEventIds: arrayUnion(result.id),
      });
    }
  }, []);

  return useMutation({
    mutationFn: doCreateEvent,
    mutationKey: [CREATE_EVENT_MUTATION_KEY],
    onSuccess: () => {
      void queryClient.invalidateQueries([EVENT_QUERY_KEY]);
    },
  });
};
