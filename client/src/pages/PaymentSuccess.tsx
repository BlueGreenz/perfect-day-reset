import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Eye, EyeOff, Copy, ArrowRight, Sparkles, Heart, Star, Mail, ShieldCheck, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";

interface UserCredentials {
  username: string;
  password: string;
  email?: string | null;
}

export default function PaymentSuccess() {
  const [, setLocation] = useLocation();
  const { user, loginMutation } = useAuth();
  const [credentials, setCredentials] = useState<UserCredentials | null>(null);
  const [autoLoggedIn, setAutoLoggedIn] = useState(false);
  const [isEnteringPortal, setIsEnteringPortal] = useState(false);
  const [pollingTimedOut, setPollingTimedOut] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState<{ username: boolean; password: boolean }>({ username: false, password: false });
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [optInSubmitted, setOptInSubmitted] = useState(false);
  const { toast } = useToast();

  const marketingOptInMutation = useMutation({
    mutationFn: async (data: { email: string; firstName?: string }) => {
      const res = await apiRequest("POST", "/api/marketing-optin", data);
      return res.json();
    },
    onSuccess: () => {
      setOptInSubmitted(true);
      toast({
        title: "Success!",
        description: "You'll receive helpful wellness tips and exclusive updates.",
      });
    },
    onError: () => {
      toast({
        title: "Oops!",
        description: "Something went wrong. You can always subscribe later from our homepage.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentIntentId = urlParams.get("payment_intent");

    if (!paymentIntentId) {
      setPollingTimedOut(true);
      return;
    }

    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 12; // 12 attempts * 2000ms = 24 seconds
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const pollCredentials = async () => {
      if (cancelled) return;
      attempts += 1;

      try {
        const response = await fetch(`/api/payment-success/${paymentIntentId}`, {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          if (!cancelled) {
            setCredentials({
              username: data.username,
              password: data.password || "Check your email for login details",
              email: data.email || null,
            });
            if (data.email && !email) {
              setEmail(data.email);
            }
            if (data.autoLoggedIn || data.user) {
              setAutoLoggedIn(true);
              if (data.user) {
                queryClient.setQueryData(["/api/user"], data.user);
              } else {
                queryClient.invalidateQueries({ queryKey: ["/api/user"] });
              }
            }
          }
          return;
        }
      } catch (error) {
        console.error("Error fetching credentials:", error);
      }

      if (cancelled) return;

      if (attempts < maxAttempts) {
        timeoutId = setTimeout(pollCredentials, 2000);
      } else {
        setPollingTimedOut(true);
        toast({
          title: "Account Processing",
          description: "Your account is still being finalized. Please check your email for your login details.",
        });
      }
    };

    pollCredentials();

    return () => {
      cancelled = true;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [toast]);

  const handleEnterPortal = (targetPath: string = "/product/reset/welcome") => {
    if (user || autoLoggedIn) {
      setLocation(targetPath);
      return;
    }

    if (
      credentials?.username &&
      credentials?.password &&
      !credentials.password.startsWith("Check your email")
    ) {
      setIsEnteringPortal(true);
      loginMutation.mutate(
        {
          username: credentials.username,
          password: credentials.password,
        },
        {
          onSuccess: () => {
            setIsEnteringPortal(false);
            setLocation(targetPath);
          },
          onError: () => {
            setIsEnteringPortal(false);
            setLocation("/login");
          },
        }
      );
      return;
    }

    setLocation("/login");
  };

  const copyToClipboard = async (text: string, type: 'username' | 'password') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(prev => ({ ...prev, [type]: true }));
      toast({
        title: "Copied!",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} copied to clipboard`,
      });
      setTimeout(() => {
        setCopied(prev => ({ ...prev, [type]: false }));
      }, 2000);
    } catch {
      toast({
        title: "Failed to copy",
        description: "Please manually copy the credentials",
        variant: "destructive",
      });
    }
  };

  if (!credentials && !pollingTimedOut) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Processing your payment and signing you into your Reset Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Success Header */}
      <div className="pt-20 pb-10 text-center">
        <div className="container mx-auto px-4">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Welcome to Your New Beginning! 🎉
          </h1>
          
          <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
            Your payment is confirmed and your interactive Perfect Day Reset portal is ready right now!
          </p>

          {/* 1-Click Primary Portal Entry Above the Fold */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Button
              size="lg"
              onClick={() => handleEnterPortal("/product/reset/welcome")}
              disabled={isEnteringPortal}
              data-testid="button-enter-portal-hero"
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-10 py-6 text-lg sm:text-xl rounded-full font-semibold shadow-2xl transform hover:scale-105 transition-all"
            >
              {isEnteringPortal ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Opening Your Portal...
                </>
              ) : (
                <>
                  Enter My Reset Portal Now
                  <ArrowRight className="ml-3 h-6 w-6" />
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleEnterPortal("/dashboard")}
              disabled={isEnteringPortal}
              className="border-gray-300 bg-white/90 hover:bg-white text-gray-800 px-7 py-6 text-base rounded-full font-semibold"
            >
              Open Full Member Dashboard
            </Button>
          </div>

          {/* Social Impact Badge */}
          <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2">
            <Heart className="h-4 w-4 mr-2" />
            Thank you! $1 has been donated to children's programs
          </Badge>
        </div>
      </div>

      {/* Credentials Section */}
      <div className="container mx-auto px-4 mb-12">
        <Card className="max-w-2xl mx-auto bg-white shadow-xl">
          <CardContent className="p-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <ShieldCheck className="h-6 w-6 text-emerald-600" />
              <h2 className="text-2xl font-bold text-center text-gray-800">
                Your Account &amp; Login Credentials
              </h2>
            </div>
            {(user || autoLoggedIn) && (
              <p className="text-sm text-emerald-700 font-medium text-center mb-6">
                ✓ You are already signed in on this device! Save the details below for logging in on other devices.
              </p>
            )}
            
            {credentials ? (
              <>
                <div className="space-y-5">
                  {credentials.email && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Login Email (You can log in with either your Email OR Username)
                      </label>
                      <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg font-mono text-base text-emerald-950">
                        {credentials.email}
                      </div>
                    </div>
                  )}

                  {/* Username */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Username
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 p-3 bg-gray-50 rounded-lg font-mono text-lg">
                        {credentials.username}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(credentials.username, 'username')}
                        className={copied.username ? 'bg-green-50 text-green-600' : ''}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Password
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 p-3 bg-gray-50 rounded-lg font-mono text-lg">
                        {showPassword ? credentials.password : '••••••••••••'}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(credentials.password, 'password')}
                        className={copied.password ? 'bg-green-50 text-green-600' : ''}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    <strong>Saved to your inbox too:</strong> We've also emailed these credentials to you. Whenever you return on a phone or laptop, you can sign in using either your email address or username.
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center space-y-4">
                <div className="p-6 bg-blue-50 rounded-lg border border-blue-200 text-blue-900">
                  <Mail className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <p className="font-semibold text-lg mb-2">
                    Check Your Email for Your Login Details
                  </p>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    Your payment is confirmed and your account is being finalized. We've sent your username and password to your checkout email address. If you don't see it within a couple of minutes, please check your spam or promotions folder.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Motivational Message */}
      <div className="container mx-auto px-4 mb-12">
        <Card className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-800">Your Transformation Begins Today</h2>
              <Sparkles className="h-6 w-6 text-yellow-500" />
            </div>
            
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              You've just taken the most important step towards a healthier, more energized, and focused version of yourself. 
              This isn't just a purchase—it's your commitment to becoming the person you've always wanted to be.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Today You Start</h3>
                <p className="text-sm text-gray-600">Your 24-hour reset journey begins with renewed energy and purpose</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Tomorrow You Transform</h3>
                <p className="text-sm text-gray-600">Experience clarity, focus, and energy like never before</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Forever You Thrive</h3>
                <p className="text-sm text-gray-600">Build lasting habits that will serve you for life</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Marketing Email Opt-in Section */}
      <div className="container mx-auto px-4 max-w-2xl mb-12">
        {!optInSubmitted && (
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 shadow-lg">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <div className="bg-blue-500 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Stay Connected with Perfect Day Reset
                </h3>
                <p className="text-gray-600">
                  Get exclusive wellness tips, new content updates, and special offers delivered to your inbox.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                      First Name (Optional)
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Your first name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="marketing-optin"
                    checked={marketingOptIn}
                    onCheckedChange={(checked) => setMarketingOptIn(checked as boolean)}
                    className="mt-1"
                  />
                  <Label htmlFor="marketing-optin" className="text-sm text-gray-600 leading-relaxed">
                    Yes, I'd like to receive helpful wellness tips, exclusive content, and special offers from Perfect Day Reset. 
                    You can unsubscribe at any time.
                  </Label>
                </div>

                <Button
                  onClick={() => {
                    if (email && marketingOptIn) {
                      marketingOptInMutation.mutate({ email, firstName: firstName || undefined });
                    }
                  }}
                  disabled={!email || !marketingOptIn || marketingOptInMutation.isPending}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {marketingOptInMutation.isPending ? (
                    "Subscribing..."
                  ) : (
                    <>
                      Subscribe to Updates <Heart className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  We respect your privacy. No spam, just valuable wellness content.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {optInSubmitted && (
          <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-green-500 p-3 rounded-full">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                You're All Set!
              </h3>
              <p className="text-gray-600">
                Thank you for subscribing! You'll receive our best wellness tips and exclusive updates.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Bottom CTA Button */}
      <div className="container mx-auto px-4 pb-20 text-center">
        <Button
          size="lg"
          onClick={() => handleEnterPortal("/product/reset/welcome")}
          disabled={isEnteringPortal}
          data-testid="button-enter-portal-footer"
          className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-12 py-6 text-xl rounded-full font-semibold shadow-2xl transform hover:scale-105 transition-all"
        >
          Enter My Reset Portal Now
          <ArrowRight className="ml-3 h-6 w-6" />
        </Button>
        
        <p className="text-gray-600 mt-4 text-sm">
          Ready to transform your life? Your journey to better energy, clarity, and focus starts now!
        </p>
      </div>
    </div>
  );
}