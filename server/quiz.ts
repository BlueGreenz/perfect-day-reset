import { z } from "zod";

export const quizSubmissionSchema = z.object({
  energyBottleneck: z.enum([
    "morning_fatigue",
    "midday_crash",
    "evening_wired",
    "full_burnout",
  ]),
  wakeTime: z.enum(["06:00", "07:00", "08:00", "09:00"]),
  screenHabit: z.enum([
    "first_thing",
    "constant_notifications",
    "late_scrolling",
    "moderate",
  ]),
  foodPreference: z.enum(["omni", "veg", "keto", "paleo", "vegan"]),
  pastBlocker: z.enum(["ran_late", "too_rigid", "quit_30_day", "meal_prep"]),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  firstName: z.string().trim().max(80).optional(),
});

export type QuizSubmissionInput = z.infer<typeof quizSubmissionSchema>;

export type OverwhelmArchetypeId =
  | "cortisol_spiked"
  | "dopamine_depleted"
  | "metabolic_crasher"
  | "systemic_burnout";

export interface TimelinePreviewActivity {
  time: string;
  title: string;
  detail: string;
  tag: string;
}

export interface TimelinePreviewBlock {
  id: string;
  phaseBadge: string;
  title: string;
  timeWindow: string;
  summary: string;
  activities: TimelinePreviewActivity[];
  outcome: string;
}

export interface QuizDiagnosticReport {
  archetype: {
    id: OverwhelmArchetypeId;
    name: string;
    tagline: string;
    summary: string;
  };
  severityScore: number;
  severityLabel: string;
  primaryBottleneck: {
    title: string;
    mechanism: string;
    fixIn24Hours: string;
  };
  pastBlockerSolution: {
    blockerLabel: string;
    whyPastFailed: string;
    howResetSolvesIt: string;
    featureHighlight: string;
  };
  coachingInsight: string;
  aiGenerated: boolean;
  nutritionTrack: {
    code: QuizSubmissionInput["foodPreference"];
    portalDietCode: string;
    label: string;
    description: string;
    sampleMeals: {
      breakfast: string;
      lunch: string;
      dinner: string;
    };
  };
  scheduleMeta: {
    wakeTime: QuizSubmissionInput["wakeTime"];
    targetBedtime: string;
    nextMorningCheckIn: string;
     recommendedGoal: string;
  };
  timelinePreview: TimelinePreviewBlock[];
}

const DIET_CONFIG: Record<
  QuizSubmissionInput["foodPreference"],
  QuizDiagnosticReport["nutritionTrack"]
> = {
  omni: {
    code: "omni",
    portalDietCode: "omni",
    label: "Omnivore Reset Track",
    description:
      "Clean pasture-raised proteins, omega-3 fats, and slow-release cellular carbohydrates for steady all-day neurotransmitter support.",
    sampleMeals: {
      breakfast: "Omega Brain Bowl (2 pasture-raised eggs, ½ avocado, sautéed spinach, chia & olive oil)",
      lunch: "Grilled Wild Salmon Power Salad with pumpkin seeds, cucumber & lemon-olive oil dressing",
      dinner: "Lean Turkey & Quinoa Recovery Bowl with roasted zucchini, carrot & garlic",
    },
  },
  veg: {
    code: "veg",
    portalDietCode: "vegetarian",
    label: "Vegetarian Reset Track",
    description:
      "Plant-rich anti-inflammatory whole foods with clean eggs/cultured dairy for gut-brain axis calm and stable glucose.",
    sampleMeals: {
      breakfast: "Unsweetened Greek Yogurt, Wild Berry, Flaxseed & Walnut Cortisol-Steady Bowl",
      lunch: "Warm Lentil, Halloumi, Baby Spinach & Olive Oil Metabolic Salad",
      dinner: "Soft-Herbed Frittata with Steamed Asparagus & Quinoa",
    },
  },
  keto: {
    code: "keto",
    portalDietCode: "keto",
    label: "Keto / Low-Carb Track",
    description:
      "Ultra-low glycemic, high healthy-fat protocol engineered to eliminate insulin spikes and unlock ketone mental clarity.",
    sampleMeals: {
      breakfast: "Baked Avocado Egg Cups with extra-virgin olive oil, sea salt & chili flakes",
      lunch: "Herb-Grilled Chicken Caesar over crisp romaine with parmesan & olive oil-lemon dressing",
      dinner: "Pan-Seared Wild Salmon over velvety garlic-ghee cauliflower mash with fresh dill",
    },
  },
  paleo: {
    code: "paleo",
    portalDietCode: "gluten-free",
    label: "Paleo / Ancestral Track",
    description:
      "100% grain-free, dairy-free whole foods focused on lowering systemic inflammation and eliminating brain fog.",
    sampleMeals: {
      breakfast: "Pasture-Raised Egg & Sweet Potato Hash with avocado and wilted greens",
      lunch: "Herb-Grilled Chicken & Avocado Salad with cucumber, olive oil, and toasted walnuts",
      dinner: "Garlic-Seared Shrimp or Grass-Fed Beef over spiralized zucchini noodles & bell peppers",
    },
  },
  vegan: {
    code: "vegan",
    portalDietCode: "vegan",
    label: "100% Plant-Based Vegan Track",
    description:
      "Nutrient-dense legumes, seeds, and phytonutrient greens designed for clean digestion and cellular hydration.",
    sampleMeals: {
      breakfast: "Warm Chia, Hemp Seed & Almond Butter Protein Pudding with low-glycemic berries",
      lunch: "Crispy Chickpea, Quinoa, Tahini & Massaged Kale Power Bowl",
      dinner: "Tamari-Ginger Tofu & Zucchini Noodle Stir-Fry with toasted sesame oil",
    },
  },
};

