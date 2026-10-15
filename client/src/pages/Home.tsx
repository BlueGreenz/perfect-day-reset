import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Clock,
  Heart,
  ArrowRight,
  Calendar,
  Target,
  Smartphone,
  Mail,
  Utensils,
  Droplets,
  Sparkles,
  FileText,
  Sun,
  Zap,
  Moon,
  ShieldCheck,
  Award,
  RefreshCw,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import FAQSection from "@/components/FAQSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ComparisonSection from "@/components/ComparisonSection";
import SEOHead from "@/components/SEOHead";
import sunriseBackground from "@assets/16x9_A_vibrant_golden_sunrise_gradual.webp";
import founderPhoto from "@assets/unnamed.jpg";

interface TimelinePhase {
  id: string;
  badge: string;
  title: string;
  timeWindow: string;
  summary: string;
  gradient: string;
  icon: React.ElementType;
  highlights: {
    time: string;
    label: string;
    detail: string;
  }[];
  outcome: string;
}

const TIMELINE_PHASES: TimelinePhase[] = [
  {
    id: "prep",
    badge: "Prep • Evening Before (15 mins)",
    title: "Prep (Evening Before, 15 mins)",
    timeWindow: "Evening Before • 15 Mins",
    summary:
      "Choose your wake time, pick 1 of 5 meal tracks, and set your phone detox boundary so you wake up with zero decision fatigue.",
    gradient: "from-indigo-500 to-purple-600",
    icon: Calendar,
    highlights: [
      {
        time: "Step 1 (5 min)",
        label: "Choose Your Wake Time",
        detail: "Set your anchor time—your entire 24-hour schedule automatically calibrates around it.",
      },
      {
        time: "Step 2 (5 min)",
        label: "Pick 1 of 5 Meal Tracks",
        detail: "Select Omnivore, Vegetarian, Keto, Paleo, or Vegan and generate your 1-click grocery checklist.",
      },
      {
        time: "Step 3 (5 min)",
        label: "Set Your Phone Detox Boundary",
        detail: "Configure your morning screen-free window and prepare your water & space for tomorrow.",
      },
    ],
    outcome: "You go to sleep knowing every hour and meal of tomorrow is already decided for you.",
  },
  {
    id: "morning",
    badge: "Phase 1 • 07:00–10:00",
    title: "Phase 1 — Morning Activation (07:00–10:00)",
    timeWindow: "07:00 – 10:00",
    summary:
      "Hydration & light anchor, mindful mobility, anti-crash breakfast, and intention setting to ignite clean, jitter-free energy.",
    gradient: "from-amber-500 to-orange-500",
    icon: Sun,
    highlights: [
      {
        time: "07:00 – 07:30",
        label: "Hydration & Natural Light Anchor",
        detail: "500ml mineral-rich water + 10 minutes of natural morning light before touching any screen.",
      },
      {
        time: "07:30 – 08:15",
        label: "Mindful Mobility & Breath Primer",
        detail: "Gentle joint awakening and nasal breathing to align your cortisol curve without agotamiento.",
      },
      {
        time: "08:15 – 09:15",
        label: "Anti-Crash Breakfast",
        detail: "High-protein, blood-sugar-stabilizing morning meal tailored to your chosen nutrition track.",
      },
      {
        time: "09:15 – 10:00",
        label: "Intention Setting & Priority Lock",
        detail: "Guided mindset prompt to clear mental clutter and lock in your #1 focus for the day.",
      },
    ],
    outcome: "Calm, laser-sharp morning clarity without coffee jitters or reactive phone scrolling.",
  },
  {
    id: "midday",
    badge: "Phase 2 • 10:30–15:15",
    title: "Phase 2 — Midday Recharge (10:30–15:15)",
    timeWindow: "10:30 – 15:15",
    summary:
      "Deep focus block, metabolic lunch, guided outdoor movement, and energy reset to eliminate the 2 PM afternoon crash.",
    gradient: "from-emerald-500 to-teal-600",
    icon: Zap,
    highlights: [
      {
        time: "10:30 – 12:30",
        label: "Deep Focus Block & Hydration Check",
        detail: "Distraction-free execution or restorative flow state with timed electrolyte hydration.",
      },
      {
        time: "12:30 – 13:30",
        label: "Metabolic Lunch",
        detail: "Anti-inflammatory midday fuel designed for sustained afternoon brainpower, not food coma.",
      },
      {
        time: "13:30 – 14:30",
        label: "Guided Outdoor Movement",
        detail: "30–45 minute purposeful walk, mobility session, or strength flow to flush stress hormones.",
      },
      {
        time: "14:30 – 15:15",
        label: "Contrast & Breath Energy Reset",
        detail: "Cold/warm shower refresh + 5-minute physiological sigh protocol to recharge your afternoon.",
      },
    ],
    outcome: "Sustained afternoon momentum and physical lightness right when you would normally crash.",
  },
  {
    id: "evening",
    badge: "Phase 3 • 15:30–21:30",
    title: "Phase 3 — Evening Decompression & Reflection (15:30–21:30)",
    timeWindow: "15:30 – 21:30",
    summary:
      "Nervous system down-regulation, nourishing dinner, digital sunset, and 5-prompt cognitive unload journal for deep restorative sleep.",
    gradient: "from-purple-600 to-pink-600",
    icon: Moon,
    highlights: [
      {
        time: "15:30 – 18:00",
        label: "Nervous System Down-Regulation",
        detail: "Transition out of high-alert mode with mirror work, gratitude, and present-moment connection.",
      },
      {
        time: "18:00 – 19:30",
        label: "Nourishing Recovery Dinner",
        detail: "Clean, easily digestible evening meal timed to support overnight cellular repair.",
      },
      {
        time: "19:30 – 20:30",
        label: "Digital Sunset & Warm Wind-Down",
        detail: "Screens off, dim lighting, herbal tea, and parasympathetic stretching.",
      },
      {
        time: "20:30 – 21:30",
        label: "5-Prompt Cognitive Unload Journal",
        detail: "Save your evening reflections in the web portal (or PDF) to empty your mind before sleep.",
      },
    ],
    outcome: "Deep, uninterrupted sleep and waking up the next morning feeling genuinely reset.",
  },
];

