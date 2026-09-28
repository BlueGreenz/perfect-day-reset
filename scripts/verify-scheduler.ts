import { generateInitialResetSchedule } from '../server/reset/scheduler.js';
import { ACTIVITY_CATALOG_V1 } from '../server/reset/activity-catalog.js';

function runTests() {
  const baseInput = {
    startAt: new Date('2023-10-10T07:00:00Z'),
    targetBedtimeAt: new Date('2023-10-10T22:00:00Z'),
    targetNextMorningAt: new Date('2023-10-11T07:00:00Z'),
    timezone: 'Europe/Tallinn'
  };

  console.log("Running smoke verification...");
  
  const schedule1 = generateInitialResetSchedule(baseInput);
  const schedule2 = generateInitialResetSchedule(baseInput);

  // 1. Same inputs produce identical output
  if (JSON.stringify(schedule1) !== JSON.stringify(schedule2)) throw new Error("Non-deterministic output");

  // 2. Activity keys unique
  const keys = new Set(schedule1.map(i => i.activityKey));
  if (keys.size !== schedule1.length) throw new Error("Duplicate keys");

  // 3. Sequence values unique & ordered
  const seqs = schedule1.map(i => i.sequence);
  const isOrdered = seqs.every((v, i, a) => i === 0 || a[i - 1] <= v);
  if (!isOrdered || new Set(seqs).size !== seqs.length) throw new Error("Sequences invalid");

  // 4. Withheld activities excluded
  if (keys.has("morning_supplements") || keys.has("midday_supplements") || keys.has("night_supplements")) {
    throw new Error("Withheld activities present");
  }

  // 5. No sleep activity
  if (keys.has("sleep")) throw new Error("Sleep activity present");

  // 6. next_morning_checkin occurs at targetNextMorningAt
  const nextMorn = schedule1.find(i => i.activityKey === 'next_morning_checkin');
  if (nextMorn?.scheduledAt.getTime() !== baseInput.targetNextMorningAt.getTime()) {
    throw new Error("next_morning_checkin time mismatch");
  }

  // 7. Test shifting anchors
  const shiftedInput = {
    startAt: new Date('2023-10-10T08:00:00Z'),
    targetBedtimeAt: new Date('2023-10-10T23:00:00Z'),
    targetNextMorningAt: new Date('2023-10-11T08:00:00Z'),
    timezone: 'Europe/Tallinn'
  };
  const shiftedSchedule = generateInitialResetSchedule(shiftedInput);
  
  const shiftedWake = shiftedSchedule.find(i => i.activityKey === 'wake_up');
  if (shiftedWake?.scheduledAt.getTime() !== shiftedInput.startAt.getTime()) throw new Error("START anchor failed to shift");

  const shiftedWindDown = shiftedSchedule.find(i => i.activityKey === 'wind_down');
  // Should be BEDTIME - 30m = 22:30:00Z
  if (shiftedWindDown?.scheduledAt.getTime() !== new Date('2023-10-10T22:30:00Z').getTime()) throw new Error("BEDTIME anchor failed to shift");

  // 8. Invalid chronological inputs
  try {
    generateInitialResetSchedule({
      ...baseInput,
      targetBedtimeAt: new Date('2023-10-10T06:00:00Z') // Before start
    });
    throw new Error("Should have thrown on bad bedtime");
  } catch(e: any) {
    if (!e.message.includes('after start time')) throw e;
  }

  // 9. cold_shower is optional
  const coldShower = ACTIVITY_CATALOG_V1.find(i => i.activityKey === 'cold_shower');
  if (!coldShower || coldShower.optional !== true) {
     throw new Error("cold_shower must be optional");
  }

  // 10. Normal schedule succeeds
  // Already succeeded above.

  // 11. Overlap / window too small throws
  try {
    generateInitialResetSchedule({
      ...baseInput,
      targetBedtimeAt: new Date('2023-10-10T14:00:00Z') // Only 7 hours after start, surely overlaps
    });
    throw new Error("Should have thrown on overlapping schedule / window too small");
  } catch(e: any) {
    if (!e.message.includes('do not provide enough time')) throw e;
    console.log(`Correctly rejected invalid schedule: ${e.message}`);
  }

  console.log("All verifications passed!");
  console.log(`Generated ${schedule1.length} activities`);
}

runTests();
