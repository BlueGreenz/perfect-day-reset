import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, CreditCard, Shield, Loader2 } from "lucide-react";

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

if (!stripePublicKey) {
  console.error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}

const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;

interface CheckoutFormProps {
  clientSecret: string;
  customerEmail: string;
}

function CheckoutForm({ clientSecret, customerEmail }: CheckoutFormProps) {
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
          layout: "tabs"
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
            Complete Purchase - $19
            <ArrowRight className="ml-2 h-5 w-5" />
          </>
        )}
      </Button>
      
      <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
        <Shield className="h-4 w-4" />
        <span>Secured by Stripe</span>
      </div>
    </form>
  );
}

export default function StripeCheckout() {
  const [clientSecret, setClientSecret] = useState("");
  const [email, setEmail] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const { toast } = useToast();

  // Handle missing Stripe configuration
  if (!stripePublicKey) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Payment Configuration Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600">Payment processing is temporarily unavailable. Please contact support.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const createPaymentIntent = async () => {
    if (!email || !email.includes('@')) {
      toast({
        title: "Valid email required",
        description: "Please enter a valid email address to continue.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: email,
          receipt_email: email 
        }),
      });

      const data = await response.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setShowPayment(true);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!showPayment) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Perfect Day Reset - $19
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
            <p className="text-sm text-gray-600 mt-1">
              We'll send your login credentials to this email
            </p>
          </div>
          
          <Button 
            onClick={createPaymentIntent}
            className="w-full bg-gradient-to-r from-primary to-green-500 hover:from-primary/90 hover:to-green-600 text-white py-6 text-lg font-semibold"
          >
            Continue to Payment
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!clientSecret) {
    return (
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>Preparing payment...</p>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Complete Your Purchase</CardTitle>
        <p className="text-sm text-gray-600">
          Paying for: Perfect Day Reset - $19
        </p>
      </CardHeader>
      <CardContent>
        <Elements 
          stripe={stripePromise} 
          options={{ 
            clientSecret,
            appearance: {
              theme: 'stripe',
              variables: {
                colorPrimary: '#4A8B2C',
                colorBackground: '#ffffff',
                colorText: '#1f2937',
                colorDanger: '#ef4444',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                spacingUnit: '4px',
                borderRadius: '8px'
              },
              rules: {
                '.Tab': {
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: 'none',
                  padding: '12px 16px',
                  marginBottom: '8px'
                },
                '.Tab:hover': {
                  borderColor: '#4A8B2C',
                  backgroundColor: '#f9fafb'
                },
                '.Tab--selected': {
                  borderColor: '#4A8B2C',
                  backgroundColor: '#f0f9ff'
                },
                '.TabIcon': {
                  height: '24px'
                },
                '.Input': {
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  padding: '12px'
                },
                '.Label': {
                  fontWeight: '500',
                  marginBottom: '6px'
                }
              }
            }
          }}
        >
          <CheckoutForm clientSecret={clientSecret} customerEmail={email} />
        </Elements>
      </CardContent>
    </Card>
  );
}