export default function Home() {
  const [leadEmail, setLeadEmail] = useState("");
  const [activePhaseId, setActivePhaseId] = useState<string>("prep");
  const { toast } = useToast();

  const activePhase =
    TIMELINE_PHASES.find((phase) => phase.id === activePhaseId) || TIMELINE_PHASES[0];

  const leadCaptureMutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await apiRequest("POST", "/api/subscribe", { email });
      return res.json();
    },
    onSuccess: () => {
      setLeadEmail("");
      toast({
        title: "Checklist on its way!",
        description: "Check your inbox for the Free Morning Cortisol & Hydration Checklist.",
      });
    },
    onError: (error: Error) => {
      const isAlreadySubscribed =
        error.message.includes("409") ||
        error.message.toLowerCase().includes("already subscribed");
      toast({
        title: isAlreadySubscribed ? "You're already subscribed!" : "Could not send checklist",
        description: isAlreadySubscribed
          ? "This email is already on our list—watch your inbox for our wellness checklists."
          : "Please enter a valid email address and try again.",
        variant: isAlreadySubscribed ? "default" : "destructive",
      });
    },
  });

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = leadEmail.trim();
    if (!trimmed) {
      toast({
        title: "Email required",
        description: "Please enter your email address to receive the free checklist.",
        variant: "destructive",
      });
      return;
    }
    leadCaptureMutation.mutate(trimmed);
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      if (anchor) {
        e.preventDefault();
        const href = anchor.getAttribute("href");
        if (href && href !== "#" && href.length > 1) {
          const targetElement = document.querySelector(href);
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Perfect Day Reset – Reclaim Your Energy, Focus & Mood in 24 Hours"
        description="Transform your mind and body with the Perfect Day Reset – an interactive 24-hour web companion and printable PDF protocol of clean nutrition, movement, and journaling for $19."
        canonical="https://perfectdayreset.com"
        ogTitle="Perfect Day Reset – Reclaim Your Energy, Focus & Mood"
        ogDescription="Our 24-hour lifestyle reboot blends clean food, focused movement, and powerful mindset tools. Start your reset today for $19."
        ogImage="https://perfectdayreset.com/og-image.png"
        twitterTitle="Perfect Day Reset – Reclaim Your Energy"
        twitterDescription="One day can change everything. Join the 24-hour reset that improves your energy, focus, and mood."
      />
      <NavBar />

      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center text-white pt-24 pb-16"
        style={{
          backgroundImage: `url(${sunriseBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black/35" />

        {/* Social Impact Badge */}
        <div className="absolute top-20 sm:top-24 left-4 right-4 sm:left-auto sm:right-8 z-10 flex justify-center sm:justify-end">
          <Badge className="bg-white/20 backdrop-blur-md text-white border-white/30 px-3 sm:px-4 py-2 text-xs sm:text-sm">
            <Heart className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 text-pink-300" />
            <span className="hidden sm:inline">Every purchase donates $1 to children's programs</span>
            <span className="sm:hidden">$1 donated per purchase</span>
          </Badge>
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto px-6 sm:px-8">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 rounded-full px-4 py-1.5 text-xs sm:text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span>Interactive Web Companion + Printable PDF Guide • Instant Access</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight drop-shadow-sm">
            Transform Your Energy, Clarity &amp; Focus in Just 24 Hours
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-10 max-w-3xl mx-auto text-white/95 leading-relaxed">
            A proven, guided 24-hour protocol with an adaptive schedule engine, 5 customizable meal tracks, and evening cognitive unload journaling—plus $1 donated to children's programs with every purchase.
          </p>

          {/* Dual CTA Option */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/checkout" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-8 md:px-10 py-6 text-lg sm:text-xl rounded-full font-semibold shadow-2xl transform hover:scale-105 transition-all"
              >
                Start My 24-Hour Reset — $19
                <ArrowRight className="ml-2.5 h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
            </a>
            <a href="/what-you-get" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto bg-white/15 hover:bg-white/25 text-white border-2 border-white/60 hover:border-white backdrop-blur-md px-8 py-6 text-lg rounded-full font-semibold transition-all"
              >
                See Full Program Breakdown
              </Button>
            </a>
          </div>

          {/* Instant Web + PDF Value Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-white/90">
            <span className="inline-flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/15">
              <Smartphone className="h-4 w-4 text-emerald-300" />
              Works Instantly on Any Phone or Laptop
            </span>
            <span className="inline-flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/15">
              <RefreshCw className="h-4 w-4 text-amber-300" />
              1-Tap Delay Rescheduler
            </span>
            <span className="inline-flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/15">
              <ShieldCheck className="h-4 w-4 text-blue-300" />
              30-Day Money-Back Guarantee
            </span>
          </div>

          <div className="mt-6">
            <a
              href="/quiz"
              className="inline-flex items-center gap-2 text-amber-200 hover:text-white text-sm sm:text-base font-semibold underline underline-offset-4 transition-colors"
            >
              <Sparkles className="h-4 w-4 text-amber-300" />
              Not sure where to start? Take the Free 60-Second Burnout &amp; Reset Diagnostic →
            </a>
          </div>
        </div>
      </section>

      {/* Free 60-Second Diagnostic Callout Banner */}
      <section className="py-10 bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 text-white border-b border-slate-800">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-white/5 border border-white/15 rounded-2xl p-6 sm:p-8">
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2.5">
                <Sparkles className="h-3.5 w-3.5" />
                Free Interactive Tool • 60 Seconds
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Find Your #1 Energy Bottleneck &amp; Preview Your Custom 24-Hour Schedule
              </h2>
              <p className="text-gray-300 text-sm sm:text-base max-w-2xl">
                Answer 5 quick questions to discover your Overwhelm Archetype, Severity Score, and see your hour-by-hour reset shifted to your exact wake time and nutrition track.
              </p>
            </div>
            <div className="flex-shrink-0 w-full sm:w-auto">
              <a href="/quiz" className="block w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-bold px-8 py-6 text-base sm:text-lg rounded-full shadow-xl transition-all hover:scale-105"
                >
                  Take the Free 60-Second Burnout &amp; Reset Diagnostic
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-b from-white via-gray-50 to-white" id="how-it-works">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">How the 24-Hour Reset Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A simple, science-backed 3-step process to reset your nervous system, energy, and focus in a single intentional day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Step 1: Prepare in 15 Minutes</h3>
              <ul className="text-left space-y-2.5 text-gray-700">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Choose your wake time to generate your personalized 24-hour timeline
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Pick 1 of 5 nutrition tracks (Omnivore, Vegetarian, Keto, Paleo, or Vegan) with a 1-click grocery list
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Set your digital detox boundary so you wake up with zero decision fatigue
                </li>
              </ul>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Clock className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Step 2: Follow the Adaptive Protocol</h3>
              <p className="text-gray-700 leading-relaxed">
                Move through timed morning activation, midday recharge, and evening reflection on your phone, laptop, or printable PDF. Running 15 minutes late? Tap once and the engine recalculates your entire day automatically—no guilt.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Heart className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Step 3: Feel the Transformation</h3>
              <p className="text-gray-700 leading-relaxed">
                Wake up the next morning with steady energy, crystal-clear focus, and a calm nervous system—plus the ability to repeat your 24-Hour Reset any weekend or stressful week for life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive / Scannable "Inside Your 24 Hours" Timeline Preview */}
      <section className="py-20 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50" id="program">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <span className="inline-block bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3">
              Inside Your 24 Hours
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Your Complete 24-Hour Reset Timeline
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Click any phase below—or scan all four stages at a glance—to see exactly how your day unfolds from the evening before until lights out.
            </p>
          </div>

          {/* Interactive Phase Selector Tabs */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8"
            role="tablist"
            aria-label="24-Hour Reset Phases"
          >
            {TIMELINE_PHASES.map((phase) => {
              const Icon = phase.icon;
              const isSelected = phase.id === activePhase.id;
              return (
                <button
                  key={phase.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActivePhaseId(phase.id)}
                  className={`text-left p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? "bg-gray-900 text-white border-gray-900 shadow-lg scale-[1.01]"
                      : "bg-white/90 hover:bg-white text-gray-800 border-gray-200 hover:border-orange-300 shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        isSelected
                          ? "bg-orange-500 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {phase.timeWindow}
                    </span>
                    <Icon
                      className={`h-5 w-5 ${
                        isSelected ? "text-amber-300" : "text-orange-500"
                      }`}
                    />
                  </div>
                  <div className="font-bold text-base leading-snug">{phase.title}</div>
                </button>
              );
            })}
          </div>

          {/* Active Phase Interactive Detail Panel */}
          <Card className="bg-white border-2 border-orange-200/80 shadow-xl rounded-2xl overflow-hidden mb-12">
            <CardContent className="p-6 sm:p-10">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 mb-8 border-b border-gray-100">
                <div>
                  <span
                    className={`inline-block bg-gradient-to-r ${activePhase.gradient} text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2`}
                  >
                    {activePhase.badge}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {activePhase.title}
                  </h3>
                  <p className="text-gray-600 mt-2 max-w-3xl text-base sm:text-lg">
                    {activePhase.summary}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <a href="/checkout">
                    <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-full px-6 py-3 font-semibold shadow-md">
                      Unlock Full Timeline — $19
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {activePhase.highlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50/90 rounded-xl p-5 border border-gray-100 flex items-start gap-4"
                  >
                    <div className="bg-white border border-orange-200 text-orange-700 font-mono text-xs font-bold px-2.5 py-1.5 rounded-lg flex-shrink-0 mt-0.5 shadow-sm">
                      {item.time}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-base mb-1">
                        {item.label}
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 text-emerald-900 text-sm sm:text-base font-medium">
                <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span>
                  <strong>Phase Outcome:</strong> {activePhase.outcome}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* All 4 Phases Scannable Summary Grid (Always visible for fast scanners & crawlers) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TIMELINE_PHASES.map((phase) => {
              const Icon = phase.icon;
              return (
                <Card
                  key={phase.id}
                  onClick={() => setActivePhaseId(phase.id)}
                  className={`cursor-pointer bg-white shadow-md hover:shadow-xl transition-all border ${
                    activePhase.id === phase.id
                      ? "border-orange-400 ring-2 ring-orange-200"
                      : "border-gray-100"
                  }`}
                >
                  <CardContent className="p-6 flex flex-col h-full justify-between">
                    <div>
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${phase.gradient} rounded-xl flex items-center justify-center mb-4`}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-xs font-semibold text-orange-600 uppercase tracking-wider mb-1">
                        {phase.timeWindow}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {phase.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed mb-4">
                        {phase.summary}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-blue-600 flex items-center mt-2">
                      {activePhase.id === phase.id ? "Viewing details above" : "Click to inspect phase"}{" "}
                      <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </span>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Dual CTA under Program Timeline */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
            <a href="/checkout" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-10 py-6 text-lg rounded-full font-semibold shadow-xl transform hover:scale-105 transition-all"
              >
                Start My 24-Hour Reset — $19
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </a>
            <a href="/what-you-get" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-gray-300 hover:border-gray-400 text-gray-800 bg-white px-8 py-6 text-lg rounded-full font-semibold"
              >
                See Full Program Breakdown
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Why 24 Hours vs. 30-Day Challenges Comparison Section */}
      <ComparisonSection />

      {/* High-Trust Founder Authority Section */}
      <section className="py-20 bg-white border-t border-gray-100" id="founder">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white rounded-3xl p-8 sm:p-12 shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-4 flex flex-col items-center text-center">
                <div className="relative">
                  <img
                    src={founderPhoto}
                    alt="Reiko Kevvai – Founder of Perfect Day Reset"
                    loading="lazy"
                    decoding="async"
                    className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl object-cover shadow-xl border-2 border-amber-400/60"
                  />
                  <div className="mt-4">
                    <h3 className="text-xl font-bold text-white">Reiko Kevvai</h3>
                    <p className="text-amber-300 text-sm font-medium mt-0.5">
                      Ex Head of Sales for Inchcape Motors BMW
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      35+ Years in Competitive Sports &amp; High-Performance Recovery
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8">
                <span className="inline-flex items-center gap-1.5 bg-amber-400/15 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full mb-4">
                  <Award className="h-3.5 w-3.5" />
                  Why I Built the 24-Hour Reset
                </span>
                <h2 className="text-2xl sm:text-4xl font-bold mb-4 leading-tight">
                  "After Corporate Burnout Hit Me at Full Speed, I Realized High Performers Don't Need Another 30-Day Challenge—They Need One Engineered Day."
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4 text-base sm:text-lg">
                  As Head of Sales for Inchcape Motors BMW and an athlete with over 35 years in competitive sports, I spent years pushing through 12-hour corporate days on caffeine, stress, and fragmented sleep—until burnout forced me to stop.
                </p>
                <p className="text-gray-300 leading-relaxed mb-6 text-base sm:text-lg">
                  When you're exhausted, a rigid 30-day program feels like another job. So I combined decades of athletic conditioning, circadian biology, and nervous system recovery into a single, structured 24-hour blueprint that resets your energy, focus, and mood in one day.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <a href="/checkout">
                    <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-full px-7 py-5 font-semibold shadow-lg">
                      Start My 24-Hour Reset — $19
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                  <a
                    href="/about"
                    className="inline-flex items-center text-amber-300 hover:text-amber-200 font-semibold text-sm sm:text-base underline underline-offset-4"
                  >
                    Read the full origin story
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <TestimonialsSection />

      {/* Works Instantly on Any Phone or Laptop + Printable PDF Showcase & Free Lead Capture */}
      <section className="py-20 bg-white border-t border-gray-100" id="companion">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
              <Smartphone className="h-8 w-8 text-white" />
            </div>
            <span className="inline-block bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3">
              No App Store Wait • Live Right Now
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Works Instantly on Any Phone or Laptop + Printable PDF
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Your $19 access unlocks our live Interactive Web Companion Portal in your mobile or desktop browser alongside the full Printable PDF kit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-7">
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-5">
                  <RefreshCw className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2.5 text-gray-900">
                  Dynamic 24-Hour Schedule &amp; 1-Tap Delay Rescheduler
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  Set your wake-up time and follow your live hour-by-hour schedule. Running 15 or 30 minutes late? Tap once and the engine recalculates your entire day automatically—zero guilt, zero stress.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-7">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-5">
                  <Utensils className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2.5 text-gray-900">
                  5 Customizable Nutrition Modes + 1-Click Grocery Lists
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  Switch seamlessly between <strong>Omnivore, Vegetarian, Keto, Paleo, and Vegan</strong> tracks. Every breakfast, lunch, and dinner includes exact macros, prep steps, and an interactive grocery list.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-7">
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-5">
                  <Droplets className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2.5 text-gray-900">
                  Hydration Calculator, Digital Detox &amp; Saved Reflections
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  Calculate your personal electrolyte &amp; water target, check off your digital detox commitments, and save your 5 evening reflection prompts directly to your private account—plus download the Printable PDF Guide &amp; 7-Day Tracker.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Free Lead Capture Form (POST /api/subscribe) */}
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-200/80 rounded-2xl p-8 sm:p-10 text-center shadow-sm">
            <div className="inline-flex items-center gap-2 bg-white text-blue-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-blue-200 mb-4">
              <FileText className="h-3.5 w-3.5" />
              Free Instant Bonus
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Not Ready for a Full Reset Today? Get the Free Morning Cortisol &amp; Hydration Checklist Sent to Your Inbox.
            </h3>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
              Start with our 15-minute morning light, hydration, and screen-free routine that stops the mid-morning energy crash.
            </p>
            <form
              onSubmit={handleLeadSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
            >
              <div className="relative flex-1">
                <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  disabled={leadCaptureMutation.isPending}
                  placeholder="Enter your best email address"
                  aria-label="Email address for free Morning Cortisol and Hydration Checklist"
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                />
              </div>
              <Button
                type="submit"
                disabled={leadCaptureMutation.isPending}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3.5 h-auto rounded-xl font-semibold whitespace-nowrap shadow-md"
              >
                {leadCaptureMutation.isPending ? "Sending..." : "Send Me the Free Checklist"}
              </Button>
            </form>
            <p className="text-xs text-gray-500 mt-3">
              100% free. Unsubscribe anytime with one click.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />

      <Footer />
    </div>
  );
}