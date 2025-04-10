import { getAuth } from '@react-native-firebase/auth';
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getFirestore,
  updateDoc,
} from '@react-native-firebase/firestore';

type EventOperations = {
  joinEvent: (id: string) => Promise<void>;
  leaveEvent: (id: string) => Promise<void>;
};

const eventOperations: EventOperations = {
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
};
