import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Calendar 
} from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChevronRight, ArrowRight, Sunrise, Coffee, BookOpen, ShoppingBag, Bell, Smartphone, Download, PenTool, Droplets, Calculator } from "lucide-react";
import { Link, useLocation } from "wouter";
import { toast } from "@/hooks/use-toast";
import PerfectDayResetPDF from "@/components/PerfectDayResetPDF";
import PortalNavBar from "@/components/PortalNavBar";
import { useCurrentReset, useCreateReset, useStartReset } from "@/lib/reset-api";
import { loadQuizProfile } from "@/lib/quiz-profile";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

function toDatetimeLocal(d: Date) {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function getInitialScheduleFromWakeTime(wakeTime: string = "07:00") {
  const [hStr, mStr] = wakeTime.split(":");
  const wakeHour = Number.isFinite(parseInt(hStr, 10)) ? parseInt(hStr, 10) : 7;
  const wakeMin = Number.isFinite(parseInt(mStr, 10)) ? parseInt(mStr, 10) : 0;

  const start = new Date();
  start.setDate(start.getDate() + 1);
  start.setHours(wakeHour, wakeMin, 0, 0);

  // Target bedtime is 15 hours after wake time
  const bedtime = new Date(start.getTime() + 15 * 60 * 60 * 1000);

  // Next morning check-in is 24 hours after wake time
  const nextMorning = new Date(start.getTime() + 24 * 60 * 60 * 1000);

  return {
    startAt: toDatetimeLocal(start),
    targetBedtimeAt: toDatetimeLocal(bedtime),
    targetNextMorningAt: toDatetimeLocal(nextMorning),
  };
}

function mapFoodPreferenceToPortalTab(pref?: string | null): string {
  if (!pref) return "omni";
  const normalized = pref.toLowerCase();
  if (normalized === "veg" || normalized === "vegetarian") return "vegetarian";
  if (normalized === "paleo" || normalized === "gluten-free") return "gluten-free";
  if (normalized === "keto") return "keto";
  if (normalized === "vegan") return "vegan";
  return "omni";
}

export default function ProductPage1() {
  const [, setLocation] = useLocation();
  const { data: currentReset, isLoading: isResetLoading, error: resetError, refetch } = useCurrentReset();
  const createReset = useCreateReset();
  const startReset = useStartReset();

  const initialQuizProfile = loadQuizProfile();
  const initialTimes = getInitialScheduleFromWakeTime(initialQuizProfile?.wakeTime || "07:00");

  const [startAt, setStartAt] = useState(initialTimes.startAt);
  const [targetBedtimeAt, setTargetBedtimeAt] = useState(initialTimes.targetBedtimeAt);
  const [targetNextMorningAt, setTargetNextMorningAt] = useState(initialTimes.targetNextMorningAt);
  const [resetGoal, setResetGoal] = useState(
    initialQuizProfile?.recommendedGoal ||
      "Reclaim calm morning energy, eliminate afternoon brain fog, and get deep restorative sleep"
  );
  const [movementAccess, setMovementAccess] = useState("bodyweight");
  const [blockedTimes, setBlockedTimes] = useState("");

  const [selectedDiet, setSelectedDiet] = useState<string>(() =>
    mapFoodPreferenceToPortalTab(
      initialQuizProfile?.portalDietCode || initialQuizProfile?.foodPreference || "omni"
    )
  );

  useEffect(() => {
    if (currentReset?.resetRun?.foodPreference) {
      setSelectedDiet(mapFoodPreferenceToPortalTab(currentReset.resetRun.foodPreference));
    }
  }, [currentReset?.resetRun?.foodPreference]);
  const [waterCalc, setWaterCalc] = useState({
    weight: "",
    height: "",
    unit: "metric", // metric or imperial
    dailyWater: 0
  });
  const [checkedSupplements, setCheckedSupplements] = useState<Record<string, boolean>>({
    magnesium: false,
    vitaminb: false,
    vitaminc: false,
    vitamind3: false,
    ltyrosine: false,
    ltheanine: false,
    melatonin: false,
    electrolytes: false,
    water: false,
    ashwagandha: false,
    zinc: false,
    tea: false,
    ginkgo: false,
    omega3: false
  });
  const [detoxChecklist, setDetoxChecklist] = useState<Record<string, boolean>>({
    notifications: false,
    airplane: false,
    autoreply: false,
    alarm: false,
    inform: false,
    journal: false
  });

  const pageRef = useRef<HTMLDivElement>(null);
  
  const scrollToPrep = () => {
    const prepSection = document.getElementById("prep-section");
    if (prepSection) {
      prepSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Water calculation function
  const calculateWaterIntake = () => {
    if (!waterCalc.weight || !waterCalc.height) return;
    
    let weightKg = parseFloat(waterCalc.weight);
    let heightCm = parseFloat(waterCalc.height);
    
    // Convert to metric if needed
    if (waterCalc.unit === "imperial") {
      weightKg = weightKg * 0.453592; // lbs to kg
      heightCm = heightCm * 2.54; // inches to cm
    }
    
    // Water calculation formula: 35ml per kg body weight + activity factor
    // Base water need: 35ml per kg
    let dailyWaterMl = weightKg * 35;
    
    // Add extra for height (taller people need more water)
    if (heightCm > 170) {
      dailyWaterMl += (heightCm - 170) * 5;
    }
    
    // Convert to liters and round to 1 decimal
    const dailyWaterLiters = Math.round((dailyWaterMl / 1000) * 10) / 10;
    
    setWaterCalc(prev => ({
      ...prev,
      dailyWater: dailyWaterLiters
    }));
  };
  
  const toggleSupplement = (key: string) => {
    setCheckedSupplements(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const toggleDetoxItem = (key: string) => {
    setDetoxChecklist(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  // Check if all required items are ready
  const isReadyToStart = () => {
    const hasDiet = !!selectedDiet;
    
    // Check if all supplements are checked
    const hasMustHaveSupplements = 
      checkedSupplements.magnesium && 
      checkedSupplements.vitaminb && 
      checkedSupplements.vitaminc &&
      checkedSupplements.vitamind3 &&
      checkedSupplements.ltyrosine &&
      checkedSupplements.ltheanine &&
      checkedSupplements.melatonin &&
      checkedSupplements.electrolytes &&
      checkedSupplements.water &&
      checkedSupplements.ashwagandha && 
      checkedSupplements.zinc && 
      checkedSupplements.tea &&
      checkedSupplements.ginkgo &&
      checkedSupplements.omega3;
    
    // Check if all digital detox items are checked
    const hasDigitalDetox = 
      Object.values(detoxChecklist).every(val => val);
    
    return hasDiet && hasMustHaveSupplements && hasDigitalDetox;
  };
  
  // Function to download the selected diet plan and supplement checklist
  const downloadChecklist = () => {
    // Diet information based on selection
    const getDietInfo = () => {
      switch(selectedDiet) {
        case 'omni':
          return {
            name: 'Omni Reset',
            description: 'Omnivore with clean animal protein, healthy fats, and whole plant foods.',
            breakfast: {
              name: 'Omega Brain Bowl',
              ingredients: [
                '2 pasture-raised eggs',
                '½ avocado',
                'Handful of spinach',
                '1 tbsp chia seeds',
                '1 tbsp extra virgin olive oil',
                '1 slice whole grain bread (no added sugar)'
              ],
              preparation: [
                'Sauté spinach lightly in olive oil.',
                'Poach or fry eggs.',
                'Toast bread, top with avocado, eggs, and sprinkle chia seeds.'
              ]
            },
            lunch: {
              name: 'Grilled Salmon Power Salad',
              ingredients: [
                '150g wild-caught salmon',
                'Mixed salad greens',
                'Cherry tomatoes',
                '½ cucumber',
                '1 tbsp pumpkin seeds',
                '1 tbsp olive oil + lemon for dressing'
              ],
              preparation: [
                'Grill salmon with salt, pepper, lemon.',
                'Mix salad ingredients.',
                'Top with salmon and seeds, drizzle with olive oil + lemon.'
              ]
            },
            dinner: {
              name: 'Turkey Quinoa Bowl',
              ingredients: [
                '150g lean ground turkey',
                '½ cup quinoa',
                '½ zucchini',
                '1 carrot',
                '1 garlic clove',
                'Olive oil'
              ],
              preparation: [
                'Cook quinoa.',
                'Sauté garlic, then turkey.',
                'Add chopped zucchini and carrots.',
                'Serve turkey mix over quinoa.'
              ]
            }
          };
        case 'vegetarian':
          return {
            name: 'Vegetarian',
            description: 'No meat, includes eggs/dairy. Focus on gut health and anti-inflammatory foods.',
            breakfast: {
              name: 'Greek Yogurt & Berry Parfait',
              ingredients: [
                'Unsweetened Greek yogurt',
                '½ cup blueberries',
                '1 tbsp flax seeds',
                '5 walnuts',
                'Cinnamon'
              ],
              preparation: [
                'Layer yogurt with berries and crushed walnuts.',
                'Sprinkle flax and cinnamon.'
              ]
            },
            lunch: {
              name: 'Lentil & Sweet Potato Salad',
              ingredients: [
                '1 cup cooked lentils',
                '½ sweet potato',
                'Arugula or spinach',
                '1 tbsp olive oil',
                'Feta (optional)'
              ],
              preparation: [
                'Roast sweet potato cubes.',
                'Toss all together with olive oil and crumbled feta.'
              ]
            },
            dinner: {
              name: 'Halloumi & Veggie Stir-fry',
              ingredients: [
                'Halloumi cheese',
                'Broccoli',
                'Bell pepper',
                'Red onion',
                'Tamari or coconut aminos',
                'Olive oil'
              ],
              preparation: [
                'Stir-fry chopped veggies in oil.',
                'Add sliced halloumi and a dash of tamari.'
              ]
            }
          };
        case 'vegan':
          return {
            name: 'Vegan',
            description: 'No animal products. Anti-inflammatory, detox-friendly meals.',
            breakfast: {
              name: 'Chia Pudding with Almond Butter',
              ingredients: [
                'Chia seeds',
                'Unsweetened almond milk',
                '½ banana',
                '1 tbsp almond butter',
                'Cinnamon'
              ],
              preparation: [
                'Soak 3 tbsp chia seeds in 1 cup almond milk overnight.',
                'Top with banana slices, almond butter, and cinnamon.'
              ]
            },
            lunch: {
              name: 'Buddha Bowl',
              ingredients: [
                'Cooked quinoa',
                'Chickpeas',
                'Steamed broccoli',
                'Avocado',
                'Tahini',
                'Lemon'
              ],
              preparation: [
                'Combine quinoa, chickpeas, broccoli, and sliced avocado.',
                'Drizzle with tahini + lemon juice.'
              ]
            },
            dinner: {
              name: 'Coconut Lentil Curry',
              ingredients: [
                'Red lentils',
                'Coconut milk',
                'Curry powder',
                'Garlic, onion',
                'Spinach',
                'Olive oil'
              ],
              preparation: [
                'Sauté onion and garlic.',
                'Add lentils, coconut milk, curry powder. Simmer.',
                'Add spinach before serving.'
              ]
            }
          };
        case 'gluten-free':
          return {
            name: 'Gluten-Free',
            description: 'No gluten-containing grains. Focus on gut healing and anti-inflammatory support.',
            breakfast: {
              name: 'Buckwheat Porridge',
              ingredients: [
                'Buckwheat groats',
                'Almond milk',
                'Berries',
                'Pumpkin seeds',
                'Honey (optional)'
              ],
              preparation: [
                'Cook groats in almond milk.',
                'Top with berries, seeds, and drizzle honey.'
              ]
            },
            lunch: {
              name: 'Grilled Chicken & Quinoa',
              ingredients: [
                '150g chicken breast',
                'Cooked quinoa',
                'Spinach',
                'Cucumber',
                'Olive oil + lemon'
              ],
              preparation: [
                'Grill chicken with herbs.',
                'Serve over quinoa-spinach salad with dressing.'
              ]
            },
            dinner: {
              name: 'Zucchini Noodle Stir-fry',
              ingredients: [
                '2 zucchinis (spiralized)',
                'Tofu or shrimp',
                'Garlic',
                'Bell pepper',
                'Tamari',
                'Sesame oil'
              ],
              preparation: [
                'Sauté garlic and protein.',
                'Add bell pepper and zoodles, toss with tamari and sesame oil.'
              ]
            }
          };
        case 'keto':
          return {
            name: 'Keto',
            description: 'Very low carb, high fat, moderate protein. Focus on fat-adapted energy and brain performance.',
            breakfast: {
              name: 'Keto Avocado Egg Cups',
              ingredients: [
                '1 avocado',
                '2 eggs',
                'Olive oil',
                'Chili flakes'
              ],
              preparation: [
                'Halve avocado, scoop slightly.',
                'Crack egg into each half, bake at 180°C for ~15 min.',
                'Drizzle with oil and sprinkle chili flakes.'
              ]
            },
            lunch: {
              name: 'Chicken Caesar (No Croutons)',
              ingredients: [
                'Chicken breast',
                'Romaine lettuce',
                'Parmesan',
                'Olive oil + lemon',
                'Anchovy paste or mustard (optional)'
              ],
              preparation: [
                'Grill chicken.',
                'Toss chopped lettuce with oil, lemon, and optional paste.',
                'Add chicken and cheese.'
              ]
            },
            dinner: {
              name: 'Salmon & Cauliflower Mash',
              ingredients: [
                '150g salmon',
                'Cauliflower',
                'Butter or ghee',
                'Garlic',
                'Dill'
              ],
              preparation: [
                'Steam cauliflower, blend with butter and garlic.',
                'Grill salmon, top with dill.',
                'Serve with mash.'
              ]
            }
          };
        default:
          return {
            name: 'Custom Diet Plan',
            description: 'Your customized nutrition plan',
            breakfast: { name: '', ingredients: [], preparation: [] },
            lunch: { name: '', ingredients: [], preparation: [] },
            dinner: { name: '', ingredients: [], preparation: [] }
          };
      }
    };
    
    // Get supplement information
    const getSupplementsList = () => {
      const supplements = [
        { id: 'magnesium', name: 'Magnesium (e.g., Biomagnis B6 Premium)' },
        { id: 'vitaminb', name: 'Vitamin B12 or Complex' },
        { id: 'vitaminc', name: 'Vitamin C' },
        { id: 'vitamind3', name: 'Vitamin D3' },
        { id: 'ltyrosine', name: 'L-Tyrosine' },
        { id: 'ltheanine', name: 'L-Theanine' },
        { id: 'melatonin', name: 'Melatonin (for sleep restoration)' },
        { id: 'electrolytes', name: 'Electrolytes' },
        { id: 'water', name: 'Clean filtered water' },
        { id: 'ashwagandha', name: 'Ashwagandha (Stress & Cortisol Support)' },
        { id: 'zinc', name: 'Zinc' },
        { id: 'tea', name: 'Pau D\'Arco tea (gut cleanse)' },
        { id: 'ginkgo', name: 'Ginkgo Biloba' },
        { id: 'omega3', name: 'Omega-3 Fatty Acids' }
      ];
      
      return supplements.map(supplement => ({
        ...supplement,
        checked: checkedSupplements[supplement.id] || false
      }));
    };
    
    const diet = getDietInfo();
    const supplements = getSupplementsList();
    
    // Create the content for the checklist
    let content = `==========================================\n`;
    content += `    PERFECT DAY RESET - SHOPPING LIST    \n`;
    content += `==========================================\n\n`;
    
    // Diet information
    content += `SELECTED DIET PLAN: ${diet.name}\n`;
    content += `${diet.description}\n\n`;
    
    // Breakfast
    content += `🍳 BREAKFAST: ${diet.breakfast.name}\n`;
    content += `Ingredients:\n`;
    diet.breakfast.ingredients.forEach(ingredient => {
      content += `□ ${ingredient}\n`;
    });
    content += `\nPreparation:\n`;
    diet.breakfast.preparation.forEach((step, index) => {
      content += `${index + 1}. ${step}\n`;
    });
    content += `\n`;
    
    // Lunch
    content += `🥗 LUNCH: ${diet.lunch.name}\n`;
    content += `Ingredients:\n`;
    diet.lunch.ingredients.forEach(ingredient => {
      content += `□ ${ingredient}\n`;
    });
    content += `\nPreparation:\n`;
    diet.lunch.preparation.forEach((step, index) => {
      content += `${index + 1}. ${step}\n`;
    });
    content += `\n`;
    
    // Dinner
    content += `🍲 DINNER: ${diet.dinner.name}\n`;
    content += `Ingredients:\n`;
    diet.dinner.ingredients.forEach(ingredient => {
      content += `□ ${ingredient}\n`;
    });
    content += `\nPreparation:\n`;
    diet.dinner.preparation.forEach((step, index) => {
      content += `${index + 1}. ${step}\n`;
    });
    content += `\n`;
    
    // Supplements
    content += `=================================\n`;
    content += `💊 RECOMMENDED SUPPLEMENTS:\n`;
    content += `=================================\n\n`;
    supplements.forEach(supplement => {
      content += `${supplement.checked ? '☑' : '□'} ${supplement.name}\n`;
    });
    
    content += `\n==========================================\n`;
    content += `Thank you for using the Perfect Day Reset Program!\n`;
    content += `==========================================\n`;
    
    // Create a Blob and trigger download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `perfect-day-reset-${diet.name.toLowerCase().replace(/\s+/g, '-')}-plan.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show success toast
    toast({
      title: "Checklist Downloaded!",
      description: `Your ${diet.name} plan checklist is ready. Happy resetting!`,
    });
  };

  return (
    <div className="bg-white min-h-screen" ref={pageRef}>
      <PortalNavBar />
      {/* Hero Section */}
      <section className="relative text-white py-24 md:py-32">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url("/assets/serene-tree.webp")',
            backgroundSize: 'cover'
          }}
        >
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-primary/50"></div>
        </div>
        
        {/* Content */}
        <div className="container mx-auto text-center relative z-10">
          <h1 className="mb-6 text-white drop-shadow-md">Reset Your Body & Mind in One Powerful Day</h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-white drop-shadow-sm">
            The Perfect Day Reset is a science-backed, step-by-step one-day transformation designed to help you feel clear, energized, and centered — all without scrolling or overthinking.
          </p>
          <Button 
            size="lg" 
            className="text-primary bg-white hover:bg-gray-100 px-8 py-6 text-lg rounded-full shadow-lg"
            onClick={scrollToPrep}
          >
            I'm In – Let's Start <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Intro Section */}
      <section className="bg-gray-50">
        <div className="container">
          <div className="section-heading">
            <h2>What is the Perfect Day Reset?</h2>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <p className="text-xl mb-12 text-center">
              In just one day, we'll guide you through:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <Card className="bg-white shadow-sm hover:shadow-md transition">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-primary/10 rounded-full mb-4">
                      <Smartphone className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">A full digital detox</h3>
                    <p className="text-gray-600">Disconnect to reconnect with yourself</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white shadow-sm hover:shadow-md transition">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-primary/10 rounded-full mb-4">
                      <Coffee className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">High-impact meals and supplements</h3>
                    <p className="text-gray-600">Fuel your body for optimal performance</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white shadow-sm hover:shadow-md transition">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-primary/10 rounded-full mb-4">
                      <BookOpen className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Mind + body routines</h3>
                    <p className="text-gray-600">Designed for clarity and calm</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-primary/5 p-6 rounded-lg mb-12">
              <p className="text-lg font-medium text-center">
                A structure so powerful, it's been described as a "manual for recharging your life."
              </p>
            </div>
            
            <div className="text-center mb-12">
              <p className="text-lg font-bold mb-4">This is not a juice cleanse. This is a guided full-body & mind reset.</p>
              <p className="text-lg mb-6">No fluff. No guesswork. No phone.</p>
              
              <div className="flex flex-col md:flex-row justify-center gap-4 mb-6">
                <div className="flex items-center">
                  <div className="mr-2 bg-green-100 text-green-800 p-1 rounded">✓</div>
                  <span>Fully planned.</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-2 bg-green-100 text-green-800 p-1 rounded">✓</div>
                  <span>Science-based.</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-2 bg-green-100 text-green-800 p-1 rounded">✓</div>
                  <span>Minimal decisions. Maximum impact.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Preparation Section */}
      <section id="prep-section">
        <div className="container">
          <div className="section-heading">
            <h2>What You'll Need to Start</h2>
            <p className="text-center text-xl max-w-3xl mx-auto">
              Before your reset day, make sure you're prepared. We'll guide you.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {/* Food Style Selection */}
            <Card className="mb-10">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingBag className="mr-2 h-5 w-5 text-primary" /> 
                  Choose Your Food Style
                </CardTitle>
                <CardDescription>
                  Select one option to unlock your customized meal plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end mb-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2"
                    onClick={downloadChecklist}
                  >
                    <Download size={16} /> Download Selected Diet Plan
                  </Button>
                </div>
                <Tabs 
                  defaultValue="omni" 
                  className="w-full"
                  value={selectedDiet}
                  onValueChange={setSelectedDiet}
                >
                  <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
                    <TabsTrigger value="omni">Omni Reset</TabsTrigger>
                    <TabsTrigger value="vegetarian">Vegetarian</TabsTrigger>
                    <TabsTrigger value="vegan">Vegan</TabsTrigger>
                    <TabsTrigger value="gluten-free">Gluten-Free</TabsTrigger>
                    <TabsTrigger value="keto">Keto</TabsTrigger>
                  </TabsList>
                  
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <TabsContent value="omni">
                      <div>
                        <h3 className="text-lg font-medium mb-3">Omni Reset</h3>
                        <p className="text-gray-600 mb-4">Omnivore with clean animal protein, healthy fats, and whole plant foods.</p>
                        
                        <div className="space-y-6">
                          <div className="border rounded-lg p-4 bg-white shadow-sm">
                            <h4 className="font-medium text-primary flex items-center"><span className="mr-2">🍳</span> Breakfast: Omega Brain Bowl</h4>
                            
                            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h5 className="text-sm font-semibold text-gray-700 mb-2">Ingredients:</h5>
                                <ul className="text-sm space-y-1">
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>2 pasture-raised eggs</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>½ avocado</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Handful of spinach</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>1 tbsp chia seeds</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>1 tbsp extra virgin olive oil</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>1 slice whole grain bread (no added sugar)</span>
                                  </li>
                                </ul>
                              </div>
                              
                              <div>
                                <h5 className="text-sm font-semibold text-gray-700 mb-2">Preparation:</h5>
                                <ol className="text-sm list-decimal ml-4 space-y-1">
                                  <li>Sauté spinach lightly in olive oil.</li>
                                  <li>Poach or fry eggs.</li>
                                  <li>Toast bread, top with avocado, eggs, and sprinkle chia seeds.</li>
                                </ol>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border rounded-lg p-4 bg-white shadow-sm">
                            <h4 className="font-medium text-primary flex items-center"><span className="mr-2">🥗</span> Lunch: Grilled Salmon Power Salad</h4>
                            
                            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h5 className="text-sm font-semibold text-gray-700 mb-2">Ingredients:</h5>
                                <ul className="text-sm space-y-1">
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>150g wild-caught salmon</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Mixed salad greens</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Cherry tomatoes</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>½ cucumber</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>1 tbsp pumpkin seeds</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>1 tbsp olive oil + lemon for dressing</span>
                                  </li>
                                </ul>
                              </div>
                              
                              <div>
                                <h5 className="text-sm font-semibold text-gray-700 mb-2">Preparation:</h5>
                                <ol className="text-sm list-decimal ml-4 space-y-1">
                                  <li>Grill salmon with salt, pepper, lemon.</li>
                                  <li>Mix salad ingredients.</li>
                                  <li>Top with salmon and seeds, drizzle with olive oil + lemon.</li>
                                </ol>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border rounded-lg p-4 bg-white shadow-sm">
                            <h4 className="font-medium text-primary flex items-center"><span className="mr-2">🍲</span> Dinner: Turkey Quinoa Bowl</h4>
                            
                            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h5 className="text-sm font-semibold text-gray-700 mb-2">Ingredients:</h5>
                                <ul className="text-sm space-y-1">
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>150g lean ground turkey</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>½ cup quinoa</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>½ zucchini</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>1 carrot</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>1 garlic clove</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Olive oil</span>
                                  </li>
                                </ul>
                              </div>
                              
                              <div>
                                <h5 className="text-sm font-semibold text-gray-700 mb-2">Preparation:</h5>
                                <ol className="text-sm list-decimal ml-4 space-y-1">
                                  <li>Cook quinoa.</li>
                                  <li>Sauté garlic, then turkey.</li>
                                  <li>Add chopped zucchini and carrots.</li>
                                  <li>Serve turkey mix over quinoa.</li>
                                </ol>
                              </div>
                            </div>
                          </div>
                          
                          <div className="pt-2">
                            <p className="text-sm text-gray-600 italic">You'll be able to download a comprehensive shopping list after purchase.</p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="vegetarian">
                      <div>
                        <h3 className="text-lg font-medium mb-3">Vegetarian</h3>
                        <p className="text-gray-600 mb-4">No meat, includes eggs/dairy. Focus on gut health and anti-inflammatory foods.</p>
                        
                        <div className="space-y-6">
                          <div className="border rounded-lg p-4 bg-white shadow-sm">
                            <h4 className="font-medium text-primary flex items-center"><span className="mr-2">🍳</span> Breakfast: Greek Yogurt & Berry Parfait</h4>
                            
                            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h5 className="text-sm font-semibold text-gray-700 mb-2">Ingredients:</h5>
                                <ul className="text-sm space-y-1">
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Unsweetened Greek yogurt</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>½ cup blueberries</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>1 tbsp flax seeds</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>5 walnuts</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Cinnamon</span>
                                  </li>
                                </ul>
                              </div>
                              
                              <div>
                                <h5 className="text-sm font-semibold text-gray-700 mb-2">Preparation:</h5>
                                <ol className="text-sm list-decimal ml-4 space-y-1">
                                  <li>Layer yogurt with berries and crushed walnuts.</li>
                                  <li>Sprinkle flax and cinnamon.</li>
                                </ol>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border rounded-lg p-4 bg-white shadow-sm">
                            <h4 className="font-medium text-primary flex items-center"><span className="mr-2">🥗</span> Lunch: Lentil & Sweet Potato Salad</h4>
                            
                            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h5 className="text-sm font-semibold text-gray-700 mb-2">Ingredients:</h5>
                                <ul className="text-sm space-y-1">
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>1 cup cooked lentils</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>½ sweet potato</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Arugula or spinach</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>1 tbsp olive oil</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Feta (optional)</span>
                                  </li>
                                </ul>
                              </div>
                              
                              <div>
                                <h5 className="text-sm font-semibold text-gray-700 mb-2">Preparation:</h5>
                                <ol className="text-sm list-decimal ml-4 space-y-1">
                                  <li>Roast sweet potato cubes.</li>
                                  <li>Toss all together with olive oil and crumbled feta.</li>
                                </ol>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border rounded-lg p-4 bg-white shadow-sm">
                            <h4 className="font-medium text-primary flex items-center"><span className="mr-2">🍲</span> Dinner: Halloumi & Veggie Stir-fry</h4>
                            
                            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h5 className="text-sm font-semibold text-gray-700 mb-2">Ingredients:</h5>
                                <ul className="text-sm space-y-1">
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Halloumi cheese</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Broccoli</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Bell pepper</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Red onion</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Tamari or coconut aminos</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Olive oil</span>
                                  </li>
                                </ul>
                              </div>
                              
                              <div>
                                <h5 className="text-sm font-semibold text-gray-700 mb-2">Preparation:</h5>
                                <ol className="text-sm list-decimal ml-4 space-y-1">
                                  <li>Stir-fry chopped veggies in oil.</li>
                                  <li>Add sliced halloumi and a dash of tamari.</li>
                                </ol>
                              </div>
                            </div>
                          </div>
                          
                          <div className="pt-2">
                            <p className="text-sm text-gray-600 italic">You'll be able to download a comprehensive shopping list after purchase.</p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="vegan">
                      <div>
                        <h3 className="text-lg font-medium mb-3">Vegan</h3>
                        <p className="text-gray-600 mb-4">No animal products. Anti-inflammatory, detox-friendly meals.</p>
                        
                        <div className="space-y-6">
                          <div className="border rounded-lg p-4 bg-white shadow-sm">
                            <h4 className="font-medium text-primary flex items-center"><span className="mr-2">🍳</span> Breakfast: Chia Pudding with Almond Butter</h4>
                            
                            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h5 className="text-sm font-semibold text-gray-700 mb-2">Ingredients:</h5>
                                <ul className="text-sm space-y-1">
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Chia seeds</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Unsweetened almond milk</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>½ banana</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>1 tbsp almond butter</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Cinnamon</span>
                                  </li>
                                </ul>
                              </div>
                              
                              <div>
                                <h5 className="text-sm font-semibold text-gray-700 mb-2">Preparation:</h5>
                                <ol className="text-sm list-decimal ml-4 space-y-1">
                                  <li>Soak 3 tbsp chia seeds in 1 cup almond milk overnight.</li>
                                  <li>Top with banana slices, almond butter, and cinnamon.</li>
                                </ol>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border rounded-lg p-4 bg-white shadow-sm">
                            <h4 className="font-medium text-primary flex items-center"><span className="mr-2">🥗</span> Lunch: Buddha Bowl</h4>
                            
                            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h5 className="text-sm font-semibold text-gray-700 mb-2">Ingredients:</h5>
                                <ul className="text-sm space-y-1">
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Cooked quinoa</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Chickpeas</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Steamed broccoli</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Avocado</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Tahini</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Lemon</span>
                                  </li>
                                </ul>
                              </div>
                              
                              <div>
                                <h5 className="text-sm font-semibold text-gray-700 mb-2">Preparation:</h5>
                                <ol className="text-sm list-decimal ml-4 space-y-1">
                                  <li>Combine quinoa, chickpeas, broccoli, and sliced avocado.</li>
                                  <li>Drizzle with tahini + lemon juice.</li>
                                </ol>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border rounded-lg p-4 bg-white shadow-sm">
                            <h4 className="font-medium text-primary flex items-center"><span className="mr-2">🍲</span> Dinner: Coconut Lentil Curry</h4>
                            
                            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h5 className="text-sm font-semibold text-gray-700 mb-2">Ingredients:</h5>
                                <ul className="text-sm space-y-1">
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Red lentils</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Coconut milk</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Curry powder</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Garlic, onion</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Spinach</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Olive oil</span>
                                  </li>
                                </ul>
                              </div>
                              
                              <div>
                                <h5 className="text-sm font-semibold text-gray-700 mb-2">Preparation:</h5>
                                <ol className="text-sm list-decimal ml-4 space-y-1">
                                  <li>Sauté onion and garlic.</li>
                                  <li>Add lentils, coconut milk, curry powder. Simmer.</li>
                                  <li>Add spinach before serving.</li>
                                </ol>
                              </div>
                            </div>
                          </div>
                          
                          <div className="pt-2">
                            <p className="text-sm text-gray-600 italic">You'll be able to download a comprehensive shopping list after purchase.</p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="gluten-free">
                      <div>
                        <h3 className="text-lg font-medium mb-3">Gluten-Free</h3>
                        <p className="text-gray-600 mb-4">No gluten-containing grains. Focus on gut healing and anti-inflammatory support.</p>
                        
                        <div className="space-y-6">
                          <div className="border rounded-lg p-4 bg-white shadow-sm">
                            <h4 className="font-medium text-primary flex items-center"><span className="mr-2">🍳</span> Breakfast: Buckwheat Porridge</h4>
                            
                            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h5 className="text-sm font-semibold text-gray-700 mb-2">Ingredients:</h5>
                                <ul className="text-sm space-y-1">
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Buckwheat groats</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Almond milk</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Berries</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Pumpkin seeds</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Honey (optional)</span>
                                  </li>
                                </ul>
                              </div>
                              
                              <div>
                                <h5 className="text-sm font-semibold text-gray-700 mb-2">Preparation:</h5>
                                <ol className="text-sm list-decimal ml-4 space-y-1">
                                  <li>Cook groats in almond milk.</li>
                                  <li>Top with berries, seeds, and drizzle honey.</li>
                                </ol>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border rounded-lg p-4 bg-white shadow-sm">
                            <h4 className="font-medium text-primary flex items-center"><span className="mr-2">🥗</span> Lunch: Grilled Chicken & Quinoa</h4>
                            
                            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h5 className="text-sm font-semibold text-gray-700 mb-2">Ingredients:</h5>
                                <ul className="text-sm space-y-1">
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>150g chicken breast</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Cooked quinoa</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Spinach</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Cucumber</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Olive oil + lemon</span>
                                  </li>
                                </ul>
                              </div>
                              
                              <div>
                                <h5 className="text-sm font-semibold text-gray-700 mb-2">Preparation:</h5>
                                <ol className="text-sm list-decimal ml-4 space-y-1">
                                  <li>Grill chicken with herbs.</li>
                                  <li>Serve over quinoa-spinach salad with dressing.</li>
                                </ol>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border rounded-lg p-4 bg-white shadow-sm">
                            <h4 className="font-medium text-primary flex items-center"><span className="mr-2">🍲</span> Dinner: Zucchini Noodle Stir-fry</h4>
                            
                            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h5 className="text-sm font-semibold text-gray-700 mb-2">Ingredients:</h5>
                                <ul className="text-sm space-y-1">
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>2 zucchinis (spiralized)</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Tofu or shrimp</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Garlic</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Bell pepper</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Tamari</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Sesame oil</span>
                                  </li>
                                </ul>
                              </div>
                              
                              <div>
                                <h5 className="text-sm font-semibold text-gray-700 mb-2">Preparation:</h5>
                                <ol className="text-sm list-decimal ml-4 space-y-1">
                                  <li>Sauté garlic and protein.</li>
                                  <li>Add bell pepper and zoodles, toss with tamari and sesame oil.</li>
                                </ol>
                              </div>
                            </div>
                          </div>
                          
                          <div className="pt-2">
                            <p className="text-sm text-gray-600 italic">You'll be able to download a comprehensive shopping list after purchase.</p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="keto">
                      <div>
                        <h3 className="text-lg font-medium mb-3">Keto</h3>
                        <p className="text-gray-600 mb-4">Very low carb, high fat, moderate protein. Focus on fat-adapted energy and brain performance.</p>
                        
                        <div className="space-y-6">
                          <div className="border rounded-lg p-4 bg-white shadow-sm">
                            <h4 className="font-medium text-primary flex items-center"><span className="mr-2">🍳</span> Breakfast: Keto Avocado Egg Cups</h4>
                            
                            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h5 className="text-sm font-semibold text-gray-700 mb-2">Ingredients:</h5>
                                <ul className="text-sm space-y-1">
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>1 avocado</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>2 eggs</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Olive oil</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Chili flakes</span>
                                  </li>
                                </ul>
                              </div>
                              
                              <div>
                                <h5 className="text-sm font-semibold text-gray-700 mb-2">Preparation:</h5>
                                <ol className="text-sm list-decimal ml-4 space-y-1">
                                  <li>Halve avocado, scoop slightly.</li>
                                  <li>Crack egg into each half, bake at 180°C for ~15 min.</li>
                                  <li>Drizzle with oil and sprinkle chili flakes.</li>
                                </ol>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border rounded-lg p-4 bg-white shadow-sm">
                            <h4 className="font-medium text-primary flex items-center"><span className="mr-2">🥗</span> Lunch: Chicken Caesar (No Croutons)</h4>
                            
                            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h5 className="text-sm font-semibold text-gray-700 mb-2">Ingredients:</h5>
                                <ul className="text-sm space-y-1">
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Chicken breast</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Romaine lettuce</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Parmesan</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Olive oil + lemon</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Anchovy paste or mustard (optional)</span>
                                  </li>
                                </ul>
                              </div>
                              
                              <div>
                                <h5 className="text-sm font-semibold text-gray-700 mb-2">Preparation:</h5>
                                <ol className="text-sm list-decimal ml-4 space-y-1">
                                  <li>Grill chicken.</li>
                                  <li>Toss chopped lettuce with oil, lemon, and optional paste.</li>
                                  <li>Add chicken and cheese.</li>
                                </ol>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border rounded-lg p-4 bg-white shadow-sm">
                            <h4 className="font-medium text-primary flex items-center"><span className="mr-2">🍲</span> Dinner: Salmon & Cauliflower Mash</h4>
                            
                            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h5 className="text-sm font-semibold text-gray-700 mb-2">Ingredients:</h5>
                                <ul className="text-sm space-y-1">
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>150g salmon</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Cauliflower</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Butter or ghee</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Garlic</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary/10 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs text-primary mr-2 mt-0.5">✓</span>
                                    <span>Dill</span>
                                  </li>
                                </ul>
                              </div>
                              
                              <div>
                                <h5 className="text-sm font-semibold text-gray-700 mb-2">Preparation:</h5>
                                <ol className="text-sm list-decimal ml-4 space-y-1">
                                  <li>Steam cauliflower, blend with butter and garlic.</li>
                                  <li>Grill salmon, top with dill.</li>
                                  <li>Serve with mash.</li>
                                </ol>
                              </div>
                            </div>
                          </div>
                          
                          <div className="pt-2">
                            <p className="text-sm text-gray-600 italic">You'll be able to download a comprehensive shopping list after purchase.</p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>

            {/* Supplements Checklist */}
            <Card className="mb-10">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div>
                    <CardTitle className="flex items-center">
                      <ShoppingBag className="mr-2 h-5 w-5 text-primary" /> 
                      Core Supplements Checklist
                    </CardTitle>
                    <CardDescription>
                      We don't sell these, but we recommend them for optimal results
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2 mt-3 md:mt-0"
                    onClick={downloadChecklist}
                  >
                    <Download size={16} /> Download Complete Checklist
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-lg mb-3 bg-green-100 text-green-800 inline-block px-2 py-1 rounded">Core Supplements:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* First Column */}
                      <div className="space-y-3">
                        <div className="flex items-start space-x-2">
                          <Checkbox 
                            id="magnesium" 
                            checked={checkedSupplements.magnesium}
                            onCheckedChange={() => toggleSupplement('magnesium')}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="magnesium" className="text-base">
                              Magnesium (e.g., Biomagnis B6 Premium)
                            </Label>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <Checkbox 
                            id="vitaminb" 
                            checked={checkedSupplements.vitaminb}
                            onCheckedChange={() => toggleSupplement('vitaminb')}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="vitaminb" className="text-base">
                              Vitamin B12 or Complex
                            </Label>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <Checkbox 
                            id="vitaminc" 
                            checked={checkedSupplements.vitaminc}
                            onCheckedChange={() => toggleSupplement('vitaminc')}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="vitaminc" className="text-base">
                              Vitamin C
                            </Label>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <Checkbox 
                            id="vitamind3" 
                            checked={checkedSupplements.vitamind3}
                            onCheckedChange={() => toggleSupplement('vitamind3')}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="vitamind3" className="text-base">
                              Vitamin D3
                            </Label>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <Checkbox 
                            id="ltyrosine" 
                            checked={checkedSupplements.ltyrosine}
                            onCheckedChange={() => toggleSupplement('ltyrosine')}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="ltyrosine" className="text-base">
                              L-Tyrosine
                            </Label>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <Checkbox 
                            id="ltheanine" 
                            checked={checkedSupplements.ltheanine}
                            onCheckedChange={() => toggleSupplement('ltheanine')}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="ltheanine" className="text-base">
                              L-Theanine
                            </Label>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <Checkbox 
                            id="melatonin" 
                            checked={checkedSupplements.melatonin}
                            onCheckedChange={() => toggleSupplement('melatonin')}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="melatonin" className="text-base">
                              Melatonin
                            </Label>
                          </div>
                        </div>
                      </div>
                      
                      {/* Second Column */}
                      <div className="space-y-3">
                        <div className="flex items-start space-x-2">
                          <Checkbox 
                            id="electrolytes" 
                            checked={checkedSupplements.electrolytes}
                            onCheckedChange={() => toggleSupplement('electrolytes')}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="electrolytes" className="text-base">
                              Electrolytes
                            </Label>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <Checkbox 
                            id="water" 
                            checked={checkedSupplements.water}
                            onCheckedChange={() => toggleSupplement('water')}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="water" className="text-base">
                              Clean Water (1-2 liters)
                            </Label>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <Checkbox 
                            id="ashwagandha" 
                            checked={checkedSupplements.ashwagandha}
                            onCheckedChange={() => toggleSupplement('ashwagandha')}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="ashwagandha" className="text-base">
                              Ashwagandha
                            </Label>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <Checkbox 
                            id="zinc" 
                            checked={checkedSupplements.zinc}
                            onCheckedChange={() => toggleSupplement('zinc')}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="zinc" className="text-base">
                              Zinc
                            </Label>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <Checkbox 
                            id="tea" 
                            checked={checkedSupplements.tea}
                            onCheckedChange={() => toggleSupplement('tea')}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="tea" className="text-base">
                              Pau D'Arco tea
                            </Label>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <Checkbox 
                            id="ginkgo" 
                            checked={checkedSupplements.ginkgo}
                            onCheckedChange={() => toggleSupplement('ginkgo')}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="ginkgo" className="text-base">
                              Ginkgo Biloba
                            </Label>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <Checkbox 
                            id="omega3" 
                            checked={checkedSupplements.omega3}
                            onCheckedChange={() => toggleSupplement('omega3')}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="omega3" className="text-base">
                              Omega-3
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-gray-600">
                    <strong>Buy at:</strong> local pharmacy, iHerb, Amazon, or health food store
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <p className="text-sm text-gray-500">Check all items that you already have or plan to get</p>
              </CardFooter>
            </Card>

            {/* PDF Download Section */}
            <Card className="mb-10">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Download className="mr-2 h-5 w-5 text-primary" /> 
                  🎯 Your Complete Perfect Day Reset Guide
                </CardTitle>
                <CardDescription>
                  Download the full timeline with all activities, supplements, and motivational content - designed exactly like our webpage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PerfectDayResetPDF />
              </CardContent>
            </Card>

            {/* Digital Detox */}
            <Card className="mb-10">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Smartphone className="mr-2 h-5 w-5 text-primary" /> 
                  Prepare for a Digital Detox
                </CardTitle>
                <CardDescription>
                  Your phone is the #1 enemy of rest and focus. Let's break that cycle for one day.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-orange-50 p-4 rounded-lg mb-6">
                  <p className="font-medium text-orange-800 mb-1">Why this matters:</p>
                  <p className="text-orange-700 text-sm">Studies show that even having your phone nearby (even when powered off) reduces cognitive capacity and focus. A true reset requires true disconnection.</p>
                </div>
              
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors md:col-span-2 border border-primary/20">
                    <Checkbox 
                      id="journal" 
                      checked={detoxChecklist.journal}
                      onCheckedChange={() => toggleDetoxItem('journal')}
                      className="mt-1"
                    />
                    <div>
                      <Label htmlFor="journal" className="text-base font-medium flex items-center">
                        <PenTool className="h-4 w-4 mr-2 text-primary" /> Prepare a pen and paper/diary
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">
                        Essential tools for your reset day - needed for morning journaling, noting insights, and the Mind Reset exercise
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <Checkbox 
                      id="notifications" 
                      checked={detoxChecklist.notifications}
                      onCheckedChange={() => toggleDetoxItem('notifications')}
                      className="mt-1"
                    />
                    <div>
                      <Label htmlFor="notifications" className="text-base font-medium">
                        Turn off all notifications
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">
                        Disable alerts, badges and banners completely
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <Checkbox 
                      id="airplane" 
                      checked={detoxChecklist.airplane}
                      onCheckedChange={() => toggleDetoxItem('airplane')}
                      className="mt-1"
                    />
                    <div>
                      <Label htmlFor="airplane" className="text-base font-medium">
                        Use airplane mode
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">
                        Block all incoming distractions during your reset day
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <Checkbox 
                      id="autoreply" 
                      checked={detoxChecklist.autoreply}
                      onCheckedChange={() => toggleDetoxItem('autoreply')}
                      className="mt-1"
                    />
                    <div>
                      <Label htmlFor="autoreply" className="text-base font-medium">
                        Set auto-reply message
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">
                        "I'm doing a one-day reset and will respond tomorrow"
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <Checkbox 
                      id="alarm" 
                      checked={detoxChecklist.alarm}
                      onCheckedChange={() => toggleDetoxItem('alarm')}
                      className="mt-1"
                    />
                    <div>
                      <Label htmlFor="alarm" className="text-base font-medium">
                        Use separate alarm clock
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">
                        Don't rely on your phone as your morning alarm
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors md:col-span-2">
                    <Checkbox 
                      id="inform" 
                      checked={detoxChecklist.inform}
                      onCheckedChange={() => toggleDetoxItem('inform')}
                      className="mt-1"
                    />
                    <div>
                      <Label htmlFor="inform" className="text-base font-medium">
                        Inform important contacts
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">
                        Let friends, family, and colleagues know you'll be offline for your reset day
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 border border-green-200 rounded-lg bg-green-50">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <p className="text-green-800 font-medium">Pro tip:</p>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    For optimal results, put your phone in a drawer in another room. Out of sight, out of mind!
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Water Preparation Calculator */}
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-800">
                  <Droplets className="h-6 w-6 mr-3 text-blue-600" />
                  Daily Water Calculator
                </CardTitle>
                <CardDescription className="text-blue-700">
                  Calculate your personalized daily water intake based on your height and weight
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="unit-toggle" className="text-sm font-medium text-gray-700 mb-2 block">
                      Measurement System
                    </Label>
                    <div className="flex space-x-2">
                      <Button
                        variant={waterCalc.unit === "metric" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setWaterCalc(prev => ({ ...prev, unit: "metric", weight: "", height: "", dailyWater: 0 }))}
                        className="flex-1"
                      >
                        Metric
                      </Button>
                      <Button
                        variant={waterCalc.unit === "imperial" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setWaterCalc(prev => ({ ...prev, unit: "imperial", weight: "", height: "", dailyWater: 0 }))}
                        className="flex-1"
                      >
                        Imperial
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="weight" className="text-sm font-medium text-gray-700 mb-2 block">
                      Weight ({waterCalc.unit === "metric" ? "kg" : "lbs"})
                    </Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder={waterCalc.unit === "metric" ? "70" : "154"}
                      value={waterCalc.weight}
                      onChange={(e) => setWaterCalc(prev => ({ ...prev, weight: e.target.value }))}
                      className="text-center"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="height" className="text-sm font-medium text-gray-700 mb-2 block">
                      Height ({waterCalc.unit === "metric" ? "cm" : "inches"})
                    </Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder={waterCalc.unit === "metric" ? "175" : "69"}
                      value={waterCalc.height}
                      onChange={(e) => setWaterCalc(prev => ({ ...prev, height: e.target.value }))}
                      className="text-center"
                    />
                  </div>
                </div>
                
                <div className="text-center">
                  <Button 
                    onClick={calculateWaterIntake}
                    disabled={!waterCalc.weight || !waterCalc.height}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg"
                  >
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate My Daily Water Need
                  </Button>
                </div>
                
                {waterCalc.dailyWater > 0 && (
                  <div className="bg-gradient-to-r from-blue-100 to-cyan-100 p-6 rounded-lg border border-blue-200">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-800 mb-2">
                        {waterCalc.dailyWater} Liters
                      </div>
                      <p className="text-blue-700 text-lg">
                        Your recommended daily water intake
                      </p>
                      <p className="text-blue-600 text-sm mt-2">
                        That's approximately {Math.round(waterCalc.dailyWater * 4.2)} glasses (250ml each)
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Water Quality Information */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Droplets className="h-5 w-5 mr-2 text-blue-500" />
                    Choose Clean Water with Minerals
                  </h4>
                  
                  <div className="space-y-4 text-sm text-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-gray-800 mb-2">✅ What to Look For:</h5>
                        <ul className="space-y-1 list-disc ml-4">
                          <li>Natural spring water with minerals</li>
                          <li>Filtered water with added electrolytes</li>
                          <li>pH between 7.0-8.5 (slightly alkaline)</li>
                          <li>Contains magnesium, calcium, potassium</li>
                          <li>Low sodium content (&lt;20mg/L)</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-gray-800 mb-2">❌ Avoid:</h5>
                        <ul className="space-y-1 list-disc ml-4">
                          <li>Distilled water (lacks minerals)</li>
                          <li>Water with artificial additives</li>
                          <li>High fluoride content water</li>
                          <li>Plastic bottles (use glass when possible)</li>
                          <li>Unfiltered tap water</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-blue-800 font-medium mb-2">💡 Perfect Day Reset Tip:</p>
                      <p className="text-blue-700">
                        Start your morning with 500ml of room temperature water with a pinch of sea salt and lemon. 
                        This jumpstarts hydration and supports your body's natural detox processes.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ready to Reset */}
            {/* Setup & Ready State */}
            <Card className="mb-10">
              <CardHeader>
                <CardTitle className="text-center">
                  Your Reset Setup
                </CardTitle>
                <CardDescription className="text-center">
                  Configure your upcoming Perfect Day Reset.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center w-full">
                {isResetLoading ? (
                  <div className="flex flex-col items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                    <p>Loading your Reset...</p>
                  </div>
                ) : resetError && (resetError as any).status === 401 ? (
                  <div className="bg-orange-50 text-orange-700 p-4 rounded-md">
                    <p>Please log in to configure your Reset.</p>
                  </div>
                ) : resetError && (resetError as any).status !== 404 ? (
                  <div className="bg-red-50 text-red-700 p-4 rounded-md">
                    <p>There was a problem loading your Reset. Please try again.</p>
                  </div>
                ) : currentReset ? (
                  <div className="w-full max-w-md bg-green-50 p-6 rounded-xl border border-green-200">
                    <h3 className="text-xl font-bold text-green-800 text-center mb-4">
                      Your 24-Hour Reset is {currentReset.resetRun.status === "ready" ? "Ready" : "Active"}!
                    </h3>
                    <div className="space-y-2 text-sm text-green-900 mb-6">
                      <p><strong>Goal:</strong> {currentReset.resetRun.resetGoal || 'Not specified'}</p>
                      <p><strong>Diet Track:</strong> {(currentReset.resetRun.foodPreference || 'omni').toUpperCase()}</p>
                      <p><strong>Start:</strong> {new Date(currentReset.resetRun.startAt).toLocaleString()}</p>
                      <p><strong>Bedtime:</strong> {new Date(currentReset.resetRun.targetBedtimeAt).toLocaleString()}</p>
                      <p><strong>Next Morning:</strong> {new Date(currentReset.resetRun.targetNextMorningAt).toLocaleString()}</p>
                    </div>
                    {currentReset.resetRun.status === 'ready' ? (
                      <div className="flex flex-col items-center mt-4 pt-4 border-t border-green-200">
                        <Button 
                          size="lg" 
                          className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold rounded-full"
                          disabled={startReset.isPending}
                          onClick={async () => {
                            try {
                              await startReset.mutateAsync();
                              setLocation('/product/reset/morning');
                            } catch (err: any) {
                              refetch();
                              setLocation('/product/reset/morning');
                            }
                          }}
                        >
                          {startReset.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                          {startReset.isPending ? "Starting..." : "Start My 24-Hour Reset → Morning Phase"}
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-green-200">
                        <Button
                          size="lg"
                          className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold rounded-full"
                          onClick={() => {
                            const phase = currentReset.resetRun.phase;
                            if (phase === "midday") setLocation("/product/reset/midday");
                            else if (phase === "afternoon" || phase === "evening") setLocation("/product/reset/afternoon");
                            else if (currentReset.resetRun.status === "next_morning" || currentReset.resetRun.status === "completed") setLocation("/product/reset/reflection");
                            else setLocation("/product/reset/morning");
                          }}
                        >
                          Continue Active Reset Phase <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <div className="grid grid-cols-2 gap-2 pt-2">
                          <Link href="/product/reset/morning">
                            <Button variant="outline" size="sm" className="w-full text-xs">1. Morning</Button>
                          </Link>
                          <Link href="/product/reset/midday">
                            <Button variant="outline" size="sm" className="w-full text-xs">2. Midday</Button>
                          </Link>
                          <Link href="/product/reset/afternoon">
                            <Button variant="outline" size="sm" className="w-full text-xs">3. Evening</Button>
                          </Link>
                          <Link href="/product/reset/reflection">
                            <Button variant="outline" size="sm" className="w-full text-xs">4. Reflection</Button>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full max-w-md space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="startAt">Start Time</Label>
                      <Input 
                        id="startAt" 
                        type="datetime-local" 
                        value={startAt} 
                        onChange={e => setStartAt(e.target.value)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bedtimeAt">Target Bedtime</Label>
                      <Input 
                        id="bedtimeAt" 
                        type="datetime-local" 
                        value={targetBedtimeAt} 
                        onChange={e => setTargetBedtimeAt(e.target.value)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nextMorningAt">Target Next Morning</Label>
                      <Input 
                        id="nextMorningAt" 
                        type="datetime-local" 
                        value={targetNextMorningAt} 
                        onChange={e => setTargetNextMorningAt(e.target.value)} 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="resetGoal">Primary Goal for this Reset</Label>
                      <Input 
                        id="resetGoal" 
                        placeholder="e.g., Deep rest, planning, detox..."
                        value={resetGoal} 
                        onChange={e => setResetGoal(e.target.value)} 
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="movementAccess">Movement Style</Label>
                      <select 
                        id="movementAccess" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={movementAccess}
                        onChange={e => setMovementAccess(e.target.value)}
                      >
                        <option value="bodyweight">Bodyweight / Yoga</option>
                        <option value="gym">Full Gym Access</option>
                        <option value="outdoor">Outdoor Running / Walking</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="blockedTimes">Blocked Time / Commitments (Optional)</Label>
                      <Textarea 
                        id="blockedTimes" 
                        placeholder="e.g., Doctor appointment 1pm-2pm"
                        value={blockedTimes} 
                        onChange={e => setBlockedTimes(e.target.value)} 
                      />
                    </div>

                    <Button 
                      size="lg" 
                      className="w-full mt-4 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold rounded-full py-6 text-base shadow-lg"
                      disabled={createReset.isPending || startReset.isPending}
                      onClick={async () => {
                        if (!startAt || !targetBedtimeAt || !targetNextMorningAt) {
                          toast({ title: "Please fill out all times", variant: "destructive" });
                          return;
                        }
                        const effectiveGoal =
                          resetGoal.trim() ||
                          "Reclaim calm morning energy, eliminate afternoon brain fog, and get deep restorative sleep";
                        
                        try {
                          await createReset.mutateAsync({
                            startAt: new Date(startAt).toISOString(),
                            targetBedtimeAt: new Date(targetBedtimeAt).toISOString(),
                            targetNextMorningAt: new Date(targetNextMorningAt).toISOString(),
                            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
                            resetGoal: effectiveGoal,
                            foodPreference: selectedDiet || "omni",
                            movementAccess: movementAccess || "bodyweight",
                            blockedTimesJson: blockedTimes ? { notes: blockedTimes } : undefined
                          });
                          await startReset.mutateAsync();
                          toast({ title: "Your 24-Hour Reset is Live!", description: "Starting Phase 1: Morning Activation." });
                          setLocation("/product/reset/morning");
                        } catch (err: any) {
                          if (err.status === 409) {
                            try {
                              await startReset.mutateAsync();
                            } catch {
                              // Already started
                            }
                            refetch();
                            setLocation("/product/reset/morning");
                          } else {
                            toast({ title: "Failed to setup Reset", description: err.message, variant: "destructive" });
                          }
                        }
                      }}
                    >
                      {createReset.isPending || startReset.isPending ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      ) : null}
                      {createReset.isPending || startReset.isPending
                        ? "Starting Your Reset..."
                        : "Save & Start My 24-Hour Reset →"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}