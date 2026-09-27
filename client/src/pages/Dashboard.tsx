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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-orange-600" />
                </div>
                Morning Reset
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Start your day with energy and purpose</p>
              <Link href="/product/reset/welcome">
                <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                  Begin Morning Routine
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
                Midday Recharge
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Maintain momentum and stay focused</p>
              <Link href="/product/reset/midday">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                  Continue to Midday
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Target className="h-4 w-4 text-purple-600" />
                </div>
                Evening Reflection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Wind down and prepare for rest</p>
              <Link href="/product/reset/afternoon">
                <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
                  Complete Your Day
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

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