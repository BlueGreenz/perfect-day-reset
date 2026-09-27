import { Button } from "@/components/ui/button";
import { X, Check, TrendingUp, Sprout, RotateCw, Users, Gauge, SlidersHorizontal, BarChart2 } from "lucide-react";

export default function ComparisonSection() {
  return (
    <section className="section bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Vacations don't work.<br />You need a real reset.</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">The problem with traditional approaches is they don't create lasting change. Our system rebuilds your daily habits from the ground up.</p>
        </div>
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 mb-12">
          <div className="text-center">
            <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 border-2 border-red-400">
              <X className="text-red-400 text-2xl h-8 w-8" />
            </div>
            <p className="text-gray-700 font-medium">Temporary Escape</p>
          </div>
          
          <div className="hidden md:block border-t-2 border-gray-300 w-32"></div>
          
          <div className="text-center">
            <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 border-2 border-green-400">
              <Check className="text-green-400 text-2xl h-8 w-8" />
            </div>
            <p className="text-gray-700 font-medium">Lasting Change</p>
          </div>
          
          <div className="hidden md:block border-t-2 border-gray-300 w-32"></div>
          
          <div className="text-center">
            <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 border-2 border-primary">
              <TrendingUp className="text-primary text-2xl h-8 w-8" />
            </div>
            <p className="text-gray-700 font-medium">Continuous Growth</p>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-sm mb-12">
          <h3 className="text-xl font-semibold mb-6 text-center">What's different about our program?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
            <div className="flex items-start">
              <Sprout className="text-primary text-xl mt-1 mr-4 h-6 w-6" />
              <div>
                <h4 className="font-medium mb-1">Habit Science</h4>
                <p className="text-gray-600 text-sm">Based on behavioral psychology and habit formation research.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <RotateCw className="text-primary text-xl mt-1 mr-4 h-6 w-6" />
              <div>
                <h4 className="font-medium mb-1">Daily Implementation</h4>
                <p className="text-gray-600 text-sm">Builds consistent practices that fit into your actual life.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Users className="text-primary text-xl mt-1 mr-4 h-6 w-6" />
              <div>
                <h4 className="font-medium mb-1">Community Support</h4>
                <p className="text-gray-600 text-sm">Connect with others on the same journey for accountability.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Gauge className="text-primary text-xl mt-1 mr-4 h-6 w-6" />
              <div>
                <h4 className="font-medium mb-1">Incremental Progress</h4>
                <p className="text-gray-600 text-sm">Small, sustainable changes that compound over time.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <SlidersHorizontal className="text-primary text-xl mt-1 mr-4 h-6 w-6" />
              <div>
                <h4 className="font-medium mb-1">Personalized Approach</h4>
                <p className="text-gray-600 text-sm">Adaptable to your unique circumstances and goals.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <BarChart2 className="text-primary text-xl mt-1 mr-4 h-6 w-6" />
              <div>
                <h4 className="font-medium mb-1">Measurable Results</h4>
                <p className="text-gray-600 text-sm">Track progress and see real changes in productivity and wellbeing.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <a 
            href="/what-you-get"
          >
            <Button className="cta-button bg-primary text-white font-medium px-8 py-3 rounded-full hover:bg-green-600 transition">
              Get the Perfect Day Reset – $67
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
