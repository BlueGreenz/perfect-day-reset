import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  saveQuizProfile,
  type StoredQuizProfile,
} from "@/lib/quiz-profile";
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Sun,
  Zap,
  Moon,
  Flame,
  Clock,
  Smartphone,
  Utensils,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  ShieldCheck,
  Mail,
  User,
  Loader2,
  Calendar,
  Award,
  RotateCcw,
} from "lucide-react";

type EnergyBottleneck =
  | "morning_fatigue"
  | "midday_crash"
  | "evening_wired"
  | "full_burnout";
type WakeTime = "06:00" | "07:00" | "08:00" | "09:00";
type ScreenHabit =
  | "first_thing"
  | "constant_notifications"
  | "late_scrolling"
  | "moderate";
type FoodPreference = "omni" | "veg" | "keto" | "paleo" | "vegan";
type PastBlocker = "ran_late" | "too_rigid" | "quit_30_day" | "meal_prep";

interface QuizDiagnosticReport {
  archetype: {
    id: string;
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
    code: FoodPreference;
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
    wakeTime: WakeTime;
    targetBedtime: string;
    nextMorningCheckIn: string;
    recommendedGoal: string;
  };
  timelinePreview: {
    id: string;
    phaseBadge: string;
    title: string;
    timeWindow: string;
    summary: string;
    activities: {
      time: string;
      title: string;
      detail: string;
      tag: string;
    }[];
    outcome: string;
  }[];
}

const ENERGY_OPTIONS: {
  value: EnergyBottleneck;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  badge: string;
}[] = [
  {
    value: "morning_fatigue",
    title: "Heavy Morning Brain Fog & Snoozing",
    subtitle: "I wake up unrefreshed and need caffeine just to feel human.",
    icon: Sun,
    badge: "Morning Cortisol Blunting",
  },
  {
    value: "midday_crash",
    title: "The 2:00 PM Energy & Focus Cliff",
    subtitle: "I start strong, then hit a wall of afternoon fatigue and cravings.",
    icon: Zap,
    badge: "Glycemic & Dopamine Dip",
  },
  {
    value: "evening_wired",
    title: "'Tired But Wired' at Night",
    subtitle: "My body is exhausted after work, but my mind won't stop racing at bedtime.",
    icon: Moon,
    badge: "Inverted Stress Curve",
  },
  {
    value: "full_burnout",
    title: "Full-System High-Performer Burnout",
    subtitle: "I've been running on willpower for months—my tank feels completely empty.",
    icon: Flame,
    badge: "Autonomic Overload",
  },
];

const WAKE_OPTIONS: {
  value: WakeTime;
  title: string;
  subtitle: string;
  bedtimeTarget: string;
}[] = [
  {
    value: "06:00",
    title: "06:00 AM — Early Riser Anchor",
    subtitle: "Ideal for quiet mornings before the household or inbox wakes up.",
    bedtimeTarget: "Target Lights Out: 21:00",
  },
  {
    value: "07:00",
    title: "07:00 AM — Classic Circadian Rhythm",
    subtitle: "Aligned with natural sunrise cortisol activation and standard workdays.",
    bedtimeTarget: "Target Lights Out: 22:00",
  },
  {
    value: "08:00",
    title: "08:00 AM — Balanced Professional / Weekend",
    subtitle: "Great for flexible schedules or a Sunday recovery reset.",
    bedtimeTarget: "Target Lights Out: 23:00",
  },
  {
    value: "09:00",
    title: "09:00 AM — Deep Sleep Recovery Anchor",
    subtitle: "Best when catching up on sleep debt before starting your 24-hour protocol.",
    bedtimeTarget: "Target Lights Out: 00:00",
  },
];

const SCREEN_OPTIONS: {
  value: ScreenHabit;
  title: string;
  subtitle: string;
}[] = [
  {
    value: "first_thing",
    title: "Checking Email/Messages Within 5 Mins of Waking",
    subtitle: "My phone is the first thing I touch before getting out of bed.",
  },
  {
    value: "constant_notifications",
    title: "Continuous Pings & Context-Switching All Day",
    subtitle: "Slack, WhatsApp, email, and calls keep my attention fragmented.",
  },
  {
    value: "late_scrolling",
    title: "Revenge Bedtime Scrolling After 9:30 PM",
    subtitle: "I scroll or watch screens late at night because it's my only 'free time'.",
  },
  {
    value: "moderate",
    title: "Moderate Screen Use, Ready for a Full Detox",
    subtitle: "My screen habits are decent, but I want a clean 24-hour mental unplug.",
  },
];

