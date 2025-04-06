import { userOperations } from './users';

export const firebaseBaseOperation = {
  realtime: {},
  database: {
    ...userOperations,
  },
};