function formatTimeFromWake(wakeTime: string, offsetMinutes: number): string {
  const [hStr, mStr] = wakeTime.split(":");
  const baseMinutes = parseInt(hStr, 10) * 60 + parseInt(mStr, 10);
  const total = ((baseMinutes + offsetMinutes) % 1440 + 1440) % 1440;
  const hh = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const mm = (total % 60).toString().padStart(2, "0");
  return `${hh}:${mm}`;
}

function determineArchetypeAndBottleneck(input: QuizSubmissionInput): {
  archetype: QuizDiagnosticReport["archetype"];
  severityScore: number;
  severityLabel: string;
  primaryBottleneck: QuizDiagnosticReport["primaryBottleneck"];
  recommendedGoal: string;
} {
  let score = 70;

  if (input.energyBottleneck === "full_burnout") score += 14;
  else if (input.energyBottleneck === "evening_wired") score += 10;
  else if (input.energyBottleneck === "morning_fatigue") score += 9;
  else if (input.energyBottleneck === "midday_crash") score += 8;

  if (input.screenHabit === "first_thing") score += 5;
  else if (input.screenHabit === "constant_notifications") score += 5;
  else if (input.screenHabit === "late_scrolling") score += 6;
  else score += 2;

  if (input.pastBlocker === "quit_30_day") score += 2;
  else if (input.pastBlocker === "ran_late") score += 2;
  else score += 1;

  const severityScore = Math.min(92, Math.max(68, score));
  const severityLabel =
    severityScore >= 85
      ? "Acute Nervous System & Circadian Strain"
      : severityScore >= 77
      ? "Elevated Cortisol & Cognitive Load"
      : "Moderate Rhythm Misalignment";

  // Map to 1 of 4 Overwhelm Archetypes
  if (input.energyBottleneck === "full_burnout") {
    return {
      archetype: {
        id: "systemic_burnout",
        name: "Systemic Burnout Recovery",
        tagline: "High-Output Nervous System Running on Empty Reserves",
        summary:
          "You've been overriding fatigue signals with sheer willpower and caffeine. Your autonomic nervous system is stuck in low-grade sympathetic ('fight-or-flight') overdrive, flattening your natural energy curve from morning to night.",
      },
      severityScore,
      severityLabel,
      primaryBottleneck: {
        title: "HPA-Axis & Autonomic Exhaustion",
        mechanism:
          "When high performers push through chronic stress without a structured down-regulation window, morning cortisol blunts (causing heavy waking fatigue) while evening adrenaline remains elevated (preventing deep restorative sleep).",
        fixIn24Hours:
          "By combining a morning light + mineral hydration anchor, anti-inflammatory whole-food fuel, and an evening 5-prompt cognitive unload journal, you signal safety to your nervous system and restore deep sleep architecture in a single day.",
      },
      recommendedGoal: "Full nervous system decompression, deep restorative sleep, and clean mental clarity",
    };
  }

  if (
    input.energyBottleneck === "evening_wired" ||
    (input.energyBottleneck === "morning_fatigue" && input.screenHabit === "late_scrolling")
  ) {
    return {
      archetype: {
        id: "cortisol_spiked",
        name: "Cortisol-Spiked High Performer",
        tagline: "Inverted Stress Curve: Sluggish Mornings, Racing Mind at Night",
        summary:
          "Your circadian cortisol rhythm is inverted. Late-day cognitive stimulation and screen exposure keep your brain in problem-solving mode past 9 PM, robbing you of deep slow-wave recovery and leaving you groggy at wake-up.",
      },
      severityScore,
      severityLabel,
      primaryBottleneck: {
        title: "Inverted Cortisol-Melatonin Rhythm",
        mechanism:
          "Blue light and cognitive loops in the evening suppress pineal melatonin release by up to 60%, delaying your circadian phase so your brain feels 'tired but wired' at bedtime and starved of natural alertness in the morning.",
        fixIn24Hours:
          "We re-anchor your master circadian clock at wake-up with 10 minutes of natural light and mineral hydration, burn off residual stress hormones during midday movement, and lock in a structured Digital Sunset + Cognitive Unload 90 minutes before sleep.",
      },
      recommendedGoal: "Resetting my inverted cortisol curve and quieting evening mental overdrive",
    };
  }

  if (
    input.screenHabit === "constant_notifications" ||
    (input.screenHabit === "first_thing" && input.energyBottleneck !== "midday_crash")
  ) {
    return {
      archetype: {
        id: "dopamine_depleted",
        name: "Dopamine-Depleted Multitasker",
        tagline: "Fragmented Attention & Reactive Decision Fatigue",
        summary:
          "Checking notifications first thing in the morning hijacks your prefrontal cortex before your feet hit the floor. Continuous context-switching drains your baseline dopamine, making deep focus feel exhausting by early afternoon.",
      },
      severityScore,
      severityLabel,
      primaryBottleneck: {
        title: "Prefrontal Dopamine Receptor Fatigue",
        mechanism:
          "Micro-hits of digital notifications create rapid dopamine spikes followed by below-baseline troughs—manifesting as brain fog, restlessness, and an inability to stay locked onto a single priority.",
        fixIn24Hours:
          "A structured morning phone-free boundary, tyrosine-rich breakfast fuel, and a timed midday contrast + breath reset restore your baseline dopamine tone within 24 hours.",
      },
      recommendedGoal: "Reclaiming laser-sharp focus and breaking reactive phone habits",
    };
  }

  return {
    archetype: {
      id: "metabolic_crasher",
      name: "Metabolic Midday Crasher",
      tagline: "Strong Morning Start Derailed by the 2:00 PM Energy Cliff",
      summary:
        "You power through your mornings on adrenaline and coffee, but mismatched meal timing, hidden glycemic swings, and intracellular dehydration trigger a sharp afternoon crash in focus and mood.",
    },
    severityScore,
    severityLabel,
    primaryBottleneck: {
      title: "Post-Prandial Glucose & Electrolyte Dip",
      mechanism:
        "Drinking caffeine before mineral hydration and eating carb-heavy or rushed lunches causes a steep insulin response followed by reactive hypoglycemia—starving your brain of steady ATP right around 2:00 PM.",
      fixIn24Hours:
        "Your 24-Hour Reset sequences electrolyte hydration before caffeine, pairs your chosen nutrition track to flatten glucose curves, and uses a 45-minute midday movement + breath protocol to keep afternoon energy steady.",
    },
    recommendedGoal: "Eliminating the 2 PM energy crash and sustaining all-day mental sharpness",
  };
}

