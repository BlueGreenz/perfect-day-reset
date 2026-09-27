import { Button } from "@/components/ui/button";
import { PlayIcon, CheckCircle, Users, Headphones, Battery, Brain, Target } from "lucide-react";
import { Link } from "wouter";
import CountdownTimer from "./CountdownTimer";

export default function HeroSection() {
  // Calculate expiration date (72 hours from now)
  const expireDate = new Date();
  expireDate.setHours(expireDate.getHours() + 72);
  return (
    <section className="hero-pattern pt-20 md:pt-24 pb-16 md:pb-20">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="bg-white text-primary text-sm font-medium px-5 py-2 rounded-full inline-block mb-8 shadow-sm">
            1-Day Transformation Protocol
          </span>
          
          <h1 className="leading-tight mb-8">
            Reset Your Body, Mind &<br className="hidden sm:block" />
            <span className="text-primary">Purpose in 24 Hours</span>
          </h1>
          
          <div className="flex justify-center gap-10 mb-10">
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                <Battery className="h-7 w-7 text-primary" />
              </div>
              <span className="text-sm font-medium">Recharge Energy</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                <Brain className="h-7 w-7 text-primary" />
              </div>
              <span className="text-sm font-medium">Boost Clarity</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                <Target className="h-7 w-7 text-primary" />
              </div>
              <span className="text-sm font-medium">Restore Focus</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-8">
            <div className="space-y-4">
              <Link 
                href="/what-you-get" 
                className="block"
              >
                <Button size="lg" className="cta-button w-full sm:w-auto bg-primary text-white font-medium px-8 py-6 rounded-full hover:bg-green-600 transition text-lg">
                  Get the Perfect Day Reset – $67
                </Button>
              </Link>
              
              <div className="text-center">
                <Link href="/product/reset/welcome">
                  <span className="text-primary hover:underline mt-3 block cursor-pointer font-medium">
                    View Demo Version
                  </span>
                </Link>
              </div>
            </div>
            
            <Button 
              variant="outline"
              size="lg" 
              className="cta-button bg-white text-primary font-medium px-8 py-6 rounded-full border-2 border-primary hover:bg-gray-50 transition text-lg"
              onClick={() => document.getElementById('program-overview')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            >
              <PlayIcon className="mr-2 h-5 w-5" /> Learn more
            </Button>
          </div>
        </div>
        
        {/* Trust Badges */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-12 mt-12 bg-white/60 backdrop-blur-sm py-6 px-4 rounded-xl max-w-3xl mx-auto shadow-sm">
          <div className="flex items-center">
            <span className="text-xl text-primary mr-3">✔️</span>
            <span className="text-base font-medium">30-Day Money Back Guarantee</span>
          </div>
          <div className="flex items-center">
            <span className="text-xl text-primary mr-3">📩</span>
            <span className="text-base font-medium">Direct Support During Your Reset</span>
          </div>
          <div className="flex items-center">
            <span className="text-xl text-primary mr-3">📘</span>
            <span className="text-base font-medium">Structured, No-Guesswork Plan</span>
          </div>
        </div>
        
        {/* Countdown Timer */}
        <div className="max-w-md mx-auto mt-12">
          <CountdownTimer 
            endDate={expireDate}
            title="Launch Special: 30% OFF"
            description="This introductory price ends soon! Get lifetime access now."
            ctaText="Get the Perfect Day Reset – $67"
            ctaLink="/what-you-get"
          />
        </div>
      </div>
    </section>
  );
}
