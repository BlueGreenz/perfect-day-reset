import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Star,
  Quote,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from "lucide-react";
import successGroupImage from "@assets/21x9_A_diverse_group_of_confident_pro.webp";
import { Link } from "wouter";

interface TestimonialItem {
  name: string;
  role: string;
  badge: string;
  image: string;
  content: string;
  benefit: string;
  rating: number;
}

const featuredTestimonials: TestimonialItem[] = [
  {
    name: "Marcus V.",
    role: "Corporate Sales Director",
    badge: "Verified Member • Omnivore Track",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120&q=80",
    content:
      "After years of starting my day with double espressos and hitting a wall by 2 PM, the Morning Hydration & Sunlight Anchor changed my energy curve on day one. I closed three back-to-back afternoon client calls with zero brain fog.",
    benefit: "Steady Morning Energy & Zero 2 PM Crash",
    rating: 5,
  },
  {
    name: "Elena R.",
    role: "Startup Founder",
    badge: "Verified Member • Keto Track",
    image:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120&q=80",
    content:
      "I always quit 30-day wellness challenges by Day 4 the moment an investor call ran late. The +15m Delay Rescheduler inside the web portal recalculated my afternoon automatically—no guilt, no starting over.",
    benefit: "Adaptive Schedule That Survives Real Workdays",
    rating: 5,
  },
  {
    name: "Daniel K.",
    role: "Product Manager",
    badge: "Verified Member • Vegetarian Track",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120&q=80",
    content:
      "My biggest issue was feeling exhausted all day and then 'tired but wired' at 10 PM scrolling my phone. The Evening Decompression & 5-Prompt Cognitive Unload gave me my first deep, uninterrupted night of sleep in months.",
    benefit: "Calm Evening Nervous System & Restorative Sleep",
    rating: 5,
  },
];

const additionalTestimonials: TestimonialItem[] = [
  {
    name: "Sarah K.",
    role: "Marketing Director",
    badge: "Verified Member • Paleo Track",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
    content:
      "The Perfect Day Reset completely transformed how I structure my weekends. I run the 24-hour protocol every second Sunday and wake up Monday morning feeling sharper than I did in my twenties.",
    benefit: "More productive, less stressed",
    rating: 5,
  },
  {
    name: "Jennifer L.",
    role: "Healthcare Provider",
    badge: "Verified Member • Omnivore Track",
    image:
      "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
    content:
      "Working in healthcare with demanding shifts made me think no routine could work for me. Focusing on circadian light, hydration, and blood-sugar stability for 24 intentional hours was the reset my body needed.",
    benefit: "Energy management over rigid scheduling",
    rating: 5,
  },
  {
    name: "Emma C.",
    role: "Parent & Consultant",
    badge: "Verified Member • Vegan Track",
    image:
      "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
    content:
      "Having both the interactive phone companion and the printable PDF meant I could put my phone in a drawer and follow the paper blueprint with my family. The 1-click grocery list saved me an hour of planning.",
    benefit: "Screen-free clarity despite a busy home",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const [showMore, setShowMore] = useState(false);

  const displayedTestimonials = showMore
    ? [...featuredTestimonials, ...additionalTestimonials]
    : featuredTestimonials;

  return (
    <section
      id="testimonials"
      className="relative bg-gradient-to-b from-white via-orange-50/30 to-orange-50 pt-12 pb-20 md:pt-16 md:pb-24"
      style={{
        backgroundImage: `url(${successGroupImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay for high text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/85 to-orange-50/95" />

      <div className="container relative z-10 max-w-6xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            Real 24-Hour Reset Outcomes
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Why High Performers Switch From 30-Day Challenges to One Engineered Day
          </h2>
          <p className="text-gray-600 text-lg">
            Specific results from busy professionals who used the 24-Hour Reset to fix morning fatigue, eliminate the 2 PM crash, and sleep deeply again.
          </p>
        </div>

        {/* Scannable 3-Card Featured Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-8">
          {displayedTestimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-6 sm:p-7 rounded-2xl shadow-md border border-gray-100 flex flex-col justify-between hover:shadow-xl transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="text-amber-400 fill-current h-4 w-4"
                      />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    {testimonial.badge}
                  </span>
                </div>

                <div className="mb-3 flex items-start gap-2">
                  <Quote className="h-5 w-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-bold text-gray-900">
                    {testimonial.benefit}
                  </p>
                </div>

                <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-6">
                  "{testimonial.content}"
                </p>
              </div>

              <div className="flex items-center pt-4 border-t border-gray-100">
                <img
                  src={testimonial.image}
                  alt={`${testimonial.name} – ${testimonial.role}`}
                  loading="lazy"
                  decoding="async"
                  className="w-11 h-11 rounded-full object-cover mr-3.5 border border-orange-200"
                />
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs font-semibold text-orange-700">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Optional Toggle for Additional Stories */}
        <div className="text-center mb-14">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowMore((prev) => !prev)}
            className="rounded-full border-gray-300 bg-white hover:bg-gray-50 text-gray-800 font-semibold px-6 py-2.5"
          >
            {showMore ? (
              <>
                Show Fewer Stories
                <ChevronUp className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Read 3 More Member Stories
                <ChevronDown className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {/* High-Trust Conversion & 14-Day Guarantee Banner (Zero Fake Scarcity Timers) */}
        <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-xl border border-emerald-200/80 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            <div className="inline-flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              14-Day 100% Satisfaction Guarantee • Instant Digital Access
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Experience the 24-Hour Reset Completely Risk-Free
            </h3>
            <p className="text-gray-600 text-base leading-relaxed">
              Get instant access to the Interactive Web Companion Portal, 1-Tap Delay Rescheduler, 5 Nutrition Modes, and Printable PDF Kit for a one-time $19 payment. If you don't feel noticeably more energized and clear-headed within 14 days, email us for a full, friendly refund.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
            <Link href="/checkout" className="w-full">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold px-8 py-6 rounded-full shadow-lg text-base sm:text-lg"
              >
                Start My 24-Hour Reset — $19
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/quiz" className="w-full">
              <Button
                variant="outline"
                size="lg"
                className="w-full border-gray-300 text-gray-800 hover:bg-gray-50 font-semibold px-6 py-5 rounded-full text-sm"
              >
                Or Take the Free 60s Diagnostic Quiz
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
