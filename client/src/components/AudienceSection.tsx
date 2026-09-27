import { Button } from "@/components/ui/button";
import { Briefcase, Heart, Bolt, RefreshCw, Check } from "lucide-react";
import { Link } from "wouter";

export default function AudienceSection() {
  return (
    <section id="about" className="section bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Who's This For?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Our program is designed for individuals who are ready to transform their daily habits and achieve lasting change.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-secondary rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Briefcase className="text-primary text-2xl h-8 w-8" />
            </div>
            <h3 className="font-semibold mb-2">Professionals</h3>
            <p className="text-gray-600">Seeking better work-life balance and increased productivity.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-secondary rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Heart className="text-primary text-2xl h-8 w-8" />
            </div>
            <h3 className="font-semibold mb-2">Health Seekers</h3>
            <p className="text-gray-600">Looking to establish sustainable wellness habits.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-secondary rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Bolt className="text-primary text-2xl h-8 w-8" />
            </div>
            <h3 className="font-semibold mb-2">Overcommited</h3>
            <p className="text-gray-600">Needing structure to manage multiple responsibilities.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-secondary rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="text-primary text-2xl h-8 w-8" />
            </div>
            <h3 className="font-semibold mb-2">Life Transitioners</h3>
            <p className="text-gray-600">Navigating major changes and seeking new patterns.</p>
          </div>
        </div>
        
        <div className="mt-16 bg-gray-50 p-8 rounded-lg">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold mb-4">Is This You?</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              {[
                "You're busy but feeling like you're not making progress on what truly matters",
                "You struggle creating boundaries between work and personal time",
                "You've tried other productivity systems but couldn't stick with them"
              ].map((text, i) => (
                <div key={i} className="flex items-start mb-6 last:mb-0">
                  <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    <Check className="text-white text-sm h-4 w-4" />
                  </div>
                  <p className="text-gray-700">{text}</p>
                </div>
              ))}
            </div>
            
            <div>
              {[
                "You feel exhausted at the end of the day but unsatisfied with what you've accomplished",
                "You want to prioritize health and wellness but can't find the time",
                "You're ready for a practical system that actually fits into your real life"
              ].map((text, i) => (
                <div key={i} className="flex items-start mb-6 last:mb-0">
                  <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    <Check className="text-white text-sm h-4 w-4" />
                  </div>
                  <p className="text-gray-700">{text}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Link href="/checkout">
              <Button className="cta-button bg-primary text-white font-medium px-8 py-3 rounded-full hover:bg-green-600 transition">
                Yes, This Is Me! Get Started →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