function buildPastBlockerSolution(
  pastBlocker: QuizSubmissionInput["pastBlocker"],
  dietLabel: string
): QuizDiagnosticReport["pastBlockerSolution"] {
  switch (pastBlocker) {
    case "ran_late":
      return {
        blockerLabel: "Schedules derailed when a meeting or morning ran late",
        whyPastFailed:
          "Static PDFs and rigid timetables assume your day goes 100% according to plan. The moment you run 15 minutes behind, guilt sets in and you abandon the whole day.",
        howResetSolvesIt:
          "Your Perfect Day Reset portal includes our live 1-Tap Delay Rescheduler. Running 15, 30, or 45 minutes late? Tap once and the engine recalculates your entire remaining 24-hour schedule automatically—zero guilt.",
        featureHighlight: "Live 1-Tap Delay Rescheduler",
      };
    case "too_rigid":
      return {
        blockerLabel: "Programs felt too rigid, extreme, or unrealistic",
        whyPastFailed:
          "Biohacker routines built around 4:30 AM ice baths and 2-hour workouts aren't sustainable for real life—they add stress instead of removing it.",
        howResetSolvesIt:
          "Every block in your 24-Hour Reset adapts to your chosen wake time and gives you practical movement choices (bodyweight, outdoor walk, or gym) and real, satisfying food.",
        featureHighlight: "Adaptive Wake-Time & Movement Flexibility",
      };
    case "quit_30_day":
      return {
        blockerLabel: "Lost momentum on 30-day challenges by Day 4",
        whyPastFailed:
          "85% of people quit 30-day wellness challenges because committing to a month of restriction when you're already exhausted feels like a second full-time job.",
        howResetSolvesIt:
          "Anyone can commit to 24 intentional hours. Instead of a 30-day slog, you get a complete physiological and mental reboot in one day—and you can repeat it any weekend you choose.",
        featureHighlight: "1-Day Complete Protocol (Unlimited Repeats)",
      };
    case "meal_prep":
      return {
        blockerLabel: "Complicated meal prep & confusing nutrition rules",
        whyPastFailed:
          "Generic wellness plans force you to cook unfamiliar 20-ingredient recipes or eat foods that don't match your dietary preferences.",
        howResetSolvesIt: `Your portal is pre-configured to the ${dietLabel} with simple, 15-minute whole-food meals and a 1-click printable grocery list so there is zero guesswork.`,
        featureHighlight: `1-Click ${dietLabel} Grocery List & 15-Min Meals`,
      };
  }
}

