import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Check, ArrowRight, Sparkles, Clock, SlidersHorizontal, Utensils, Smartphone } from "lucide-react";
import { Link } from "wouter";

export default function ComparisonSection() {
  const genericChallenges = [
    "Overwhelming 30-day commitment — 85% of people quit by Day 4",
    "Rigid schedules that fall apart the moment a meeting runs 15 minutes late",
    "Restrictive one-size-fits-all meal rules that ignore your food preferences",
    "Static wall-of-text PDFs that sit unopened in your downloads folder",
    "Weeks of grinding before you feel a noticeable shift in clarity or mood",
  ];

  const perfectDayReset = [
    "Just 24 focused hours — 100% achievable on any weekend or reset day",
    "Adaptive 1-Tap Delay Rescheduler (+5m to +30m) recalculates your day automatically",
    "5 customizable nutrition modes (Omnivore, Vegetarian, Keto, Paleo, Vegan) + grocery lists",
    "Interactive Web Companion on any phone or laptop + Printable PDF & 7-Day Tracker",
    "Tangible mental clarity, calmer nervous system, and restored momentum in 1 single day",
  ];

  return (
    <section className="py-20 bg-gray-50" id="why-24-hours">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-14">
          <Badge className="bg-orange-100 text-orange-800 border-orange-200 mb-4 px-4 py-1 text-sm font-semibold">
            Why 24 Hours Works Better
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">
            Why 30-Day Challenges Fail — And Why 24 Hours Changes Everything
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            When you're burned out, the last thing you need is another exhausting 30-day homework assignment. You need one structured, victorious day that resets your biology and proves you're back in control.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 items-stretch">
          {/* Left Column: Typical 30-Day Challenges / Generic PDFs */}
          <Card className="border border-red-100 bg-white shadow-sm">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                    The Old Way
                  </span>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">
                    Typical 30-Day Challenges &amp; Generic PDFs
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                  <X className="h-6 w-6 text-red-500" />
                </div>
              </div>

              <ul className="space-y-4">
                {genericChallenges.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-600">
                    <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <X className="h-4 w-4 text-red-500" />
                    </div>
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Right Column: The Perfect Day Reset ($19) */}
          <Card className="border-2 border-primary bg-gradient-to-br from-white via-emerald-50/30 to-emerald-50/60 shadow-xl relative overflow-hidden">
            <div className="bg-primary text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 text-center">
              Science-Backed 1-Day Interactive Protocol
            </div>
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-emerald-100">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    The Smarter Reset
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    The Perfect Day Reset ($19)
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
              </div>

              <ul className="space-y-4">
                {perfectDayReset.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-800 font-medium">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Highlight Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-start gap-3">
            <Clock className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">1-Tap Delay Engine</h4>
              <p className="text-xs text-gray-600 mt-1">Running late? Shift your schedule by 5–30 mins in one tap.</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-start gap-3">
            <Utensils className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">5 Nutrition Tracks</h4>
              <p className="text-xs text-gray-600 mt-1">Omnivore, Vegetarian, Keto, Paleo &amp; Vegan recipes included.</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-start gap-3">
            <Smartphone className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Web App + Printable PDF</h4>
              <p className="text-xs text-gray-600 mt-1">Use the live interactive companion or print for 100% offline use.</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-start gap-3">
            <SlidersHorizontal className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Repeat Unlimited Times</h4>
              <p className="text-xs text-gray-600 mt-1">One-time $19 payment for lifetime access whenever you need a reset.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/checkout">
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold px-8 py-6 rounded-full text-lg shadow-lg w-full sm:w-auto"
            >
              Start My 24-Hour Reset — $19
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/what-you-get">
            <Button
              variant="outline"
              size="lg"
              className="border-gray-300 text-gray-800 hover:bg-white font-medium px-8 py-6 rounded-full text-lg w-full sm:w-auto"
            >
              See Full Program Breakdown
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
