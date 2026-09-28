import { z } from "zod";

export const allowedEntryKinds = [
  "midday_reflection",
  "evening_reflection",
  "next_morning_reflection"
] as const;

export const resetEntrySchema = z.object({
  content: z.string()
    .trim()
    .min(1, "Reflection content is required")
    .max(5000, "Reflection content is too long")
});

export type ResetEntryInput = z.infer<typeof resetEntrySchema>;
export type AllowedEntryKind = typeof allowedEntryKinds[number];
