import type { ResetItem } from "@shared/schema";

export type RescheduleCandidate = {
  itemId: number;
  newScheduledAt: Date;
};

export type RescheduleResult = 
  | { type: "schedule_conflict" }
  | { type: "success", changes: RescheduleCandidate[] };

const BEDTIME_ANCHORED_KEYS = new Set([
  "night_supplements",
  "evening_movement",
  "evening_journal",
  "wind_down",
]);

export function computeDelayedSchedule(
  items: ResetItem[],
  targetItemId: number,
  delayMinutes: number,
  targetBedtimeAt: Date
): RescheduleResult {
  const targetItemIndex = items.findIndex((i) => i.id === targetItemId);
  if (targetItemIndex === -1) {
    throw new Error("Target item not found in provided items list");
  }

  const delayMs = delayMinutes * 60 * 1000;
  const changes: RescheduleCandidate[] = [];

  // Deep clone the items for validation simulation so we don't mutate input
  const simulatedItems = items.map((i) => ({ ...i }));
  const targetItem = simulatedItems[targetItemIndex];
  const isTargetBedtimeAnchored = BEDTIME_ANCHORED_KEYS.has(targetItem.activityKey);

  for (let i = targetItemIndex; i < simulatedItems.length; i++) {
    const item = simulatedItems[i];
    if (item.phase === "next_morning") continue;
    if (i !== targetItemIndex && item.status !== "scheduled") continue;

    const isItemBedtimeAnchored = BEDTIME_ANCHORED_KEYS.has(item.activityKey);

    // If delaying an earlier daytime activity, only shift bedtime-anchored items
    // if the preceding activity's end time pushes into them.
    if (!isTargetBedtimeAnchored && isItemBedtimeAnchored && i > targetItemIndex) {
      const prevItem = simulatedItems[i - 1];
      const prevEndMs =
        prevItem.scheduledAt.getTime() + prevItem.durationMinutes * 60 * 1000;
      if (prevEndMs <= item.scheduledAt.getTime()) {
        continue;
      }
      const pushedTime = new Date(prevEndMs);
      item.scheduledAt = pushedTime;
      changes.push({ itemId: item.id, newScheduledAt: pushedTime });
      continue;
    }

    const newTime = new Date(item.scheduledAt.getTime() + delayMs);
    item.scheduledAt = newTime;
    changes.push({ itemId: item.id, newScheduledAt: newTime });
  }

  // Allow up to 3 hours of bedtime flexibility when the user explicitly delays activities
  const maxBedtimeMs = targetBedtimeAt.getTime() + 3 * 60 * 60 * 1000;

  // Verify chronological order and boundaries
  const wakingItems = simulatedItems.filter((i) => i.phase !== "next_morning");
  const unfinishedWakingItems = wakingItems.filter(
    (i) => i.status === "active" || i.status === "scheduled"
  );

  for (let i = 0; i < unfinishedWakingItems.length; i++) {
    const item = unfinishedWakingItems[i];
    const itemEnd = new Date(
      item.scheduledAt.getTime() + item.durationMinutes * 60 * 1000
    );

    if (i < unfinishedWakingItems.length - 1) {
      const nextItem = unfinishedWakingItems[i + 1];
      if (itemEnd.getTime() > nextItem.scheduledAt.getTime()) {
        return { type: "schedule_conflict" };
      }
    } else {
      if (itemEnd.getTime() > maxBedtimeMs) {
        return { type: "schedule_conflict" };
      }
    }
  }

  return { type: "success", changes };
}
