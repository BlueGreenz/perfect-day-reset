import { useState } from "react";
import {
  CheckCircle2,
  Clock,
  RefreshCw,
  Utensils,
  FileText,
  Sparkles,
  Smartphone,
  Laptop,
  Award,
  Droplets,
} from "lucide-react";

const DIET_PREVIEWS: Record<
  string,
  { label: string; short: string; meal: string; macros: string }
> = {
  Omni: {
    label: "Omnivore Track",
    short: "Omni",
    meal: "Pasture-Raised Eggs, Avocado & Wild Smoked Salmon Bowl",
    macros: "36g Protein • Zero Glucose Spike • 1-Click Grocery List",
  },
  Veg: {
    label: "Vegetarian Track",
    short: "Veg",
    meal: "Savory Greek Yogurt, Hemp Seed, Spinach & Poached Egg Plate",
    macros: "32g Protein • Zero Glucose Spike • 1-Click Grocery List",
  },
  Keto: {
    label: "Keto Track",
    short: "Keto",
    meal: "Herb Omelet with Avocado, Macadamia & Olive Oil Greens",
    macros: "34g Protein • <6g Net Carbs • 1-Click Grocery List",
  },
  Paleo: {
    label: "Paleo Track",
    short: "Paleo",
    meal: "Grass-Fed Turkey & Sweet Potato Hash with Wilted Kale",
    macros: "35g Protein • Whole-Food Fuel • 1-Click Grocery List",
  },
  Vegan: {
    label: "Vegan Track",
    short: "Vegan",
    meal: "Turmeric Tofu Scramble, Black Beans, Avocado & Chia Pudding",
    macros: "30g Plant Protein • High Fiber • 1-Click Grocery List",
  },
};

export default function PortalPreviewMockup() {
  const [delayed, setDelayed] = useState(false);
  const [selectedDiet, setSelectedDiet] = useState<string>("Omni");

  const activeDiet = DIET_PREVIEWS[selectedDiet] || DIET_PREVIEWS.Omni;
  const step2Time = delayed ? "08:00 AM" : "07:45 AM";
  const step3Time = delayed ? "08:45 AM" : "08:30 AM";

  return (
    <div
      className="w-full max-w-4xl mx-auto rounded-2xl bg-slate-950 text-white shadow-2xl border border-slate-800 overflow-hidden"
      data-testid="portal-preview-mockup"
    >
      {/* Sleek macOS / Mobile App Browser Frame Top Bar */}
      <div className="bg-slate-900/95 px-4 sm:px-6 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500/90 inline-block" />
          <span className="w-3 h-3 rounded-full bg-amber-400/90 inline-block" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/90 inline-block" />
          <span className="ml-2 text-xs font-mono text-slate-400 hidden sm:inline-block">
            perfectdayreset.com/product/reset • Live Interactive Web Companion
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700">
            <Smartphone className="h-3 w-3 text-amber-400" />
            <Laptop className="h-3 w-3 text-emerald-400" />
            Phone &amp; Laptop Ready
          </span>
        </div>
      </div>

      {/* Portal Status & Progress Header Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/90 px-5 sm:px-8 py-5 border-b border-slate-800/90">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Active Reset • Wake 07:00 • {activeDiet.label}
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Your Live 24-Hour Reset Dashboard (Interactive Preview)
            </h3>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 min-w-[240px]">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
              <span>4 of 8 Morning Steps Complete (50%)</span>
              <span className="text-emerald-400 font-bold">50%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full w-1/2 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Schedule Rows */}
      <div className="p-5 sm:p-8 space-y-4 bg-slate-950">
        {/* Row 1: 07:00 AM Completed */}
        <div className="rounded-xl bg-slate-900/90 border border-emerald-500/30 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold text-emerald-300 bg-emerald-950/90 border border-emerald-700/60 px-2 py-0.5 rounded">
                  07:00 AM
                </span>
                <span className="font-bold text-white text-sm sm:text-base">
                  07:00 AM — Morning Hydration &amp; Mineral Anchor
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-1.5">
                <Droplets className="h-3.5 w-3.5 text-sky-400 flex-shrink-0" />
                500ml water + pinch of sea salt before caffeine • Screen-free boundary active
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Completed
            </span>
          </div>
        </div>

        {/* Row 2: 07:45 AM In Progress + +15m Delay Rescheduler */}
        <div className="rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-slate-900 border-2 border-amber-400/60 p-4 sm:p-5 shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-400/50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Clock className="h-5 w-5 text-amber-300" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-200 bg-amber-950/90 border border-amber-600/60 px-2 py-0.5 rounded">
                    {step2Time}
                  </span>
                  <span className="font-bold text-white text-sm sm:text-base">
                    07:45 AM — 15-Min Sunlight &amp; Mobility Flow
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950">
                    In Progress
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 mt-1">
                  Natural outdoor light exposure + thoracic &amp; hip mobility sequence to anchor your cortisol peak.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setDelayed((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                  delayed
                    ? "bg-amber-400 text-slate-950 border-amber-300 shadow-md"
                    : "bg-slate-900/90 hover:bg-slate-800 text-amber-300 border-amber-400/50"
                }`}
              >
                <RefreshCw className={`h-3.5 w-3.5 ${delayed ? "animate-spin" : ""}`} />
                {delayed ? "Shifted +15m (Tap to Undo)" : "+15m Delay Rescheduler"}
              </button>
              <span className="text-[11px] text-amber-200/90 font-medium px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-500/30">
                Auto-shifts remaining day
              </span>
            </div>
          </div>
        </div>

        {/* Row 3: 08:30 AM Anti-Crash Protein Breakfast + 5 Diet Tracks */}
        <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-4 sm:p-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-orange-500/15 border border-orange-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Utensils className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                    {step3Time}
                  </span>
                  <span className="font-bold text-white text-sm sm:text-base">
                    08:30 AM — Anti-Crash Protein Breakfast
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-300 font-medium mt-1">
                  {activeDiet.meal}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{activeDiet.macros}</p>
              </div>
            </div>

            <div className="flex flex-col items-start lg:items-end gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                5 Diet Tracks: Omni • Veg • Keto • Paleo • Vegan
              </span>
              <div className="flex flex-wrap gap-1.5">
                {Object.keys(DIET_PREVIEWS).map((key) => {
                  const isSelected = selectedDiet === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedDiet(key)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        isSelected
                          ? "bg-emerald-500 text-slate-950 shadow-sm"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      {key}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Badge */}
      <div className="bg-slate-900/95 px-5 sm:px-8 py-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-slate-300">
        <div className="flex items-center gap-2 font-medium text-center sm:text-left">
          <FileText className="h-4 w-4 text-amber-400 flex-shrink-0" />
          <span>
            Includes Printable PDF Guide + 7-Day Tracker + Completion Certificate
          </span>
        </div>
        <div className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold text-xs">
          <Award className="h-4 w-4" />
          <span>Unlimited Lifetime Resets Included ($19 One-Time)</span>
        </div>
      </div>
    </div>
  );
}
