import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Mail, Check, X, Shield, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function RefundPolicy() {
  return (
    <div className="bg-white min-h-screen">
      <NavBar />
      
      <div className="pt-32 pb-16">
        <div className="container max-w-3xl mx-auto px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">🧾 Refund Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-8 text-center">
              We're confident that the Perfect Day Reset will elevate your energy, focus, and mood. 
              But we understand everyone's journey is unique, so we offer a 14-day money-back guarantee 
              — with conditions to keep it fair.
            </p>
            
            <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-8 border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Check className="h-6 w-6 text-green-500 mr-2" />
                  You're eligible for a full refund if:
                </h2>
                
                <ul className="space-y-3 list-disc pl-6">
                  <li>You've followed the program for at least 7 full days.</li>
                  <li>
                    You submit proof of participation, such as:
                    <ul className="mt-2 space-y-2 list-disc pl-6">
                      <li>A completed page from the Daily Reset Tracker (provided in your guide),</li>
                      <li>A short reflection or journal entry about your experience,</li>
                      <li>Screenshots of meals/supplements or activities you've followed.</li>
                    </ul>
                  </li>
                  <li>You haven't requested a refund from us before.</li>
                  <li>Your request is within 14 days of purchase.</li>
                </ul>
              </div>
            </div>
            
            {/* New Refund Eligibility Requirements Section */}
            <div className="bg-green-50 shadow-sm rounded-lg overflow-hidden mb-8 border border-green-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-primary">
                  Refund Eligibility Requirements
                </h2>
                
                <p className="mb-4">
                  We offer a 14-day money-back guarantee — but to be eligible for a refund, you must:
                </p>
                
                <ol className="space-y-4 list-decimal pl-6 mb-6">
                  <li className="font-medium">Use the program consistently for at least 7 consecutive days</li>
                  <li className="font-medium">Fill in our Daily Reset Tracker for those 7 days</li>
                  <li className="font-medium">Submit your completed tracker with a short explanation of why the program didn't meet your expectations</li>
                </ol>
                
                <div className="flex justify-center mt-6">
                  <Link href="/daily-reset-tracker">
                    <Button className="flex items-center gap-2 bg-primary text-white">
                      <FileDown className="h-4 w-4" />
                      Download Daily Reset Guide
                    </Button>
                  </Link>
                </div>
                
                <p className="mt-6 text-sm text-gray-600 text-center">
                  This ensures fairness for all and helps us improve our program based on honest, committed feedback.
                </p>
              </div>
            </div>
            
            <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-8 border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <X className="h-6 w-6 text-red-500 mr-2" />
                  Refunds will not be approved if:
                </h2>
                
                <ul className="space-y-3 list-disc pl-6">
                  <li>You didn't attempt the program.</li>
                  <li>You purchased by accident.</li>
                  <li>You downloaded the product and immediately requested a refund without trying it.</li>
                  <li>You fail to provide the required participation proof.</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-8 border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Mail className="h-6 w-6 text-blue-500 mr-2" />
                  How to request a refund:
                </h2>
                
                <p className="mb-4">Please email us at <a href="mailto:hello@perfectdayreset.com" className="text-primary hover:underline">hello@perfectdayreset.com</a> with:</p>
                
                <ul className="space-y-3 list-disc pl-6">
                  <li>Subject: Refund Request – Perfect Day Reset</li>
                  <li>Your name + order confirmation</li>
                  <li>Your participation proof (described above)</li>
                </ul>
                
                <p className="mt-4">If approved, refunds are processed within 5 working days.</p>
              </div>
            </div>
            
            <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-8 border border-gray-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Shield className="h-6 w-6 text-primary mr-2" />
                  Why these conditions?
                </h2>
                
                <p>
                  We've poured our hearts and expertise into creating this. These guidelines protect us 
                  from misuse and ensure refunds are only used when someone genuinely didn't receive 
                  value — not as a free download loophole.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}