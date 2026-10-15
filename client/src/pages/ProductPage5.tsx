import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import PerfectDayResetPDF from "@/components/PerfectDayResetPDF";
import CertificateOfCompletion from "@/components/CertificateOfCompletion";
import {
  ArrowRight,
  FileDown,
  Calendar,
  Sparkles,
  CheckCircle,
  Download,
  BookOpen,
  Phone,
  Music,
  Share2,
  UserPlus,
  Loader2,
} from "lucide-react";
import { Link } from "wouter";
import { Textarea } from "@/components/ui/textarea";
import sunriseBackground from "@assets/16x9_A_vibrant_golden_sunrise_gradual.webp";
import {
  useCurrentReset,
  useResetEntries,
  useSaveResetEntry,
  useStartNextMorning,
  useCompleteItem,
} from "@/lib/reset-api";
import { useToast } from "@/hooks/use-toast";

interface ReflectionFields {
  surprised: string;
  phoneDetox: string;
  mostAlive: string;
  keepHabit: string;
  sharePerson: string;
}

export default function ProductPage5() {
  const { toast } = useToast();
  const { data: currentReset } = useCurrentReset();
  const { data: entriesData, isLoading: isLoadingEntries } = useResetEntries();
  const saveResetEntry = useSaveResetEntry();
  const startNextMorning = useStartNextMorning();
  const completeItem = useCompleteItem();

  const [reflections, setReflections] = useState<ReflectionFields>({
    surprised: "",
    phoneDetox: "",
    mostAlive: "",
    keepHabit: "",
    sharePerson: "",
  });
  const [hasLoadedSavedReflections, setHasLoadedSavedReflections] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  useEffect(() => {
    if (!entriesData?.entries || hasLoadedSavedReflections) return;
    const eveningEntry =
      entriesData.entries.find((e) => e.kind === "evening_reflection") ||
      entriesData.entries.find((e) => e.kind === "next_morning_reflection");

    if (eveningEntry?.content) {
      try {
        const parsed = JSON.parse(eveningEntry.content);
        if (parsed && typeof parsed === "object") {
          setReflections({
            surprised: parsed.surprised || "",
            phoneDetox: parsed.phoneDetox || "",
            mostAlive: parsed.mostAlive || "",
            keepHabit: parsed.keepHabit || "",
            sharePerson: parsed.sharePerson || "",
          });
        } else {
          setReflections((prev) => ({ ...prev, surprised: eveningEntry.content }));
        }
      } catch {
        setReflections((prev) => ({ ...prev, surprised: eveningEntry.content }));
      }
      setLastSavedAt(
        new Date(eveningEntry.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      setHasLoadedSavedReflections(true);
    }
  }, [entriesData, hasLoadedSavedReflections]);

  const handleChange = (field: keyof ReflectionFields, value: string) => {
    setReflections((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveReflections = async () => {
    const hasAnyContent = Object.values(reflections).some((v) => v.trim().length > 0);
    if (!hasAnyContent) {
      toast({
        title: "Write a reflection first",
        description: "Please fill in at least one reflection prompt before saving.",
        variant: "destructive",
      });
      return;
    }

    const payload = JSON.stringify(reflections);

    try {
      await saveResetEntry.mutateAsync({
        kind: "evening_reflection",
        content: payload,
      });

      // Also complete the Reset Run lifecycle if currently in sleep or next_morning
      if (currentReset?.resetRun) {
        let latestReset = currentReset;
        if (latestReset.resetRun.status === "sleep") {
          try {
            latestReset = await startNextMorning.mutateAsync();
          } catch {
            // Ignore if already transitioned
          }
        }
        if (latestReset.resetRun.status === "next_morning") {
          try {
            await saveResetEntry.mutateAsync({
              kind: "next_morning_reflection",
              content: payload,
            });
            const checkinItem = latestReset.items.find(
              (i) => i.activityKey === "next_morning_checkin" && i.status === "active"
            );
            if (checkinItem) {
              await completeItem.mutateAsync(checkinItem.id);
            }
          } catch {
            // Non-fatal if already completed
          }
        }
      }

      const nowStr = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setLastSavedAt(nowStr);
      toast({
        title: "Reflections Saved!",
        description: "Your closing reflections have been saved to your Perfect Day Reset journal.",
      });
    } catch (err: any) {
      toast({
        title: "Could not save reflections",
        description:
          err?.message || "Make sure you have started a Perfect Day Reset session first.",
        variant: "destructive",
      });
    }
  };

  const isSaving =
    saveResetEntry.isPending || startNextMorning.isPending || completeItem.isPending;

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section with Sunrise Background */}
      <section 
        className="text-white py-24 md:py-32 relative"
        style={{
          backgroundImage: `url(${sunriseBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Content with relative positioning */}
        <div className="relative z-10">
          <div className="container text-center">
            <h1 className="mb-6 text-4xl md:text-5xl font-bold">Final Reflection + Downloads</h1>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
              You have now lived the day most people only dream about. And you'll do it again — better.
              This is how change begins.
            </p>
          </div>
        </div>
      </section>

      {/* Reflection Journal Section */}
      <section className="bg-primary/5">
        <div className="container">
          <div className="section-heading">
            <h2>Closing the Loop: Reflection Journal</h2>
            <p className="text-center text-gray-700 max-w-2xl mx-auto">
              Your mind changed today. Let's make it permanent.
            </p>
            {lastSavedAt && (
              <p className="text-center text-sm text-emerald-700 font-medium mt-2">
                ✓ Saved to your Reset journal ({lastSavedAt})
              </p>
            )}
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>What surprised you most about today?</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="I was surprised by..."
                  className="min-h-[100px]"
                  disabled={isLoadingEntries}
                  value={reflections.surprised || ""}
                  onChange={(e) => handleChange('surprised', e.target.value)}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>How did you feel without your phone?</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Without my phone, I felt..."
                  className="min-h-[100px]"
                  disabled={isLoadingEntries}
                  value={reflections.phoneDetox || ""}
                  onChange={(e) => handleChange('phoneDetox', e.target.value)}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>What part of the day made you feel most alive?</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="I felt most alive when..."
                  className="min-h-[100px]"
                  disabled={isLoadingEntries}
                  value={reflections.mostAlive || ""}
                  onChange={(e) => handleChange('mostAlive', e.target.value)}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>What's one habit from today you want to keep daily?</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="I want to keep..."
                  className="min-h-[100px]"
                  disabled={isLoadingEntries}
                  value={reflections.keepHabit || ""}
                  onChange={(e) => handleChange('keepHabit', e.target.value)}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Who could benefit from doing this with you?</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="I think [name] would benefit because..."
                  className="min-h-[100px]"
                  disabled={isLoadingEntries}
                  value={reflections.sharePerson || ""}
                  onChange={(e) => handleChange('sharePerson', e.target.value)}
                />
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between">
                <a 
                  href="/assets/reflection-journal.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="flex items-center">
                    <Download className="h-4 w-4 mr-2" /> Download Reflection Journal (PDF)
                  </Button>
                </a>
                <Button onClick={handleSaveReflections} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Save My Reflections <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Quote Section */}
      <section className="py-24 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="container text-center max-w-3xl">
          <Sparkles className="h-16 w-16 mx-auto mb-10 text-white/80" />
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-10 italic leading-relaxed">
            "You have now lived the day most people only dream about. And you'll do it again — better."
          </h2>
          
          <p className="text-xl md:text-2xl mb-6">
            This is how change begins.
          </p>
        </div>
      </section>
      
      {/* Certificate Section */}
      <section>
        <div className="container">
          <div className="section-heading">
            <h2>Celebrate Your Achievement</h2>
            <p className="text-center text-gray-700 max-w-2xl mx-auto">
              You've completed something extraordinary. Get your professional certificate to commemorate this milestone and share your transformation with the world.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <CertificateOfCompletion />
          </div>
        </div>
      </section>
      
      {/* Success Stories Section - Without CTA */}
      <section className="bg-white py-16 md:py-24">
        <div className="container">
          <div className="flex justify-between items-end mb-12">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-3xl md:text-4xl font-bold text-primary">Success Stories</h2>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="mb-4">
                <div className="h-8 w-8 text-primary/20">💬</div>
              </div>
              <div className="mb-6">
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-sm font-medium text-primary">Breakthrough creative blocks</p>
              </div>
              <p className="text-gray-700 mb-6 italic">"Creative blocks were killing my career. The Perfect Day Reset unlocked something in me - the combination of movement, mindfulness, and digital detox sparked creativity I didn't know I had."</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">L</div>
                <div className="ml-4">
                  <h4 className="font-medium">Lisa H.</h4>
                  <p className="text-gray-600 text-sm">Creative Director</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="mb-4">
                <div className="h-8 w-8 text-primary/20">💬</div>
              </div>
              <div className="mb-6">
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-sm font-medium text-primary">Proof it's never too late to change</p>
              </div>
              <p className="text-gray-700 mb-6 italic">"At 62, I thought it was too late to change my habits. The Perfect Day Reset proved me wrong. The gentle approach gave me a new lease on life. I feel 10 years younger."</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">T</div>
                <div className="ml-4">
                  <h4 className="font-medium">Tom W.</h4>
                  <p className="text-gray-600 text-sm">Retired Teacher</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="mb-4">
                <div className="h-8 w-8 text-primary/20">💬</div>
              </div>
              <div className="mb-6">
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-sm font-medium text-primary">Better focus and energy for studies</p>
              </div>
              <p className="text-gray-700 mb-6 italic">"Between studies, part-time work, and social life, I was burning out fast. The Perfect Day Reset taught me how to actually rest and recharge. My focus improved dramatically."</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">A</div>
                <div className="ml-4">
                  <h4 className="font-medium">Alex M.</h4>
                  <p className="text-gray-600 text-sm">University Student</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Momentum Section */}
      <section className="bg-primary/5">
        <div className="container max-w-4xl">
          {/* Hour-24 Ascension Card */}
          <Card className="mb-12 border-2 border-emerald-500 bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white shadow-xl overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles className="h-3.5 w-3.5" />
                Hour 24 Unlocked • Next Step
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                What Happens Tomorrow? Your Next 7 Days of Momentum
              </h2>
              <p className="text-emerald-100/90 text-base md:text-lg mb-6 max-w-2xl leading-relaxed">
                Don't let your Hour-24 clarity fade when work starts tomorrow. Launch your interactive{" "}
                <strong className="text-white">7-Day Momentum &amp; Emergency 2-Hour Workday Reset Toolkit</strong>{" "}
                to lock in your habits, Rescue chaotic Tuesday/Wednesday workdays in 120 minutes, and use the Executive Dining-Out Cheat Sheet.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 text-sm">
                <div className="bg-white/10 border border-white/10 rounded-lg p-3">
                  <p className="font-semibold text-emerald-300 mb-0.5">⚡ 2-Hour Workday Triage</p>
                  <p className="text-xs text-slate-200">8-step interactive checklist for chaotic workdays when you don't have 24 hours.</p>
                </div>
                <div className="bg-white/10 border border-white/10 rounded-lg p-3">
                  <p className="font-semibold text-emerald-300 mb-0.5">🍽️ Executive Cheat Sheet</p>
                  <p className="text-xs text-slate-200">Restaurant, airport &amp; back-to-back meeting protocols for all 5 diet tracks.</p>
                </div>
                <div className="bg-white/10 border border-white/10 rounded-lg p-3">
                  <p className="font-semibold text-emerald-300 mb-0.5">📅 7-Day Habit Tracker</p>
                  <p className="text-xs text-slate-200">Interactive + printable daily energy &amp; habit scorecard for the week ahead.</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link href="/daily-reset-tracker">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-lg"
                    data-testid="button-launch-momentum-toolkit"
                  >
                    Launch 7-Day Momentum &amp; 2-Hour Workday Toolkit
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    const shareText = `I just completed the 24-Hour Perfect Day Reset and reclaimed my energy and focus! Check it out: ${window.location.origin}/quiz`;
                    if (navigator.share) {
                      navigator.share({
                        title: "Perfect Day Reset - 24-Hour Protocol",
                        text: shareText,
                        url: `${window.location.origin}/quiz`,
                      });
                    } else {
                      navigator.clipboard.writeText(shareText);
                      toast({
                        title: "Invite link copied!",
                        description: "Share the 60-Second Reset Diagnostic Quiz with a friend.",
                      });
                    }
                  }}
                  className="border-emerald-400/50 bg-white/5 text-white hover:bg-white/15"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Reset with a Friend
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="section-heading">
            <h2>How to Keep the Momentum</h2>
            <p className="text-center text-gray-700 max-w-2xl mx-auto">
              Momentum is magic. Here's how to keep it.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Repeat the Reset Weekly</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Choose one day per week to implement your Perfect Day Reset routine. Block it in your calendar as a non-negotiable appointment with yourself.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Choose 1 Habit Daily</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Select the one practice from the Perfect Day Reset that gave you the most energy, and incorporate it into your daily routine.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Book a "No Phone Half-Day"</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Set aside 4 hours each week when your phone stays in another room. This mini digital detox will multiply the benefits of your reset.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <UserPlus className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Invite a Friend</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Share this reset with someone you care about. Accountability and shared experience will strengthen your commitment to the practice.
                </p>
                <Button 
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'Perfect Day Reset - Transform Your Life in 24 Hours',
                        text: 'I just completed the Perfect Day Reset and it was transformative! This 24-hour protocol combines mindful movement, digital detox, and energy optimization. You should try it too!',
                        url: window.location.origin
                      });
                    } else {
                      // Fallback for browsers without native sharing
                      navigator.clipboard.writeText(`I just completed the Perfect Day Reset and it was transformative! This 24-hour protocol combines mindful movement, digital detox, and energy optimization. Check it out: ${window.location.origin}`);
                      toast({
                        title: "Link copied to clipboard!",
                        description: "Share it with a friend to invite them to the Reset.",
                      });
                    }
                  }}
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Perfect Day Reset
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-primary/10 p-6 rounded-xl text-center mb-12">
            <p className="text-xl font-medium">Stack 3 Perfect Days per month = transformation</p>
          </div>
          

          
          {/* PDF Download Section */}
          <Card className="bg-gradient-to-br from-emerald-50 to-blue-50 border-emerald-200">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl md:text-3xl font-bold text-emerald-800">
                🎯 Your Complete Perfect Day Reset Guide
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Download the full timeline with all activities, supplements, and motivational content - designed exactly like our webpage
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <PerfectDayResetPDF />
              <div className="mt-6 p-4 bg-white/60 rounded-lg">
                <p className="text-sm text-gray-600">
                  ✨ Complete timeline from 7:00 AM to 10:00 PM<br/>
                  💊 All supplement schedules and details<br/>
                  🌟 Motivational quotes throughout<br/>
                  📱 Print-friendly format for offline use
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Final CTA Section */}
          <div className="text-center bg-white p-8 md:p-12 rounded-xl shadow-sm">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Today, you proved it to yourself.</h2>
            <p className="text-xl md:text-2xl mb-10 text-gray-700 max-w-2xl mx-auto">
              The world didn't change. You did. And now — you carry that energy forward.
            </p>
            
            <Link href="/">
              <Button 
                size="lg" 
                className="px-10 py-7 text-lg md:text-xl rounded-full font-medium bg-gradient-to-r from-primary to-primary-dark shadow-lg hover:shadow-xl transition-all duration-300"
              >
                I'm Ready to Live This Way – Every Damn Week <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </Link>
            
            <div className="mt-10 space-y-8">
              {/* Lead Capture Form */}
              <div className="bg-primary/5 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4 text-center">Join Our Transformation Community</h3>
                <p className="text-gray-600 mb-6 text-center">Get exclusive tips, bonus resets, and early access to new protocols</p>
                
                <form 
                  className="flex flex-col sm:flex-row gap-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const emailInput = e.currentTarget.querySelector('input[type="email"]') as HTMLInputElement;
                    if (emailInput && emailInput.value) {
                      fetch('/api/subscribe', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email: emailInput.value }),
                      })
                      .then(response => {
                        if (response.ok) {
                          toast({
                            title: "Subscribed!",
                            description: "Thank you for joining our transformation community.",
                          });
                          emailInput.value = '';
                        } else if (response.status === 409) {
                          toast({
                            title: "Already subscribed",
                            description: "This email is already subscribed to our community updates.",
                          });
                        } else {
                          toast({
                            title: "Subscription error",
                            description: "There was an error subscribing. Please try again.",
                            variant: "destructive",
                          });
                        }
                      })
                      .catch(error => {
                        console.error('Error:', error);
                        toast({
                          title: "Subscription error",
                          description: "There was an error subscribing. Please try again.",
                          variant: "destructive",
                        });
                      });
                    }
                  }}
                >
                  <input 
                    type="email" 
                    placeholder="Enter your email address" 
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  <Button type="submit" className="bg-primary hover:bg-primary-dark text-white">
                    Join the Community <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  We respect your privacy. Unsubscribe anytime.
                </p>
              </div>
              
              <Link href="/product/reset/welcome">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="flex items-center border-2 hover:bg-gray-50 transition-colors w-full justify-center"
                >
                  <BookOpen className="h-5 w-5 mr-2" /> Start a New Perfect Day Reset
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}