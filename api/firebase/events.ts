import { getAuth } from '@react-native-firebase/auth';
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
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
  getEventData: (id: string) => Promise<EventData>;
};

export const eventOperations: EventOperations = {
  createEvent: async (data) => {
    const userId = getAuth().currentUser?.uid;
    if (userId) {
      await addDoc(collection(getFirestore(), 'events'), {
        ...data,
      });

      updateDoc(doc(getFirestore(), 'users', userId), {
        admin_event_ids: arrayUnion(userId),
      }).catch((e) => console.log(e));
    }
  },
  joinEvent: async (eventId) => {
    const userId = getAuth().currentUser?.uid;
    if (!userId) {
      return;
    }
    const possibleEvent = await collection(getFirestore(), 'events').doc(eventId).get();
    if (!possibleEvent.exists) {
      return;
    }
    await updateDoc(doc(getFirestore(), 'users', userId), {
      admin_event_ids: arrayUnion(eventId),
    }).catch((e) => console.log(e));
  },
  leaveEvent: async (eventId) => {
    const userId = getAuth().currentUser?.uid;
    if (!userId) {
      return;
    }

    await updateDoc(doc(getFirestore(), 'users', userId), {
      admin_event_ids: arrayRemove(eventId),
    }).catch((e) => console.log(e));
  },
  getEventData: async (eventId) => {
    return Promise.resolve({ id: eventId, name: 'Event 1' });
  },
};
