import { z } from 'zod';

export const userDataSchema = z.object({
  id: z.string(),
  email: z.string(),
  adminEventIds: z.array(z.string()).optional().catch([]),
  eventIds: z.array(z.string()).optional().catch([]),
});

export type UserData = z.infer<typeof userDataSchema>;
