import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Heart, Target, Users, Lightbulb, ArrowRight } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import heroBackground from "@assets/16x9_the_morning_sun_on_a_plant_fille.png";
import founderPhoto from "@assets/unnamed.jpg";
import logoImage from "@assets/1x1_logo_for_website_which_sells_dig.png";

export default function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="About Perfect Day Reset – Transform Your Daily Routine & Well-being"
        description="Learn about Perfect Day Reset's mission to help busy professionals reclaim their energy, focus, and life balance through science-backed daily protocols."
        canonical="https://perfectdayreset.com/about"
        ogTitle="About Perfect Day Reset – Transform Your Daily Routine"
        ogDescription="Discover how Perfect Day Reset helps busy professionals reclaim their energy and focus through proven daily transformation protocols."
        ogImage="https://perfectdayreset.com/logo.png"
        twitterTitle="About Perfect Day Reset – Daily Transformation"
        twitterDescription="Science-backed protocols to transform your energy, focus, and well-being in just one day."
      />
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center text-white"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          {/* Logo */}
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto bg-white/10 backdrop-blur-sm rounded-3xl p-4 shadow-2xl border border-white/20">
              <img 
                src={logoImage} 
                alt="Perfect Day Reset Logo" 
                className="w-full h-full object-contain rounded-2xl"
              />
            </div>
          </div>
          
          <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 mb-6 text-sm font-medium">
            Our Story
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-shadow-lg drop-shadow-2xl">
            <span className="bg-gradient-to-r from-white to-gray-100 bg-clip-text text-transparent">
              Built for Real People Who Want a Fresh Start
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            We believe one perfect day can change everything.
          </p>
          <p className="text-lg md:text-xl opacity-80 max-w-2xl mx-auto">
            Perfect Day Reset was created from a simple but powerful idea — that when life feels overwhelming, all it takes is one structured, mindful day to begin rewriting your story.
          </p>
        </div>
      </section>

      {/* Founder Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Our Origin Story
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Founded by Reiko Kevvai, Ex Head of Sales for Inchcape Motors BMW, who went through burnout, heartbreak, and self-reinvention, Perfect Day Reset is a digital product born from personal experience.
                </p>
                <p>
                  After years of leading high-performance teams and chasing corporate success, Reiko hit rock bottom — and discovered that the way back wasn't complicated: it was about starting one day at a time, with clarity, purpose, and real structure.
                </p>
                <p className="font-medium text-gray-800">
                  That journey — packed with lessons, tools, and small wins from both corporate leadership and personal transformation — became what is now Perfect Day Reset.
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="inline-block">
                <img 
                  src={founderPhoto} 
                  alt="Reiko Kevvai, Founder of Perfect Day Reset" 
                  className="w-80 h-80 rounded-2xl object-cover shadow-2xl mx-auto mb-6"
                />
                <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white p-4 rounded-xl shadow-lg text-center max-w-sm mx-auto">
                  <p className="font-semibold text-base mb-1">Founder</p>
                  <p className="font-bold text-lg mb-1">Reiko Kevvai</p>
                  <p className="text-sm opacity-90">Ex Head of Sales for Inchcape Motors BMW</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why We Exist Section */}
      <section className="py-20 bg-gradient-to-b from-orange-50 to-pink-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Why We Exist
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              We don't believe in magic pills or hustle culture.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lightbulb className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">Simple Systems</h3>
                <p className="text-gray-600">
                  That reduce mental chaos and bring clarity to your daily routine.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">Daily Rituals</h3>
                <p className="text-gray-600">
                  That reconnect you to your strength and inner wisdom.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">Clear Reset</h3>
                <p className="text-gray-600">
                  A guided reset process that just works, no matter where you're starting.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Whether you're feeling stuck, scattered, or just ready for better — Perfect Day Reset is your first step toward momentum.
            </p>
          </div>
        </div>
      </section>

      {/* Who It's For Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 text-center">
              Who It's For
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">Entrepreneurs & Creators</h3>
                <p className="text-gray-600">Who lost their edge and need to reconnect with their vision.</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">Recovery & Healing</h3>
                <p className="text-gray-600">Anyone recovering from heartbreak, burnout, or major life changes.</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">Fresh Start Seekers</h3>
                <p className="text-gray-600">People who want to get their life back in order — starting today.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes It Different */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              What Makes It Different
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Designed for Real-World Overwhelm</h3>
                <p className="text-gray-600">Not fantasy routines that only work in perfect conditions.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Guided Step-by-Step</h3>
                <p className="text-gray-600">With zero guesswork — everything is laid out clearly for you.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">No Fluff</h3>
                <p className="text-gray-600">Just structure, intention, and real results that you can feel immediately.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Built by Someone Who Needed It</h3>
                <p className="text-gray-600">Created from personal experience and now shared with authenticity.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Promise */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-pink-500 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            Our Promise
          </h2>
          
          <div className="max-w-2xl mx-auto mb-12">
            <p className="text-xl mb-8 opacity-90">
              You'll walk away from your reset day feeling:
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <CheckCircle className="h-6 w-6" />
                <span className="text-lg font-medium">Clear-headed</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <CheckCircle className="h-6 w-6" />
                <span className="text-lg font-medium">Back in control</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <CheckCircle className="h-6 w-6" />
                <span className="text-lg font-medium">Proud of how you showed up</span>
              </div>
            </div>
          </div>

          <a href="/what-you-get">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold rounded-full shadow-2xl transform hover:scale-105 transition-all">
              Start Your Reset Today
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}