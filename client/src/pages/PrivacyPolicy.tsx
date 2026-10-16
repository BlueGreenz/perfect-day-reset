import React from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Shield, Mail, Eye, Database } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="bg-white min-h-screen">
      <SEOHead
        title="Privacy Policy – Perfect Day Reset"
        description="Learn how Perfect Day Reset collects, uses, and safeguards your personal data and privacy."
        canonical="https://perfectdayreset.com/privacy-policy"
      />
      <NavBar />
      
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-gray-600">Last Updated: January 2025</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 mb-8">
              PerfectDayReset.com ("we", "us", or "our") values your privacy. This Privacy Policy explains how we collect, use, and protect your information.
            </p>

            <div className="bg-gray-50 rounded-lg p-8 mb-8">
              <div className="flex items-center mb-4">
                <Database className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold">What We Collect</h2>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Email address (when signing up)
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Usage data (e.g., time spent on exercises, engagement)
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Device and browser info (standard analytics)
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-8 mb-8">
              <div className="flex items-center mb-4">
                <Eye className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold">How We Use It</h2>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  To provide and improve the 24-hour reset experience
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  To send important updates or offers (you can opt out anytime)
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  To analyze trends and enhance user experience
                </li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold mb-4">Data Protection</h2>
            <p className="text-gray-700 mb-8">
              We take appropriate measures to protect your data and never sell or rent it to third parties.
            </p>

            <h2 className="text-2xl font-bold mb-4">Your Rights (Under GDPR)</h2>
            <ul className="space-y-2 text-gray-700 mb-8">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Access, update, or delete your data
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Withdraw consent at any time
              </li>
            </ul>

            <div className="bg-green-50 rounded-lg p-8">
              <div className="flex items-center mb-4">
                <Mail className="h-6 w-6 text-green-600 mr-3" />
                <h3 className="text-xl font-semibold">Contact Us</h3>
              </div>
              <p className="text-gray-700">
                For any questions, email us at: <a href="mailto:perfectdayreset@gmail.com" className="text-blue-600 hover:underline">perfectdayreset@gmail.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}