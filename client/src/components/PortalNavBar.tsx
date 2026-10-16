import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Sunrise,
  Sun,
  Moon,
  Sparkles,
  CheckCircle2,
  LayoutDashboard,
  Calendar,
  Play,
  Loader2,
} from "lucide-react";
import { useCurrentReset, useCreateReset, useStartReset, type ResetItem } from "@/lib/reset-api";
import { loadQuizProfile } from "@/lib/quiz-profile";
import { toast } from "@/hooks/use-toast";

export function getDefaultPhaseItems(
  phase: "morning" | "midday" | "afternoon_evening"
): ResetItem[] {
  const baseMorning = new Date();
  baseMorning.setHours(7, 0, 0, 0);
  const nowIso = new Date().toISOString();
  const makeItem = (
    id: number,
    activityKey: string,
    itemPhase: "morning" | "midday" | "afternoon" | "evening",
    sequence: number,
    offsetMins: number,
    durationMinutes: number
  ): ResetItem => {
    const t = new Date(baseMorning.getTime() + offsetMins * 60 * 1000).toISOString();
    return {
      id,
      resetRunId: 0,
      activityKey,
      variantKey: null,
      phase: itemPhase,
      sequence,
      originalScheduledAt: t,
      scheduledAt: t,
      durationMinutes,
      status: "scheduled",
      completedAt: null,
      skippedAt: null,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
  };

  if (phase === "morning") {
    return [
      makeItem(-1, "wake_up", "morning", 10, 0, 10),
      makeItem(-2, "hydration", "morning", 20, 10, 10),
      makeItem(-3, "light_movement", "morning", 30, 20, 10),
      makeItem(-4, "grounding_walk", "morning", 40, 30, 30),
      makeItem(-5, "morning_journal", "morning", 50, 60, 30),
      makeItem(-6, "breakfast", "morning", 60, 90, 60),
      makeItem(-7, "integration", "morning", 80, 180, 10),
    ];
  }

  if (phase === "midday") {
    return [
      makeItem(-10, "focus_sprint", "midday", 90, 210, 90),
      makeItem(-11, "midday_movement", "midday", 100, 300, 60),
      makeItem(-12, "cold_shower", "midday", 110, 390, 5),
    ];
  }

  return [
    makeItem(-20, "lunch", "afternoon", 120, 420, 60),
    makeItem(-21, "midday_reflection", "afternoon", 140, 495, 5),
    makeItem(-22, "mirror_task", "afternoon", 150, 510, 5),
    makeItem(-23, "breathing_exercise", "afternoon", 160, 515, 5),
    makeItem(-24, "nature_exposure", "afternoon", 170, 540, 30),
    makeItem(-25, "social_connection", "afternoon", 180, 600, 15),
    makeItem(-26, "act_of_kindness", "evening", 190, 630, 15),
    makeItem(-27, "dinner", "evening", 200, 660, 60),
    makeItem(-28, "vision_board", "evening", 210, 720, 60),
    makeItem(-29, "evening_movement", "evening", 230, 840, 15),
    makeItem(-30, "evening_journal", "evening", 240, 855, 15),
    makeItem(-31, "wind_down", "evening", 250, 870, 30),
  ];
}

export default function PortalNavBar() {
  const [location] = useLocation();
  const { data: currentReset, refetch } = useCurrentReset();
  const createReset = useCreateReset();
  const startReset = useStartReset();

  const steps = [
    {
      label: "Prep & Setup",
      href: "/product/reset/welcome",
      icon: Sparkles,
    },
    {
      label: "1. Morning",
      href: "/product/reset/morning",
      icon: Sunrise,
    },
    {
      label: "2. Midday",
      href: "/product/reset/midday",
      icon: Sun,
    },
    {
      label: "3. Evening",
      href: "/product/reset/afternoon",
      altHref: "/product/reset/evening",
      icon: Moon,
    },
    {
      label: "4. Reflection & PDF",
      href: "/product/reset/reflection",
      icon: CheckCircle2,
    },
  ];

  const handleQuickStartInteractiveRun = async () => {
    try {
      if (!currentReset) {
        const quizProfile = loadQuizProfile();
        const wakeTime = quizProfile?.wakeTime || "07:00";
        const [hStr, mStr] = wakeTime.split(":");
        const wakeHour = Number.isFinite(parseInt(hStr, 10)) ? parseInt(hStr, 10) : 7;
        const wakeMin = Number.isFinite(parseInt(mStr, 10)) ? parseInt(mStr, 10) : 0;

        const start = new Date();
        start.setDate(start.getDate() + 1);
        start.setHours(wakeHour, wakeMin, 0, 0);
        const bedtime = new Date(start.getTime() + 15 * 60 * 60 * 1000);
        const nextMorning = new Date(start.getTime() + 24 * 60 * 60 * 1000);

        await createReset.mutateAsync({
          startAt: start.toISOString(),
          targetBedtimeAt: bedtime.toISOString(),
          targetNextMorningAt: nextMorning.toISOString(),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
          resetGoal:
            quizProfile?.recommendedGoal ||
            "Reclaim calm morning energy, eliminate afternoon brain fog, and get deep restorative sleep",
          foodPreference: quizProfile?.portalDietCode || quizProfile?.foodPreference || "omni",
          movementAccess: "bodyweight",
        });
      }

      await startReset.mutateAsync();
      await refetch();
      toast({
        title: "Interactive 24-Hour Reset Activated!",
        description: "Your live checkboxes and 1-Tap Delay Rescheduler (+15m/+30m) are now active.",
      });
    } catch (err: any) {
      await refetch();
      toast({
        title: "Interactive Mode Ready",
        description: err?.message || "Your reset schedule is synced.",
      });
    }
  };

  const isStarted =
    currentReset?.resetRun?.status === "active" ||
    currentReset?.resetRun?.status === "sleep" ||
    currentReset?.resetRun?.status === "next_morning" ||
    currentReset?.resetRun?.status === "completed";

  return (
    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-3 md:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <Link href="/dashboard">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full cursor-pointer shrink-0 transition-colors">
              <LayoutDashboard className="h-3.5 w-3.5" />
              Dashboard
            </span>
          </Link>

          <div className="h-4 w-px bg-gray-200 hidden sm:block" />

          {steps.map((step) => {
            const Icon = step.icon;
            const isCurrent =
              location === step.href || (step.altHref && location === step.altHref);
            return (
              <Link key={step.href} href={step.href}>
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full cursor-pointer shrink-0 transition-all ${
                    isCurrent
                      ? "bg-emerald-700 text-white shadow-sm"
                      : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-800"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {step.label}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {!isStarted && (
            <Button
              size="sm"
              onClick={handleQuickStartInteractiveRun}
              disabled={createReset.isPending || startReset.isPending}
              className="h-7 px-3 text-xs font-bold rounded-full bg-orange-500 hover:bg-orange-600 text-white"
            >
              {createReset.isPending || startReset.isPending ? (
                <>
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  Activating...
                </>
              ) : (
                <>
                  <Play className="h-3 w-3 mr-1" />
                  Activate Live Tracking
                </>
              )}
            </Button>
          )}
          <Link href="/daily-reset-tracker">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-full cursor-pointer shrink-0">
              <Calendar className="h-3 w-3" />
              7-Day &amp; 2h Kit
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
