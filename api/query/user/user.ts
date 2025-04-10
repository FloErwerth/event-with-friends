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
import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { UserData, userDataSchema } from './types';
import { queryKeys } from '../queryKeys';

const createUser = async (userData: UserData) => {
  const parsedUserData = userDataSchema.safeParse(userData);
  if (parsedUserData.success) {
    await setDoc(doc(getFirestore(), 'users', parsedUserData.data.id), {
      ...parsedUserData.data,
    });
  }
};

export const useUserEventIdsQuery = () => {
  const getEventIds = useCallback(async () => {
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
  }, []);

  return useQuery({
    queryFn: getEventIds,
    queryKey: [queryKeys.USER.EVENT_IDS_QUERY_KEY],
  });
};

export const useLoginUserQuery = () => {

}

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    mutationKey: [queryKeys.USER.CREATE_USER_MUTATION_KEY],
    onSuccess: () => {
      void queryClient.invalidateQueries([queryKeys.EVENTS.EVENT_QUERY_KEY]);
    },
  });
};
