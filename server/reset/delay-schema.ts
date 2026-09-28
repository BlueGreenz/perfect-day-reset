import { z } from "zod";

export const delayRequestSchema = z.object({
  delayMinutes: z.number().int().positive().max(180),
  expectedScheduleRevision: z.number().int().min(0)
});

export type DelayRequestInput = z.infer<typeof delayRequestSchema>;
