import { getAuth } from '@react-native-firebase/auth';
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getFirestore,
  updateDoc,
} from '@react-native-firebase/firestore';
import { z } from 'zod';

const eventDataSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type EventData = z.infer<typeof eventDataSchema>;

type EventOperations = {
  createEvent: (data: Partial<EventData>) => Promise<void>;
  joinEvent: (id: string) => Promise<void>;
  leaveEvent: (id: string) => Promise<void>;
  getEventData: (id: string) => Promise<EventData | undefined>;
};

export const eventOperations: EventOperations = {
  createEvent: async (data) => {
    const userId = getAuth().currentUser?.uid;
    if (userId) {
      const result = await addDoc(collection(getFirestore(), 'events'), {
        ...data,
      });

      updateDoc(doc(getFirestore(), 'users', userId), {
        adminEventIds: arrayUnion(result.id),
      }).catch((e) => console.log(e));
    }
  },
  joinEvent: async (eventId) => {
    const userId = getAuth().currentUser?.uid;
    if (!userId) {
      return;
    }
    const possibleEvent = await getDoc(collection(getFirestore(), 'events').doc(eventId));
    if (!possibleEvent.exists) {
      return;
    }
    await updateDoc(doc(getFirestore(), 'users', userId), {
      adminEventIds: arrayUnion(eventId),
    }).catch((e) => console.log(e));
  },
  leaveEvent: async (eventId) => {
    const userId = getAuth().currentUser?.uid;
    if (!userId) {
      return;
    }

    await updateDoc(doc(getFirestore(), 'users', userId), {
      adminEventIds: arrayRemove(eventId),
    }).catch((e) => console.log(e));
  },
  getEventData: async (eventId) => {
    const eventSnapshot = await getDoc(doc(getFirestore(), 'events', eventId));

    if (eventSnapshot.exists) {
      return eventDataSchema.parse({ id: eventId, ...eventSnapshot.data() });
    }

    return undefined;
  },
};
