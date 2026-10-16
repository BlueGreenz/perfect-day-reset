import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Mail, CheckCircle2, ShieldCheck, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function RefundPolicy() {
  return (
    <div className="bg-white min-h-screen">
      <SEOHead
        title="Refund Policy – 14-Day 100% Satisfaction Guarantee | Perfect Day Reset"
        description="Read the Perfect Day Reset 14-day money-back satisfaction guarantee. Try the 24-Hour Reset risk-free and contact perfectdayreset@gmail.com within 14 days if you aren't noticeably more energized and focused."
        canonical="https://perfectdayreset.com/refund-policy"
      />
      <NavBar />

      <div className="pt-28 pb-20">
        <div className="container max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-md">
              <ShieldCheck className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">
              14-Day Money-Back Satisfaction Guarantee
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We stand behind the Perfect Day Reset 100%. Because this is a 24-hour protocol—not a grueling 30-day boot camp—you can experience the results immediately and risk-free.
            </p>
          </div>

          <div className="space-y-8">
            {/* Simple, Friendly 14-Day Promise */}
            <div className="bg-emerald-50/70 rounded-2xl p-6 sm:p-8 border border-emerald-200 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2.5">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                Our Straightforward 14-Day Promise
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you complete the 24-Hour Reset (or try the protocol within <strong>14 days of purchase</strong>) and do not feel noticeably more energized, focused, and clear-headed, simply email us within 14 days and we will issue a full, friendly 100% refund.
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Zero paperwork hoops:</strong> No 7-consecutive-day tracker forms or complicated hurdles required.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Covers both the $19 Core Reset &amp; +$12 Momentum Kit:</strong> Your entire checkout order is protected for a full 14 days from purchase.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Fast processing:</strong> Refunds are processed back to your original Stripe payment method within 3–5 business days.
                  </span>
                </li>
              </ul>
            </div>

            {/* How to Request a Refund */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2.5">
                <Mail className="h-6 w-6 text-blue-600 flex-shrink-0" />
                How to Request a Refund
              </h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Email our support team at{" "}
                <a
                  href="mailto:perfectdayreset@gmail.com"
                  className="text-primary font-semibold hover:underline"
                >
                  perfectdayreset@gmail.com
                </a>{" "}
                within 14 days of your purchase with:
              </p>
              <ol className="space-y-2.5 list-decimal pl-5 text-gray-700 mb-4">
                <li>
                  The <strong>email address</strong> you used at checkout (or your username).
                </li>
                <li>
                  A quick note letting us know what didn't work for you so we can keep improving the protocol.
                </li>
              </ol>
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                <Clock className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <span>
                  Our team replies within 24 hours and processes refunds promptly with no hassle.
                </span>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center pt-4">
              <Link href="/checkout">
                <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-full px-8 py-6 text-lg font-semibold shadow-lg">
                  Start My 24-Hour Reset Risk-Free — $19
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}