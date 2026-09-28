import { z } from "zod";

export const createResetSchema = z.object({
  startAt: z.string().datetime().transform(str => new Date(str)),
  targetBedtimeAt: z.string().datetime().transform(str => new Date(str)),
  targetNextMorningAt: z.string().datetime().transform(str => new Date(str)),
  timezone: z.string().trim().min(1, "Timezone is required"),
  resetGoal: z.string().trim().min(1, "Goal is required"),
  foodPreference: z.string().trim().min(1, "Food preference is required"),
  movementAccess: z.string().trim().min(1, "Movement access is required"),
  blockedTimesJson: z.any().optional(),
});

export type CreateResetInput = z.infer<typeof createResetSchema>;
