import React from "react";
import { Link } from "wouter";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import heroImage from "@assets/Täiuslik päeva algus.webp";
import sunriseImage from "@assets/Hommikune venitamine päikesetõusul.webp";
import {
  FileText,
  MailOpen,
  CheckCheck,
  Calendar,
  Utensils,
  ShieldCheck,
  ArrowRight,
  Star,
  User,
  ShoppingBag,
  FileDown,
  Sparkles,
  Phone,
  ListTodo,
  Flame,
  Smartphone,
  RefreshCw,
  Droplets,
  Award,
} from "lucide-react";

export default function WhatYouGet() {
  return (
    <div className="bg-[#FCFCFC] min-h-screen font-sans">
      <SEOHead
        title="Perfect Day Reset Program – Complete 24-Hour Transformation Guide"
        description="Get the complete Perfect Day Reset program ($19): live interactive web companion with 1-tap delay rescheduling, 5 customizable nutrition tracks, hydration calculator, evening reflection journal, and printable PDF guide."
        canonical="https://perfectdayreset.com/what-you-get"
        ogTitle="Perfect Day Reset Program – 24-Hour Transformation ($19)"
        ogDescription="Complete interactive web companion and printable PDF guide to reset your energy, focus, and mood in just one day."
        ogImage="https://perfectdayreset.com/og-image.png"
        twitterTitle="Perfect Day Reset – Complete Program ($19)"
        twitterDescription="Transform your energy, focus, and mood in 24 hours with our interactive web companion and printable reset blueprint."
      />
      <NavBar />

      {/* Top padding for fixed navbar */}
      <div className="pt-16 md:pt-20">
        {/* HERO IMAGE */}
        <div className="w-full">
          <img
            src={heroImage}
            alt="Perfect Day Reset Hero Image"
            decoding="async"
            className="w-full object-cover"
            style={{ maxHeight: "80vh" }}
          />
        </div>

        {/* Above-the-fold Hero Value Banner & CTA */}
        <div className="bg-slate-900 text-white py-8 px-6 border-b border-slate-800">
          <div className="container mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1.5">
                <Smartphone className="h-4 w-4" />
                Works Instantly on Any Phone or Laptop + Printable PDF
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                The Complete 24-Hour Reset System — One-Time Access ($19)
              </h1>
              <p className="text-slate-300 text-sm sm:text-base mt-1">
                Includes the Live Interactive Web Companion Portal, 5 Nutrition Modes, 1-Tap Schedule Rescheduler &amp; Printable PDF Kit.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 flex-shrink-0 w-full md:w-auto">
              <Link href="/checkout" className="block w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-7 py-5 rounded-full h-auto text-base font-semibold shadow-xl">
                  Start My 24-Hour Reset — $19
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/quiz" className="block w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto bg-white/10 border-amber-400/60 text-amber-300 hover:bg-amber-400/20 hover:text-amber-200 px-5 py-5 rounded-full h-auto text-sm font-semibold"
                >
                  <Sparkles className="mr-1.5 h-4 w-4" />
                  Free 60s Diagnostic
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* BLOCK 3: WHAT'S INSIDE (Live Web Companion + Printable PDF) */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-12">
            <span className="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3">
              Dual Format: Interactive Web App + Printable PDF
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              What's Included in the Perfect Day Reset
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Everything you need for a complete mind-body transformation in a single day—accessible instantly on any phone or laptop, or printed on paper.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-orange-50/70 rounded-xl p-6 border border-orange-200/80 flex items-start transition-all hover:shadow-md">
              <div className="bg-orange-100 rounded-xl p-3 mr-4 flex-shrink-0">
                <RefreshCw className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1 text-gray-900">
                  Dynamic 24-Hour Schedule &amp; 1-Tap Delay Rescheduler
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Set your wake time and follow your hour-by-hour timeline from Prep through Evening Decompression. Running 15 or 30 mins late? Tap once and the engine recalculates your entire day automatically—no guilt.
                </p>
              </div>
            </div>

            <div className="bg-emerald-50/70 rounded-xl p-6 border border-emerald-200/80 flex items-start transition-all hover:shadow-md">
              <div className="bg-emerald-100 rounded-xl p-3 mr-4 flex-shrink-0">
                <Utensils className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1 text-gray-900">
                  5 Customizable Nutrition Modes + 1-Click Grocery Lists
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Choose between <strong>Omnivore, Vegetarian, Keto, Paleo, or Vegan</strong> tracks. Includes anti-crash breakfast, metabolic lunch, and recovery dinner recipes with interactive shopping lists.
                </p>
              </div>
            </div>

            <div className="bg-blue-50/70 rounded-xl p-6 border border-blue-200/80 flex items-start transition-all hover:shadow-md">
              <div className="bg-blue-100 rounded-xl p-3 mr-4 flex-shrink-0">
                <Droplets className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1 text-gray-900">
                  Interactive Hydration Calculator &amp; Electrolyte Protocol
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Calculate your exact daily water and mineral target based on your body weight and activity level, with timed hydration checkpoints built into your schedule.
                </p>
              </div>
            </div>

            <div className="bg-purple-50/70 rounded-xl p-6 border border-purple-200/80 flex items-start transition-all hover:shadow-md">
              <div className="bg-purple-100 rounded-xl p-3 mr-4 flex-shrink-0">
                <Phone className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1 text-gray-900">
                  Digital Detox Checklist &amp; Saved Evening Reflections
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Structured screen-free morning and digital sunset boundaries, plus a 5-prompt cognitive unload journal that saves your reflections privately in your account.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 flex items-start transition-all hover:shadow-md">
              <div className="bg-primary/10 rounded-xl p-3 mr-4 flex-shrink-0">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1 text-gray-900">
                  Printable 24-Hour Reset PDF Blueprint
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Prefer going 100% offline during your reset? Download and print the complete step-by-step PDF manual so you can leave your phone in another room all day.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 flex items-start transition-all hover:shadow-md">
              <div className="bg-primary/10 rounded-xl p-3 mr-4 flex-shrink-0">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1 text-gray-900">
                  Evidence-Based Supplement Stack &amp; Dosage Guide
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Optional, high-impact supplement timings (magnesium, electrolytes, omega-3s, L-theanine) with clean sourcing criteria—no overpriced proprietary blends required.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 flex items-start transition-all hover:shadow-md">
              <div className="bg-primary/10 rounded-xl p-3 mr-4 flex-shrink-0">
                <ListTodo className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1 text-gray-900">
                  7-Day Daily Reset Tracker (Web + Printable)
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Lock in your favorite micro-habits after your 24-hour reset with our interactive 7-day integration tracker.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 flex items-start transition-all hover:shadow-md">
              <div className="bg-primary/10 rounded-xl p-3 mr-4 flex-shrink-0">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1 text-gray-900">
                  Unlimited Lifetime Reset Runs &amp; Completion Certificate
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Start a fresh Reset Run any weekend, post-travel recovery day, or stressful week—and download your personalized Certificate of Completion.
                </p>
              </div>
            </div>

            <div className="md:col-span-2 bg-gradient-to-r from-green-50 to-emerald-100 rounded-xl p-6 border border-green-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:shadow-md">
              <div className="flex items-start">
                <div className="bg-primary/10 rounded-xl p-3 mr-4 flex-shrink-0">
                  <Flame className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1 text-gray-900">
                    Built by Reiko Kevvai (Ex Head of Sales for Inchcape Motors BMW)
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base">
                    Engineered from 35+ years in competitive sports and corporate burnout recovery—plus every purchase donates $1 to children's programs.
                  </p>
                </div>
              </div>
              <Link href="/checkout" className="flex-shrink-0">
                <Button className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-6 py-3 font-semibold">
                  Start My 24-Hour Reset — $19
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* BLOCK 4: WHO THIS IS FOR */}
      <div className="py-16 bg-blue-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Who Is This For?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              If you recognize yourself in any of these descriptions, the Perfect Day Reset was built for you:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            <div className="bg-white rounded-lg shadow-sm p-8 border border-blue-100 flex flex-col justify-center">
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-1.5 mr-4 flex-shrink-0">
                    <CheckCheck className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Anyone feeling stuck, foggy, or low-energy</h3>
                    <p className="text-gray-600">
                      When you've been running on empty for too long and need a structured 1-day system to recharge
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-1.5 mr-4 flex-shrink-0">
                    <CheckCheck className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">People who've lost momentum and want a clean reset</h3>
                    <p className="text-gray-600">
                      When good habits have slipped and a 30-day challenge feels overwhelming
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-1.5 mr-4 flex-shrink-0">
                    <CheckCheck className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">High performers who need to recover from burnout</h3>
                    <p className="text-gray-600">
                      When you're accomplishing a lot at work but your sleep, focus, and nervous system are paying the price
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-1.5 mr-4 flex-shrink-0">
                    <CheckCheck className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Busy professionals &amp; parents who need flexibility</h3>
                    <p className="text-gray-600">
                      When life is unpredictable and you need a 1-tap delay rescheduler that adapts to your day
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-1.5 mr-4 flex-shrink-0">
                    <CheckCheck className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">You, if you're ready to feel a difference in 24 hours</h3>
                    <p className="text-gray-600">
                      When you want tangible mental clarity and calm energy tomorrow morning without overthinking every detail
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Full Vertical Image Column */}
            <div className="order-first lg:order-last">
              <img
                src={sunriseImage}
                alt="Person celebrating success at sunrise"
                loading="lazy"
                decoding="async"
                className="w-full h-full rounded-lg shadow-lg object-cover min-h-[600px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* FREE 60-SECOND DIAGNOSTIC CALLOUT BANNER */}
      <div className="py-12 bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 text-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-white/5 border border-white/15 rounded-2xl p-6 sm:p-8">
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                Free Personalized Preview • 60 Seconds
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Not Sure Which Wake Time or Meal Track Fits You Best?
              </h2>
              <p className="text-gray-300 text-sm sm:text-base max-w-2xl">
                Take our 5-question diagnostic to uncover your Overwhelm Archetype and preview your custom hour-by-hour 24-Hour Reset schedule before you buy.
              </p>
            </div>
            <div className="flex-shrink-0 w-full sm:w-auto">
              <Link href="/quiz" className="block w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-bold px-7 py-6 rounded-full h-auto text-base shadow-xl">
                  Take the Free 60-Second Burnout &amp; Reset Diagnostic
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* BLOCK 5: WHAT HAPPENS AFTER PURCHASE */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">What Happens After You Buy?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Access is automatic and immediate—you'll be inside your Interactive Reset Portal in under 60 seconds:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-amber-50 rounded-xl p-6 border border-amber-100 text-center">
              <div className="inline-block bg-white rounded-full p-3 mb-4 shadow-sm">
                <MailOpen className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Step 1: Instant Portal Unlock</h3>
              <p className="text-gray-700">
                Right after your $19 checkout, your browser unlocks the 5-part Interactive Web Companion Portal and emails your backup login credentials.
              </p>
            </div>

            <div className="bg-amber-50 rounded-xl p-6 border border-amber-100 text-center">
              <div className="inline-block bg-white rounded-full p-3 mb-4 shadow-sm">
                <FileDown className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Step 2: 15-Minute Prep</h3>
              <p className="text-gray-700">
                Choose your wake time, pick 1 of the 5 nutrition tracks (Omnivore, Vegetarian, Keto, Paleo, or Vegan), and download your Printable PDF Guide if desired.
              </p>
            </div>

            <div className="bg-amber-50 rounded-xl p-6 border border-amber-100 text-center">
              <div className="inline-block bg-white rounded-full p-3 mb-4 shadow-sm">
                <Sparkles className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Step 3: Run Your 24-Hour Reset</h3>
              <p className="text-gray-700">
                Follow your adaptive timeline at your own pace, log your evening reflections, and repeat the reset whenever you need a fresh start.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof Section */}
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-3xl font-bold mb-10 text-center">What People Are Saying</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transform transition-transform hover:-translate-y-1">
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-amber-400" fill="#F59E0B" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "Followed this reset when I was feeling completely burnt out. By the end of the day, I felt like a new person. My mind was clear and my energy was back."
              </p>
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <p className="font-medium">Sophia R.</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transform transition-transform hover:-translate-y-1">
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-amber-400" fill="#F59E0B" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "The meal plans were so easy to follow, and the supplement recommendations made a noticeable difference. I'm making this reset a monthly ritual now."
              </p>
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <p className="font-medium">Michael T.</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transform transition-transform hover:-translate-y-1">
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-amber-400" fill="#F59E0B" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "As a busy mom, I never take time for myself. This reset was exactly what I needed - structured enough to follow but flexible enough to fit into my life."
              </p>
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <p className="font-medium">Jennifer L.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BLOCK 6: FINAL CTA SECTION */}
      <div className="py-16 bg-gradient-to-br from-primary/5 to-blue-50 border-t border-primary/10">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-6">
            Start Your 24-Hour Reset Today for Only $19
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            One engineered day to transform your energy, clarity, and focus. Get instant access to the Interactive Web Companion + Printable PDF Guide and start whenever you're ready.
          </p>

          <div className="flex justify-center">
            <Link href="/checkout" className="inline-block mb-4">
              <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-8 sm:px-10 py-6 sm:py-7 rounded-full h-auto text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 w-full sm:w-auto">
                Start My 24-Hour Reset — $19
                <ArrowRight className="ml-2 sm:ml-3 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
          </div>

          <p className="mt-4 text-sm text-gray-600 italic">
            Backed by our 30-day 100% money-back satisfaction guarantee.
          </p>

          <div className="flex flex-wrap justify-center mt-8 gap-6">
            <div className="flex items-center text-sm text-gray-600">
              <ShoppingBag className="h-4 w-4 text-primary mr-1.5" />
              <span>One-time $19 purchase</span>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <Smartphone className="h-4 w-4 text-primary mr-1.5" />
              <span>Live Web App + Printable PDF</span>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <MailOpen className="h-4 w-4 text-primary mr-1.5" />
              <span>Instant access</span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}