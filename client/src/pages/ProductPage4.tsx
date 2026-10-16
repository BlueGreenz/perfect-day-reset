import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  ArrowDown,
  Utensils,
  Moon,
  CheckCircle2,
  AlertCircle,
  Wind,
  Phone,
  Edit3,
  Music,
  Heart,
  Plus,
  Minus,
  Palette,
  Loader2,
  PencilLine,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import focusMeditationImage from "@assets/16x9_A_minimalist_gradient_transition.webp";
import {
  useCurrentReset,
  useCompleteItem,
  useSkipItem,
  useDelayItem,
  useUpdateFoodPreference,
  useResetEntries,
  useSaveResetEntry,
  type ResetItem,
} from "@/lib/reset-api";
import PortalNavBar, { getDefaultPhaseItems } from "@/components/PortalNavBar";
import { toast } from "@/hooks/use-toast";
import { ApiError } from "@/lib/queryClient";

export default function ProductPage4() {
  const [, setLocation] = useLocation();
  const { data: currentReset, isLoading, error: resetError, refetch } = useCurrentReset();
  const { data: entriesData } = useResetEntries();
  const completeItem = useCompleteItem();
  const skipItem = useSkipItem();
  const delayItem = useDelayItem();
  const updateFoodPreference = useUpdateFoodPreference();
  const saveResetEntry = useSaveResetEntry();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [selectedDiet, setSelectedDiet] = useState<string>("omni");
  const [middayNote, setMiddayNote] = useState<string>("");
  const [activeSocialPanel, setActiveSocialPanel] = useState<string | null>(null);
  const [activeKindnessPanel, setActiveKindnessPanel] = useState<string | null>(null);

  useEffect(() => {
    const pref = currentReset?.resetRun?.foodPreference;
    if (pref) {
      const normalized = pref.toLowerCase();
      if (normalized === "regular") {
        setSelectedDiet("omni");
      } else if (normalized === "paleo") {
        setSelectedDiet("gluten-free");
      } else {
        setSelectedDiet(normalized);
      }
    }
  }, [currentReset?.resetRun?.foodPreference]);

  useEffect(() => {
    const existingMidday = entriesData?.entries?.find((e) => e.kind === "midday_reflection");
    if (existingMidday?.content) {
      setMiddayNote(existingMidday.content);
    }
  }, [entriesData]);

  const handleDietChange = (diet: string) => {
    setSelectedDiet(diet);
    if (currentReset?.resetRun) {
      updateFoodPreference.mutate(diet, {
        onError: () => {
          // Non-blocking if offline
        },
      });
    }
  };

  // Function to toggle social connection panels
  const toggleSocialPanel = (panelId: string) => {
    setActiveSocialPanel((prev) => (prev === panelId ? null : panelId));
  };

  // Function to toggle kindness panels
  const toggleKindnessPanel = (panelId: string) => {
    setActiveKindnessPanel((prev) => (prev === panelId ? null : panelId));
  };

  // Get lunch options based on selected diet
  const getLunchOption = () => {
    switch (selectedDiet) {
      case "omni":
        return "Quinoa bowl with grilled chicken, avocado, spinach, pumpkin seeds, olive oil";
      case "vegetarian":
        return "Halloumi salad with nuts, greens, olive oil + citrus";
      case "vegan":
        return "Lentil and sweet potato curry + brown rice";
      case "gluten-free":
        return "Grilled salmon + broccoli + tahini drizzle";
      case "keto":
        return "Grilled salmon + broccoli + tahini drizzle";
      default:
        return "Quick Reset: 2 boiled eggs, hummus, veggie sticks + apple";
    }
  };

  // Get dinner options based on selected diet
  const getDinnerOption = () => {
    switch (selectedDiet) {
      case "omni":
        return "Grilled turkey + steamed greens + sweet potato";
      case "vegetarian":
        return "Roasted vegetables + hummus + quinoa";
      case "vegan":
        return "Chickpea & kale stir-fry with quinoa";
      case "gluten-free":
        return "Grilled salmon + steamed vegetables + rice";
      case "keto":
        return "Zucchini noodles + pesto + chicken/tofu";
      default:
        return "Protein smoothie (w/ berries, greens, nut butter)";
    }
  };

  const catalogMapping: Record<string, { title: string; description: React.ReactNode; icon: React.ReactNode }> = {
    lunch: {
      title: "Mindful Lunch & Hydration",
      description: (
        <div className="text-gray-600">
          <p>Nourish your body with a blood-sugar-stabilizing lunch tailored to your chosen dietary track:</p>
          <div className="mt-2 p-3 bg-green-50 border border-green-100 rounded-lg text-sm font-medium text-green-900">
            Recommended ({selectedDiet}): {getLunchOption()}
          </div>
          <div className="mt-2 italic text-sm">
            Tip: Chew slowly without screens and drink a full glass of water 20 minutes after eating.
          </div>
        </div>
      ),
      icon: <Utensils className="h-6 w-6 text-primary" />,
    },
    midday_reflection: {
      title: "Midday Check-In & Energy Reflection (5 Minutes)",
      description: (
        <div className="text-gray-600 space-y-3">
          <p>Pause for 5 minutes to notice how your body and focus feel compared to this morning.</p>
          <Textarea
            value={middayNote}
            onChange={(e) => setMiddayNote(e.target.value)}
            placeholder="How is your energy, clarity, and mood right now? Jot down a quick midday note..."
            className="bg-white text-sm"
            rows={3}
          />
          {middayNote.trim().length > 0 && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={saveResetEntry.isPending}
              onClick={() => {
                saveResetEntry.mutate(
                  { kind: "midday_reflection", content: middayNote.trim() },
                  {
                    onSuccess: () => {
                      toast({
                        title: "Midday reflection saved",
                        description: "Your midday check-in note has been saved to your Reset log.",
                      });
                    },
                    onError: (err) => {
                      toast({
                        title: "Could not save note",
                        description: err.message,
                        variant: "destructive",
                      });
                    },
                  }
                );
              }}
            >
              {saveResetEntry.isPending ? "Saving..." : "Save Midday Note"}
            </Button>
          )}
        </div>
      ),
      icon: <PencilLine className="h-6 w-6 text-primary" />,
    },
    mirror_task: {
      title: "Mirror Task (1 Minute)",
      description: (
        <div className="text-gray-600">
          <p>"I'm proud of myself for showing up today. I'm kind, I'm doing my best, and I matter."</p>
          <div className="mt-2 italic text-sm">
            Why: Triggers oxytocin and interrupts negative self-talk loops.
          </div>
        </div>
      ),
      icon: <Heart className="h-6 w-6 text-primary" />,
    },
    breathing_exercise: {
      title: "Breathing Exercise (5 Minutes)",
      description: (
        <div className="text-gray-600">
          <p>Center yourself with one of these powerful breathing techniques:</p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-primary/5 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1">Box Breathing</h4>
              <ol className="text-xs text-gray-600 list-decimal pl-4 space-y-1">
                <li>Inhale through nose for 4 seconds</li>
                <li>Hold breath for 4 seconds</li>
                <li>Exhale through mouth for 4 seconds</li>
                <li>Hold empty lungs for 4 seconds</li>
                <li>Repeat 5-10 times</li>
              </ol>
            </div>
            <div className="bg-primary/5 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-1">4-7-8 Breathing</h4>
              <ol className="text-xs text-gray-600 list-decimal pl-4 space-y-1">
                <li>Inhale through nose for 4 seconds</li>
                <li>Hold breath for 7 seconds</li>
                <li>Exhale completely through mouth for 8 seconds</li>
                <li>Repeat 4-5 times</li>
              </ol>
            </div>
          </div>
          <div className="mt-4">
            <a
              href="https://www.youtube.com/watch?v=tybOi4hjZFQ"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center"
            >
              <ArrowRight className="h-4 w-4 mr-1" />
              Watch guided breathing exercise video
            </a>
          </div>
          <div className="mt-2 italic text-sm">
            Why: Reduces stress hormones, activates parasympathetic nervous system, improves focus
          </div>
        </div>
      ),
      icon: <Wind className="h-6 w-6 text-primary" />,
    },
    nature_exposure: {
      title: "Nature Exposure (Forest Bathing / Greenspace)",
      description: (
        <div className="text-gray-600">
          <p>30-40 minutes exposure to green spaces or natural environments reduces stress and restores mental clarity.</p>
          <div className="mt-3">
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Reduces cortisol (stress hormone) by 10–25%</li>
              <li>Improves cognitive performance and working memory</li>
              <li>Lowers blood pressure and heart rate</li>
              <li>Mindful engagement enhances anxiety and depression reduction</li>
              <li>Benefits last for hours to days after exposure</li>
            </ul>
          </div>
          <div className="mt-2 italic text-sm">
            Why: Natural environments activate parasympathetic nervous system and reduce cognitive fatigue
          </div>
        </div>
      ),
      icon: <Wind className="h-6 w-6 text-primary" />,
    },
    social_connection: {
      title: "Social Connection",
      description: (
        <div className="text-gray-600">
          <p>Strengthen bonds, feel seen and valued, and experience joy or laughter through interaction. These increase oxytocin, dopamine, and serotonin.</p>

          <div className="mt-4 space-y-4">
            {/* Voice Note Roulette */}
            <div className="border border-gray-100 rounded-lg overflow-hidden">
              <div
                className="p-3 bg-blue-50 flex justify-between items-center cursor-pointer"
                onClick={() => toggleSocialPanel("voice-note")}
              >
                <div className="font-medium flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-blue-600" />
                  🎲 Voice Note Roulette
                </div>
                <div className="text-gray-500">
                  {activeSocialPanel === "voice-note" ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </div>
              </div>
              <div className={`p-3 ${activeSocialPanel === "voice-note" ? "" : "hidden"}`}>
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Pick 3 friends or family members and send them a quick voice note:</p>
                  <p className="text-sm mt-1 italic">"Hey, just wanted to send some love today — you're awesome."</p>
                  <p className="text-sm mt-1">Bonus: Add a fun memory you shared together.</p>
                </div>
              </div>
            </div>

            {/* Mini-Date Challenge */}
            <div className="border border-gray-100 rounded-lg overflow-hidden">
              <div
                className="p-3 bg-purple-50 flex justify-between items-center cursor-pointer"
                onClick={() => toggleSocialPanel("mini-date")}
              >
                <div className="font-medium flex items-center">
                  <Heart className="h-4 w-4 mr-2 text-purple-600" />
                  👥 15-Minute 'Mini-Date' Challenge
                </div>
                <div className="text-gray-500">
                  {activeSocialPanel === "mini-date" ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </div>
              </div>
              <div className={`p-3 ${activeSocialPanel === "mini-date" ? "" : "hidden"}`}>
                <div className="p-3 bg-purple-50 border border-purple-100 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Call or meet one person today (can be a friend, neighbor, colleague) and:</p>
                  <p className="text-sm mt-1">Share one good memory + ask them one deeper-than-usual question (e.g., "What's something you're excited about lately?")</p>
                  <p className="text-sm mt-1">If they're not available, send a voice/video message instead.</p>
                </div>
              </div>
            </div>

            {/* Connection Through Curiosity */}
            <div className="border border-gray-100 rounded-lg overflow-hidden">
              <div
                className="p-3 bg-amber-50 flex justify-between items-center cursor-pointer"
                onClick={() => toggleSocialPanel("curiosity")}
              >
                <div className="font-medium flex items-center">
                  <Edit3 className="h-4 w-4 mr-2 text-amber-600" />
                  Connection Through Curiosity
                </div>
                <div className="text-gray-500">
                  {activeSocialPanel === "curiosity" ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </div>
              </div>
              <div className={`p-3 ${activeSocialPanel === "curiosity" ? "" : "hidden"}`}>
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Message 2 people you haven't spoken to in a while and ask:</p>
                  <p className="text-sm mt-1 italic">"What's something unexpected that made you smile this week?"</p>
                  <p className="text-sm mt-1">Frame it as curiosity, not obligation — people love being asked meaningful questions.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 italic text-sm">
            Why: Social connection releases oxytocin and reduces stress, improving mood and emotional resilience
          </div>
        </div>
      ),
      icon: <Phone className="h-6 w-6 text-primary" />,
    },
    act_of_kindness: {
      title: "Act of Kindness",
      description: (
        <div className="text-gray-600">
          <p>Create a wave of positivity. Acts of kindness increase serotonin, endorphins, and reduce stress levels — even when observing others doing them.</p>

          <div className="mt-4 space-y-4">
            {/* Sticky Note Ninja */}
            <div className="border border-gray-100 rounded-lg overflow-hidden">
              <div
                className="p-3 bg-green-50 flex justify-between items-center cursor-pointer"
                onClick={() => toggleKindnessPanel("sticky-note")}
              >
                <div className="font-medium flex items-center">
                  <Edit3 className="h-4 w-4 mr-2 text-green-600" />
                  Sticky Note Ninja
                </div>
                <div className="text-gray-500">
                  {activeKindnessPanel === "sticky-note" ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </div>
              </div>
              <div className={`p-3 ${activeKindnessPanel === "sticky-note" ? "" : "hidden"}`}>
                <div className="p-3 bg-green-50 border border-green-100 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Write 3 kind or funny notes and leave them in public places:</p>
                  <p className="text-sm mt-1">On bathroom mirrors, car windshields, coffee shop tables.</p>
                  <p className="text-sm mt-1 italic">Messages like: "You're more loved than you think." or "Hey, you're crushing it."</p>
                </div>
              </div>
            </div>

            {/* Gratitude Bomb */}
            <div className="border border-gray-100 rounded-lg overflow-hidden">
              <div
                className="p-3 bg-indigo-50 flex justify-between items-center cursor-pointer"
                onClick={() => toggleKindnessPanel("gratitude")}
              >
                <div className="font-medium flex items-center">
                  <Heart className="h-4 w-4 mr-2 text-indigo-600" />
                  Gratitude Bomb
                </div>
                <div className="text-gray-500">
                  {activeKindnessPanel === "gratitude" ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </div>
              </div>
              <div className={`p-3 ${activeKindnessPanel === "gratitude" ? "" : "hidden"}`}>
                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Send a thank-you message to someone who'd never expect it:</p>
                  <p className="text-sm mt-1">Ex-boss, old teacher, friend's mom, security guard, shop owner.</p>
                  <p className="text-sm mt-1 italic">Be specific: "You helped me more than you knew when…"</p>
                </div>
              </div>
            </div>

            {/* Make Someone's Day */}
            <div className="border border-gray-100 rounded-lg overflow-hidden">
              <div
                className="p-3 bg-rose-50 flex justify-between items-center cursor-pointer"
                onClick={() => toggleKindnessPanel("make-day")}
              >
                <div className="font-medium flex items-center">
                  <Music className="h-4 w-4 mr-2 text-rose-600" />
                  Make Someone's Day
                </div>
                <div className="text-gray-500">
                  {activeKindnessPanel === "make-day" ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </div>
              </div>
              <div className={`p-3 ${activeKindnessPanel === "make-day" ? "" : "hidden"}`}>
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Send someone flowers or donate to a charity in their name.</p>
                  <p className="text-sm mt-1">Even a small gesture can create a ripple effect of positivity.</p>
                  <p className="text-sm mt-1 italic">You'll experience a "helper's high" — the endorphin release from giving.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 italic text-sm">
            Why: Kindness activates reward pathways in the brain, releasing dopamine and creating a positive feedback loop
          </div>
        </div>
      ),
      icon: <Heart className="h-6 w-6 text-primary" />,
    },
    dinner: {
      title: "Dinner Time",
      description: (
        <div className="text-gray-600">
          <p>Light, nourishing meal to avoid brain fog and promote restful sleep.</p>
          <div className="mt-2 p-3 bg-green-50 border border-green-100 rounded-lg text-sm font-medium text-green-900">
            Tonight's Option ({selectedDiet}): {getDinnerOption()}
          </div>
          <div className="mt-2 italic text-sm">
            Tip: No eating after 19:00 if possible to let your gut recover overnight.
          </div>
          <button
            type="button"
            onClick={() => document.getElementById("dinner-plan-section")?.scrollIntoView({ behavior: "smooth" })}
            className="mt-3 text-primary font-medium hover:underline inline-flex items-center"
          >
            <ArrowDown className="h-3 w-3 mr-1" /> See full dinner recipes below
          </button>
        </div>
      ),
      icon: <Utensils className="h-6 w-6 text-primary" />,
    },
    vision_board: {
      title: "🔮 Create Your Vision Board",
      description: (
        <div className="text-gray-600">
          <p className="font-medium">Your Light in Picture Form</p>

          <div className="mt-3 space-y-4">
            <div className="border-l-4 border-blue-300 pl-3">
              <h4 className="font-medium text-sm mb-1">🅰️ Paper + Pen Option (best for tactile connection):</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Grab paper, scissors, glue, magazines, or printouts.</li>
                <li>Write words and draw images of what you want: your dream environment, job, relationship, energy, and purpose.</li>
                <li>Don't judge. Let your soul draw it.</li>
              </ul>
            </div>

            <div className="border-l-4 border-purple-300 pl-3">
              <h4 className="font-medium text-sm mb-1">🅱️ Digital Option (for those who prefer tech):</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Use Canva, Pinterest, or even a phone collage app.</li>
                <li>Choose 5–10 pictures that visually represent the life you want.</li>
                <li>Add powerful words like: freedom, love, discipline, clarity, peace, strength.</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg">
            <p className="text-sm font-medium">🔁 Reflection</p>
            <p className="text-sm italic">
              "Look at your board and ask: What is one small step I can take tomorrow to walk toward this life? Write it down."
            </p>
          </div>
        </div>
      ),
      icon: <Palette className="h-6 w-6 text-primary" />,
    },
    evening_movement: {
      title: "Gentle Evening Movement",
      description: (
        <div className="text-gray-600">
          <p>Perform gentle stretching or mobility flow to relax your body before sleep:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
            <li>Neck rolls (5 each direction)</li>
            <li>Shoulder rolls (5 each direction)</li>
            <li>Light spinal twists (hold 10 seconds each side)</li>
            <li>Gentle forward folds to release tension</li>
          </ul>
        </div>
      ),
      icon: <Wind className="h-6 w-6 text-primary" />,
    },
    evening_journal: {
      title: "Quiet Reflection",
      description: (
        <div className="text-gray-600">
          <p>Write a final "3 good things" in your journal:</p>
          <ol className="list-decimal pl-5 space-y-1 mt-2 text-sm">
            <li>One thing you're proud of today</li>
            <li>One thing you learned today</li>
            <li>One thing you're looking forward to tomorrow</li>
          </ol>
          <div className="mt-2 italic text-sm">
            This practice refocuses your brain on positive experiences before sleep
          </div>
        </div>
      ),
      icon: <Edit3 className="h-6 w-6 text-primary" />,
    },
    wind_down: {
      title: "Screen-Free Wind Down",
      description: (
        <div className="text-gray-600">
          <p>Choose one relaxing activity:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
            <li>Read a physical book (fiction/poetry)</li>
            <li>Practice guided imagery</li>
            <li>Listen to sleep meditation</li>
            <li>Gentle breathing exercises</li>
          </ul>
          <div className="mt-2 italic text-sm">
            <strong>Lights out by bedtime</strong> — phone outside the bedroom, bedside lamp on minimal setting or candle only
          </div>
        </div>
      ),
      icon: <Moon className="h-6 w-6 text-primary" />,
    },
  };

  const renderAfternoonEveningPage = (items: ResetItem[]) => {
    const allCompletedOrSkipped =
      items.length > 0 && items.every((i) => i.status === "completed" || i.status === "skipped");

    return (
      <div className="bg-white min-h-screen">
        {/* Header Section with meditation focus background */}
        <section className="relative text-white py-24 px-4 overflow-hidden">
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `linear-gradient(rgba(90, 64, 153, 0.85), rgba(76, 29, 149, 0.8)), url(${focusMeditationImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          <div className="container mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
              Afternoon Flow + Evening Wind Down
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto drop-shadow-md">
              Strengthen discipline &amp; dopamine control. Keep your nervous system calm and sharp. End the day with intention, not autopilot.
            </p>
          </div>
        </section>

        {/* Full Timeline Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              Afternoon &amp; Evening Timeline
            </h2>
            <p className="text-center text-xl mb-8">
              From mindful afternoon nourishment to restorative sleep — your Perfect Day continues
            </p>

            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 top-0 h-full w-1 bg-primary/20"></div>

                {/* Timeline Cards */}
                <div className="space-y-8">
                  {items.map((item, index) => {
                    const step = catalogMapping[item.activityKey] || {
                      title: item.activityKey,
                      description: null,
                      icon: <CheckCircle2 className="h-6 w-6 text-primary" />,
                    };
                    const formattedTime = new Date(item.scheduledAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    });

                    return (
                      <div
                        key={item.id}
                        className={`relative flex flex-col md:flex-row ${
                          index % 2 === 0 ? "md:flex-row-reverse" : ""
                        } items-center md:gap-8`}
                      >
                        {/* Time Indicator */}
                        <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-12 flex items-center justify-center z-10">
                          <div
                            className={`bg-white p-2 rounded-full border-2 ${
                              item.status === "completed"
                                ? "border-green-500"
                                : item.status === "active"
                                ? "border-primary ring-4 ring-primary/20"
                                : "border-gray-300"
                            }`}
                          >
                            <CheckCircle2
                              className={`h-6 w-6 ${
                                item.status === "completed"
                                  ? "text-green-500"
                                  : item.status === "active"
                                  ? "text-primary"
                                  : "text-gray-300"
                              }`}
                            />
                          </div>
                        </div>

                        {/* Time Label */}
                        <div
                          className={`md:w-1/2 text-center md:text-right ${
                            index % 2 === 0 ? "md:text-left" : ""
                          } mb-4 md:mb-0`}
                        >
                          <span
                            className={`text-lg font-bold px-3 py-1 rounded-full ${
                              item.status === "active"
                                ? "bg-primary text-white"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {formattedTime}
                          </span>
                        </div>

                        {/* Step Content */}
                        <div className={`md:w-1/2 ${index % 2 === 0 ? "md:pr-8" : "md:pl-8"}`}>
                          <Card
                            className={`bg-white transition ${
                              item.status === "active"
                                ? "shadow-md border-primary border-2"
                                : "shadow-sm border-none opacity-80"
                            }`}
                          >
                            <CardContent className="p-6">
                              <div className="flex items-start gap-4">
                                <div className="p-3 bg-primary/10 rounded-full">{step.icon}</div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-start mb-2 gap-2">
                                    <h3 className="font-semibold text-lg">{step.title}</h3>
                                    <span
                                      className={`text-xs px-2 py-1 rounded capitalize font-medium ${
                                        item.status === "completed"
                                          ? "bg-green-100 text-green-800"
                                          : item.status === "skipped"
                                          ? "bg-gray-100 text-gray-600"
                                          : item.status === "active"
                                          ? "bg-blue-100 text-blue-800"
                                          : "bg-gray-50 text-gray-500"
                                      }`}
                                    >
                                      {item.status}
                                    </span>
                                  </div>
                                  {step.description}

                                  {item.status === "active" && (
                                    <div className="mt-6 flex flex-col gap-3 pt-4 border-t border-gray-100">
                                      <div className="flex gap-3">
                                        <Button
                                          onClick={async () => {
                                            try {
                                              const res = await completeItem.mutateAsync(item.id);
                                              if (res.resetRun.status === "sleep") {
                                                toast({
                                                  title: "Evening Wind-Down Complete!",
                                                  description:
                                                    "Ready for your Final Reflection & Downloads.",
                                                });
                                                setLocation("/product/reset/reflection");
                                              }
                                            } catch (err: any) {
                                              if (err instanceof ApiError && err.status === 409) {
                                                toast({
                                                  title: "Your Reset state changed. Refreshing...",
                                                });
                                                refetch();
                                              } else {
                                                toast({
                                                  title: "Something went wrong",
                                                  description: err.message,
                                                  variant: "destructive",
                                                });
                                              }
                                            }
                                          }}
                                          disabled={
                                            completeItem.isPending ||
                                            skipItem.isPending ||
                                            delayItem.isPending
                                          }
                                          className="flex-1"
                                        >
                                          {completeItem.isPending ? (
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                          ) : null}
                                          Mark Complete
                                        </Button>
                                        <Button
                                          variant="outline"
                                          onClick={async () => {
                                            try {
                                              const res = await skipItem.mutateAsync(item.id);
                                              if (res.resetRun.status === "sleep") {
                                                toast({
                                                  title: "Evening Wind-Down Complete!",
                                                  description:
                                                    "Ready for your Final Reflection & Downloads.",
                                                });
                                                setLocation("/product/reset/reflection");
                                              }
                                            } catch (err: any) {
                                              if (err instanceof ApiError && err.status === 409) {
                                                toast({
                                                  title: "Your Reset state changed. Refreshing...",
                                                });
                                                refetch();
                                              } else {
                                                toast({
                                                  title: "Something went wrong",
                                                  description: err.message,
                                                  variant: "destructive",
                                                });
                                              }
                                            }
                                          }}
                                          disabled={
                                            completeItem.isPending ||
                                            skipItem.isPending ||
                                            delayItem.isPending
                                          }
                                        >
                                          {skipItem.isPending ? (
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                          ) : null}
                                          Skip
                                        </Button>
                                      </div>

                                      <div className="flex items-center gap-2 pt-2">
                                        <span className="text-xs text-gray-500 font-medium mr-1">
                                          Delay:
                                        </span>
                                        {([5, 10, 15, 30] as const).map((mins) => (
                                          <Button
                                            key={mins}
                                            variant="secondary"
                                            size="sm"
                                            className="h-7 text-xs px-2"
                                            onClick={async () => {
                                              try {
                                                await delayItem.mutateAsync({
                                                  itemId: item.id,
                                                  delayMinutes: mins,
                                                  expectedScheduleRevision:
                                                    currentReset!.resetRun.scheduleRevision,
                                                });
                                              } catch (err: any) {
                                                if (
                                                  err instanceof ApiError &&
                                                  err.status === 409 &&
                                                  err.message.includes("changed")
                                                ) {
                                                  toast({
                                                    title:
                                                      "Your schedule changed. We've refreshed it.",
                                                  });
                                                  refetch();
                                                } else {
                                                  toast({
                                                    title: "Cannot delay",
                                                    description: err.message,
                                                    variant: "destructive",
                                                  });
                                                }
                                              }
                                            }}
                                            disabled={
                                              completeItem.isPending ||
                                              skipItem.isPending ||
                                              delayItem.isPending
                                            }
                                          >
                                            +{mins}m
                                          </Button>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dinner Options Section */}
        <section id="dinner-plan-section" className="py-12 px-4 bg-gray-50">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold text-center mb-6">Your Dinner Options</h3>
              <p className="text-center text-gray-600 mb-8">
                Light, nourishing meals to avoid brain fog and promote restful sleep
              </p>

              <Tabs
                defaultValue={selectedDiet}
                className="w-full"
                value={selectedDiet}
                onValueChange={handleDietChange}
              >
                <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full mb-8">
                  <TabsTrigger value="omni">Omni Reset</TabsTrigger>
                  <TabsTrigger value="vegetarian">Vegetarian</TabsTrigger>
                  <TabsTrigger value="vegan">Vegan</TabsTrigger>
                  <TabsTrigger value="gluten-free">Gluten-Free</TabsTrigger>
                  <TabsTrigger value="keto">Low-Carb</TabsTrigger>
                </TabsList>

                <TabsContent value="omni">
                  <Card>
                    <CardContent className="p-6">
                      <h4 className="font-semibold mb-3">
                        Grilled turkey with greens and sweet potato
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>4 oz turkey breast cutlet</li>
                        <li>1 medium sweet potato, baked</li>
                        <li>2 cups steamed greens (kale, spinach, or broccoli)</li>
                        <li>1 tablespoon olive oil</li>
                        <li>Herbs and spices to taste</li>
                      </ul>
                      <p className="mt-4 text-gray-600">
                        Season turkey with herbs and grill until done. Serve with baked sweet potato and steamed greens drizzled with olive oil.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="vegetarian">
                  <Card>
                    <CardContent className="p-6">
                      <h4 className="font-semibold mb-3">
                        Roasted vegetables with hummus and quinoa
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>1 cup mixed roasted vegetables (bell peppers, zucchini, eggplant)</li>
                        <li>1/2 cup cooked quinoa</li>
                        <li>3 tablespoons hummus</li>
                        <li>1 tablespoon tahini</li>
                        <li>Fresh herbs and lemon juice</li>
                      </ul>
                      <p className="mt-4 text-gray-600">
                        Arrange roasted vegetables and quinoa in a bowl. Top with hummus, drizzle with tahini, and garnish with fresh herbs and lemon juice.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="vegan">
                  <Card>
                    <CardContent className="p-6">
                      <h4 className="font-semibold mb-3">
                        Chickpea &amp; kale stir-fry with quinoa
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>1/2 cup cooked chickpeas</li>
                        <li>2 cups chopped kale</li>
                        <li>1/2 cup diced vegetables (carrots, onions, bell peppers)</li>
                        <li>1/2 cup cooked quinoa</li>
                        <li>1 teaspoon coconut oil</li>
                        <li>1 teaspoon curry powder or spices of choice</li>
                      </ul>
                      <p className="mt-4 text-gray-600">
                        Sauté vegetables in coconut oil until tender. Add chickpeas, kale, and spices. Cook until kale is wilted. Serve over quinoa.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="gluten-free">
                  <Card>
                    <CardContent className="p-6">
                      <h4 className="font-semibold mb-3">
                        Grilled salmon with steamed vegetables and rice
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>4 oz wild-caught salmon fillet</li>
                        <li>1.5 cups mixed steamed vegetables</li>
                        <li>1/3 cup cooked brown rice</li>
                        <li>1 tablespoon olive oil</li>
                        <li>Fresh lemon and herbs</li>
                      </ul>
                      <p className="mt-4 text-gray-600">
                        Season salmon with herbs and grill until just cooked through. Serve with steamed vegetables and brown rice drizzled with olive oil and fresh lemon.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="keto">
                  <Card>
                    <CardContent className="p-6">
                      <h4 className="font-semibold mb-3">
                        Zucchini noodles with pesto and protein
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>2 medium zucchini, spiralized</li>
                        <li>4 oz protein (chicken or tofu)</li>
                        <li>2 tablespoons pesto (oil, basil, pine nuts)</li>
                        <li>1 tablespoon olive oil</li>
                        <li>1 tablespoon nutritional yeast or parmesan</li>
                      </ul>
                      <p className="mt-4 text-gray-600">
                        Sauté zucchini noodles in olive oil for 2-3 minutes. Separately cook your protein. Toss zucchini with pesto and top with your protein and nutritional yeast or parmesan.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Tip Box */}
              <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="text-yellow-500">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Tip</h4>
                    <p className="text-gray-700">
                      No eating after 19:00 if possible. Let your gut recover overnight.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold mb-6">
              {allCompletedOrSkipped
                ? "Your Afternoon & Evening Protocol is Complete!"
                : "Finish Your Evening Wind-Down & Continue to Reflection"}
            </h2>
            <p className="text-xl mb-8">
              Congratulations on progressing through your Perfect Day Reset. You've taken a powerful step toward reclaiming your mental clarity, physical energy, and sense of purpose.
            </p>

            <div className="relative py-16 px-6 mb-12 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl">
              <blockquote className="text-2xl md:text-3xl font-medium italic text-center">
                "You have now lived the day most people only dream about. And you'll do it again — better."
              </blockquote>
              <p className="mt-6 text-xl text-center">This is how change begins.</p>
            </div>

            <Link href="/product/reset/reflection">
              <Button size="lg" className="px-8 py-6 text-lg rounded-full font-medium">
                Continue to Final Reflection + Downloads{" "}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (resetError && (resetError as ApiError).status === 401) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">Session Expired</h2>
        <p className="text-gray-600 mb-4">Please log in to continue your Reset.</p>
        <Link href="/login">
          <Button>Log In</Button>
        </Link>
      </div>
    );
  }

  const afternoonEveningItems =
    currentReset && currentReset.items.length > 0
      ? [...currentReset.items]
          .filter((i) => i.phase === "afternoon" || i.phase === "evening")
          .sort((a, b) => a.sequence - b.sequence)
      : getDefaultPhaseItems("afternoon_evening");

  return (
    <>
      <PortalNavBar />
      {currentReset?.currentItem &&
        (currentReset.currentItem.phase === "afternoon" ||
          currentReset.currentItem.phase === "evening") && (
          <div className="bg-primary text-primary-foreground text-center p-2 text-sm font-medium">
            Current active step:{" "}
            {catalogMapping[currentReset.currentItem.activityKey]?.title ||
              currentReset.currentItem.activityKey}
          </div>
        )}
      {renderAfternoonEveningPage(afternoonEveningItems)}
    </>
  );
}