const FOOD_OPTIONS: {
  value: FoodPreference;
  title: string;
  subtitle: string;
  badge: string;
}[] = [
  {
    value: "omni",
    title: "Omnivore Reset Track",
    subtitle: "Pasture-raised eggs, wild salmon, lean poultry, healthy fats & whole plants.",
    badge: "Most Popular",
  },
  {
    value: "veg",
    title: "Vegetarian Track",
    subtitle: "Plant-rich anti-inflammatory meals with eggs, Greek yogurt & halloumi.",
    badge: "Gut-Brain Calm",
  },
  {
    value: "keto",
    title: "Keto / Low-Carb Track",
    subtitle: "Ultra-low glycemic, high healthy fats & clean protein for steady ketones.",
    badge: "Zero Glucose Spikes",
  },
  {
    value: "paleo",
    title: "Paleo / Ancestral Track",
    subtitle: "100% grain-free and dairy-free whole foods to eliminate systemic bloat.",
    badge: "Grain & Dairy Free",
  },
  {
    value: "vegan",
    title: "100% Plant-Based Vegan Track",
    subtitle: "Clean legumes, chia/hemp proteins, tahini greens & energizing stir-fries.",
    badge: "100% Plant-Based",
  },
];

const BLOCKER_OPTIONS: {
  value: PastBlocker;
  title: string;
  subtitle: string;
  solutionPreview: string;
}[] = [
  {
    value: "ran_late",
    title: "I Ran 15–30 Mins Late & Felt Like I 'Ruined' the Day",
    subtitle: "One unexpected call or late morning threw off the entire rigid schedule.",
    solutionPreview: "Solved by our 1-Tap Delay Rescheduler",
  },
  {
    value: "quit_30_day",
    title: "30-Day Challenges Felt Like a Second Full-Time Job",
    subtitle: "I started strong on Day 1, got overwhelmed by Day 4, and quit.",
    solutionPreview: "Solved by our 24-Hour Complete Sprint",
  },
  {
    value: "too_rigid",
    title: "Protocols Were Too Extreme or Unrealistic",
    subtitle: "4:30 AM ice baths and 2-hour workouts don't fit my real life.",
    solutionPreview: "Solved by Adaptive Wake & Movement Options",
  },
  {
    value: "meal_prep",
    title: "Complicated Meal Prep & Confusing Grocery Lists",
    subtitle: "I didn't have time to cook 20-ingredient recipes on a busy week.",
    solutionPreview: "Solved by 15-Min Meals & 1-Click Grocery List",
  },
];

