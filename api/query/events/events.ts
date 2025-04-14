import { getAuth } from '@react-native-firebase/auth';
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from '@react-native-firebase/firestore';
import { useCallback } from 'react';
import { useMutation, useQuery } from 'react-query';

import { EventData, eventDataSchema } from './types';
import { queryClient } from '../../../app/_layout';
import { queryKeys } from '../queryKeys';
import { userDataSchema } from '../user';

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
      const userId = getAuth().currentUser?.uid;
      if (!userId) {
        throw new Error('Not logged in');
      }

      const usersRef = collection(getFirestore(), 'users');
      const userData = await getDocs(query(usersRef, where('id', '==', userId)));
      const adminIds: string[] = [];
      const eventIds: string[] = [];

      userData.forEach((doc) => {
        const parsedUserData = userDataSchema.safeParse(doc.data());

        if (parsedUserData.success) {
          adminIds.push(...(parsedUserData.data.adminEventIds ?? []));
          eventIds.push(...(parsedUserData.data.eventIds ?? []));
        }
      });

      const adminEvents = await Promise.all(adminIds.map(getEventData));
      const normalEvents = await Promise.all(eventIds.map(getEventData));

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

export const useJoinEventsMutation = () => {
  const joinEvent = async (eventId: string) => {
    const userId = getAuth().currentUser?.uid;
    console.log('userId: ', userId, 'eventId: ', eventId);
    if (!userId) {
      return;
    }
    const possibleEvent = await getDoc(collection(getFirestore(), 'events').doc(eventId));
    if (!possibleEvent.exists) {
      return;
    }

    await updateDoc(doc(getFirestore(), 'users', userId), {
      eventIds: arrayUnion(eventId),
    }).catch((e) => console.log(e));
  };

  return useMutation({
    mutationFn: joinEvent,
    mutationKey: [queryKeys.EVENTS.JOIN_EVENT_MUTATION_KEY],
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.USER.EVENT_IDS_QUERY_KEY });
      await queryClient.invalidateQueries({ queryKey: queryKeys.EVENTS.EVENT_QUERY_KEY });
    },
  });
};

export const useCreateEventMutation = () => {
  const doCreateEvent = useCallback(async (data: EventData) => {
    const userId = getAuth().currentUser?.uid;

    if (userId) {
      const result = await addDoc(collection(getFirestore(), 'events'), {
        ...data,
      });

      await updateDoc(doc(getFirestore(), 'users', userId), {
        adminEventIds: arrayUnion(result.id),
      });

      return result.id;
    }
  }, []);

  return useMutation({
    mutationFn: doCreateEvent,
    mutationKey: [queryKeys.EVENTS.CREATE_EVENT_MUTATION_KEY],
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.USER.EVENT_IDS_QUERY_KEY });
      await queryClient.invalidateQueries({ queryKey: queryKeys.EVENTS.EVENT_QUERY_KEY });
    },
  });
};
