export type AnchorType = 'START' | 'BEDTIME' | 'NEXT_MORNING';

export type ActivityPhase = 'morning' | 'midday' | 'afternoon' | 'evening' | 'next_morning';

export interface ActivityDefinition {
  activityKey: string;
  catalogVersion: string;
  phase: ActivityPhase;
  sequence: number; // For tie-breaking and absolute ordering
  timing: {
    anchor: AnchorType;
    offsetMinutes: number;
  };
  defaultDurationMinutes: number;
  minimumDurationMinutes: number;
  optional: boolean;
  allowedVariants?: string[];
  publicationStatus: 'active' | 'withheld';
}

export const CATALOG_VERSION_V1 = "v1.0";

export const ACTIVITY_CATALOG_V1: ActivityDefinition[] = [
  // MORNING (Anchor: START = 07:00 in base)
  {
    activityKey: "wake_up",
    catalogVersion: CATALOG_VERSION_V1,
    phase: "morning",
    sequence: 10,
    timing: { anchor: "START", offsetMinutes: 0 },
    defaultDurationMinutes: 10,
    minimumDurationMinutes: 5,
    optional: false,
    publicationStatus: "active"
  },
  {
    activityKey: "hydration",
    catalogVersion: CATALOG_VERSION_V1,
    phase: "morning",
    sequence: 20,
    timing: { anchor: "START", offsetMinutes: 10 },
    defaultDurationMinutes: 10,
    minimumDurationMinutes: 5,
    optional: false,
    publicationStatus: "active"
  },
  {
    activityKey: "light_movement",
    catalogVersion: CATALOG_VERSION_V1,
    phase: "morning",
    sequence: 30,
    timing: { anchor: "START", offsetMinutes: 20 },
    defaultDurationMinutes: 10,
    minimumDurationMinutes: 5,
    optional: false,
    publicationStatus: "active"
  },
  {
    activityKey: "grounding_walk",
    catalogVersion: CATALOG_VERSION_V1,
    phase: "morning",
    sequence: 40,
    timing: { anchor: "START", offsetMinutes: 30 },
    defaultDurationMinutes: 30,
    minimumDurationMinutes: 15,
    optional: false,
    publicationStatus: "active"
  },
  {
    activityKey: "morning_journal",
    catalogVersion: CATALOG_VERSION_V1,
    phase: "morning",
    sequence: 50,
    timing: { anchor: "START", offsetMinutes: 60 },
    defaultDurationMinutes: 30,
    minimumDurationMinutes: 15,
    optional: false,
    publicationStatus: "active"
  },
  {
    activityKey: "breakfast",
    catalogVersion: CATALOG_VERSION_V1,
    phase: "morning",
    sequence: 60,
    timing: { anchor: "START", offsetMinutes: 90 },
    defaultDurationMinutes: 60,
    minimumDurationMinutes: 30,
    optional: false,
    publicationStatus: "active"
  },
  {
    activityKey: "morning_supplements",
    catalogVersion: CATALOG_VERSION_V1,
    phase: "morning",
    sequence: 70,
    timing: { anchor: "START", offsetMinutes: 150 }, // 09:30
    defaultDurationMinutes: 5,
    minimumDurationMinutes: 1,
    optional: true,
    publicationStatus: "withheld"
  },
  {
    activityKey: "integration",
    catalogVersion: CATALOG_VERSION_V1,
    phase: "morning",
    sequence: 80,
    timing: { anchor: "START", offsetMinutes: 180 }, // 10:00
    defaultDurationMinutes: 10,
    minimumDurationMinutes: 5,
    optional: false,
    publicationStatus: "active"
  },

  // MIDDAY (10:30 - 14:00)
  {
    activityKey: "focus_sprint",
    catalogVersion: CATALOG_VERSION_V1,
    phase: "midday",
    sequence: 90,
    timing: { anchor: "START", offsetMinutes: 210 }, // 10:30
    defaultDurationMinutes: 90,
    minimumDurationMinutes: 45,
    optional: false,
    allowedVariants: ['reflective', 'creative', 'productive'],
    publicationStatus: "active"
  },
  {
    activityKey: "midday_movement",
    catalogVersion: CATALOG_VERSION_V1,
    phase: "midday",
    sequence: 100,
    timing: { anchor: "START", offsetMinutes: 300 }, // 12:00
    defaultDurationMinutes: 60,
    minimumDurationMinutes: 30,
    optional: false,
    allowedVariants: ['no-equipment', 'gear-based', 'gym-access', 'follow-along'],
    publicationStatus: "active"
  },
  {
    activityKey: "cold_shower",
    catalogVersion: CATALOG_VERSION_V1,
    phase: "midday",
    sequence: 110,
    timing: { anchor: "START", offsetMinutes: 390 }, // 13:30
    defaultDurationMinutes: 5,
    minimumDurationMinutes: 2,
    optional: true,
    publicationStatus: "active"
  },

  // AFTERNOON (14:00 - 17:30)
  {
    activityKey: "lunch",
    catalogVersion: CATALOG_VERSION_V1,
    phase: "afternoon",
    sequence: 120,
    timing: { anchor: "START", offsetMinutes: 420 }, // 14:00
    defaultDurationMinutes: 60,
    minimumDurationMinutes: 30,
    optional: false,
    publicationStatus: "active"
  },
  {
    activityKey: "midday_supplements",
    catalogVersion: CATALOG_VERSION_V1,
    phase: "afternoon",
    sequence: 130,
    timing: { anchor: "START", offsetMinutes: 480 }, // 15:00
    defaultDurationMinutes: 5,
    minimumDurationMinutes: 1,
    optional: true,
    publicationStatus: "withheld"
  },
  {
    activityKey: "midday_reflection",
    catalogVersion: CATALOG_VERSION_V1,
    phase: "afternoon",
    sequence: 140,
    timing: { anchor: "START", offsetMinutes: 495 }, // 15:15
    defaultDurationMinutes: 5,
    minimumDurationMinutes: 5,
    optional: false,
    publicationStatus: "active"
  },
  {
    activityKey: "mirror_task",
    catalogVersion: CATALOG_VERSION_V1,
    phase: "afternoon",
    sequence: 150,
    timing: { anchor: "START", offsetMinutes: 510 }, // 15:30
    defaultDurationMinutes: 5,
    minimumDurationMinutes: 1,
    optional: false,
    publicationStatus: "active"
  },
  {
    activityKey: "breathing_exercise",
    catalogVersion: CATALOG_VERSION_V1,
    phase: "afternoon",
    sequence: 160,
    timing: { anchor: "START", offsetMinutes: 515 }, // 15:35
    defaultDurationMinutes: 5,
    minimumDurationMinutes: 5,
    optional: false,
    publicationStatus: "active"
  },
  {
    activityKey: "nature_exposure",
    catalogVersion: CATALOG_VERSION_V1,
    phase: "afternoon",
    sequence: 170,
    timing: { anchor: "START", offsetMinutes: 540 }, // 16:00
    defaultDurationMinutes: 30,
    minimumDurationMinutes: 20,
    optional: false,
    publicationStatus: "active"
  },
  {
    activityKey: "social_connection",
    catalogVersion: CATALOG_VERSION_V1,
    phase: "afternoon",
    sequence: 180,
    timing: { anchor: "START", offsetMinutes: 600 }, // 17:00
    defaultDurationMinutes: 15,
    minimumDurationMinutes: 5,
    optional: false,
    allowedVariants: ['voice-note', 'mini-date', 'curiosity'],
    publicationStatus: "active"
  },
  
  // EVENING
  {
    activityKey: "act_of_kindness",
    catalogVersion: CATALOG_VERSION_V1,
    phase: "evening",
    sequence: 190,
    timing: { anchor: "START", offsetMinutes: 630 }, // 17:30
    defaultDurationMinutes: 15,
    minimumDurationMinutes: 5,
    optional: false,
    allowedVariants: ['sticky-note', 'gratitude', 'make-day'],
    publicationStatus: "active"
  },
  {
    activityKey: "dinner",
    catalogVersion: CATALOG_VERSION_V1,
    phase: "evening",
    sequence: 200,
    timing: { anchor: "START", offsetMinutes: 660 }, // 18:00
    defaultDurationMinutes: 60,
    minimumDurationMinutes: 30,
    optional: false,
    publicationStatus: "active"
  },
  {
    activityKey: "vision_board",
    catalogVersion: CATALOG_VERSION_V1,
    phase: "evening",
    sequence: 210,
    timing: { anchor: "START", offsetMinutes: 720 }, // 19:00
    defaultDurationMinutes: 60,
    minimumDurationMinutes: 30,
    optional: false,
    publicationStatus: "active"
  },

  // ANCHORED TO BEDTIME (Bedtime is conceptually 22:00 in the UI example)
  {
    activityKey: "night_supplements",
    catalogVersion: CATALOG_VERSION_V1,
    phase: "evening",
    sequence: 220,
    timing: { anchor: "BEDTIME", offsetMinutes: -75 }, // 20:45
    defaultDurationMinutes: 5,
    minimumDurationMinutes: 1,
    optional: true,
    publicationStatus: "withheld"
  },
  {
    activityKey: "evening_movement",
    catalogVersion: CATALOG_VERSION_V1,
    phase: "evening",
    sequence: 230,
    timing: { anchor: "BEDTIME", offsetMinutes: -60 }, // 21:00
    defaultDurationMinutes: 15,
    minimumDurationMinutes: 10,
    optional: false,
    publicationStatus: "active"
  },
  {
    activityKey: "evening_journal",
    catalogVersion: CATALOG_VERSION_V1,
    phase: "evening",
    sequence: 240,
    timing: { anchor: "BEDTIME", offsetMinutes: -45 }, // 21:15
    defaultDurationMinutes: 15,
    minimumDurationMinutes: 10,
    optional: false,
    publicationStatus: "active"
  },
  {
    activityKey: "wind_down",
    catalogVersion: CATALOG_VERSION_V1,
    phase: "evening",
    sequence: 250,
    timing: { anchor: "BEDTIME", offsetMinutes: -30 }, // 21:30
    defaultDurationMinutes: 30,
    minimumDurationMinutes: 15,
    optional: false,
    publicationStatus: "active"
  },

  // NEXT MORNING
  {
    activityKey: "next_morning_checkin",
    catalogVersion: CATALOG_VERSION_V1,
    phase: "next_morning",
    sequence: 260,
    timing: { anchor: "NEXT_MORNING", offsetMinutes: 0 },
    defaultDurationMinutes: 15,
    minimumDurationMinutes: 5,
    optional: false,
    publicationStatus: "active"
  }
];
