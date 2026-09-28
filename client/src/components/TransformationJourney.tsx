import { Button } from "@/components/ui/button";
import { 
  Sun, GlassWater, ListChecks, PersonStanding, Book, 
  Utensils, Timer, Brain, MessageSquare, TrendingUp, 
  Moon, PenSquare, Bath, CalendarClock, Bed, 
  Sunrise, Sunset, CloudSun, ArrowRight,
  AlarmClock, Clock3
} from "lucide-react";

export default function TransformationJourney() {
  return (
    <section id="journey" className="bg-white py-16 md:py-24">
      <div className="container">
        <div className="section-heading">
          <h2>Your 24-Hour Transformation Journey</h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            A time-optimized program designed to reset your mental, physical, and emotional state in just one day.
          </p>
        </div>
        
        <div className="mb-12 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-full">
                <Sunrise className="h-7 w-7 text-primary" />
              </div>
              <span className="text-sm font-medium mt-2">6 AM</span>
            </div>
            <div className="h-1 flex-1 bg-primary/10 mx-4"></div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-full">
                <CloudSun className="h-7 w-7 text-primary" />
              </div>
              <span className="text-sm font-medium mt-2">12 PM</span>
            </div>
            <div className="h-1 flex-1 bg-primary/10 mx-4"></div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-full">
                <Sunset className="h-7 w-7 text-primary" />
              </div>
              <span className="text-sm font-medium mt-2">6 PM</span>
            </div>
            <div className="h-1 flex-1 bg-primary/10 mx-4"></div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary/10 rounded-full">
                <Moon className="h-7 w-7 text-primary" />
              </div>
              <span className="text-sm font-medium mt-2">10 PM</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Morning Rituals */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-primary/10 rounded-full mr-4">
                <Sun className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Morning Rituals</h3>
            </div>
            
            <div className="space-y-5">
              <div className="flex items-start">
                <GlassWater className="text-primary h-5 w-5 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-medium">Morning Hydration</div>
                  <p className="text-gray-600 text-sm mt-1">Lemon water + electrolytes</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <ListChecks className="text-primary h-5 w-5 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-medium">Intention Setting</div>
                  <p className="text-gray-600 text-sm mt-1">Focus journaling practice</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <PersonStanding className="text-primary h-5 w-5 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-medium">Movement Practice</div>
                  <p className="text-gray-600 text-sm mt-1">Energizing yoga flow</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Book className="text-primary h-5 w-5 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-medium">Growth & Learning</div>
                  <p className="text-gray-600 text-sm mt-1">Guided reflection reading</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Midday Recharge */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-primary/10 rounded-full mr-4">
                <CloudSun className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Midday Recharge</h3>
            </div>
            
            <div className="space-y-5">
              <div className="flex items-start">
                <Utensils className="text-primary h-5 w-5 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-medium">Mindful Eating</div>
                  <p className="text-gray-600 text-sm mt-1">Nutrient-dense lunch protocol</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Timer className="text-primary h-5 w-5 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-medium">Deep Focus Session</div>
                  <p className="text-gray-600 text-sm mt-1">Flow state technique</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Brain className="text-primary h-5 w-5 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-medium">Mental Refresh</div>
                  <p className="text-gray-600 text-sm mt-1">Guided visualization</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <TrendingUp className="text-primary h-5 w-5 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-medium">Progress Check-in</div>
                  <p className="text-gray-600 text-sm mt-1">Energy level assessment</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Evening Wind-Down */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-primary/10 rounded-full mr-4">
                <Sunset className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Evening Wind-Down</h3>
            </div>
            
            <div className="space-y-5">
              <div className="flex items-start">
                <Moon className="text-primary h-5 w-5 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-medium">Digital Sunset</div>
                  <p className="text-gray-600 text-sm mt-1">Screen-free transition</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <PenSquare className="text-primary h-5 w-5 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-medium">Reflection Practice</div>
                  <p className="text-gray-600 text-sm mt-1">Guided journaling</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Bath className="text-primary h-5 w-5 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-medium">Relaxation Ritual</div>
                  <p className="text-gray-600 text-sm mt-1">Calming body technique</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Bed className="text-primary h-5 w-5 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <div className="font-medium">Sleep Optimization</div>
                  <p className="text-gray-600 text-sm mt-1">Deep rest protocol</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6 mb-12">
          <div className="bg-primary/5 py-3 px-6 rounded-lg flex items-center">
            <AlarmClock className="text-primary h-5 w-5 mr-2" />
            <span className="text-sm font-medium">16 Key Activities</span>
          </div>
          <ArrowRight className="hidden md:block text-primary h-5 w-5" />
          <div className="bg-primary/5 py-3 px-6 rounded-lg flex items-center">
            <MessageSquare className="text-primary h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Step-by-Step Guidance</span>
          </div>
          <ArrowRight className="hidden md:block text-primary h-5 w-5" />
          <div className="bg-primary/5 py-3 px-6 rounded-lg flex items-center">
            <Clock3 className="text-primary h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Just 24 Hours</span>
          </div>
        </div>
        
        <div className="text-center">
          <a 
            href="/what-you-get"
          >
            <Button size="lg" className="cta-button bg-primary text-white font-medium px-8 py-6 rounded-full hover:bg-green-600 transition text-lg">
              Get the Perfect Day Reset – $19
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
