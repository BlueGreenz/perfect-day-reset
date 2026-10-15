import React, { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import DailyResetTracker from "@/components/DailyResetTracker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Printer,
  Download,
  Zap,
  Utensils,
  Calendar,
  Clock,
  Coffee,
  CheckCircle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Plane,
  ArrowLeft,
} from "lucide-react";
import { Link } from "wouter";

const EMERGENCY_STORAGE_KEY = "pdr_emergency_2hr_checklist_v1";

interface EmergencyStep {
  id: string;
  window: string;
  phase: string;
  title: string;
  detail: string;
  scienceNote: string;
}

const EMERGENCY_STEPS: EmergencyStep[] = [
  {
    id: "min_0_15_water",
    window: "Min 0–15",
    phase: "Phase 1: Cortisol Down-Regulation & Hydration Anchor",
    title: "Drink 500ml Mineral / Electrolyte Water Immediately",
    detail:
      "Before answering another message or pouring more coffee, drink a full glass of water with a pinch of sea salt or electrolytes.",
    scienceNote: "Even 1.5% intracellular dehydration amplifies perceived stress and brain fog.",
  },
  {
    id: "min_0_15_breath",
    window: "Min 0–15",
    phase: "Phase 1: Cortisol Down-Regulation & Hydration Anchor",
    title: "3 Minutes of Physiological Sighs (Double Inhale, Long Exhale)",
    detail:
      "Two quick nasal inhales to full lung capacity, followed by a slow, extended mouth exhale for 6–8 seconds. Repeat 12 cycles.",
    scienceNote: "Offloads carbon dioxide and mechanically triggers the vagus nerve to slow heart rate.",
  },
  {
    id: "min_15_45_triage",
    window: "Min 15–45",
    phase: "Phase 2: Single-Task Deep Triage",
    title: "Close All Open Browser Tabs & Write Your 3-Item Triage List on Paper",
    detail:
      "Put your phone in another room on Do Not Disturb. Write down the 1 task that actually moves the needle today and cross out low-leverage busywork.",
    scienceNote: "Eliminates prefrontal attention residue caused by visual tab clutter.",
  },
  {
    id: "min_15_45_sprint",
    window: "Min 15–45",
    phase: "Phase 2: Single-Task Deep Triage",
    title: "Execute One Undivided 25-Minute Monotask Sprint",
    detail:
      "Work on your #1 triage item for 25 minutes with zero Slack, email, or context switching.",
    scienceNote: "Restores endogenous dopamine tone through completion momentum.",
  },
  {
    id: "min_45_75_walk",
    window: "Min 45–75",
    phase: "Phase 3: 20-Minute Outdoor Optic Flow Walk + No-Crash Fuel",
    title: "20-Minute Brisk Outdoor Walk (No Podcasts, No Calls)",
    detail:
      "Step outside into natural daylight. Keep your gaze on the horizon rather than a screen.",
    scienceNote:
      "Panoramic optic flow directly quiets amygdala reactivity and clears circulating stress hormones.",
  },
  {
    id: "min_45_75_fuel",
    window: "Min 45–75",
    phase: "Phase 3: 20-Minute Outdoor Optic Flow Walk + No-Crash Fuel",
    title: "Protein + Healthy Fat Refuel (Zero Refined Sugar/Flour)",
    detail:
      "Eat 30g+ of clean protein with fiber and healthy fats (e.g., grilled salmon/chicken salad, eggs & avocado, or tofu/tempeh greens bowl).",
    scienceNote: "Prevents reactive hypoglycemia and the 2:30 PM insulin crash.",
  },
  {
    id: "min_75_120_boundary",
    window: "Min 75–120",
    phase: "Phase 4: Boundaries & Evening Shutdown Lock",
    title: "Send 2 Proactive Boundary Messages & Renegotiate Non-Urgent Deadlines",
    detail:
      "Clear guilt by communicating proactively: 'I'm heads-down completing X today and will follow up on Y tomorrow at 10 AM.'",
    scienceNote: "Closes open cognitive loops that otherwise cause evening rumination.",
  },
  {
    id: "min_75_120_sunset",
    window: "Min 75–120",
    phase: "Phase 4: Boundaries & Evening Shutdown Lock",
    title: "Lock In Your Hard Workday Cutoff & Tonight's Digital Sunset",
    detail:
      "Set an alarm for your workday shutdown and commit to turning off screens 60–90 minutes before sleep tonight.",
    scienceNote: "Protects tonight's slow-wave and REM sleep architecture so tomorrow starts at 100%.",
  },
];