function buildTimelinePreview(
  input: QuizSubmissionInput,
  diet: QuizDiagnosticReport["nutritionTrack"]
): TimelinePreviewBlock[] {
  const w = input.wakeTime;
  const f = (offsetMin: number) => formatTimeFromWake(w, offsetMin);

  const screenBoundaryDetail =
    input.screenHabit === "first_thing"
      ? "Put phone on charger outside bedroom so your first 45 minutes after waking are 100% notification-free."
      : input.screenHabit === "late_scrolling"
      ? "Configure your Digital Sunset alarm 90 minutes before sleep to stop evening blue-light cortisol spikes."
      : "Enable Focus Mode batches so notifications don't hijack your prefrontal dopamine during your Reset.";

  return [
    {
      id: "prep",
      phaseBadge: "Prep • Evening Before (15 mins)",
      title: "Evening-Before Zero-Friction Setup",
      timeWindow: `${f(-600)} – ${f(-585)} (Evening Before)`,
      summary: `Lock in your ${w} wake anchor, generate your 1-click ${diet.label} shopping list, and set your digital detox boundary.`,
      activities: [
        {
          time: "5 mins",
          title: `Anchor Your ${w} Wake Schedule`,
          detail: `Your interactive portal calibrates all 4 phases of tomorrow around your ${w} wake time (with 1-tap delay rescheduling ready if needed).`,
          tag: "Schedule Engine",
        },
        {
          time: "5 mins",
          title: `Select ${diet.label} & 1-Click Grocery Check`,
          detail: `Pre-load your 3 anti-crash meals (${diet.sampleMeals.breakfast.split("(")[0].trim()}, ${diet.sampleMeals.lunch.split("with")[0].trim()}, and ${diet.sampleMeals.dinner.split("with")[0].trim()}).`,
          tag: diet.label,
        },
        {
          time: "5 mins",
          title: "Set Your Custom Screen Detox Boundary",
          detail: screenBoundaryDetail,
          tag: "Digital Detox",
        },
      ],
      outcome: "Wake up at " + w + " with zero decision fatigue—every meal and hour is already mapped.",
    },
    {
      id: "morning",
      phaseBadge: `Phase 1 • ${f(0)}–${f(180)}`,
      title: "Phase 1 — Morning Activation",
      timeWindow: `${f(0)} – ${f(180)}`,
      summary:
        "Anchor your circadian cortisol peak with mineral hydration, natural morning light, gentle mobility, and an anti-crash breakfast.",
      activities: [
        {
          time: `${f(0)} – ${f(30)}`,
          title: "Mineral Hydration & Natural Light Anchor",
          detail:
            "Drink 500ml water with electrolytes/lemon and step into natural daylight for 10 minutes before touching any screen.",
          tag: "Circadian Anchor",
        },
        {
          time: `${f(30)} – ${f(75)}`,
          title: "Mindful Mobility & Nasal Breath Primer",
          detail:
            "15–20 minutes of joint awakening and rhythmic nasal breathing to clear morning stiffness and oxygenate your brain.",
          tag: "Movement",
        },
        {
          time: `${f(75)} – ${f(135)}`,
          title: `Anti-Crash Breakfast (${diet.label})`,
          detail: diet.sampleMeals.breakfast,
          tag: "Nutrition",
        },
        {
          time: `${f(135)} – ${f(180)}`,
          title: "Intention Setting & #1 Priority Lock",
          detail:
            "Complete your 3-minute morning mindset prompt inside the web companion to lock in calm, single-task focus.",
          tag: "Mindset",
        },
      ],
      outcome: "Jitter-free morning energy and razor-sharp mental clarity by " + f(180) + ".",
    },
    {
      id: "midday",
      phaseBadge: `Phase 2 • ${f(210)}–${f(495)}`,
      title: "Phase 2 — Midday Recharge",
      timeWindow: `${f(210)} – ${f(495)}`,
      summary:
        "Sustain cognitive output, fuel with a blood-sugar-stabilizing lunch, flush stress hormones with guided movement, and prevent the afternoon crash.",
      activities: [
        {
          time: `${f(210)} – ${f(330)}`,
          title: "Deep Focus Block & Hydration Checkpoint",
          detail:
            "Execute your highest-value priority or creative restorative work while hitting 50% of your calculated daily water goal.",
          tag: "Deep Focus",
        },
        {
          time: `${f(330)} – ${f(390)}`,
          title: `Metabolic Lunch (${diet.label})`,
          detail: diet.sampleMeals.lunch,
          tag: "Nutrition",
        },
        {
          time: `${f(390)} – ${f(450)}`,
          title: "Guided Outdoor Movement or Strength Flow",
          detail:
            "30–45 minute brisk outdoor walk, mobility flow, or bodyweight session to metabolize circulating cortisol.",
          tag: "Movement",
        },
        {
          time: `${f(450)} – ${f(495)}`,
          title: "Contrast Shower & 4-7-8 Breath Energy Reset",
          detail:
            "Thermal contrast rinse + guided breathwork to reboot afternoon dopamine (running late? Use 1-Tap Delay here).",
          tag: "Nervous System",
        },
      ],
      outcome: "Zero 2:00 PM brain fog—steady physical lightness and afternoon momentum.",
    },
    {
      id: "evening",
      phaseBadge: `Phase 3 • ${f(510)}–${f(870)}`,
      title: "Phase 3 — Evening Decompression & Reflection",
      timeWindow: `${f(510)} – ${f(870)}`,
      summary:
        "Shift your nervous system into parasympathetic recovery, enjoy a clean dinner, unplug at Digital Sunset, and complete your 5-prompt cognitive unload.",
      activities: [
        {
          time: `${f(510)} – ${f(660)}`,
          title: "Nervous System Down-Regulation & Nature Walk",
          detail:
            "20-minute sunset walk, mirror affirmation work, and intentional connection without work email.",
          tag: "Decompression",
        },
        {
          time: `${f(660)} – ${f(750)}`,
          title: `Nourishing Recovery Dinner (${diet.label})`,
          detail: diet.sampleMeals.dinner,
          tag: "Nutrition",
        },
        {
          time: `${f(750)} – ${f(810)}`,
          title: "Digital Sunset & Parasympathetic Wind-Down",
          detail:
            "Screens off, warm ambient lighting, magnesium/herbal tea, and gentle evening decompression.",
          tag: "Digital Sunset",
        },
        {
          time: `${f(810)} – ${f(870)}`,
          title: "5-Prompt Cognitive Unload Journal",
          detail: `Save your 5 guided evening reflections in your portal before lights out at ${f(900)} so your brain sleeps deeply.`,
          tag: "Reflection Journal",
        },
      ],
      outcome: `Deep, restorative sleep at ${f(900)} and waking up at ${w} tomorrow genuinely recharged.`,
    },
  ];
}

