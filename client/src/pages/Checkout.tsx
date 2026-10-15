import { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import StripeCheckout from "@/components/StripeCheckout";
import SEOHead from "@/components/SEOHead";
import { CheckCircle, Clock, Shield, Sparkles, Zap } from "lucide-react";
import { loadQuizProfile, type StoredQuizProfile } from "@/lib/quiz-profile";

export default function Checkout() {
  const [quizProfile, setQuizProfile] = useState<StoredQuizProfile | null>(null);
  const [includeOrderBump, setIncludeOrderBump] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setQuizProfile(loadQuizProfile());
  }, []);

  const totalAmount = includeOrderBump ? 31 : 19;
  const climateContribution = ((totalAmount * 0.005 * 100) / 100).toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <SEOHead
        title="Checkout - Perfect Day Reset"
        description="Complete your Perfect Day Reset purchase securely with Stripe. Transform your energy, focus, and mood in just 24 hours."
        canonical="https://perfectdayreset.com/checkout"
        noindex={true}
      />
      <NavBar />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Complete Your Perfect Day Reset Purchase
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                You're one step away from transforming your energy, focus, and mood in just 24 hours.
              </p>
            </div>

            {/* Personalized Quiz Profile Confirmation Banner */}
            {quizProfile && (
              <div className="mb-8 bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-amber-400/40">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
                      <Sparkles className="h-3.5 w-3.5" />
                      Personalized Diagnostic Profile Active
                    </div>
                    <p className="text-base sm:text-lg font-semibold text-white">
                      Configured for your{" "}
                      <span className="text-amber-300">{quizProfile.archetypeName}</span> Profile •{" "}
                      <span className="text-emerald-300">{quizProfile.wakeTime} Wake Schedule</span> •{" "}
                      <span className="text-orange-300">{quizProfile.dietLabel}</span>
                    </p>
                    <p className="text-xs sm:text-sm text-gray-300 mt-1">
                      Your Interactive Web Companion Portal will automatically pre-load your{" "}
                      {quizProfile.wakeTime} wake time and {quizProfile.dietLabel} meal plan immediately after checkout.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
              {/* Product Summary */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                  <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-start justify-between text-sm pb-3 border-b border-gray-100">
                      <div className="pr-3">
                        <div className="font-semibold text-gray-900">
                          The Perfect Day Reset (24-Hour Protocol)
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Live Web Companion Portal + Printable PDF Blueprint
                        </p>
                      </div>
                      <span className="font-semibold text-gray-900">$19.00</span>
                    </div>

                    {includeOrderBump && (
                      <div className="flex items-start justify-between text-sm pb-3 border-b border-amber-100 bg-amber-50/60 p-3 rounded-lg">
                        <div className="pr-3">
                          <div className="font-semibold text-amber-900 flex items-center gap-1.5">
                            <Zap className="h-3.5 w-3.5 text-amber-600" />
                            7-Day Momentum &amp; Emergency 2-Hour Workday Reset Kit
                          </div>
                          <p className="text-xs text-amber-800/80 mt-0.5">
                            2-Hour Triage Checklist + 7-Day Tracker + Executive Dining Cheat Sheet
                          </p>
                        </div>
                        <span className="font-bold text-amber-900">+$12.00</span>
                      </div>
                    )}

                    <div className="flex items-center text-sm pt-1">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                      <span>
                        {quizProfile
                          ? `Personalized 24-hour protocol (${quizProfile.wakeTime} wake anchor)`
                          : "Complete 24-hour transformation protocol"}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                      <span>
                        {quizProfile
                          ? `5 Nutrition Modes (Pre-set to ${quizProfile.dietLabel})`
                          : "Morning, midday, and evening routines + 5 Nutrition Modes"}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                      <span>Live 1-Tap Delay Rescheduler + Printable PDF Guide</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                      <span>Instant digital access &amp; unlimited lifetime resets</span>
                    </div>
                  </div>

                  {/* Climate & Donation Impact */}
                  <div className="border-t pt-4 mb-4">
                    <h4 className="font-medium text-green-700 mb-3">Your Positive Impact</h4>
                    <div className="space-y-2">
                      <div className="flex items-start text-sm">
                        <div className="bg-green-100 rounded-full p-1 mr-2 mt-0.5">
                          <svg
                            className="h-3 w-3 text-green-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <span className="font-medium text-green-700">Climate Contribution:</span>
                          <p className="text-green-600 text-xs">
                            PerfectDayReset.com contributes 0.5% (${climateContribution}) to remove CO₂ from the atmosphere
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start text-sm">
                        <div className="bg-blue-100 rounded-full p-1 mr-2 mt-0.5">
                          <svg
                            className="h-3 w-3 text-blue-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                        <div>
                          <span className="font-medium text-blue-700">Children's Support:</span>
                          <p className="text-blue-600 text-xs">
                            Every purchase donates $1 to children's programs
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                      <span>Total Due Today</span>
                      <span>${totalAmount}.00</span>
                    </div>
                  </div>
                </div>

                {/* Security & Guarantees */}
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                  <h4 className="font-semibold mb-4">Your Purchase is Protected</h4>

                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Shield className="h-4 w-4 text-blue-600 mr-2" />
                      <span>Secure payment processing by Stripe</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 text-blue-600 mr-2" />
                      <span>30-day money-back satisfaction guarantee</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-blue-600 mr-2" />
                      <span>Instant access after payment</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkout Form */}
              <div>
                <StripeCheckout
                  includeOrderBump={includeOrderBump}
                  onToggleOrderBump={setIncludeOrderBump}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}