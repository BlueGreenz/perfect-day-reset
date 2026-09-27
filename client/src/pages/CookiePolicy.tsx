import React from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Cookie, Settings, BarChart3, Target } from "lucide-react";

export default function CookiePolicy() {
  return (
    <div className="bg-white min-h-screen">
      <NavBar />
      
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Cookie className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Cookie Policy</h1>
            <p className="text-gray-600">Last Updated: January 2025</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 mb-8">
              PerfectDayReset.com uses cookies to improve your experience.
            </p>

            <div className="bg-green-50 rounded-lg p-8 mb-8">
              <div className="flex items-center mb-4">
                <Cookie className="h-6 w-6 text-green-600 mr-3" />
                <h2 className="text-2xl font-bold">What Are Cookies?</h2>
              </div>
              <p className="text-gray-700">
                Cookies are small files stored on your device that help us remember your preferences and analyze usage.
              </p>
            </div>

            <h2 className="text-2xl font-bold mb-6">Types of Cookies We Use</h2>

            <div className="space-y-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <Settings className="h-5 w-5 text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold">Essential Cookies</h3>
                </div>
                <p className="text-gray-700">
                  Enable core functionality like account login.
                </p>
              </div>

              <div className="bg-purple-50 rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <BarChart3 className="h-5 w-5 text-purple-600 mr-3" />
                  <h3 className="text-xl font-semibold">Analytics Cookies</h3>
                </div>
                <p className="text-gray-700">
                  Help us understand how users engage with the site.
                </p>
              </div>

              <div className="bg-orange-50 rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <Target className="h-5 w-5 text-orange-600 mr-3" />
                  <h3 className="text-xl font-semibold">Marketing Cookies</h3>
                </div>
                <p className="text-gray-700">
                  May be used for relevant future ads or offers.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-8">
              <div className="flex items-center mb-4">
                <Settings className="h-6 w-6 text-gray-600 mr-3" />
                <h2 className="text-2xl font-bold">Managing Cookies</h2>
              </div>
              <p className="text-gray-700">
                You can disable cookies in your browser settings. Please note this may affect functionality.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}