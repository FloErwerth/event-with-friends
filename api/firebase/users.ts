import { getAuth } from '@react-native-firebase/auth';
import { doc, getFirestore, setDoc } from '@react-native-firebase/firestore';
import { z } from 'zod';

const userDataSchema = z.object({
  id: z.string(),
  email: z.string(),
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

    const adminEvents = ['admin_event_id_1'];
    const participationEvents = ['event_id_1', 'event_id_2'];
    return Promise.resolve({ adminEventIds: adminEvents, eventIds: participationEvents });
  },
};