export default function Quiz() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Steps 1..5 = questions, Step 6 = lead capture gate, Step 7 = results view
  const [step, setStep] = useState<number>(1);
  const [energyBottleneck, setEnergyBottleneck] =
    useState<EnergyBottleneck>("evening_wired");
  const [wakeTime, setWakeTime] = useState<WakeTime>("07:00");
  const [screenHabit, setScreenHabit] = useState<ScreenHabit>("first_thing");
  const [foodPreference, setFoodPreference] = useState<FoodPreference>("omni");
  const [pastBlocker, setPastBlocker] = useState<PastBlocker>("ran_late");

  const [firstName, setFirstName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [report, setReport] = useState<QuizDiagnosticReport | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const diagnoseMutation = useMutation({
    mutationFn: async (payload: {
      energyBottleneck: EnergyBottleneck;
      wakeTime: WakeTime;
      screenHabit: ScreenHabit;
      foodPreference: FoodPreference;
      pastBlocker: PastBlocker;
      email?: string;
      firstName?: string;
    }) => {
      const res = await apiRequest("POST", "/api/quiz/diagnose", payload);
      return (await res.json()) as {
        report: QuizDiagnosticReport;
        leadCaptured: boolean;
      };
    },
    onSuccess: (data, variables) => {
      setReport(data.report);
      const profileToSave: StoredQuizProfile = {
        energyBottleneck: variables.energyBottleneck,
        wakeTime: variables.wakeTime,
        screenHabit: variables.screenHabit,
        foodPreference: variables.foodPreference,
        portalDietCode: data.report.nutritionTrack.portalDietCode,
        dietLabel: data.report.nutritionTrack.label,
        pastBlocker: variables.pastBlocker,
        archetypeName: data.report.archetype.name,
        severityScore: data.report.severityScore,
        recommendedGoal: data.report.scheduleMeta.recommendedGoal,
        email: variables.email?.trim() || undefined,
        firstName: variables.firstName?.trim() || undefined,
        savedAt: new Date().toISOString(),
      };
      saveQuizProfile(profileToSave);
      setStep(7);
      if (data.leadCaptured) {
        toast({
          title: "Diagnostic Unlocked & Saved!",
          description: "Your personalized 24-hour reset blueprint is ready below.",
        });
      }
    },
    onError: () => {
      toast({
        title: "Could not generate diagnostic",
        description: "Please check your inputs and try again.",
        variant: "destructive",
      });
    },
  });

  const handleSelectAndAdvance = <T,>(setter: (val: T) => void, val: T, nextStep: number) => {
    setter(val);
    setStep(nextStep);
  };

  const handleRevealWithEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      toast({
        title: "Please enter a valid email",
        description:
          "Enter your email to receive your protocol preview, or click 'Skip email & view my results now' below.",
        variant: "destructive",
      });
      return;
    }
    diagnoseMutation.mutate({
      energyBottleneck,
      wakeTime,
      screenHabit,
      foodPreference,
      pastBlocker,
      email: trimmedEmail,
      firstName: firstName.trim() || undefined,
    });
  };

  const handleSkipEmailAndReveal = () => {
    diagnoseMutation.mutate({
      energyBottleneck,
      wakeTime,
      screenHabit,
      foodPreference,
      pastBlocker,
      firstName: firstName.trim() || undefined,
    });
  };

  const handleUnlockCheckout = () => {
    if (report) {
      saveQuizProfile({
        energyBottleneck,
        wakeTime,
        screenHabit,
        foodPreference,
        portalDietCode: report.nutritionTrack.portalDietCode,
        dietLabel: report.nutritionTrack.label,
        pastBlocker,
        archetypeName: report.archetype.name,
        severityScore: report.severityScore,
        recommendedGoal: report.scheduleMeta.recommendedGoal,
        email: email.trim() || undefined,
        firstName: firstName.trim() || undefined,
        savedAt: new Date().toISOString(),
      });
    }
    setLocation("/checkout");
  };

  const progressPercentage = Math.min(100, Math.round((Math.min(step, 5) / 5) * 100));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/40 to-purple-50/40 flex flex-col">
      <SEOHead
        title="Free 60-Second Burnout & Reset Diagnostic Quiz | Perfect Day Reset"
        description="Discover your Overwhelm Archetype, #1 physiological energy bottleneck, and get a custom hour-by-hour 24-Hour Reset schedule calibrated to your wake time and nutrition track."
        canonical="https://perfectdayreset.com/quiz"
        ogTitle="Free 60-Second Burnout & Reset Diagnostic Quiz"
        ogDescription="Find out why your energy crashes and preview your custom 24-hour reset schedule in 60 seconds."
        ogImage="https://perfectdayreset.com/og-image.png"
        twitterTitle="60-Second Reset Diagnostic Quiz – Perfect Day Reset"
        twitterDescription="Discover your Overwhelm Archetype and preview your personalized 24-hour protocol."
      />
      <NavBar />

      <main className="flex-1 pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Quiz Steps 1 to 5 */}
          {step >= 1 && step <= 5 && (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <span className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3">
                  <Sparkles className="h-3.5 w-3.5" />
                  Free 60-Second Clinical &amp; Performance Diagnostic
                </span>
                <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">
                  Build Your Custom 24-Hour Reset Blueprint
                </h1>
              </div>

              {/* Progress Bar */}
              <div className="mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  <span>
                    Question {step} of 5
                  </span>
                  <span className="text-orange-600">{progressPercentage}% Complete</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-pink-500 transition-all duration-300 rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Step 1: Energy Bottleneck */}
              {step === 1 && (
                <Card className="border-2 border-gray-100 shadow-xl rounded-2xl">
                  <CardContent className="p-6 sm:p-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                      1. Where does your energy or focus break down most right now?
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base mb-6">
                      Select the primary symptom you want your 24-Hour Reset to fix first:
                    </p>
                    <div className="space-y-3.5">
                      {ENERGY_OPTIONS.map((opt) => {
                        const Icon = opt.icon;
                        const isSelected = energyBottleneck === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() =>
                              handleSelectAndAdvance(setEnergyBottleneck, opt.value, 2)
                            }
                            className={`w-full text-left p-4 sm:p-5 rounded-xl border-2 transition-all flex items-start gap-4 ${
                              isSelected
                                ? "border-orange-500 bg-orange-50/70 shadow-sm"
                                : "border-gray-200 hover:border-orange-300 bg-white"
                            }`}
                          >
                            <div className="p-3 rounded-xl bg-orange-100 text-orange-600 flex-shrink-0 mt-0.5">
                              <Icon className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                                <span className="font-bold text-gray-900 text-base sm:text-lg">
                                  {opt.title}
                                </span>
                                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                                  {opt.badge}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">{opt.subtitle}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Wake Time */}
              {step === 2 && (
                <Card className="border-2 border-gray-100 shadow-xl rounded-2xl">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-center gap-2 text-orange-600 text-xs font-bold uppercase tracking-wider mb-2">
                      <Clock className="h-4 w-4" />
                      Circadian Anchor Calibration
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                      2. What time do you want to wake up on your Reset Day?
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base mb-6">
                      We'll dynamically shift every meal, focus block, and wind-down window around your chosen wake anchor:
                    </p>
                    <div className="space-y-3.5">
                      {WAKE_OPTIONS.map((opt) => {
                        const isSelected = wakeTime === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() =>
                              handleSelectAndAdvance(setWakeTime, opt.value, 3)
                            }
                            className={`w-full text-left p-4 sm:p-5 rounded-xl border-2 transition-all flex items-start gap-4 ${
                              isSelected
                                ? "border-orange-500 bg-orange-50/70 shadow-sm"
                                : "border-gray-200 hover:border-orange-300 bg-white"
                            }`}
                          >
                            <div className="px-3 py-2 rounded-xl bg-slate-900 text-white font-mono font-bold text-sm flex-shrink-0 mt-0.5">
                              {opt.value}
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                                <span className="font-bold text-gray-900 text-base sm:text-lg">
                                  {opt.title}
                                </span>
                                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                                  {opt.bedtimeTarget}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">{opt.subtitle}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-6 flex justify-between">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setStep(1)}
                        className="text-gray-600"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Screen Habit */}
              {step === 3 && (
                <Card className="border-2 border-gray-100 shadow-xl rounded-2xl">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-center gap-2 text-purple-600 text-xs font-bold uppercase tracking-wider mb-2">
                      <Smartphone className="h-4 w-4" />
                      Dopamine &amp; Screen Boundary
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                      3. Which digital habit drains your mental clarity the most?
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base mb-6">
                      This customizes the Digital Detox boundary inside your 24-Hour Reset:
                    </p>
                    <div className="space-y-3.5">
                      {SCREEN_OPTIONS.map((opt) => {
                        const isSelected = screenHabit === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() =>
                              handleSelectAndAdvance(setScreenHabit, opt.value, 4)
                            }
                            className={`w-full text-left p-4 sm:p-5 rounded-xl border-2 transition-all flex items-start gap-4 ${
                              isSelected
                                ? "border-orange-500 bg-orange-50/70 shadow-sm"
                                : "border-gray-200 hover:border-orange-300 bg-white"
                            }`}
                          >
                            <div className="p-3 rounded-xl bg-purple-100 text-purple-600 flex-shrink-0 mt-0.5">
                              <Smartphone className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="font-bold text-gray-900 text-base sm:text-lg mb-1">
                                {opt.title}
                              </div>
                              <p className="text-sm text-gray-600">{opt.subtitle}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-6 flex justify-between">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setStep(2)}
                        className="text-gray-600"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 4: Food Preference */}
              {step === 4 && (
                <Card className="border-2 border-gray-100 shadow-xl rounded-2xl">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-2">
                      <Utensils className="h-4 w-4" />
                      Metabolic Nutrition Track
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                      4. Which of our 5 Nutrition Modes fits your body best?
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base mb-6">
                      We'll pre-load your breakfast, lunch, dinner, and 1-click grocery list to match:
                    </p>
                    <div className="space-y-3">
                      {FOOD_OPTIONS.map((opt) => {
                        const isSelected = foodPreference === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() =>
                              handleSelectAndAdvance(setFoodPreference, opt.value, 5)
                            }
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-4 ${
                              isSelected
                                ? "border-orange-500 bg-orange-50/70 shadow-sm"
                                : "border-gray-200 hover:border-orange-300 bg-white"
                            }`}
                          >
                            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 flex-shrink-0 mt-0.5">
                              <Utensils className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-0.5">
                                <span className="font-bold text-gray-900 text-base">
                                  {opt.title}
                                </span>
                                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                                  {opt.badge}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">{opt.subtitle}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-6 flex justify-between">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setStep(3)}
                        className="text-gray-600"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 5: Past Blocker */}
              {step === 5 && (
                <Card className="border-2 border-gray-100 shadow-xl rounded-2xl">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-2">
                      <RefreshCw className="h-4 w-4" />
                      Failure-Proofing Your Reset
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                      5. What usually derailed your wellness routines or challenges in the past?
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base mb-6">
                      Be honest—we configure your Reset companion specifically to eliminate this friction point:
                    </p>
                    <div className="space-y-3.5">
                      {BLOCKER_OPTIONS.map((opt) => {
                        const isSelected = pastBlocker === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() =>
                              handleSelectAndAdvance(setPastBlocker, opt.value, 6)
                            }
                            className={`w-full text-left p-4 sm:p-5 rounded-xl border-2 transition-all flex items-start gap-4 ${
                              isSelected
                                ? "border-orange-500 bg-orange-50/70 shadow-sm"
                                : "border-gray-200 hover:border-orange-300 bg-white"
                            }`}
                          >
                            <div className="p-3 rounded-xl bg-blue-100 text-blue-600 flex-shrink-0 mt-0.5">
                              <RefreshCw className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                                <span className="font-bold text-gray-900 text-base">
                                  {opt.title}
                                </span>
                                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
                                  {opt.solutionPreview}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">{opt.subtitle}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-6 flex justify-between">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setStep(4)}
                        className="text-gray-600"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Step 6: Lead Capture Gate */}
          {step === 6 && (
            <div className="max-w-xl mx-auto">
              <Card className="border-2 border-orange-200 shadow-2xl rounded-3xl overflow-hidden bg-white">
                <div className="bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 text-white p-6 sm:p-8 text-center">
                  <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full mb-3">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Analysis 100% Complete
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold leading-snug">
                    Your 24-Hour Reset Diagnostic Is Ready — Where Should We Send Your Custom Protocol Preview?
                  </h1>
                  <p className="text-gray-300 text-sm sm:text-base mt-2">
                    We've mapped your Overwhelm Archetype, Severity Score, and a custom{" "}
                    <strong>{wakeTime}</strong> hour-by-hour reset timeline.
                  </p>
                </div>

                <CardContent className="p-6 sm:p-8">
                  <form onSubmit={handleRevealWithEmail} className="space-y-4">
                    <div>
                      <Label htmlFor="quiz-first-name" className="text-gray-700 font-medium">
                        First Name <span className="text-gray-400 font-normal">(Optional)</span>
                      </Label>
                      <div className="relative mt-1">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="quiz-first-name"
                          type="text"
                          placeholder="e.g., Alex"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="pl-10 py-5 rounded-xl"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="quiz-email" className="text-gray-700 font-medium">
                        Best Email Address
                      </Label>
                      <div className="relative mt-1">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="quiz-email"
                          type="email"
                          autoComplete="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 py-5 rounded-xl"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1.5">
                        We'll also pre-fill your checkout &amp; send you the Free Morning Cortisol &amp; Hydration Checklist.
                      </p>
                    </div>

                    <Button
                      type="submit"
                      disabled={diagnoseMutation.isPending}
                      className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white py-6 text-base sm:text-lg font-bold rounded-xl shadow-lg"
                    >
                      {diagnoseMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Generating Your Custom Schedule...
                        </>
                      ) : (
                        <>
                          Reveal My Reset Diagnostic &amp; Custom Schedule
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </form>

                  <div className="mt-5 text-center border-t border-gray-100 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(5)}
                      disabled={diagnoseMutation.isPending}
                      className="text-xs text-gray-500 hover:text-gray-700 inline-flex items-center"
                    >
                      <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Edit my answers
                    </button>

                    <button
                      type="button"
                      onClick={handleSkipEmailAndReveal}
                      disabled={diagnoseMutation.isPending}
                      className="text-xs sm:text-sm text-gray-500 hover:text-gray-800 underline underline-offset-4 font-medium"
                    >
                      Skip email &amp; view my results now
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 7: Diagnostic Results View */}
          {step === 7 && report && (
            <div className="space-y-10">
              {/* Top Diagnostic Header Card */}
              <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-700">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                  <span className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full">
                    <Sparkles className="h-3.5 w-3.5" />
                    Overwhelm Archetype Diagnostic
                  </span>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                    <span className="bg-white/10 px-3 py-1 rounded-full">
                      Wake Anchor: <strong>{report.scheduleMeta.wakeTime}</strong>
                    </span>
                    <span className="bg-white/10 px-3 py-1 rounded-full">
                      Diet: <strong>{report.nutritionTrack.label}</strong>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-8">
                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2 text-white">
                      {report.archetype.name}
                    </h1>
                    <p className="text-amber-300 font-semibold text-base sm:text-lg mb-4">
                      {report.archetype.tagline}
                    </p>
                    <p className="text-gray-300 leading-relaxed text-sm sm:text-base mb-6">
                      {report.archetype.summary}
                    </p>

                    {/* Personalized Executive Coaching Insight */}
                    <div className="bg-white/10 border border-white/15 rounded-2xl p-5">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300 mb-2">
                        <Award className="h-4 w-4" />
                        Personalized Coaching Diagnosis • Reiko Kevvai
                      </div>
                      <p className="text-white/95 italic text-sm sm:text-base leading-relaxed">
                        "{report.coachingInsight}"
                      </p>
                    </div>
                  </div>

                  {/* Severity Score Meter */}
                  <div className="lg:col-span-4 bg-white/5 border border-white/15 rounded-2xl p-6 text-center">
                    <div className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                      Overwhelm Severity Score
                    </div>
                    <div className="text-5xl sm:text-6xl font-extrabold text-amber-400 mb-1">
                      {report.severityScore}
                      <span className="text-2xl text-gray-400 font-normal">/100</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-200 bg-amber-500/20 px-3 py-1 rounded-full mb-4">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      {report.severityLabel}
                    </div>
                    <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden mb-3">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 rounded-full"
                        style={{ width: `${report.severityScore}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-300 mb-5">
                      Good news: A score of {report.severityScore}/100 responds rapidly to a single 24-hour circadian &amp; nervous system reset.
                    </p>
                    <Button
                      onClick={handleUnlockCheckout}
                      className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold py-5 rounded-xl shadow-lg"
                    >
                      Unlock My 24-Hour Reset — $19
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* #1 Physiological Bottleneck & Why Past Routines Failed */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border border-gray-200 shadow-md rounded-2xl bg-white">
                  <CardContent className="p-6 sm:p-8">
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full mb-3">
                      <Flame className="h-3.5 w-3.5" />
                      #1 Physiological Bottleneck
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                      {report.primaryBottleneck.title}
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                      {report.primaryBottleneck.mechanism}
                    </p>
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-900">
                      <strong className="block mb-1 text-emerald-800">
                        How Your 24-Hour Reset Fixes This:
                      </strong>
                      {report.primaryBottleneck.fixIn24Hours}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 shadow-md rounded-2xl bg-white">
                  <CardContent className="p-6 sm:p-8">
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-3">
                      <RefreshCw className="h-3.5 w-3.5" />
                      Why Past Routines Failed You
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                      {report.pastBlockerSolution.featureHighlight}
                    </h2>
                    <p className="text-xs font-medium text-gray-500 mb-3">
                      Your past blocker: "{report.pastBlockerSolution.blockerLabel}"
                    </p>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                      {report.pastBlockerSolution.whyPastFailed}
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-900">
                      <strong className="block mb-1 text-blue-800">
                        Built Into Your Interactive Web Companion:
                      </strong>
                      {report.pastBlockerSolution.howResetSolvesIt}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Custom 24-Hour Timeline Preview Shifted to Wake Time & Nutrition Track */}
              <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-orange-200/80">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 mb-8 border-b border-gray-100">
                  <div>
                    <span className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2">
                      <Calendar className="h-3.5 w-3.5" />
                      Custom Schedule Preview • Shifted to {report.scheduleMeta.wakeTime} Wake Time
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                      Your Personalized 24-Hour Reset Timeline ({report.nutritionTrack.label})
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base mt-1">
                      When you unlock the portal for $19, this exact schedule and your{" "}
                      <strong>{report.nutritionTrack.label}</strong> recipes are pre-configured and ready to start.
                    </p>
                  </div>
                  <Button
                    onClick={handleUnlockCheckout}
                    className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-full px-7 py-6 font-bold shadow-lg flex-shrink-0"
                  >
                    Unlock My Personalized 24-Hour Reset — $19
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>

                <div className="space-y-8">
                  {report.timelinePreview.map((block) => (
                    <div
                      key={block.id}
                      className="rounded-2xl border border-gray-200 bg-gray-50/60 p-5 sm:p-7"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-900 text-white">
                          {block.phaseBadge}
                        </span>
                        <span className="text-xs font-semibold text-orange-700 bg-orange-100 px-3 py-1 rounded-full">
                          {block.timeWindow}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {block.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-5">{block.summary}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-4">
                        {block.activities.map((act, idx) => (
                          <div
                            key={idx}
                            className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-start gap-3.5"
                          >
                            <div className="bg-orange-50 border border-orange-200 text-orange-800 font-mono text-xs font-bold px-2.5 py-1.5 rounded-lg flex-shrink-0 mt-0.5">
                              {act.time}
                            </div>
                            <div>
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <h4 className="font-bold text-gray-900 text-sm sm:text-base">
                                  {act.title}
                                </h4>
                                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                                  {act.tag}
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                {act.detail}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="bg-emerald-50/90 border border-emerald-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-emerald-900 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                        <span>
                          <strong>Block Outcome:</strong> {block.outcome}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Final Conversion Card inside Results */}
                <div className="mt-10 bg-gradient-to-r from-orange-500 to-pink-600 rounded-2xl p-6 sm:p-10 text-white text-center shadow-xl">
                  <h3 className="text-2xl sm:text-3xl font-bold mb-3">
                    Ready to Run Your {report.scheduleMeta.wakeTime} {report.nutritionTrack.label} Reset?
                  </h3>
                  <p className="text-white/90 max-w-2xl mx-auto mb-6 text-sm sm:text-base">
                    Your quiz profile is saved. When you unlock the Perfect Day Reset for $19, your Interactive Web Companion Portal will automatically load your{" "}
                    <strong>{report.scheduleMeta.wakeTime}</strong> wake schedule and{" "}
                    <strong>{report.nutritionTrack.label}</strong> meal plan—plus the full Printable PDF Guide.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button
                      size="lg"
                      onClick={handleUnlockCheckout}
                      className="w-full sm:w-auto bg-white text-gray-900 hover:bg-gray-100 px-8 py-6 text-base sm:text-lg font-bold rounded-full shadow-2xl"
                    >
                      Unlock My Personalized 24-Hour Reset — $19
                      <ArrowRight className="ml-2 h-5 w-5 text-orange-600" />
                    </Button>
                    <button
                      type="button"
                      onClick={() => {
                        setReport(null);
                        setStep(1);
                      }}
                      className="inline-flex items-center text-sm text-white/90 hover:text-white underline underline-offset-4"
                    >
                      <RotateCcw className="h-4 w-4 mr-1.5" />
                      Retake diagnostic with different answers
                    </button>
                  </div>
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-5 text-xs text-white/90">
                    <span className="inline-flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4" /> 30-Day Money-Back Guarantee
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <RefreshCw className="h-4 w-4" /> Live 1-Tap Delay Rescheduler
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4" /> $1 Donated to Children's Programs
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
