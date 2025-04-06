import { getAuth } from '@react-native-firebase/auth';
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from '@react-native-firebase/firestore';
import { z } from 'zod';

const userDataSchema = z.object({
  id: z.string(),
  email: z.string(),
  adminEventIds: z.array(z.string()).optional().catch([]),
  eventIds: z.array(z.string()).optional().catch([]),
});

type UserData = z.infer<typeof userDataSchema>;

type UserOperations = {
  createUser: (userData: Partial<UserData>) => Promise<void>;
  getEventIDs: () => Promise<{ adminEventIds: string[]; eventIds: string[] }>;
};

export const userOperations: UserOperations = {
  createUser: async (userData) => {
    const parsedUserData = userDataSchema.safeParse(userData);
    if (parsedUserData.success) {
      await setDoc(doc(getFirestore(), 'users', parsedUserData.data.id), {
        ...parsedUserData.data,
      });
    }
  },
  getEventIDs: async () => {
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

    return {
      adminEventIds: adminIds,
      eventIds,
    };
  },
};
