import { useQuery } from 'react-query';

import { eventOperations, userOperations } from '../firebase';

export const useEventsQuery = () => {
  return useQuery({
    queryFn: async () => {
      const events = await userOperations.getEventIDs();

      const adminEvents = await Promise.all(events.adminEventIds.map(eventOperations.getEventData));
      const normalEvents = await Promise.all(events.eventIds.map(eventOperations.getEventData));

      return {
        adminEvents,
        normalEvents,
      };
    },
    queryKey: ['events'],
  });
};