function buildDeterministicCoachingInsight(
  input: QuizSubmissionInput,
  archetypeName: string,
  dietLabel: string
): string {
  const greeting = input.firstName ? `${input.firstName}, your` : "Your";
  const wake = input.wakeTime;

  const blockerSentence: Record<QuizSubmissionInput["pastBlocker"], string> = {
    ran_late:
      "Because unpredictable schedules have derailed you in the past, rely on the portal's 1-Tap Delay Rescheduler so a 15-minute delay never turns into a failed day.",
    too_rigid:
      "Instead of forcing yourself into an extreme routine, your 24-hour timeline is calibrated around your natural " +
      wake +
      " wake anchor with flexible movement options.",
    quit_30_day:
      "Forget 30-day marathons—focusing all four biological levers (light, " +
      dietLabel +
      " fuel, movement, and evening cognitive unload) into a single 24-hour sprint will reset your baseline by tomorrow morning.",
    meal_prep:
      "With your " +
      dietLabel +
      " meals and 1-click grocery list already mapped out, you can execute this entire 24-hour reset with zero kitchen stress.",
  };

  return `${greeting} answers point to a classic ${archetypeName} pattern—where your energy bottleneck isn't a lack of discipline, but a misaligned circadian and nervous system rhythm starting at ${wake}. ${blockerSentence[input.pastBlocker]}`;
}

