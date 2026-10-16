import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { 
  User, 
  LogOut, 
  Calendar, 
  Clock, 
  Target, 
  BookOpen, 
  Award, 
  Sparkles,
  ArrowRight,
  Heart,
  Star,
  CheckCircle,
  Download
} from "lucide-react";
import PerfectDayResetPDF from "@/components/PerfectDayResetPDF";

export default function Dashboard() {
  const { user, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        setLocation("/");
      }
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-medium text-gray-800">Welcome back, {user.username}</h1>
                <p className="text-sm text-gray-600">Ready for your Perfect Day Reset?</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Message */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mb-6">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-4 text-green-600">
            Your Perfect Day Reset Journey Begins! 🌟
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            You've unlocked the complete 24-hour transformation protocol. Let's begin your journey to better energy, clarity, and focus!
          </p>
        </div>

        {/* Impact Badge */}
        <div className="text-center mb-8">
          <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2">
            <Heart className="h-4 w-4 mr-2" />
            Your purchase donated $1 to children's programs
          </Badge>
        </div>

        {/* Program Access Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          <Card className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all border-0 flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-emerald-600" />
                </div>
                0. Prep &amp; Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 justify-between">
              <p className="text-gray-600 text-sm mb-4">
                Customize your wake time, nutrition track, and day-before environment setup.
              </p>
              <Link href="/product/reset/welcome">
                <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                  Setup &amp; Welcome
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all border-0 flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-orange-600" />
                </div>
                1. Morning Reset
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 justify-between">
              <p className="text-gray-600 text-sm mb-4">
                Start your day with hydration, light exposure, movement, and calm focus.
              </p>
              <Link href="/product/reset/morning">
                <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                  Open Morning Routine
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all border-0 flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
                2. Midday Recharge
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 justify-between">
              <p className="text-gray-600 text-sm mb-4">
                Eliminate the 2 PM slump with blood-sugar-stable lunch and NSDR reset.
              </p>
              <Link href="/product/reset/midday">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                  Open Midday Routine
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all border-0 flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Target className="h-4 w-4 text-purple-600" />
                </div>
                3. Evening &amp; Sleep
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 justify-between">
              <p className="text-gray-600 text-sm mb-4">
                Wind down your nervous system, enjoy dinner, and lock in deep sleep.
              </p>
              <div className="space-y-2">
                <Link href="/product/reset/afternoon">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
                    Open Evening Routine
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/product/reset/reflection">
                  <Button variant="outline" size="sm" className="w-full text-xs border-purple-200 text-purple-700 hover:bg-purple-50">
                    Final Reflection &amp; Certificate →
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 4th Card/Banner: 7-Day Momentum & 2-Hour Workday Reset Toolkit */}
        <Card className="bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 text-white border border-amber-400/40 shadow-xl mb-12 overflow-hidden">
          <CardContent className="p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2.5">
                <Sparkles className="h-3.5 w-3.5" />
                Post-Reset Sustainment &amp; Mid-Week Triage
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                7-Day Momentum &amp; 2-Hour Workday Reset Toolkit
              </h3>
              <p className="text-gray-300 text-sm sm:text-base max-w-2xl">
                Access the interactive <strong>120-Minute Emergency Workday Reset Checklist</strong> for chaotic Tuesday/Wednesday schedules, the <strong>Executive Dining &amp; Travel Cheat Sheet</strong> across all 5 nutrition modes, and your <strong>7-Day Habit &amp; Energy Tracker</strong>.
              </p>
            </div>
            <div className="flex-shrink-0 w-full sm:w-auto">
              <Link href="/daily-reset-tracker" className="block w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-bold px-7 py-6 rounded-full h-auto text-base shadow-lg">
                  Open 7-Day &amp; 2-Hour Toolkit
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* PDF Download Section */}
        <Card className="bg-gradient-to-br from-emerald-50 to-blue-50 border-emerald-200 mb-12">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl md:text-3xl font-bold text-emerald-800">
              🎯 Your Complete Perfect Day Reset Guide
            </CardTitle>
            <p className="text-lg text-gray-600">
              Download the full timeline with all activities, supplements, and motivational content - designed exactly like our webpage
            </p>
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

        {/* Motivational Message */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="h-6 w-6 text-yellow-500" />
              <h3 className="text-2xl font-bold text-gray-800">Your Transformation Starts Now</h3>
              <Star className="h-6 w-6 text-yellow-500" />
            </div>
            <p className="text-lg text-gray-600 mb-6">
              You're about to embark on a life-changing 24-hour journey. Trust the process, follow each step, and prepare to feel more energized and focused than you have in years.
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">Science-Backed Protocol</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">Proven Results</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">Lifetime Access</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}