const DINING_OUT_TRACKS = [
  {
    track: "Omnivore Reset Track",
    badge: "Most Flexible",
    whatToOrder:
      "Grilled wild salmon, ribeye/filet, or roasted half-chicken + double order of steamed/grilled green vegetables (asparagus, broccolini) + side of olive oil & lemon.",
    airportGrab: "Hard-boiled eggs, beef/turkey biltong, raw almonds, and sparkling mineral water.",
    avoid: "Bread basket before protein, sweet glazes/teriyaki, and seed-oil fried sides.",
  },
  {
    track: "Vegetarian Reset Track",
    badge: "Gut-Brain Calm",
    whatToOrder:
      "Mediterranean halloumi or burrata salad over arugula/spinach,3-egg vegetable omelet, or warm lentil & roasted vegetable bowl with extra-virgin olive oil.",
    airportGrab: "Unsweetened Greek yogurt cup, mixed walnuts/pumpkin seeds, and a green apple.",
    avoid: "Heavy cream pasta sauces and sweetened granola parfaits.",
  },
  {
    track: "Keto / Low-Carb Track",
    badge: "Zero Glucose Spike",
    whatToOrder:
      "Bunless burger or steak with avocado, Caesar salad with grilled chicken (no croutons, dressing on side), or salmon with buttered asparagus.",
    airportGrab: "Macadamia nuts, cheese & salami protein pack, avocado cup, and black coffee/electrolytes.",
    avoid: "Hidden starches in soups/sauces and sugary cocktail mixers.",
  },
  {
    track: "Paleo / Ancestral Track",
    badge: "Grain & Dairy Free",
    whatToOrder:
      "Grilled fish, shrimp, or grass-fed steak with baked sweet potato, avocado salad, and olive oil.",
    airportGrab: "Guacamole pack with plantain chips or raw pecans, jerky, and berries.",
    avoid: "Grains, gluten wraps, butter/cheese sauces, andsoy-based dressings.",
  },
  {
    track: "100% Plant-Based Vegan Track",
    badge: "Clean Plant Fuel",
    whatToOrder:
      "Tofu or tempeh vegetable stir-fry (light sauce, no added sugar), chickpea & tahini kale bowl, or avocado-edamame quinoa salad.",
    airportGrab: "Roasted edamame, chia squeeze pouch, raw mixed nuts, and herbal tea.",
    avoid: "Ultra-processed fake meats high in refined oils and high-sugar acai bowls.",
  },
];

