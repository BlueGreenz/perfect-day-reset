export const QUIZ_PROFILE_STORAGE_KEY = "pdr_quiz_profile";

export interface StoredQuizProfile {
  energyBottleneck: "morning_fatigue" | "midday_crash" | "evening_wired" | "full_burnout";
  wakeTime: "06:00" | "07:00" | "08:00" | "09:00";
  screenHabit: "first_thing" | "constant_notifications" | "late_scrolling" | "moderate";
  foodPreference: "omni" | "veg" | "keto" | "paleo" | "vegan";
  portalDietCode: string; // 'omni' | 'vegetarian' | 'keto' | 'gluten-free' | 'vegan'
  dietLabel: string;
  pastBlocker: "ran_late" | "too_rigid" | "quit_30_day" | "meal_prep";
  archetypeName: string;
  severityScore: number;
  recommendedGoal: string;
  email?: string;
  firstName?: string;
  savedAt: string;
}

export function saveQuizProfile(profile: StoredQuizProfile): void {
  try {
    localStorage.setItem(QUIZ_PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // Ignore storage quota or private mode errors
  }
}

export function loadQuizProfile(): StoredQuizProfile | null {
  try {
    const raw = localStorage.getItem(QUIZ_PROFILE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === "object" &&
      typeof parsed.wakeTime === "string" &&
      typeof parsed.foodPreference === "string" &&
      typeof parsed.archetypeName === "string"
    ) {
      return parsed as StoredQuizProfile;
    }
    return null;
  } catch {
    return null;
  }
}
