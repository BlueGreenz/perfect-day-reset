import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, CreditCard, Shield, Loader2, Sparkles, Zap } from "lucide-react";
import { loadQuizProfile } from "@/lib/quiz-profile";

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

if (!stripePublicKey) {
  console.error("Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY");
}

const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;

interface CheckoutFormProps {
  clientSecret: string;
  customerEmail: string;
  totalAmount: number;
}

function CheckoutForm({ clientSecret, customerEmail, totalAmount }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
        receipt_email: customerEmail,
      },
    });

    setIsLoading(false);

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement
        options={{
          layout: "tabs",
        }}
      />

      <Button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-gradient-to-r from-primary to-green-500 hover:from-primary/90 hover:to-green-600 text-white py-6 text-lg font-semibold"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            Complete Purchase — ${totalAmount}.00
            <ArrowRight className="ml-2 h-5 w-5" />
          </>
        )}
      </Button>

      <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
        <Shield className="h-4 w-4" />
        <span>Secured by Stripe • 30-Day Money-Back Guarantee</span>
      </div>
    </form>
  );
}

interface OrderBumpCardProps {
  includeOrderBump: boolean;
  onToggle: (nextValue: boolean) => void;
  disabled?: boolean;
}

export function OrderBumpCard({ includeOrderBump, onToggle, disabled }: OrderBumpCardProps) {
  return (
    <div
      onClick={() => !disabled && onToggle(!includeOrderBump)}
      className={`cursor-pointer rounded-xl border-2 p-4 sm:p-5 transition-all select-none ${
        includeOrderBump
          ? "border-amber-500 bg-gradient-to-br from-amber-50/95 via-orange-50/80 to-yellow-50/90 shadow-md ring-2 ring-amber-200"
          : "border-dashed border-amber-400 bg-amber-50/40 hover:bg-amber-50/70"
      } ${disabled ? "opacity-60 pointer-events-none" : ""}`}
    >
      <div className="flex items-start gap-3">
        <div className="pt-0.5" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            id="order-bump-checkbox"
            checked={includeOrderBump}
            disabled={disabled}
            onCheckedChange={(checked) => onToggle(Boolean(checked))}
            className="h-5 w-5 border-2 border-amber-600 data-[state=checked]:bg-amber-600 data-[state=checked]:text-white"
          />
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
              <Zap className="h-3 w-3" /> 1-Click Upgrade • Save 60%
            </span>
            <span className="text-xs font-semibold text-gray-500 line-through">$29</span>
            <span className="text-sm font-extrabold text-amber-800">+$12</span>
          </div>

          <label
            htmlFor="order-bump-checkbox"
            className="font-bold text-gray-900 text-sm sm:text-base cursor-pointer block mb-2"
          >
            Add the 7-Day Momentum &amp; Emergency 2-Hour Workday Reset Kit (+$12 — Save 60%)
          </label>

          <ul className="space-y-1.5 text-xs sm:text-sm text-gray-700">
            <li className="flex items-start gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>The Emergency 2-Hour Mid-Week Reset Protocol:</strong> For chaotic Tuesday/Wednesday workdays when you can't do a full 24 hours.
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Interactive 7-Day Post-Reset Habit &amp; Energy Tracker:</strong> Keep your Hour-24 clarity going all week.
              </span>
            </li>
            <li className="flex items-start gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>High-Stress Executive Travel &amp; Dining-Out Cheat Sheet:</strong> How to stay in reset mode at restaurants, airports, and back-to-back meetings.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

interface StripeCheckoutProps {
  includeOrderBump?: boolean;
  onToggleOrderBump?: (nextValue: boolean) => void;
}

export default function StripeCheckout({
  includeOrderBump: controlledOrderBump,
  onToggleOrderBump,
}: StripeCheckoutProps = {}) {
  const [internalOrderBump, setInternalOrderBump] = useState(false);
  const includeOrderBump =
    controlledOrderBump !== undefined ? controlledOrderBump : internalOrderBump;

  const [clientSecret, setClientSecret] = useState("");
  const [email, setEmail] = useState(() => loadQuizProfile()?.email || "");
  const [showPayment, setShowPayment] = useState(false);
  const [isInitializingIntent, setIsInitializingIntent] = useState(false);
  const { toast } = useToast();

  const totalAmount = includeOrderBump ? 31 : 19;

  useEffect(() => {
    const savedEmail = loadQuizProfile()?.email;
    if (savedEmail && !email) {
      setEmail(savedEmail);
    }
  }, []);

  const requestPaymentIntent = async (targetEmail: string, withBump: boolean) => {
    setIsInitializingIntent(true);
    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: targetEmail,
          receipt_email: targetEmail,
          includeOrderBump: withBump,
        }),
      });

      const data = await response.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setShowPayment(true);
      } else {
        throw new Error(data.message || "Missing clientSecret");
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsInitializingIntent(false);
    }
  };

  const handleToggleOrderBump = (nextValue: boolean) => {
    if (onToggleOrderBump) {
      onToggleOrderBump(nextValue);
    } else {
      setInternalOrderBump(nextValue);
    }
    // If PaymentIntent is already active on Step 2, re-create it so Stripe charges the exact updated total ($19 vs $31)
    if (showPayment && email && email.includes("@")) {
      requestPaymentIntent(email, nextValue);
    }
  };

  // Also sync if parent toggles includeOrderBump while on step 2
  useEffect(() => {
    if (showPayment && email && email.includes("@")) {
      requestPaymentIntent(email, includeOrderBump);
    }
  }, [includeOrderBump]);

  // Handle missing Stripe configuration
  if (!stripePublicKey) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Payment Configuration Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600">
              Payment processing is temporarily unavailable. Please contact support.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const createPaymentIntent = async () => {
    if (!email || !email.includes("@")) {
      toast({
        title: "Valid email required",
        description: "Please enter a valid email address to continue.",
        variant: "destructive",
      });
      return;
    }

    await requestPaymentIntent(email, includeOrderBump);
  };

  if (!showPayment) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-lg border-gray-200">
        <CardHeader className="text-center pb-3">
          <CardTitle className="flex items-center justify-center gap-2 text-xl">
            <CreditCard className="h-5 w-5 text-primary" />
            Perfect Day Reset — ${totalAmount}.00
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
            />
            <p className="text-xs text-gray-600 mt-1">
              We'll send your instant portal login credentials to this email
            </p>
          </div>

          <OrderBumpCard
            includeOrderBump={includeOrderBump}
            onToggle={handleToggleOrderBump}
            disabled={isInitializingIntent}
          />

          <Button
            onClick={createPaymentIntent}
            disabled={isInitializingIntent}
            className="w-full bg-gradient-to-r from-primary to-green-500 hover:from-primary/90 hover:to-green-600 text-white py-6 text-lg font-semibold"
          >
            {isInitializingIntent ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Preparing Checkout...
              </>
            ) : (
              <>
                Continue to Payment — ${totalAmount}.00
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!clientSecret || isInitializingIntent) {
    return (
      <Card className="w-full max-w-md mx-auto p-8 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-gray-700 font-medium">Updating secure payment total (${totalAmount}.00)...</p>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-gray-200">
      <CardHeader className="text-center pb-3">
        <CardTitle>Complete Your Purchase</CardTitle>
        <p className="text-sm text-gray-600">
          {includeOrderBump
            ? "Perfect Day Reset ($19) + 7-Day Momentum & 2-Hour Workday Kit ($12) — $31.00"
            : "Paying for: Perfect Day Reset — $19.00"}
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <OrderBumpCard
          includeOrderBump={includeOrderBump}
          onToggle={handleToggleOrderBump}
          disabled={isInitializingIntent}
        />

        <Elements
          key={clientSecret}
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: "stripe",
              variables: {
                colorPrimary: "#4A8B2C",
                colorBackground: "#ffffff",
                colorText: "#1f2937",
                colorDanger: "#ef4444",
                fontFamily: "system-ui, -apple-system, sans-serif",
                spacingUnit: "4px",
                borderRadius: "8px",
              },
              rules: {
                ".Tab": {
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "none",
                  padding: "12px 16px",
                  marginBottom: "8px",
                },
                ".Tab:hover": {
                  borderColor: "#4A8B2C",
                  backgroundColor: "#f9fafb",
                },
                ".Tab--selected": {
                  borderColor: "#4A8B2C",
                  backgroundColor: "#f0f9ff",
                },
                ".TabIcon": {
                  height: "24px",
                },
                ".Input": {
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  padding: "12px",
                },
                ".Label": {
                  fontWeight: "500",
                  marginBottom: "6px",
                },
              },
            },
          }}
        >
          <CheckoutForm
            clientSecret={clientSecret}
            customerEmail={email}
            totalAmount={totalAmount}
          />
        </Elements>
      </CardContent>
    </Card>
  );
}