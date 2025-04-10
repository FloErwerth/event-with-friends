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
import { queryKeys } from '../queryKeys';
import { useUserEventIdsQuery } from '../user';

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
  const { data: eventIds, isLoading: isLoadingEventIds } = useUserEventIdsQuery();

  return useQuery({
    queryFn: async () => {
      if (!eventIds || isLoadingEventIds) {
        return { adminEvents: [], normalEvents: [] };
      }

      const adminEvents = await Promise.all(eventIds.adminEventIds.map(getEventData));
      const normalEvents = await Promise.all(eventIds.eventIds.map(getEventData));

      const sortedAdminEvents = mapEvents(adminEvents);
      const sortedNormalEvents = mapEvents(normalEvents);

      return {
        adminEvents: sortedAdminEvents,
        normalEvents: sortedNormalEvents,
      };
    },
    queryKey: [queryKeys.EVENTS.EVENT_QUERY_KEY],
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
    mutationKey: [queryKeys.EVENTS.CREATE_EVENT_MUTATION_KEY],
    onSuccess: () => {
      void queryClient.invalidateQueries([queryKeys.USER.EVENT_IDS_QUERY_KEY]);
      void queryClient.invalidateQueries([queryKeys.EVENTS.EVENT_QUERY_KEY]);
    },
  });
};
