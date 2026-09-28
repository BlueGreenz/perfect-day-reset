import { createResetSchema } from "../server/reset/setup-schema.js";

function runTests() {
  console.log("Running local validation verification...");

  // 1. ISO timestamp strings parse successfully
  const validData = {
    startAt: "2026-09-29T07:00:00.000Z",
    targetBedtimeAt: "2026-09-29T22:00:00.000Z",
    targetNextMorningAt: "2026-09-30T07:00:00.000Z",
    timezone: "Europe/Tallinn",
    resetGoal: "Better sleep",
    foodPreference: "Vegan",
    movementAccess: "Home workout"
  };

  const parsed = createResetSchema.parse(validData);
  if (!(parsed.startAt instanceof Date)) throw new Error("startAt is not a Date object");
  if (!(parsed.targetBedtimeAt instanceof Date)) throw new Error("targetBedtimeAt is not a Date object");
  if (!(parsed.targetNextMorningAt instanceof Date)) throw new Error("targetNextMorningAt is not a Date object");
  console.log("Valid JSON payloads successfully parse strings to Dates.");

  // 2. Malformed timestamps fail
  const invalidDateData = {
    ...validData,
    startAt: "not-a-date"
  };

  try {
    createResetSchema.parse(invalidDateData);
    throw new Error("Should have thrown on malformed date");
  } catch (e: any) {
    if (!e.errors || e.errors[0].path[0] !== "startAt") throw e;
    console.log("Malformed timestamps successfully rejected.");
  }

  // 3. Empty required strings fail
  const emptyStringData = {
    ...validData,
    timezone: "   "
  };

  try {
    createResetSchema.parse(emptyStringData);
    throw new Error("Should have thrown on empty timezone");
  } catch (e: any) {
    if (!e.errors || e.errors[0].path[0] !== "timezone") throw e;
    console.log("Empty required strings successfully rejected.");
  }

  console.log("All local validations passed!");
}

runTests();
