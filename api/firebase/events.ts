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
  id: z.string().optional(),
  name: z
    .string({ message: 'Bitte gib deinem Event einen Namen.' })
    .min(3, { message: 'Ein Event sollte einen Namen mit mindestens drei Zeichen haben.' })
    .max(32, { message: 'Ein Event sollte einen Namen mit maximal 32 Zeichen haben.' }),
  address: z.string({ message: 'Bitte gib die Addresse deine Events an.' }),
  dateTimestamp: z.number({ message: 'Bitte gib den Zeitpunkt deines Events an.' }),
  description: z.string().optional(),
});

export type EventData = z.infer<typeof eventDataSchema>;

type EventOperations = {
  createEvent: (data: EventData) => Promise<void>;
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
