import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { 
  ArrowRight, 
  ArrowDown,
  Clock, 
  Brain, 
  Dumbbell, 
  Utensils, 
  Pill, 
  Heart, 
  CheckCircle2,
  AlertCircle,
  Droplets,
  ThermometerSnowflake,
  PencilLine,
  Palette,
  Briefcase,
  Plus,
  Minus,
  Youtube
} from "lucide-react";
import { Link, useLocation } from "wouter";
import beachExerciseImage from "@assets/16x9_A_vibrant_array_of_modern_sports.png";
import { useCurrentReset, useCompleteItem, useSkipItem, useDelayItem } from "@/lib/reset-api";
import { toast } from "@/hooks/use-toast";
import { ApiError } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";

export default function ProductPage3() {
  const [, setLocation] = useLocation();
  const { data: currentReset, isLoading, error: resetError, refetch } = useCurrentReset();
  const completeItem = useCompleteItem();
  const skipItem = useSkipItem();
  const delayItem = useDelayItem();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // State that would normally be passed from previous pages
  const [selectedDiet, setSelectedDiet] = useState<string>("omni");
  const [activeTaskPanel, setActiveTaskPanel] = useState<string | null>(null);
  const [activeMovementPanel, setActiveMovementPanel] = useState<string | null>(null);
  
  // Function to toggle task panels
  const toggleTaskPanel = (panelId: string) => {
    if (activeTaskPanel === panelId) {
      setActiveTaskPanel(null);
    } else {
      setActiveTaskPanel(panelId);
    }
  };
  
  // Function to toggle movement panels
  const toggleMovementPanel = (panelId: string) => {
    if (activeMovementPanel === panelId) {
      setActiveMovementPanel(null);
    } else {
      setActiveMovementPanel(panelId);
    }
  };
  
  // Get lunch options based on selected diet
  const getLunchOption = () => {
    switch(selectedDiet) {
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

  const catalogMapping: Record<string, any> = {
    "focus_sprint": {
      title: "Light Focus Sprint",
      description: <div className="text-gray-600">
        Choose from the categories below. No phone. No multitasking. Work in full flow for 90 minutes.
        <div className="mt-2 mb-3 p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
          <div className="font-medium text-sm mb-1">Time Management Options:</div>
          <div className="text-sm">
            • Choose one task for a deep 90-minute session<br />
            • Or select two tasks for 45 minutes each
          </div>
        </div>
        
        <div className="mt-4 space-y-4">
          {/* Reflective Tasks */}
          <div className="border border-gray-100 rounded-lg overflow-hidden">
            <div 
              className="p-3 bg-blue-50 flex justify-between items-center cursor-pointer"
              onClick={() => toggleTaskPanel('reflective')}
            >
              <div className="font-medium flex items-center">
                <PencilLine className="h-4 w-4 mr-2 text-blue-600" />
                💭 Reflective Tasks
              </div>
              <div className="text-gray-500">
                {activeTaskPanel === 'reflective' ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </div>
            </div>
            <div className={`p-3 ${activeTaskPanel === 'reflective' ? '' : 'hidden'}`}>
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="text-sm space-y-3">
                  <div>
                    <div className="font-medium mb-1">Guided Journaling</div>
                    <div>Reflect on personal growth or set intentions.</div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Mind Mapping</div>
                    <div>Visualize goals and steps to achieve them.</div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Gratitude List</div>
                    <div>Write down 10 things you're grateful for — big or small — to elevate mood and reframe perspective.</div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Life Audit</div>
                    <div>Evaluate core areas of life (health, work, relationships, finances) and note where you feel aligned or off-balance.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Creative Tasks */}
          <div className="border border-gray-100 rounded-lg overflow-hidden">
            <div 
              className="p-3 bg-purple-50 flex justify-between items-center cursor-pointer"
              onClick={() => toggleTaskPanel('creative')}
            >
              <div className="font-medium flex items-center">
                <Palette className="h-4 w-4 mr-2 text-purple-600" />
                🎨 Creative Tasks
              </div>
              <div className="text-gray-500">
                {activeTaskPanel === 'creative' ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </div>
            </div>
            <div className={`p-3 ${activeTaskPanel === 'creative' ? '' : 'hidden'}`}>
              <div className="p-3 bg-purple-50 border border-purple-100 rounded-lg">
                <div className="text-sm space-y-3">
                  <div>
                    <div className="font-medium mb-1">Artistic Expression</div>
                    <div>Engage in drawing, painting, or crafting.</div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Creative Writing</div>
                    <div>Write a short story or poem.</div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Mood Board Creation</div>
                    <div>Use magazine clippings, digital tools, or drawings to create a visual of your dream lifestyle or next big goal.</div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">DIY or Mini Project</div>
                    <div>Build, fold origami, or make something simple from scratch (e.g., hand-written card, vision jar, small sculpture).</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Productive Tasks */}
          <div className="border border-gray-100 rounded-lg overflow-hidden">
            <div 
              className="p-3 bg-amber-50 flex justify-between items-center cursor-pointer"
              onClick={() => toggleTaskPanel('productive')}
            >
              <div className="font-medium flex items-center">
                <Briefcase className="h-4 w-4 mr-2 text-amber-600" />
                💪 Productive Tasks
              </div>
              <div className="text-gray-500">
                {activeTaskPanel === 'productive' ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </div>
            </div>
            <div className={`p-3 ${activeTaskPanel === 'productive' ? '' : 'hidden'}`}>
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                <div className="text-sm space-y-3">
                  <div>
                    <div className="font-medium mb-1">Organizational Sprint</div>
                    <div>Declutter a workspace or organize digital files.</div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Skill Development</div>
                    <div>Learn a new tool or technique relevant to personal or professional growth.</div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Inbox Zero Challenge</div>
                    <div>Process and archive all emails or messages for a mental clarity boost.</div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Future Planning Session</div>
                    <div>Sketch out the next 7–14 days in your calendar with top goals, habits, or projects — align time with intention.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>,
      icon: <Brain className="h-6 w-6 text-primary" />
    },
    "midday_movement": {
      title: "Midday Movement (60 Minutes)",
      description: <div className="text-gray-600">
        <p className="text-sm mb-3">
          A full hour of intentional movement boosts endorphins, lowers cortisol, improves mood, sharpens focus, and supports metabolism.
        </p>
        
        <div className="mt-4 space-y-4">
          {/* No Equipment */}
          <div className="border border-gray-100 rounded-lg overflow-hidden">
            <div 
              className="p-3 bg-blue-50 flex justify-between items-center cursor-pointer"
              onClick={() => toggleMovementPanel('no-equipment')}
            >
              <div className="font-medium flex items-center">
                <Dumbbell className="h-4 w-4 mr-2 text-blue-600" />
                🧍‍♂️ No Equipment (Home or Outdoors)
              </div>
              <div className="text-gray-500">
                {activeMovementPanel === 'no-equipment' ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </div>
            </div>
            <div className={`p-3 ${activeMovementPanel === 'no-equipment' ? '' : 'hidden'}`}>
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Move freely with bodyweight training, nature walks, or gentle flow.</p>
                <div className="text-sm space-y-3">
                  <div>
                    <div className="font-medium mb-1">Option 1: Power Walk + Mobility Flow</div>
                    <div>30 min fast walk + 30 min stretching</div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Option 2: Bodyweight Circuit</div>
                    <div>Squats, push-ups, planks, jumping jacks</div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Option 3: Outdoor Nature Flow</div>
                    <div>Walk + lunges + yoga on grass</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Gear-Based */}
          <div className="border border-gray-100 rounded-lg overflow-hidden">
            <div 
              className="p-3 bg-purple-50 flex justify-between items-center cursor-pointer"
              onClick={() => toggleMovementPanel('gear-based')}
            >
              <div className="font-medium flex items-center">
                <Dumbbell className="h-4 w-4 mr-2 text-purple-600" />
                🚴 Gear-Based (Bike or Sports Equipment)
              </div>
              <div className="text-gray-500">
                {activeMovementPanel === 'gear-based' ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </div>
            </div>
            <div className={`p-3 ${activeMovementPanel === 'gear-based' ? '' : 'hidden'}`}>
              <div className="p-3 bg-purple-50 border border-purple-100 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">If you have access to a ball, bike, or similar gear — use it with joy.</p>
                <div className="text-sm space-y-3">
                  <div>
                    <div className="font-medium mb-1">Option 1: 60 min Bike Ride</div>
                    <div>Steady pace or intervals</div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Option 2: Solo Basketball/Football Drills</div>
                    <div>Dynamic movements and skills practice</div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Option 3: Rollerblading / Skate / Paddleboard</div>
                    <div>Any movement that brings you joy</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Gym Access */}
          <div className="border border-gray-100 rounded-lg overflow-hidden">
            <div 
              className="p-3 bg-amber-50 flex justify-between items-center cursor-pointer"
              onClick={() => toggleMovementPanel('gym-access')}
            >
              <div className="font-medium flex items-center">
                <Dumbbell className="h-4 w-4 mr-2 text-amber-600" />
                🏋️ Gym Access
              </div>
              <div className="text-gray-500">
                {activeMovementPanel === 'gym-access' ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </div>
            </div>
            <div className={`p-3 ${activeMovementPanel === 'gym-access' ? '' : 'hidden'}`}>
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Put your membership to good use — focus, move with intent.</p>
                <div className="text-sm space-y-3">
                  <div>
                    <div className="font-medium mb-1">Option 1: Full-body Strength</div>
                    <div>Machines or free weights</div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Option 2: Treadmill HIIT + Core Circuit</div>
                    <div>Alternating cardio and strength</div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Option 3: Group Class</div>
                    <div>Spinning, Functional, BodyPump</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Follow-Along Video */}
          <div className="border border-gray-100 rounded-lg overflow-hidden">
            <div 
              className="p-3 bg-green-50 flex justify-between items-center cursor-pointer"
              onClick={() => toggleMovementPanel('follow-along')}
            >
              <div className="font-medium flex items-center">
                <Dumbbell className="h-4 w-4 mr-2 text-green-600" />
                📺 Follow-Along Video (YouTube-Based)
              </div>
              <div className="text-gray-500">
                {activeMovementPanel === 'follow-along' ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </div>
            </div>
            <div className={`p-3 ${activeMovementPanel === 'follow-along' ? '' : 'hidden'}`}>
              <div className="p-3 bg-green-50 border border-green-100 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">No thinking required — follow a top trainer and sweat with ease.</p>
                <div className="text-sm space-y-3">
                  <div>
                    <div className="font-medium mb-1">Option 1: 60-Minute Full Body Workout</div>
                    <div><a href="https://www.youtube.com/watch?v=BHNtFY-MSnU" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Watch full-body workout video</a></div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Option 2: Dynamic Yoga or Pilates Flow</div>
                    <div><a href="https://www.youtube.com/watch?v=Pork_4_mGRA" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Watch yoga flow video</a></div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Option 3: Dance Workout</div>
                    <div><a href="https://www.youtube.com/watch?v=s3F6R92s6_o" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Watch dance workout video</a></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-lg">
          <div className="font-medium mb-2">✅ Benefits You'll Feel Instantly:</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" /> Mental clarity
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" /> Energy boost
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" /> Deeper sleep tonight
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" /> Better posture & digestion
            </div>
            <div className="flex items-center col-span-2">
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" /> Sense of achievement
            </div>
          </div>
        </div>
      </div>,
      icon: <Dumbbell className="h-6 w-6 text-primary" />
    },
    "cold_shower": {
      title: "Cold Shower Reset",
      description: <div>
        <p className="text-gray-600 mb-2">A 2-5 minute cold shower to boost circulation, mood, and immunity.</p>
        <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
          <div className="font-medium text-sm mb-2">Benefits of Cold Exposure:</div>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
            <li>Increases alertness and energy</li>
            <li>Reduces inflammation</li>
            <li>Boosts immune function</li>
            <li>Improves mood and mental clarity</li>
            <li>Enhances circulation</li>
          </ul>
          <div className="mt-2">
            <details className="cursor-pointer">
              <summary className="font-medium text-sm">Beginner's Guide</summary>
              <div className="mt-2 text-sm text-gray-700">
                <p>Start with a normal shower, then gradually turn temperature to cold for the last 30 seconds. Each day, increase cold exposure time until you can do 2-5 minutes. Focus on controlled breathing to manage the initial shock.</p>
              </div>
            </details>
          </div>
        </div>
      </div>,
      icon: <Droplets className="h-6 w-6 text-primary" />
    }
  };

  const renderMiddayContent = (middayItems: any[]) => (
    <div className="bg-white min-h-screen">
      {/* Hero Section with beach exercise background */}
      <section className="relative text-white py-24 px-4 overflow-hidden">
        {/* Background image with overlay */}
        <div 
          className="absolute inset-0 z-0" 
          style={{
            backgroundImage: `linear-gradient(rgba(76, 175, 80, 0.85), rgba(59, 145, 70, 0.8)), url(${beachExerciseImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">Now we move with purpose.</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto drop-shadow-md">
            Your energy is building. Let's channel it into flow. Clear focus. Clean food. Inner calm. This is your time.
          </p>
        </div>
      </section>

      {/* Midday Timeline Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Midday Timeline (10:30 – 15:30)</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 top-0 h-full w-1 bg-primary/20"></div>
              
              <div className="space-y-8">
                {middayItems.map((item, index) => {
                  const uiData = catalogMapping[item.activityKey];
                  if (!uiData) {
                    return (
                      <div key={item.id} className="text-center p-4 bg-gray-50 rounded-lg text-sm text-gray-500">
                        This activity cannot be displayed right now.
                      </div>
                    );
                  }

                  const isActive = item.status === 'active';
                  const isCompleted = item.status === 'completed';
                  const isSkipped = item.status === 'skipped';
                  
                  return (
                  <div key={item.id} className={`relative flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} items-center md:gap-8 ${!isActive && item.status !== 'scheduled' ? 'opacity-75' : ''}`}>
                    {/* Time Indicator */}
                    <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-12 flex items-center justify-center z-10">
                      <div className={`bg-white p-2 rounded-full border-2 ${isActive ? 'border-blue-500' : isCompleted ? 'border-green-500' : 'border-gray-200'}`}>
                        {isCompleted ? <CheckCircle2 className="h-6 w-6 text-green-500" /> : <Clock className={`h-6 w-6 ${isActive ? 'text-blue-500' : 'text-gray-300'}`} />}
                      </div>
                    </div>
                    
                    {/* Time Label */}
                    <div className={`md:w-1/2 text-center md:text-right ${index % 2 === 0 ? 'md:text-left' : ''} mb-4 md:mb-0`}>
                      <span className="text-lg font-bold bg-primary text-white px-3 py-1 rounded-full">
                        {new Date(item.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    
                    {/* Step Content */}
                    <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                      <Card className={`bg-white shadow-sm transition border ${isActive ? 'border-blue-200 shadow-md ring-1 ring-blue-50' : 'border-transparent'}`}>
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-primary/10 rounded-full">
                              {uiData.icon}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-2">{uiData.title} {item.isOptional && <span className="text-xs font-normal text-gray-500 ml-2">(Optional)</span>}</h3>
                              <div className="text-gray-600">{uiData.description}</div>
                              
                              {isCompleted && <p className="text-sm font-medium text-green-600 mt-4">✓ Completed</p>}
                              {isSkipped && <p className="text-sm font-medium text-gray-500 mt-4">Skipped</p>}
                              
                              {isActive && currentReset!.currentItem?.id === item.id && (
                                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                                  <Button 
                                    size="sm"
                                    onClick={async () => {
                                      try {
                                        const res = await completeItem.mutateAsync(item.id);
                                        toast({ title: "Activity completed" });
                                        if (res.resetRun.status === 'active' && res.resetRun.phase === 'afternoon') {
                                          setLocation('/product/reset/afternoon');
                                        }
                                      } catch (err: any) {
                                        if (err.status === 409 && err.message.includes("Reset schedule has changed")) {
                                          toast({ title: "Your schedule changed. We've refreshed it." });
                                          refetch();
                                        } else {
                                          toast({ title: "Cannot complete", description: err.message, variant: "destructive" });
                                        }
                                      }
                                    }}
                                    disabled={completeItem.isPending || skipItem.isPending || delayItem.isPending}
                                  >
                                    {completeItem.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                                    Complete
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={async () => {
                                      try {
                                        const res = await skipItem.mutateAsync(item.id);
                                        toast({ title: "Activity skipped" });
                                        if (res.resetRun.status === 'active' && res.resetRun.phase === 'afternoon') {
                                          setLocation('/product/reset/afternoon');
                                        }
                                      } catch (err: any) {
                                        if (err.status === 409 && err.message.includes("Reset schedule has changed")) {
                                          toast({ title: "Your schedule changed. We've refreshed it." });
                                          refetch();
                                        } else {
                                          toast({ title: "Cannot skip", description: err.message, variant: "destructive" });
                                        }
                                      }
                                    }}
                                    disabled={completeItem.isPending || skipItem.isPending || delayItem.isPending}
                                  >
                                    Skip
                                  </Button>
                                  
                                  <div className="flex gap-1 ml-auto">
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      className="text-xs px-2"
                                      onClick={async () => {
                                        try {
                                          await delayItem.mutateAsync({
                                            itemId: item.id,
                                            delayMinutes: 15,
                                            expectedScheduleRevision: currentReset!.resetRun.scheduleRevision
                                          });
                                          toast({ title: "Schedule updated", description: "+15 minutes" });
                                        } catch (err: any) {
                                          if (err.status === 409 && err.message.includes("Reset schedule has changed")) {
                                            toast({ title: "Your schedule changed. We've refreshed it." });
                                            refetch();
                                          } else {
                                            toast({ title: "Cannot delay", description: err.message, variant: "destructive" });
                                          }
                                        }
                                      }}
                                      disabled={completeItem.isPending || skipItem.isPending || delayItem.isPending}
                                    >
                                      +15m
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="ghost" 
                                      className="text-xs px-2"
                                      onClick={async () => {
                                        try {
                                          await delayItem.mutateAsync({
                                            itemId: item.id,
                                            delayMinutes: 30,
                                            expectedScheduleRevision: currentReset!.resetRun.scheduleRevision
                                          });
                                          toast({ title: "Schedule updated", description: "+30 minutes" });
                                        } catch (err: any) {
                                          if (err.status === 409 && err.message.includes("Reset schedule has changed")) {
                                            toast({ title: "Your schedule changed. We've refreshed it." });
                                            refetch();
                                          } else {
                                            toast({ title: "Cannot delay", description: err.message, variant: "destructive" });
                                          }
                                        }
                                      }}
                                      disabled={completeItem.isPending || skipItem.isPending || delayItem.isPending}
                                    >
                                      +30m
                                    </Button>
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
      
      {/* Meal Options Section */}
      <section id="meal-plan-section" className="py-12 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-6">Your Lunch Options</h3>
            <p className="text-center text-gray-600 mb-8">Each option is anti-inflammatory, brain-boosting, and mood-lifting</p>
            
            <Tabs 
              defaultValue={selectedDiet} 
              className="w-full"
              value={selectedDiet}
              onValueChange={setSelectedDiet}
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
                    <h4 className="font-semibold mb-3">Quinoa bowl with grilled chicken</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>1/2 cup cooked quinoa</li>
                      <li>4 oz grilled chicken breast, sliced</li>
                      <li>1/4 avocado, diced</li>
                      <li>1 cup fresh spinach</li>
                      <li>1 tablespoon pumpkin seeds</li>
                      <li>1 tablespoon extra virgin olive oil</li>
                      <li>Salt, pepper, and lemon juice to taste</li>
                    </ul>
                    <p className="mt-4 text-gray-600">Layer quinoa in bowl, add spinach, top with chicken and avocado. Sprinkle with pumpkin seeds and drizzle olive oil. Season to taste.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="vegetarian">
                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-3">Halloumi salad with nuts and greens</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>3 oz halloumi cheese, grilled or pan-fried</li>
                      <li>2 cups mixed greens</li>
                      <li>1/4 cup mixed nuts (walnuts, almonds)</li>
                      <li>1/4 cup cherry tomatoes, halved</li>
                      <li>1 tablespoon olive oil</li>
                      <li>1/2 lemon, juiced</li>
                      <li>Fresh herbs (optional)</li>
                    </ul>
                    <p className="mt-4 text-gray-600">Grill halloumi until golden. Toss greens with nuts and tomatoes. Top with halloumi and dress with olive oil and lemon juice.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="vegan">
                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-3">Lentil and sweet potato curry</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>1/2 cup cooked brown or red lentils</li>
                      <li>1/2 medium sweet potato, cubed and roasted</li>
                      <li>1/4 cup coconut milk</li>
                      <li>1/2 tsp curry powder</li>
                      <li>1/4 tsp turmeric</li>
                      <li>1/4 cup cooked brown rice</li>
                      <li>Fresh cilantro for garnish</li>
                    </ul>
                    <p className="mt-4 text-gray-600">Heat lentils with coconut milk and spices. Add roasted sweet potato. Serve over brown rice and garnish with cilantro.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="gluten-free">
                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-3">Grilled salmon with broccoli and tahini</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>4 oz wild-caught salmon fillet</li>
                      <li>1.5 cups steamed broccoli</li>
                      <li>1 tablespoon tahini</li>
                      <li>1/2 lemon, juiced</li>
                      <li>1 teaspoon olive oil</li>
                      <li>Fresh dill (optional)</li>
                      <li>Salt and pepper to taste</li>
                    </ul>
                    <p className="mt-4 text-gray-600">Season and grill salmon. Steam broccoli until bright green. Mix tahini with lemon juice and a splash of water to thin. Drizzle over the fish and vegetables.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="keto">
                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-3">Grilled salmon with broccoli and tahini</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>4 oz wild-caught salmon fillet</li>
                      <li>1.5 cups steamed broccoli</li>
                      <li>1 tablespoon tahini</li>
                      <li>1/2 lemon, juiced</li>
                      <li>1 tablespoon extra virgin olive oil</li>
                      <li>1/2 avocado (optional)</li>
                      <li>Salt and pepper to taste</li>
                    </ul>
                    <p className="mt-4 text-gray-600">Season and grill salmon. Steam broccoli until bright green. Mix tahini with lemon juice and olive oil. Drizzle over fish and vegetables. Add avocado for extra healthy fats.</p>
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
                  <p className="text-gray-700">Avoid sugar, white bread, or fried foods right now. You'll thank yourself in 90 minutes.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      
      {/* CTA Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Energized and renewed! Now channel this clarity into your afternoon of focused achievement and purposeful calm.</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">You've nourished your body, refreshed your mind, and reset your energy. The foundation is set for your most productive and balanced afternoon yet.</p>
          
          <div className="text-gray-500 italic">
            Complete your midday activities above to unlock the Afternoon Reset.
          </div>
        </div>
      </section>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (resetError) {
    if ((resetError as ApiError).status === 401) {
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
    
    if ((resetError as ApiError).status === 404) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
          <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-bold mb-2">No Active Reset</h2>
          <p className="text-gray-600 mb-4">You haven't set up a Perfect Day Reset yet.</p>
          <Link href="/product/reset/welcome">
            <Button>Start Your Reset</Button>
          </Link>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">Error Loading Reset</h2>
        <p className="text-gray-600 mb-4">{(resetError as Error).message}</p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  if (!currentReset) return null;

  const status = currentReset.resetRun.status;
  const phase = currentReset.resetRun.phase;

  if (status === 'ready') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <AlertCircle className="h-12 w-12 text-blue-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Your Reset hasn't started yet.</h2>
        <p className="text-gray-600 mb-6">Head back to the start page to begin.</p>
        <Link href="/product/reset/welcome">
          <Button>Go to Setup</Button>
        </Link>
      </div>
    );
  }

  if (status === 'sleep') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Your Reset is in the overnight recovery phase.</h2>
        <p className="text-gray-400 mb-6">Rest well. Your next check-in is tomorrow morning.</p>
      </div>
    );
  }

  if (status === 'next_morning') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 p-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Your next-morning check-in is ready.</h2>
        <p className="text-gray-600 mb-6">Complete your final reflections to finish your Reset.</p>
      </div>
    );
  }

  if (status === 'completed') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-4 text-center">
        <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
        <h2 className="text-3xl font-bold mb-2">Your Reset is complete.</h2>
        <p className="text-gray-600 mb-6">Congratulations on completing your Perfect Day Reset.</p>
      </div>
    );
  }

  if (status === 'active') {
    if (phase === 'morning') {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
          <AlertCircle className="h-12 w-12 text-blue-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">You are currently in the Morning phase.</h2>
          <p className="text-gray-600 mb-6">Complete your morning activities to unlock midday.</p>
          <Link href="/product/reset/morning">
            <Button>Go to Morning</Button>
          </Link>
        </div>
      );
    }
    
    if (phase === 'afternoon' || phase === 'evening') {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
          <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Midday Complete</h2>
          <p className="text-gray-600 mb-6">Your Reset has progressed beyond this phase.</p>
          <Link href={`/product/reset/${phase}`}>
            <Button>Continue to {phase.charAt(0).toUpperCase() + phase.slice(1)}</Button>
          </Link>
        </div>
      );
    }

    if (phase === 'midday') {
      const middayItems = [...currentReset.items]
        .filter(i => i.phase === 'midday')
        .sort((a, b) => a.sequence - b.sequence);
      const activeItems = currentReset.items.filter(i => i.status === 'active');
      
      // Integrity check
      if (
        activeItems.length !== 1 || 
        !currentReset.currentItem || 
        currentReset.currentItem.status !== 'active' || 
        currentReset.currentItem.id !== activeItems[0].id ||
        currentReset.currentItem.phase !== 'midday'
      ) {
        return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
            <AlertCircle className="h-12 w-12 text-amber-500 mb-4" />
            <h2 className="text-xl font-bold mb-2">State Synchronizing...</h2>
            <p className="text-gray-600 mb-4">Please wait while your Reset state updates.</p>
            <Button onClick={() => refetch()}>Refresh Page</Button>
          </div>
        );
      }

      return renderMiddayContent(middayItems);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
      <h2 className="text-xl font-bold mb-2">Unknown State</h2>
      <p className="text-gray-600 mb-4">We couldn't determine your Reset phase.</p>
    </div>
  );
}