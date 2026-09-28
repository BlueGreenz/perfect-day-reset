import { computeDelayedSchedule } from "../server/reset/rescheduler";
import { delayRequestSchema } from "../server/reset/delay-schema";
import type { ResetItem } from "@shared/schema";

function runTests() {
  console.log("Running delay schema validations...");
  
  const valid = delayRequestSchema.safeParse({ delayMinutes: 30, expectedScheduleRevision: 0 });
  if (!valid.success) throw new Error("Valid delay request failed");

  const zeroDelay = delayRequestSchema.safeParse({ delayMinutes: 0, expectedScheduleRevision: 0 });
  if (zeroDelay.success) throw new Error("Zero delay should fail");

  const negativeDelay = delayRequestSchema.safeParse({ delayMinutes: -10, expectedScheduleRevision: 0 });
  if (negativeDelay.success) throw new Error("Negative delay should fail");

  const hugeDelay = delayRequestSchema.safeParse({ delayMinutes: 181, expectedScheduleRevision: 0 });
  if (hugeDelay.success) throw new Error("Too large delay should fail");

  const nonIntDelay = delayRequestSchema.safeParse({ delayMinutes: 30.5, expectedScheduleRevision: 0 });
  if (nonIntDelay.success) throw new Error("Non-int delay should fail");

  const negRevision = delayRequestSchema.safeParse({ delayMinutes: 30, expectedScheduleRevision: -1 });
  if (negRevision.success) throw new Error("Negative revision should fail");

  console.log("Delay schema validations passed!");
  
  console.log("Running pure rescheduler validations...");

  const baseTime = new Date("2024-01-01T08:00:00Z").getTime();
  
  const items: ResetItem[] = [
    {
      id: 1, resetRunId: 1, activityKey: "A", phase: "morning", sequence: 1,
      durationMinutes: 15, status: "completed", originalScheduledAt: new Date(baseTime),
      scheduledAt: new Date(baseTime), createdAt: new Date(), updatedAt: new Date(),
      variantKey: null, completedAt: new Date(baseTime + 15*60000), skippedAt: null
    },
    {
      id: 2, resetRunId: 1, activityKey: "B", phase: "morning", sequence: 2,
      durationMinutes: 15, status: "active", originalScheduledAt: new Date(baseTime + 15*60000),
      scheduledAt: new Date(baseTime + 15*60000), createdAt: new Date(), updatedAt: new Date(),
      variantKey: null, completedAt: null, skippedAt: null
    },
    {
      id: 3, resetRunId: 1, activityKey: "C", phase: "midday", sequence: 3,
      durationMinutes: 30, status: "scheduled", originalScheduledAt: new Date(baseTime + 30*60000),
      scheduledAt: new Date(baseTime + 30*60000), createdAt: new Date(), updatedAt: new Date(),
      variantKey: null, completedAt: null, skippedAt: null
    },
    {
      id: 4, resetRunId: 1, activityKey: "D", phase: "evening", sequence: 4,
      durationMinutes: 30, status: "scheduled", originalScheduledAt: new Date(baseTime + 60*60000),
      scheduledAt: new Date(baseTime + 60*60000), createdAt: new Date(), updatedAt: new Date(),
      variantKey: null, completedAt: null, skippedAt: null
    },
    {
      id: 5, resetRunId: 1, activityKey: "E", phase: "next_morning", sequence: 5,
      durationMinutes: 15, status: "scheduled", originalScheduledAt: new Date(baseTime + 24*3600*1000),
      scheduledAt: new Date(baseTime + 24*3600*1000), createdAt: new Date(), updatedAt: new Date(),
      variantKey: null, completedAt: null, skippedAt: null
    }
  ];

  const originalItemsCopy = items.map(i => ({ ...i }));
  const bedtime = new Date(baseTime + 120*60000); // 10:00:00Z, so exactly 2 hours after start. Total duration left: 15+30+30 = 75 mins. Current time 08:15. End time 09:30. We can delay up to 30 mins safely.
  
  // Test 1: +30 minutes
  const r1 = computeDelayedSchedule(items, 2, 30, bedtime);
  if (r1.type !== "success") throw new Error("Expected success for +30 min");
  
  if (r1.changes.length !== 3) throw new Error("Expected 3 items to shift (2, 3, 4)");
  
  if (r1.changes[0].itemId !== 2 || r1.changes[0].newScheduledAt.getTime() !== baseTime + 45*60000) throw new Error("Item 2 shifted incorrectly");
  if (r1.changes[1].itemId !== 3 || r1.changes[1].newScheduledAt.getTime() !== baseTime + 60*60000) throw new Error("Item 3 shifted incorrectly");
  if (r1.changes[2].itemId !== 4 || r1.changes[2].newScheduledAt.getTime() !== baseTime + 90*60000) throw new Error("Item 4 shifted incorrectly");

  // Verify inputs not mutated
  for (let i = 0; i < items.length; i++) {
    if (items[i].scheduledAt.getTime() !== originalItemsCopy[i].scheduledAt.getTime()) {
      throw new Error("Rescheduler mutated input array");
    }
  }

  // Test 2: Conflict (overflow bedtime)
  // Current end is 09:30, bedtime is 10:00. Delay of 31 should fail (overflows by 1 minute).
  const r2 = computeDelayedSchedule(items, 2, 31, bedtime);
  if (r2.type !== "schedule_conflict") throw new Error("Expected schedule conflict for +31 min");

  console.log("All rescheduler validations passed!");
}

runTests();
