import { ACTIVITY_CATALOG_V1, ActivityDefinition } from './activity-catalog';

export interface ScheduleInput {
  startAt: Date;
  targetBedtimeAt: Date;
  targetNextMorningAt: Date;
  timezone: string;
}

export interface GeneratedScheduleItem {
  activityKey: string;
  variantKey: string | null;
  phase: string;
  sequence: number;
  originalScheduledAt: Date;
  scheduledAt: Date;
  durationMinutes: number;
  status: 'scheduled';
}

export function generateInitialResetSchedule(input: ScheduleInput): GeneratedScheduleItem[] {
  // 1. Validate inputs
  if (!(input.startAt instanceof Date) || isNaN(input.startAt.getTime())) {
    throw new Error('Invalid startAt date');
  }
  if (!(input.targetBedtimeAt instanceof Date) || isNaN(input.targetBedtimeAt.getTime())) {
    throw new Error('Invalid targetBedtimeAt date');
  }
  if (!(input.targetNextMorningAt instanceof Date) || isNaN(input.targetNextMorningAt.getTime())) {
    throw new Error('Invalid targetNextMorningAt date');
  }
  if (!input.timezone || typeof input.timezone !== 'string') {
    throw new Error('Invalid timezone');
  }

  // Ensure logical chronological order
  if (input.targetBedtimeAt.getTime() <= input.startAt.getTime()) {
    throw new Error('Bedtime must be after start time');
  }
  if (input.targetNextMorningAt.getTime() <= input.targetBedtimeAt.getTime()) {
    throw new Error('Next morning must be after bedtime');
  }

  // Basic timezone string validation (will throw if invalid in modern V8)
  try {
    Intl.DateTimeFormat(undefined, { timeZone: input.timezone });
  } catch (e) {
    throw new Error(`Invalid IANA timezone: ${input.timezone}`);
  }

  const items: GeneratedScheduleItem[] = [];

  // Sort catalog by sequence just in case
  const sortedCatalog = [...ACTIVITY_CATALOG_V1].sort((a, b) => a.sequence - b.sequence);

  // Verify unique keys and sequences
  const seenKeys = new Set<string>();
  const seenSequences = new Set<number>();
  
  for (const activity of sortedCatalog) {
    if (seenKeys.has(activity.activityKey)) {
      throw new Error(`Duplicate activity key in catalog: ${activity.activityKey}`);
    }
    seenKeys.add(activity.activityKey);

    if (seenSequences.has(activity.sequence)) {
      throw new Error(`Duplicate sequence in catalog: ${activity.sequence}`);
    }
    seenSequences.add(activity.sequence);
  }

  // Generate schedule
  for (const activity of sortedCatalog) {
    // Exclude withheld
    if (activity.publicationStatus === 'withheld') {
      continue;
    }

    let itemTime: Date;

    if (activity.timing.anchor === 'START') {
      itemTime = new Date(input.startAt.getTime() + activity.timing.offsetMinutes * 60000);
    } else if (activity.timing.anchor === 'BEDTIME') {
      itemTime = new Date(input.targetBedtimeAt.getTime() + activity.timing.offsetMinutes * 60000);
    } else if (activity.timing.anchor === 'NEXT_MORNING') {
      itemTime = new Date(input.targetNextMorningAt.getTime() + activity.timing.offsetMinutes * 60000);
    } else {
      throw new Error(`Unknown anchor: ${(activity.timing as any).anchor}`);
    }

    items.push({
      activityKey: activity.activityKey,
      variantKey: null, // Initial schedule doesn't pick variants
      phase: activity.phase,
      sequence: activity.sequence,
      originalScheduledAt: itemTime,
      scheduledAt: itemTime,
      durationMinutes: activity.defaultDurationMinutes,
      status: 'scheduled'
    });
  }

  // Ensure chronological order
  items.sort((a, b) => {
    const timeDiff = a.scheduledAt.getTime() - b.scheduledAt.getTime();
    if (timeDiff !== 0) return timeDiff;
    return a.sequence - b.sequence;
  });

  // Validate schedule overlap and fit before sleep
  let previousWakingItem: GeneratedScheduleItem | null = null;
  
  for (const item of items) {
    if (item.phase === 'next_morning') {
      continue; // next_morning items are handled separately
    }
    
    // Check overlap with previous waking item
    if (previousWakingItem) {
      const prevEndTime = new Date(previousWakingItem.scheduledAt.getTime() + previousWakingItem.durationMinutes * 60000);
      if (item.scheduledAt.getTime() < prevEndTime.getTime()) {
        throw new Error(`The selected start time and bedtime do not provide enough time for the Perfect Day Reset schedule. (Overlap detected between ${previousWakingItem.activityKey} and ${item.activityKey})`);
      }
    }
    
    previousWakingItem = item;
  }
  
  // Check if final evening activity extends beyond bedtime
  if (previousWakingItem) {
    const finalWakingEndTime = new Date(previousWakingItem.scheduledAt.getTime() + previousWakingItem.durationMinutes * 60000);
    if (finalWakingEndTime.getTime() > input.targetBedtimeAt.getTime()) {
      throw new Error(`The selected start time and bedtime do not provide enough time for the Perfect Day Reset schedule. (Final activity ${previousWakingItem.activityKey} ends after bedtime)`);
    }
  }

  return items;
}