export default function DailyResetTrackerPage() {
  const [activeTab, setActiveTab] = useState<"emergency" | "cheatsheet" | "tracker">("emergency");
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem(EMERGENCY_STORAGE_KEY);
      if (saved) {
        setCheckedSteps(JSON.parse(saved));
      }
    } catch {
      // Ignore localStorage read errors
    }
  }, []);

  const toggleStep = (id: string) => {
    setCheckedSteps((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(EMERGENCY_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage write errors
      }
      return next;
    });
  };

  const resetEmergencyChecklist = () => {
    setCheckedSteps({});
    try {
      localStorage.removeItem(EMERGENCY_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  };

  const completedCount = EMERGENCY_STEPS.filter((s) => checkedSteps[s.id]).length;
  const progressPercent = Math.round((completedCount / EMERGENCY_STEPS.length) * 100);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    const trackerWin = window.open("/tracker.html?print=1", "_blank", "noopener");
    if (!trackerWin) {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col">
      <div className="print:hidden">
        <NavBar />
      </div>

      <div className="container mx-auto px-4 sm:px-6 pt-28 pb-16 flex-1 max-w-6xl">
        {/* Top Header */}
        <div className="print:hidden mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to Member Dashboard
          </Link>

          <div className="bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 text-white rounded-3xl p-6 sm:p-10 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <span className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                  <Sparkles className="h-3.5 w-3.5" />
                  7-Day Momentum &amp; Emergency Workday Toolkit
                </span>
                <h1 className="text-2xl sm:text-4xl font-bold mb-2">
                  Keep Your Hour-24 Clarity Going All Week
                </h1>
                <p className="text-gray-300 max-w-2xl text-sm sm:text-base">
                  Use the <strong>Emergency 2-Hour Workday Reset</strong> on chaotic Tuesday/Wednesday workdays, check the <strong>Executive Dining &amp; Travel Cheat Sheet</strong> on the go, and track your habits for 7 days.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 flex-shrink-0">
                <Button
                  onClick={handlePrint}
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/25"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print 7-Day Tracker
                </Button>
                <Button
                  onClick={handleDownloadPdf}
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Printable PDF Tracker
                </Button>
              </div>
            </div>

            {/* Interactive Toolkit Navigation Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8 pt-6 border-t border-white/15">
              <button
                type="button"
                onClick={() => setActiveTab("emergency")}
                className={`p-4 rounded-xl text-left transition-all flex items-center gap-3 ${
                  activeTab === "emergency"
                    ? "bg-amber-400 text-slate-950 font-bold shadow-lg"
                    : "bg-white/10 hover:bg-white/15 text-white"
                }`}
              >
                <Zap className="h-5 w-5 flex-shrink-0" />
                <div>
                  <div className="text-xs uppercase tracking-wider opacity-80">120-Min Triage</div>
                  <div className="text-sm sm:text-base font-bold">
                    1. Emergency 2-Hour Workday Reset
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("cheatsheet")}
                className={`p-4 rounded-xl text-left transition-all flex items-center gap-3 ${
                  activeTab === "cheatsheet"
                    ? "bg-amber-400 text-slate-950 font-bold shadow-lg"
                    : "bg-white/10 hover:bg-white/15 text-white"
                }`}
              >
                <Plane className="h-5 w-5 flex-shrink-0" />
                <div>
                  <div className="text-xs uppercase tracking-wider opacity-80">5 Diet Tracks</div>
                  <div className="text-sm sm:text-base font-bold">
                    2. Executive Travel &amp; Dining Cheat Sheet
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("tracker")}
                className={`p-4 rounded-xl text-left transition-all flex items-center gap-3 ${
                  activeTab === "tracker"
                    ? "bg-amber-400 text-slate-950 font-bold shadow-lg"
                    : "bg-white/10 hover:bg-white/15 text-white"
                }`}
              >
                <Calendar className="h-5 w-5 flex-shrink-0" />
                <div>
                  <div className="text-xs uppercase tracking-wider opacity-80">Web + Printable</div>
                  <div className="text-sm sm:text-base font-bold">
                    3. 7-Day Habit &amp; Energy Tracker
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* TAB 1: THE EMERGENCY 2-HOUR WORKDAY RESET CHECKLIST */}
        {activeTab === "emergency" && (
          <div className="print:hidden space-y-6">
            <Card className="border-2 border-amber-200 shadow-lg rounded-2xl bg-white">
              <CardHeader className="border-b border-gray-100 pb-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full mb-2">
                      <Clock className="h-3.5 w-3.5" />
                      120-Minute Mid-Week Triage Protocol
                    </div>
                    <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
                      The Emergency 2-Hour Workday Reset Checklist
                    </CardTitle>
                    <p className="text-gray-600 text-sm sm:text-base mt-1">
                      When a chaotic Tuesday or Wednesday derails your focus and you don't have 24 hours, run this 120-minute sequence to stop cortisol spiral and reclaim your day.
                    </p>
                  </div>

                  <div className="bg-slate-900 text-white rounded-2xl p-4 min-w-[210px] text-center">
                    <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">
                      Triage Progress
                    </div>
                    <div className="text-2xl font-extrabold text-amber-400">
                      {completedCount} / {EMERGENCY_STEPS.length} Steps ({progressPercent}%)
                    </div>
                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mt-2 mb-2">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={resetEmergencyChecklist}
                      className="text-xs text-gray-300 hover:text-white inline-flex items-center mt-1"
                    >
                      <RotateCcw className="h-3 w-3 mr-1" /> Reset checkboxes
                    </button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 sm:p-8 space-y-4">
                {EMERGENCY_STEPS.map((stepItem) => {
                  const isDone = Boolean(checkedSteps[stepItem.id]);
                  return (
                    <div
                      key={stepItem.id}
                      onClick={() => toggleStep(stepItem.id)}
                      className={`cursor-pointer rounded-xl border-2 p-4 sm:p-5 transition-all flex items-start gap-4 ${
                        isDone
                          ? "border-emerald-400 bg-emerald-50/60"
                          : "border-gray-200 hover:border-amber-300 bg-white"
                      }`}
                    >
                      <div className="pt-1" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={isDone}
                          onCheckedChange={() => toggleStep(stepItem.id)}
                          className="h-5 w-5"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-slate-900 text-amber-300">
                            {stepItem.window}
                          </span>
                          <span className="text-xs font-semibold text-gray-500">
                            {stepItem.phase}
                          </span>
                        </div>
                        <h3
                          className={`text-base sm:text-lg font-bold mb-1 ${
                            isDone ? "line-through text-gray-500" : "text-gray-900"
                          }`}
                        >
                          {stepItem.title}
                        </h3>
                        <p className="text-sm text-gray-700 mb-2">{stepItem.detail}</p>
                        <div className="text-xs text-emerald-800 bg-emerald-100/70 inline-block px-2.5 py-1 rounded-md font-medium">
                          <strong>Why it works:</strong> {stepItem.scienceNote}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 2: EXECUTIVE DINING-OUT & HIGH-STRESS WORKDAY CHEAT SHEET */}
        {activeTab === "cheatsheet" && (
          <div className="print:hidden space-y-8">
            {/* Caffeine & Afternoon Rescue Rules */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border border-gray-200 shadow-md rounded-2xl bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl font-bold">
                    <Coffee className="h-5 w-5 text-amber-600" />
                    Executive Caffeine &amp; Cortisol Rules
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm sm:text-base text-gray-700">
                  <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-100">
                    <strong className="block text-gray-900">1. The 60–90 Minute Adenosine Rule</strong>
                    Hydrate with 500ml water + electrolytes first. Delaying your first espresso/coffee by 60–90 minutes after waking prevents the 2:00 PM adenosine rebound crash.
                  </div>
                  <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-100">
                    <strong className="block text-gray-900">2. Pair Caffeine with 200mg L-Theanine</strong>
                    When going into high-stakes negotiations or board meetings, pair coffee with L-Theanine (or switch to ceremonial matcha/green tea) for jitter-free alpha-wave focus.
                  </div>
                  <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-100">
                    <strong className="block text-gray-900">3. Hard 1:30 PM Caffeine Cutoff</strong>
                    Caffeine has a 5–6 hour half-life. A 3:30 PM coffee leaves 50% circulating at 9:30 PM, reducing deep slow-wave sleep by up to 20% even if you fall asleep quickly.
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 shadow-md rounded-2xl bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl font-bold">
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                    How to Rescue a Derailed Workday in 10 Minutes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm sm:text-base text-gray-700">
                  <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-100">
                    <strong className="block text-gray-900">After a Poor Night of Sleep (&lt;6 Hours):</strong>
                    Get 15 minutes of outdoor sunlight before 9 AM, increase morning electrolyte intake, eat a high-protein/low-carb lunch, and take a 15-minute NSDR (Non-Sleep Deep Rest) or eyes-closed breath break at 2:00 PM.
                  </div>
                  <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-100">
                    <strong className="block text-gray-900">After a Heavy Client Lunch:</strong>
                    Walk briskly for 12–15 minutes immediately after eating. Muscular contraction clears up to 30% of post-meal glucose without needing extra insulin.
                  </div>
                  <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-100">
                    <strong className="block text-gray-900">Between Back-to-Back Zoom/Board Meetings:</strong>
                    Stand up, look out a window at a distant horizon for 60 seconds (relaxes ciliary eye muscles and brainstem alertness), and do 5 physiological sighs.
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Restaurant & Airport Ordering Matrix Across All 5 Diet Tracks */}
            <Card className="border border-gray-200 shadow-lg rounded-2xl bg-white">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                  <Utensils className="h-6 w-6 text-primary" />
                  Restaurant, Hotel &amp; Airport Ordering Matrix (All 5 Nutrition Modes)
                </CardTitle>
                <p className="text-gray-600 text-sm sm:text-base">
                  How to stay in clean Reset mode at client dinners, hotels, and airports—no matter which nutrition track you follow:
                </p>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {DINING_OUT_TRACKS.map((item) => (
                  <div
                    key={item.track}
                    className="rounded-xl border border-gray-200 p-5 bg-gray-50/70"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{item.track}</h3>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {item.badge}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <strong className="text-gray-900 block mb-0.5">
                          🍽️ What to Order at Restaurants:
                        </strong>
                        <p className="text-gray-600">{item.whatToOrder}</p>
                      </div>
                      <div>
                        <strong className="text-gray-900 block mb-0.5">
                          ✈️ Airport / On-the-Go Grab:
                        </strong>
                        <p className="text-gray-600">{item.airportGrab}</p>
                      </div>
                      <div>
                        <strong className="text-rose-700 block mb-0.5">
                          🚫 Energy Traps to Skip:
                        </strong>
                        <p className="text-gray-600">{item.avoid}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 3 (AND PRINT MODE): 7-DAY DAILY RESET TRACKER */}
        <div className={activeTab === "tracker" ? "block" : "hidden print:block"}>
          <div className="print:hidden mb-8 p-5 bg-blue-50 border border-blue-200 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold mb-1 text-blue-900">
                7-Day Post-Reset Habit &amp; Energy Tracker
              </h2>
              <ol className="list-decimal pl-5 space-y-1 text-sm text-blue-800">
                <li>Fill out digitally below, print this page, or open the Printable PDF version.</li>
                <li>Complete your core morning, midday, and evening anchors for 7 consecutive days.</li>
                <li>Use the notes section to record energy shifts, sleep quality, and wins.</li>
              </ol>
            </div>
            <div className="flex flex-wrap gap-3 flex-shrink-0">
              <Button onClick={handlePrint} variant="outline" className="bg-white">
                <Printer className="h-4 w-4 mr-2" />
                Print 7-Day Sheets
              </Button>
              <a
                href="/tracker.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button variant="outline" className="bg-white">
                  <Download className="h-4 w-4 mr-2" />
                  Open Standalone HTML Tracker
                </Button>
              </a>
            </div>
          </div>

          <div className="space-y-8 print:space-y-0">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="print:page-break-after">
                {i > 0 && (
                  <div className="hidden print:block text-center text-xl font-bold pt-8 pb-4">
                    Day {i + 1}
                  </div>
                )}
                <DailyResetTracker />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}