async function generateAICoachingInsight(
  input: QuizSubmissionInput,
  archetypeName: string,
  dietLabel: string,
  fallbackInsight: string
): Promise<{ insight: string; aiGenerated: boolean }> {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!geminiKey && !openaiKey) {
    return { insight: fallbackInsight, aiGenerated: false };
  }

  const prompt = `You are Reiko Kevvai (Ex Head of Sales for Inchcape Motors BMW, 35+ years in competitive sports, founder of Perfect Day Reset). Write a concise, empathetic, high-trust 2-sentence executive coaching insight for a prospective user who just completed the 60-Second Reset Diagnostic:
- Name: ${input.firstName || "High Performer"}
- Archetype: ${archetypeName}
- Primary Energy Bottleneck: ${input.energyBottleneck}
- Target Wake Time: ${input.wakeTime}
- Screen Habit: ${input.screenHabit}
- Chosen Nutrition Track: ${dietLabel}
- Past Blocker: ${input.pastBlocker}
Keep it to exactly 2 sentences (max 55 words total), no markdown bullets, addressing them directly and explaining why this 1-day adaptive protocol starting at ${input.wakeTime} will work for them.`;

  try {
    if (geminiKey) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${encodeURIComponent(
          geminiKey
        )}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              maxOutputTokens: 120,
              temperature: 0.6,
            },
          }),
          signal: AbortSignal.timeout(3500),
        }
      );

      if (response.ok) {
        const data: any = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (text && text.length > 20) {
          return { insight: text, aiGenerated: true };
        }
      }
    } else if (openaiKey) {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 120,
          temperature: 0.6,
        }),
        signal: AbortSignal.timeout(3500),
      });

      if (response.ok) {
        const data: any = await response.json();
        const text = data?.choices?.[0]?.message?.content?.trim();
        if (text && text.length > 20) {
          return { insight: text, aiGenerated: true };
        }
      }
    }
  } catch {
    // Gracefully fall back on timeout or network error
  }

  return { insight: fallbackInsight, aiGenerated: false };
}

export async function generateQuizDiagnostic(
  rawInput: QuizSubmissionInput
): Promise<QuizDiagnosticReport> {
  const diet = DIET_CONFIG[rawInput.foodPreference];
  const {
    archetype,
    severityScore,
    severityLabel,
    primaryBottleneck,
    recommendedGoal,
  } = determineArchetypeAndBottleneck(rawInput);

  const pastBlockerSolution = buildPastBlockerSolution(
    rawInput.pastBlocker,
    diet.label
  );

  const timelinePreview = buildTimelinePreview(rawInput, diet);

  const deterministicInsight = buildDeterministicCoachingInsight(
    rawInput,
    archetype.name,
    diet.label
  );

  const { insight: coachingInsight, aiGenerated } =
    await generateAICoachingInsight(
      rawInput,
      archetype.name,
      diet.label,
      deterministicInsight
    );

  const targetBedtime = formatTimeFromWake(rawInput.wakeTime, 900); // wake + 15h (e.g., 07:00 -> 22:00)

  return {
    archetype,
    severityScore,
    severityLabel,
    primaryBottleneck,
    pastBlockerSolution,
    coachingInsight,
    aiGenerated,
    nutritionTrack: diet,
    scheduleMeta: {
      wakeTime: rawInput.wakeTime,
      targetBedtime,
      nextMorningCheckIn: rawInput.wakeTime,
      recommendedGoal,
    },
    timelinePreview,
  };
}
