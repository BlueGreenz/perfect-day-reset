import type { ResetItem } from "@shared/schema";

export type RescheduleCandidate = {
  itemId: number;
  newScheduledAt: Date;
};

export type RescheduleResult = 
  | { type: "schedule_conflict" }
  | { type: "success", changes: RescheduleCandidate[] };

export function computeDelayedSchedule(
  items: ResetItem[],
  targetItemId: number,
  delayMinutes: number,
  targetBedtimeAt: Date
): RescheduleResult {
  const targetItemIndex = items.findIndex(i => i.id === targetItemId);
  if (targetItemIndex === -1) {
    throw new Error("Target item not found in provided items list");
  }

  const delayMs = delayMinutes * 60 * 1000;
  const changes: RescheduleCandidate[] = [];

  // Deep clone the items for validation simulation so we don't mutate input
  const simulatedItems = items.map(i => ({ ...i }));

  for (let i = targetItemIndex; i < simulatedItems.length; i++) {
    const item = simulatedItems[i];
    
    // Only target item and future scheduled non-next_morning items shift
    if (i === targetItemIndex || (item.status === 'scheduled' && item.phase !== 'next_morning')) {
      const newTime = new Date(item.scheduledAt.getTime() + delayMs);
      item.scheduledAt = newTime; // mutate our clone
      changes.push({ itemId: item.id, newScheduledAt: newTime });
    }
  }

  // Verify bedtime boundaries
  const wakingItems = simulatedItems.filter(i => i.phase !== 'next_morning');
  const unfinishedWakingItems = wakingItems.filter(i => i.status === 'active' || i.status === 'scheduled');

  for (let i = 0; i < unfinishedWakingItems.length; i++) {
    const item = unfinishedWakingItems[i];
    const itemEnd = new Date(item.scheduledAt.getTime() + item.durationMinutes * 60 * 1000);
    
    if (i < unfinishedWakingItems.length - 1) {
      const nextItem = unfinishedWakingItems[i + 1];
      if (itemEnd.getTime() > nextItem.scheduledAt.getTime()) {
        return { type: "schedule_conflict" };
      }
    } else {
      // Final unfinished item before sleep
      if (itemEnd.getTime() > targetBedtimeAt.getTime()) {
        return { type: "schedule_conflict" };
      }
    }
  }

  return { type: "success", changes };
}
