import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function FeaturesGrid() {
  return (
    <section id="features" className="section bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Everything You Need to Succeed</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Our comprehensive program provides all the tools and resources needed to transform your daily habits.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* First Column */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Morning Routine</h3>
              <ul className="space-y-2">
                {['5-minute meditation', 'Hydration protocol', 'Energizing movements', 'Intention journal'].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="text-primary mt-1 mr-2 h-4 w-4" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Midday Mindfulness</h3>
              <ul className="space-y-2">
                {['Breathing technique', 'Focus restoration', 'Energy nutrition guide', 'Mood elevation exercise'].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="text-primary mt-1 mr-2 h-4 w-4" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Second Column */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Productivity System</h3>
              <ul className="space-y-2">
                {['Priority framework', 'Focus block technique', 'Distraction elimination', 'Energy management'].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="text-primary mt-1 mr-2 h-4 w-4" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Personalized Guidance</h3>
              <ul className="space-y-2">
                {['1-on-1 coaching call', 'Progress tracking app', 'Custom habit stacking', 'Accountability system'].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="text-primary mt-1 mr-2 h-4 w-4" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Third Column */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Evening Reset</h3>
              <ul className="space-y-2">
                {['Reflection protocol', 'Gratitude practice', 'Sleep optimization', 'Tomorrow planning'].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="text-primary mt-1 mr-2 h-4 w-4" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Digital Resources</h3>
              <ul className="space-y-2">
                {['Video instruction library', 'Printable worksheets', 'Audio meditation guides', 'Community forum access'].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="text-primary mt-1 mr-2 h-4 w-4" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
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
