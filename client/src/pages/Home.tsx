import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Heart, Star, ArrowRight, Users, Calendar, Target, Smartphone, Mail } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import FAQSection from "@/components/FAQSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import SEOHead from "@/components/SEOHead";
import sunriseBackground from "@assets/16x9_A_vibrant_golden_sunrise_gradual.png";

export default function Home() {
  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
    
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      if (anchor) {
        e.preventDefault();
        const href = anchor.getAttribute('href');
        if (href && href !== '#' && href.length > 1) {
          const targetElement = document.querySelector(href);
          if (targetElement) {
            targetElement.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Perfect Day Reset – Reclaim Your Energy, Focus & Mood in 24 Hours"
        description="Transform your mind and body with the Perfect Day Reset – a one-day protocol of food, movement, and journaling. Start your journey now."
        canonical="https://perfectdayreset.com"
        ogTitle="Perfect Day Reset – Reclaim Your Energy, Focus & Mood"
        ogDescription="Our 24-hour lifestyle reboot blends clean food, focused movement, and powerful mindset tools. Start your reset today."
        ogImage="https://perfectdayreset.com/logo.png"
        twitterTitle="Perfect Day Reset – Reclaim Your Energy"
        twitterDescription="One day can change everything. Join the reset that improves your energy, focus, and mood."
      />
      <NavBar />
      
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center text-white"
        style={{
          backgroundImage: `url(${sunriseBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Social Impact Badge */}
        <div className="absolute top-20 sm:top-24 left-4 right-4 sm:left-auto sm:right-8 z-10 flex justify-center sm:justify-end">
          <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-3 sm:px-4 py-2 text-xs sm:text-sm">
            <Heart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Every purchase donates $1 to children's programs</span>
            <span className="sm:hidden">$1 donated per purchase</span>
          </Badge>
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto px-6 sm:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Transform Your Energy, Clarity & Focus in Just 24 Hours
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-10 max-w-3xl mx-auto opacity-90">
            A proven, guided 24-hour protocol to reset your mind and body—and give $1 to children's programs with every purchase.
          </p>
          <a href="/what-you-get">
            <Button size="lg" className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-6 sm:px-8 md:px-12 py-4 sm:py-6 text-lg sm:text-xl rounded-full font-semibold shadow-2xl transform hover:scale-105 transition-all">
              <span className="hidden sm:inline">Start Your 24-Hour Reset Now</span>
              <span className="sm:hidden">Start Reset Now</span>
              <ArrowRight className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
          </a>
          
          {/* App Store Logos - Coming Soon */}
          <div className="mt-6 sm:mt-8">
            <p className="text-white/80 text-xs sm:text-sm mb-3 sm:mb-4">Also coming soon to mobile:</p>
            <div className="flex items-center justify-center gap-2 sm:gap-4">
              {/* Apple App Store */}
              <div className="opacity-70 cursor-not-allowed">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                  alt="Download on the App Store" 
                  className="h-8 sm:h-10 md:h-12 rounded"
                />
              </div>
              
              {/* Google Play Store */}
              <div className="opacity-70 cursor-not-allowed">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Get it on Google Play" 
                  className="h-8 sm:h-10 md:h-12 rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-b from-white via-gray-50 to-white" id="how-it-works">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">How the 24-Hour Reset Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A simple, proven 3-step process to transform your energy and mindset in just one day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Step 1: Prepare Your Day</h3>
              <ul className="text-left space-y-2 text-gray-700">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Receive your personalized 24-hour schedule
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Gather supplements list and choose your dietary meal preferences
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Set your intention for transformation
                </li>
              </ul>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Step 2: Follow the Protocol</h3>
              <p className="text-gray-700 leading-relaxed">
                Experience carefully timed morning movement, midday reset activities, and evening reflection practices designed to optimize your energy cycles and mental clarity.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Step 3: Feel the Transformation</h3>
              <p className="text-gray-700 leading-relaxed">
                Wake up with sustained energy, crystal-clear focus, improved mood, and the satisfaction of contributing $1 to children's programs with your purchase.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <TestimonialsSection />

      {/* Program Snapshot Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50" id="program">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Your Complete Reset Program</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three powerful modules designed to transform your entire day and lasting energy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-white shadow-xl hover:shadow-2xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-6">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Morning Activation</h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Start your day with intention through guided movement, hydration rituals, and mind-clearing practices that set the foundation for sustained energy.
                </p>
                <a href="/product/reset/morning" className="text-blue-600 hover:text-blue-800 font-semibold flex items-center">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-xl hover:shadow-2xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mb-6">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Midday Movement</h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Recharge your energy with strategic movement, cold therapy, and focused activities designed to maintain peak performance throughout the day.
                </p>
                <a href="/product/reset/midday" className="text-blue-600 hover:text-blue-800 font-semibold flex items-center">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-xl hover:shadow-2xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mb-6">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Evening Reflection</h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  Wind down with purpose through reflection practices, vision setting, and restorative activities that prepare you for deep, rejuvenating sleep.
                </p>
                <a href="/login" className="text-blue-600 hover:text-blue-800 font-semibold flex items-center">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <a href="/what-you-get">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-10 py-4 text-lg rounded-full font-semibold shadow-xl transform hover:scale-105 transition-all">
                Get Your Complete Reset Program
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Coming Soon to Mobile Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <Smartphone className="h-10 w-10 text-white" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Coming Soon to Your Pocket</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Experience your Perfect Day Reset on the go. Our Android and iOS apps are launching soon.
            </p>
            

            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              {/* Apple App Store Logo */}
              <div className="opacity-50 grayscale hover:opacity-70 transition-all cursor-not-allowed">
                <div className="bg-black rounded-xl px-6 py-3 flex items-center gap-3 min-w-[200px]">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-black">
                      <path fill="currentColor" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-gray-300">Download on the</div>
                    <div className="text-lg font-semibold text-white">App Store</div>
                  </div>
                </div>
              </div>

              {/* Google Play Store Logo */}
              <div className="opacity-50 grayscale hover:opacity-70 transition-all cursor-not-allowed">
                <div className="bg-black rounded-xl px-6 py-3 flex items-center gap-3 min-w-[200px]">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-6 h-6">
                      <path fill="#34A853" d="M3.609 1.814L13.792 12L3.609 22.186C3.61 22.186 3.61 22.186 3.609 22.186C3.246 22.186 2.95 21.89 2.95 21.527V2.473C2.95 2.11 3.246 1.814 3.609 1.814Z"/>
                      <path fill="#FBBC04" d="M20.637 10.07L16.454 7.725L13.792 12L16.454 16.275L20.637 13.93C21.122 13.639 21.122 12.361 20.637 10.07Z"/>
                      <path fill="#EA4335" d="M13.792 12L3.609 1.814C3.859 1.564 4.246 1.564 4.496 1.814L16.454 7.725L13.792 12Z"/>
                      <path fill="#34A853" d="M13.792 12L16.454 16.275L4.496 22.186C4.246 22.436 3.859 22.436 3.609 22.186L13.792 12Z"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-gray-300">GET IT ON</div>
                    <div className="text-lg font-semibold text-white">Google Play</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Waitlist Signup */}
            <div className="mt-12 max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-4">Join the Waitlist</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold whitespace-nowrap">
                  Notify Me
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-3">
                Be the first to know when our mobile apps are available
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />

      <Footer />
    </div>
  );
}