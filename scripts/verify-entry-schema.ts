import { resetEntrySchema, allowedEntryKinds } from "../server/reset/entry-schema";

function runTests() {
  console.log("Running local reflection validation verification...");

  // Valid kinds
  if (!allowedEntryKinds.includes("midday_reflection")) throw new Error("Missing midday_reflection");
  if (!allowedEntryKinds.includes("evening_reflection")) throw new Error("Missing evening_reflection");
  if (!allowedEntryKinds.includes("next_morning_reflection")) throw new Error("Missing next_morning_reflection");
  if ((allowedEntryKinds as any).includes("unknown_kind")) throw new Error("Allowed unknown kind");

  // Valid content
  const valid = resetEntrySchema.safeParse({ content: "  This is a good reflection.  " });
  if (!valid.success || valid.data.content !== "This is a good reflection.") {
    throw new Error("Failed to parse and trim valid content");
  }

  // Empty string
  const empty = resetEntrySchema.safeParse({ content: "   " });
  if (empty.success) throw new Error("Failed to reject whitespace-only string");

  // Missing content
  const missing = resetEntrySchema.safeParse({});
  if (missing.success) throw new Error("Failed to reject missing content");

  // Max limit
  const huge = resetEntrySchema.safeParse({ content: "a".repeat(5001) });
  if (huge.success) throw new Error("Failed to reject content > 5000 chars");

  console.log("All reflection validations passed!");
}

runTests();
