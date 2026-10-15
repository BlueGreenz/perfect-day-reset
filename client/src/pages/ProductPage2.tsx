import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, ArrowDown, Clock, Coffee, Utensils, Pill, Sunrise, Wind, Heart, CheckCircle2, Youtube, Sun, TreePine, Loader2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import morningImage from "@assets/16x9_the_morning_sun_on_a_plant_fille.webp";
import { useCurrentReset, useCompleteItem, useSkipItem, useDelayItem } from "@/lib/reset-api";
import { toast } from "@/hooks/use-toast";
import { ApiError } from "@/lib/queryClient";

export default function ProductPage2() {
  const [, setLocation] = useLocation();
  const { data: currentReset, isLoading, error: resetError, refetch } = useCurrentReset();
  const completeItem = useCompleteItem();
  const skipItem = useSkipItem();
  const delayItem = useDelayItem();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // This will come from the previous page in a real implementation
  const [selectedDiet, setSelectedDiet] = useState<string>("omni");

  useEffect(() => {
    const pref = currentReset?.resetRun?.foodPreference;
    if (pref) {
      setSelectedDiet(pref === "paleo" ? "gluten-free" : pref);
    }
  }, [currentReset?.resetRun?.foodPreference]);
  
  // Function to scroll to meal plan section
  const scrollToMealPlan = () => {
    const mealPlanSection = document.getElementById("meal-plan-section");
    if (mealPlanSection) {
      mealPlanSection.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  // Get breakfast options based on selected diet
  const getBreakfastOption = () => {
    switch(selectedDiet) {
      case "omni":
        return "Omega Brain Bowl (eggs, avocado, spinach, chia seeds)";
      case "vegetarian":
        return "Greek Yogurt & Berry Parfait with flax seeds and walnuts";
      case "vegan":
        return "Chia Pudding with Almond Butter and banana";
      case "gluten-free":
        return "Buckwheat Porridge with berries and pumpkin seeds";
      case "keto":
        return "Keto Avocado Egg Cups with olive oil and chili flakes";
      default:
        return "Omega Brain Bowl (eggs, avocado, spinach, chia seeds)";
    }
  };

  const catalogMapping: Record<string, any> = {
    "wake_up": {
      title: "Wake Up",
      description: "Use your alarm clock, not your phone. Open the windows. Take 3 deep breaths. Say: \"Today, I reset.\"",
      icon: <Sunrise className="h-6 w-6 text-primary" />
    },
    "hydration": {
      title: "Hydration Ritual",
      description: "Drink a large glass of warm water with lemon & a pinch of sea salt. Sit in silence for 5 minutes after drinking.",
      icon: <Coffee className="h-6 w-6 text-primary" />
    },
    "light_movement": {
      title: "Light Movement",
      description: <>10 minutes of stretching or yoga. Focus on breath. Feel your body wake up. Optional: follow our short YouTube video (if offline mode is skipped): <a href="https://www.youtube.com/watch?v=nvFm30ZAZRY" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1 inline-flex mt-1"><Youtube className="h-4 w-4" /> Morning Yoga Routine</a></>,
      icon: <Wind className="h-6 w-6 text-primary" />
    },
    "grounding_walk": {
      title: "Morning Grounding Walk",
      description: <div className="text-gray-600">
        30-minute walk outside without your phone. Reconnect with nature and absorb morning light.
        
        <div className="mt-3">
          <div className="bg-primary/5 p-3 rounded-lg mb-3">
            <details className="cursor-pointer">
              <summary className="font-medium text-sm">Why morning light exposure matters</summary>
              <div className="mt-2 text-sm text-gray-700 space-y-2">
                <p>Bright morning light advances your internal clock (earlier melatonin onset) and reduces "morning grogginess," leading to deeper, more restorative sleep at night.</p>
                <p>Morning light exposure is linked to improved mood and lower risk of Seasonal Affective Disorder, as it increases serotonin production and stabilizes cortisol dynamics.</p>
              </div>
            </details>
          </div>
          
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
            <details className="cursor-pointer">
              <summary className="font-medium text-sm">Grounding Tips & Benefits</summary>
              <div className="mt-2">
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  <li>Walk barefoot on grass, sand, or dip your feet in water if possible</li>
                  <li>Feel the earth beneath your feet and the air on your skin</li>
                  <li>Face the morning sun to help reset your circadian rhythm</li>
                  <li>Take deep breaths and notice the scents and sounds around you</li>
                  <li>Express gratitude for this moment of connection</li>
                </ul>
                <div className="mt-2 text-sm text-gray-700">
                  <p className="font-medium">Benefits of barefoot walking:</p>
                  <p>Connecting to the earth through barefoot contact allows electrons from the earth's surface to transfer to your body, potentially reducing inflammation and improving sleep quality.</p>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>,
      icon: <Sun className="h-6 w-6 text-primary" />
    },
    "morning_journal": {
      title: "Mind Reset",
      description: <div className="text-gray-600">
        Write in a notebook (pen & paper — no phone):
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>3 things you're grateful for</li>
          <li>1 intention for the day</li>
          <li>1 affirmation (e.g., "I am clear, strong, and in control.")</li>
          <li>Your 3 biggest dreams in life (be specific and bold)</li>
        </ul>
        <p className="mt-2 text-sm italic">This reflection helps align your day with your deepest values and long-term vision.</p>
      </div>,
      icon: <Heart className="h-6 w-6 text-primary" />
    },
    "breakfast": {
      title: "Breakfast Time",
      description: <div className="text-gray-600">
        {getBreakfastOption()} <br />
        <div className="mt-2 p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
          <p className="text-sm">Take your time and enjoy your breakfast mindfully. Chew thoroughly and avoid screens.</p>
        </div>
        <button 
          onClick={scrollToMealPlan} 
          className="mt-3 text-primary font-medium hover:underline inline-flex items-center"
        >
          <ArrowDown className="h-3 w-3 mr-1" /> See full breakfast recipe details below
        </button>
      </div>,
      icon: <Utensils className="h-6 w-6 text-primary" />
    },
    "integration": {
      title: "Integration Moment",
      description: <div className="text-gray-600">
        Sit quietly for 10 minutes. No agenda. Let your body and brain settle.
        <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
          <p className="font-medium text-sm mb-2">Optional meditation resources:</p>
          <div className="space-y-2">
            <a href="https://www.youtube.com/watch?v=_m-ElPoFMVM" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1 text-sm">
              <Youtube className="h-4 w-4" /> 10-Minute Guided Meditation
            </a>
            <a href="https://www.youtube.com/watch?v=ULuJSWJIfQ0" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1 text-sm">
              <Youtube className="h-4 w-4" /> Unguided Positive Vibrations
            </a>
          </div>
        </div>
      </div>,
      icon: <Clock className="h-6 w-6 text-primary" />
    }
  };
  const renderMorningContent = (morningItems: any[]) => (
    <div className="bg-white min-h-screen">
      {/* Hero Section with morning plant background */}
      <section className="relative text-white py-24 px-4 overflow-hidden">
        {/* Background image with overlay */}
        <div 
          className="absolute inset-0 z-0" 
          style={{
            backgroundImage: `linear-gradient(rgba(76, 175, 80, 0.8), rgba(76, 175, 80, 0.7)), url(${morningImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">Good Morning. Your Reset Begins Now.</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto drop-shadow-md">
            Let's start the day with clarity and calm. No phone. No rush. Just powerful routines designed to refresh your mind, body, and energy.
          </p>
        </div>
      </section>

      {/* Morning Timeline Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Morning Timeline (7:00 – 10:15 AM)</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 top-0 h-full w-1 bg-primary/20"></div>
              
              {/* Timeline Cards */}
              <div className="space-y-8">
                {morningItems.map((item, index) => {
                  const mapped = catalogMapping[item.activityKey];
                  const isActive = item.status === 'active';
                  const isCompleted = item.status === 'completed';
                  const isSkipped = item.status === 'skipped';
                  const timeLabel = new Date(item.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  if (!mapped) {
                    return (
                      <div key={item.id} className="relative flex items-center justify-center p-4">
                        <Card className="bg-gray-50 border-dashed border-2">
                          <CardContent className="p-4">
                            <p className="text-gray-500 text-sm">This morning activity cannot be displayed right now.</p>
                          </CardContent>
                        </Card>
                      </div>
                    );
                  }

                  return (
                  <div key={item.id} className={`relative flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} items-center md:gap-8 ${isSkipped ? 'opacity-50' : ''}`}>
                    {/* Time Indicator */}
                    <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-12 flex items-center justify-center z-10">
                      <div className={`bg-white p-2 rounded-full border-2 ${isCompleted ? 'border-green-500' : isActive ? 'border-primary' : 'border-gray-300'}`}>
                        {isCompleted ? <CheckCircle2 className="h-6 w-6 text-green-500" /> : mapped.icon}
                      </div>
                    </div>
                    
                    {/* Time Label */}
                    <div className={`md:w-1/2 text-center md:text-right ${index % 2 === 0 ? 'md:text-left' : ''} mb-4 md:mb-0`}>
                      <span className={`text-lg font-bold px-3 py-1 rounded-full ${isActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}>
                        {timeLabel}
                      </span>
                    </div>
                    
                    {/* Step Content */}
                    <div className={`md:w-1/2 w-full ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                      <Card className={`bg-white shadow-sm hover:shadow-md transition border-none ${isActive ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-full ${isActive ? 'bg-primary/10' : 'bg-gray-50'}`}>
                              {mapped.icon}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-2">{mapped.title}</h3>
                              <div className="text-gray-600 mb-4">{mapped.description}</div>
                              {isCompleted && <p className="text-sm font-medium text-green-600">✓ Completed</p>}
                              {isSkipped && <p className="text-sm font-medium text-gray-500">Skipped</p>}
                              
                              {isActive && currentReset!.currentItem?.id === item.id && (
                                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                                  <Button 
                                    size="sm"
                                    onClick={async () => {
                                      try {
                                        const res = await completeItem.mutateAsync(item.id);
                                        if (res.resetRun.status === 'active' && res.resetRun.phase === 'midday') {
                                          setLocation('/product/reset/midday');
                                        }
                                      } catch(err: any) {
                                        if (err.status === 409) refetch();
                                        toast({ title: "Failed to complete", description: err.message, variant: "destructive" });
                                      }
                                    }}
                                    disabled={completeItem.isPending || skipItem.isPending || delayItem.isPending}
                                  >
                                    Complete
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={async () => {
                                      try {
                                        const res = await skipItem.mutateAsync(item.id);
                                        if (res.resetRun.status === 'active' && res.resetRun.phase === 'midday') {
                                          setLocation('/product/reset/midday');
                                        }
                                      } catch(err: any) {
                                        if (err.status === 409) refetch();
                                        toast({ title: "Failed to skip", description: err.message, variant: "destructive" });
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
      
      {/* Diet Specific Section */}
      <section id="meal-plan-section" className="py-12 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-6">Your Meal Plan</h3>
            
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
                <TabsTrigger value="keto">Keto</TabsTrigger>
              </TabsList>
              
              <TabsContent value="omni">
                <Card>
                  <CardContent className="p-6">
                    <div className="mb-2 pb-2 border-b border-gray-100">
                      <h4 className="font-semibold text-xl mb-1">Omega Brain Bowl</h4>
                      <p className="text-gray-600 text-sm">Omnivore with clean animal protein, healthy fats, and whole plant foods.</p>
                    </div>
                    
                    <div className="mt-4">
                      <h5 className="font-medium text-primary mb-2">Ingredients:</h5>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>2 pasture-raised eggs</li>
                        <li>½ avocado</li>
                        <li>Handful of spinach</li>
                        <li>1 tbsp chia seeds</li>
                        <li>1 tbsp extra virgin olive oil</li>
                        <li>1 slice whole grain bread (no added sugar)</li>
                      </ul>
                    </div>
                    
                    <div className="mt-4">
                      <h5 className="font-medium text-primary mb-2">Preparation:</h5>
                      <ol className="list-decimal list-inside space-y-1 text-gray-700">
                        <li>Sauté spinach lightly in olive oil.</li>
                        <li>Poach or fry eggs.</li>
                        <li>Toast bread, top with avocado, eggs, and sprinkle chia seeds.</li>
                      </ol>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="vegetarian">
                <Card>
                  <CardContent className="p-6">
                    <div className="mb-2 pb-2 border-b border-gray-100">
                      <h4 className="font-semibold text-xl mb-1">Greek Yogurt & Berry Parfait</h4>
                      <p className="text-gray-600 text-sm">No meat, includes eggs/dairy. Focus on gut health and anti-inflammatory foods.</p>
                    </div>
                    
                    <div className="mt-4">
                      <h5 className="font-medium text-primary mb-2">Ingredients:</h5>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>Unsweetened Greek yogurt</li>
                        <li>½ cup blueberries</li>
                        <li>1 tbsp flax seeds</li>
                        <li>5 walnuts</li>
                        <li>Cinnamon</li>
                      </ul>
                    </div>
                    
                    <div className="mt-4">
                      <h5 className="font-medium text-primary mb-2">Preparation:</h5>
                      <ol className="list-decimal list-inside space-y-1 text-gray-700">
                        <li>Layer yogurt with berries and crushed walnuts.</li>
                        <li>Sprinkle flax and cinnamon.</li>
                      </ol>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="vegan">
                <Card>
                  <CardContent className="p-6">
                    <div className="mb-2 pb-2 border-b border-gray-100">
                      <h4 className="font-semibold text-xl mb-1">Chia Pudding with Almond Butter</h4>
                      <p className="text-gray-600 text-sm">No animal products. Anti-inflammatory, detox-friendly meals.</p>
                    </div>
                    
                    <div className="mt-4">
                      <h5 className="font-medium text-primary mb-2">Ingredients:</h5>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>Chia seeds</li>
                        <li>Unsweetened almond milk</li>
                        <li>½ banana</li>
                        <li>1 tbsp almond butter</li>
                        <li>Cinnamon</li>
                      </ul>
                    </div>
                    
                    <div className="mt-4">
                      <h5 className="font-medium text-primary mb-2">Preparation:</h5>
                      <ol className="list-decimal list-inside space-y-1 text-gray-700">
                        <li>Soak 3 tbsp chia seeds in 1 cup almond milk overnight.</li>
                        <li>Top with banana slices, almond butter, and cinnamon.</li>
                      </ol>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="gluten-free">
                <Card>
                  <CardContent className="p-6">
                    <div className="mb-2 pb-2 border-b border-gray-100">
                      <h4 className="font-semibold text-xl mb-1">Buckwheat Porridge</h4>
                      <p className="text-gray-600 text-sm">No gluten-containing grains. Focus on gut healing and anti-inflammatory support.</p>
                    </div>
                    
                    <div className="mt-4">
                      <h5 className="font-medium text-primary mb-2">Ingredients:</h5>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>Buckwheat groats</li>
                        <li>Almond milk</li>
                        <li>Berries</li>
                        <li>Pumpkin seeds</li>
                        <li>Honey (optional)</li>
                      </ul>
                    </div>
                    
                    <div className="mt-4">
                      <h5 className="font-medium text-primary mb-2">Preparation:</h5>
                      <ol className="list-decimal list-inside space-y-1 text-gray-700">
                        <li>Cook groats in almond milk.</li>
                        <li>Top with berries, seeds, and drizzle honey.</li>
                      </ol>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="keto">
                <Card>
                  <CardContent className="p-6">
                    <div className="mb-2 pb-2 border-b border-gray-100">
                      <h4 className="font-semibold text-xl mb-1">Keto Avocado Egg Cups</h4>
                      <p className="text-gray-600 text-sm">Very low carb, high fat, moderate protein. Focus on fat-adapted energy and brain performance.</p>
                    </div>
                    
                    <div className="mt-4">
                      <h5 className="font-medium text-primary mb-2">Ingredients:</h5>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>1 avocado</li>
                        <li>2 eggs</li>
                        <li>Olive oil</li>
                        <li>Chili flakes</li>
                      </ul>
                    </div>
                    
                    <div className="mt-4">
                      <h5 className="font-medium text-primary mb-2">Preparation:</h5>
                      <ol className="list-decimal list-inside space-y-1 text-gray-700">
                        <li>Halve avocado, scoop slightly.</li>
                        <li>Crack egg into each half, bake at 180°C for ~15 min.</li>
                        <li>Drizzle with oil and sprinkle chili flakes.</li>
                      </ol>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">You've started your day with intention. Let's keep that flow.</h2>
          
          <Button 
            size="lg" 
            className="px-8 py-6 text-lg rounded-full font-medium"
            onClick={() => {
              // Navigate and scroll to top
              window.location.href = '/product/reset/midday';
            }}
          >
            Continue to the Midday Reset <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-gray-600">Loading your morning routine...</p>
      </div>
    );
  }

  if (resetError && (resetError as ApiError).status === 401) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm text-center border border-gray-200">
          <p className="text-gray-600">Please log in to continue your Reset.</p>
        </div>
      </div>
    );
  }

  if ((resetError && (resetError as ApiError).status === 404) || (!currentReset && !isLoading && !resetError)) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm text-center border border-gray-200">
          <h2 className="text-2xl font-bold mb-4">Reset Not Found</h2>
          <p className="text-gray-600 mb-6">You haven't set up a Reset yet.</p>
          <Link href="/product/reset/welcome">
            <Button className="w-full">Go to Setup</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (currentReset?.resetRun.status === 'ready') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm text-center border border-gray-200">
          <h2 className="text-2xl font-bold mb-4">Not Started</h2>
          <p className="text-gray-600 mb-6">Your Reset hasn't started yet.</p>
          <Link href="/product/reset/welcome">
            <Button className="w-full">Return to Setup</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (currentReset?.resetRun.status === 'active' && currentReset.resetRun.phase !== 'morning') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm text-center border border-gray-200">
          <h2 className="text-2xl font-bold mb-4">Phase Passed</h2>
          <p className="text-gray-600">Your Reset has progressed beyond the morning phase.</p>
        </div>
      </div>
    );
  }

  if (currentReset?.resetRun.status === 'sleep') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm text-center border border-gray-200">
          <p className="text-gray-600">Your Reset is in the overnight recovery phase.</p>
        </div>
      </div>
    );
  }

  if (currentReset?.resetRun.status === 'next_morning') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm text-center border border-gray-200">
          <p className="text-gray-600">Your next-morning check-in is ready.</p>
        </div>
      </div>
    );
  }

  if (currentReset?.resetRun.status === 'completed') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm text-center border border-gray-200">
          <p className="text-gray-600">Your Reset is complete.</p>
        </div>
      </div>
    );
  }

  // Active + Morning Gate
  if (currentReset?.resetRun.status === 'active' && currentReset.resetRun.phase === 'morning') {
    const activeItems = currentReset.items.filter(item => item.status === 'active');
    
    if (activeItems.length !== 1 || !currentReset.currentItem || currentReset.currentItem.status !== 'active') {
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
          <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm text-center border border-gray-200">
            <p className="text-gray-600">Your morning routine is not currently active.</p>
          </div>
        </div>
      );
    }
    
    return (
      <>
        <div className="bg-primary text-primary-foreground text-center p-2 text-sm font-medium">
          Current activity: {currentReset.currentItem.activityKey}
        </div>
        {renderMorningContent(currentReset.items.filter(i => i.phase === 'morning').sort((a,b) => a.sequence - b.sequence))}
      </>
    );
  }

  return null;
}