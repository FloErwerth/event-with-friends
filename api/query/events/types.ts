import { z } from 'zod';

export const eventDataSchema = z.object({
  id: z.string().optional(),
  name: z
    .string({ message: 'Bitte gib deinem Event einen Namen.' })
    .min(3, { message: 'Ein Event sollte einen Namen mit mindestens drei Zeichen haben.' })
    .max(32, { message: 'Ein Event sollte einen Namen mit maximal 32 Zeichen haben.' }),
  address: z.object({
    zipCity: z.string(),
    streetHouseNr: z.string(),
  }),
  dateTimestamp: z.number({ message: 'Bitte gib den Zeitpunkt deines Events an.' }),
  description: z.string().optional(),
});

export type EventData = z.infer<typeof eventDataSchema>;
