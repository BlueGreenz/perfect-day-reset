import React from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { FileText, User, Copyright, AlertTriangle } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="bg-white min-h-screen">
      <SEOHead
        title="Terms of Service – Perfect Day Reset"
        description="Read the Terms of Service, usage license, and wellness disclaimer for Perfect Day Reset."
        canonical="https://perfectdayreset.com/terms-of-service"
      />
      <NavBar />
      
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
            <p className="text-gray-600">Last Updated: January 2025</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 mb-8">
              Welcome to PerfectDayReset.com. By using our website and services, you agree to these Terms of Service.
            </p>

            <div className="bg-orange-50 rounded-lg p-8 mb-8">
              <div className="flex items-center mb-4">
                <User className="h-6 w-6 text-orange-600 mr-3" />
                <h2 className="text-2xl font-bold">Use of Service</h2>
              </div>
              <p className="text-gray-700">
                Our 24-hour reset program is for personal wellness purposes. You may not use it for commercial purposes without our written consent.
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-8 mb-8">
              <div className="flex items-center mb-4">
                <User className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold">Account</h2>
              </div>
              <p className="text-gray-700">
                You are responsible for maintaining the confidentiality of your account information and for all activities under your account.
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-8 mb-8">
              <div className="flex items-center mb-4">
                <Copyright className="h-6 w-6 text-purple-600 mr-3" />
                <h2 className="text-2xl font-bold">Intellectual Property</h2>
              </div>
              <p className="text-gray-700">
                All content on the site, including videos, guides, and branding, is owned by PerfectDayReset.com and may not be copied or redistributed.
              </p>
            </div>

            <div className="bg-yellow-50 rounded-lg p-8 mb-8">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3" />
                <h2 className="text-2xl font-bold">No Medical Advice</h2>
              </div>
              <p className="text-gray-700">
                This program offers wellness guidance, not medical or psychological treatment. Consult a professional if needed.
              </p>
            </div>

            <h2 className="text-2xl font-bold mb-4">Changes</h2>
            <p className="text-gray-700">
              We may update these terms. We'll notify you via email or website if changes are significant.
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}