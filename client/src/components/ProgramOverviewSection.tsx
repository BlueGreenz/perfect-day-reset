import { Button } from "@/components/ui/button";
import { Sun, Coffee, Battery, Clock, Utensils, Brain, PersonStanding, Moon, Lightbulb, Bed, PenTool } from "lucide-react";

export default function ProgramOverviewSection() {
  return (
    <section id="program-overview" className="section bg-gray-50 py-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What You'll Get</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">The Perfect Day Reset is broken down into three powerful protocols that work together to transform your entire day.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Morning Protocol */}
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="flex items-center mb-6">
              <div className="bg-secondary rounded-full w-12 h-12 flex items-center justify-center mr-4">
                <Sun className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Morning Clarity Protocol</h3>
            </div>
            <p className="text-gray-600 mb-6">Wake, hydrate, energize, and prep your brain for peak performance.</p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Coffee className="text-primary mt-1 mr-3 h-5 w-5" />
                <div>
                  <span className="font-medium">Hydration Formula</span>
                  <p className="text-sm text-gray-500">Special morning drink to kickstart metabolism</p>
                </div>
              </li>
              <li className="flex items-start">
                <Battery className="text-primary mt-1 mr-3 h-5 w-5" />
                <div>
                  <span className="font-medium">Energy Activation</span>
                  <p className="text-sm text-gray-500">5-minute movement to wake up your body</p>
                </div>
              </li>
              <li className="flex items-start">
                <Clock className="text-primary mt-1 mr-3 h-5 w-5" />
                <div>
                  <span className="font-medium">Intention Setting</span>
                  <p className="text-sm text-gray-500">Prioritize your day for maximum impact</p>
                </div>
              </li>
            </ul>
          </div>
          
          {/* Midday Protocol */}
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="flex items-center mb-6">
              <div className="bg-secondary rounded-full w-12 h-12 flex items-center justify-center mr-4">
                <Utensils className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Midday Momentum Boost</h3>
            </div>
            <p className="text-gray-600 mb-6">Nutrition reset, posture trick, and meditation to maintain energy and focus.</p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Brain className="text-primary mt-1 mr-3 h-5 w-5" />
                <div>
                  <span className="font-medium">Focus Renewal</span>
                  <p className="text-sm text-gray-500">3-minute breathing technique to reset attention</p>
                </div>
              </li>
              <li className="flex items-start">
                <PersonStanding className="text-primary mt-1 mr-3 h-5 w-5" />
                <div>
                  <span className="font-medium">Posture Correction</span>
                  <p className="text-sm text-gray-500">Simple alignment trick for energy &amp; confidence</p>
                </div>
              </li>
              <li className="flex items-start">
                <Lightbulb className="text-primary mt-1 mr-3 h-5 w-5" />
                <div>
                  <span className="font-medium">Creativity Pause</span>
                  <p className="text-sm text-gray-500">Reconnect with purpose and inspiration</p>
                </div>
              </li>
            </ul>
          </div>
          
          {/* Evening Protocol */}
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="flex items-center mb-6">
              <div className="bg-secondary rounded-full w-12 h-12 flex items-center justify-center mr-4">
                <Moon className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Evening Recharge Ritual</h3>
            </div>
            <p className="text-gray-600 mb-6">Wind down, reflect, reset, and sleep deep for total recovery.</p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <PenTool className="text-primary mt-1 mr-3 h-5 w-5" />
                <div>
                  <span className="font-medium">Reflection Exercise</span>
                  <p className="text-sm text-gray-500">Guided questions to process your day</p>
                </div>
              </li>
              <li className="flex items-start">
                <Clock className="text-primary mt-1 mr-3 h-5 w-5" />
                <div>
                  <span className="font-medium">Tomorrow Prep</span>
                  <p className="text-sm text-gray-500">Set yourself up for morning success</p>
                </div>
              </li>
              <li className="flex items-start">
                <Bed className="text-primary mt-1 mr-3 h-5 w-5" />
                <div>
                  <span className="font-medium">Sleep Enhancement</span>
                  <p className="text-sm text-gray-500">Techniques for deep, restorative sleep</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="text-center">
          <a 
            href="/what-you-get"
          >
            <Button className="cta-button bg-primary text-white font-medium px-8 py-3 rounded-full hover:bg-green-600 transition">
              Get the Perfect Day Reset – $19
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}