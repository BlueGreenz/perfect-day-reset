import React from 'react';
import { Link } from 'wouter';
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from '@/components/ui/button';
import heroImage from '@assets/Täiuslik päeva algus.png';
import sunriseImage from '@assets/Hommikune venitamine päikesetõusul.png';
import { 
  CheckCircle, 
  FileText, 
  MailOpen, 
  Brain, 
  CheckCheck, 
  Zap, 
  Calendar, 
  Utensils, 
  ShieldCheck, 
  ArrowRight, 
  Package, 
  Star, 
  User,
  ShoppingBag,
  FileDown,
  Sparkles,
  List,
  Phone,
  ListTodo,
  Flame
} from 'lucide-react';

export default function WhatYouGet() {
  return (
    <div className="bg-[#FCFCFC] min-h-screen font-sans">
      <SEOHead
        title="Perfect Day Reset Program – Complete 24-Hour Transformation Guide"
        description="Get the complete Perfect Day Reset program: morning routines, midday recharge protocols, evening reflection practices. Transform your energy in 24 hours for just $19."
        canonical="https://perfectdayreset.com/what-you-get"
        ogTitle="Perfect Day Reset Program – 24-Hour Transformation"
        ogDescription="Complete step-by-step guide to reset your energy, focus, and mood in just one day. Includes morning, midday, and evening protocols."
        ogImage="https://perfectdayreset.com/logo.png"
        twitterTitle="Perfect Day Reset – Complete Program"
        twitterDescription="Transform your energy, focus, and mood in 24 hours with our complete reset program."
      />
      <NavBar />
      
      {/* Add padding at the top to account for fixed navbar height */}
      <div className="pt-16 md:pt-20">
        {/* BLOCK 2: HERO SECTION - Just the image without any additions */}
        <div className="w-full">
          {/* Full width image that already contains all the text */}
          <img 
            src={heroImage} 
            alt="Perfect Day Reset Hero Image" 
            className="w-full object-cover"
            style={{ maxHeight: "80vh" }}
          />
        </div>
      </div>
      
      {/* BLOCK 3: WHAT'S INSIDE */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">
              🧘‍♂️ What's Included in the Perfect Day Reset
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need for a complete mind-body transformation in a single day
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-100 flex items-start transition-all hover:shadow-md">
              <div className="bg-primary/10 rounded-full p-2 mr-4 flex-shrink-0">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">PDF Guide</h3>
                <p className="text-gray-600">Complete instructions for your transformation day with easy-to-follow steps</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-100 flex items-start transition-all hover:shadow-md">
              <div className="bg-primary/10 rounded-full p-2 mr-4 flex-shrink-0">
                <Utensils className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">3 meals per eating time</h3>
                <p className="text-gray-600">Includes recipes + shopping list for all options, making preparation simple</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-100 flex items-start transition-all hover:shadow-md">
              <div className="bg-primary/10 rounded-full p-2 mr-4 flex-shrink-0">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Supplement stack + where to buy</h3>
                <p className="text-gray-600">Optional but powerful supplements with exact dosages and trusted sources</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-100 flex items-start transition-all hover:shadow-md">
              <div className="bg-primary/10 rounded-full p-2 mr-4 flex-shrink-0">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Fully planned schedule</h3>
                <p className="text-gray-600">Detailed timeline with habits, mindset exercises, and movement protocols</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-100 flex items-start transition-all hover:shadow-md">
              <div className="bg-primary/10 rounded-full p-2 mr-4 flex-shrink-0">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">No-phone challenge structure</h3>
                <p className="text-gray-600">Framework to break free from digital distractions and regain mental clarity</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-100 flex items-start transition-all hover:shadow-md">
              <div className="bg-primary/10 rounded-full p-2 mr-4 flex-shrink-0">
                <ListTodo className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Printable Daily Guide</h3>
                <p className="text-gray-600">Follow along with your reset using our comprehensive daily checklist</p>
              </div>
            </div>

            <div className="md:col-span-2 bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-5 border border-green-200 flex items-start transition-all hover:shadow-md">
              <div className="bg-primary/10 rounded-full p-2 mr-4 flex-shrink-0">
                <Flame className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Motivation-packed layout</h3>
                <p className="text-gray-600">Beautifully designed materials to keep you engaged and inspired throughout your reset day</p>

              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* BLOCK 4: WHO THIS IS FOR */}
      <div className="py-16 bg-blue-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">
              🙋‍♀️ Who Is This For?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              If you recognize yourself in any of these descriptions, the Perfect Day Reset was made for you:
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            <div className="bg-white rounded-lg shadow-sm p-8 border border-blue-100 flex flex-col justify-center">
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-1.5 mr-4 flex-shrink-0">
                    <CheckCheck className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Anyone feeling stuck, foggy, or low-energy</h3>
                    <p className="text-gray-600">When you've been running on empty for too long and need a system to recharge</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-1.5 mr-4 flex-shrink-0">
                    <CheckCheck className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">People who've lost momentum and want a clean reset</h3>
                    <p className="text-gray-600">When good habits have slipped and you need a structured day to get back on track</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-1.5 mr-4 flex-shrink-0">
                    <CheckCheck className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">High performers who need to recharge</h3>
                    <p className="text-gray-600">When you're accomplishing a lot but feeling burned out and need renewal</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-1.5 mr-4 flex-shrink-0">
                    <CheckCheck className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Beginners in self-care or wellbeing</h3>
                    <p className="text-gray-600">When you want to start a wellness journey but don't know where to begin</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-1.5 mr-4 flex-shrink-0">
                    <CheckCheck className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">You, if you're ready to change how you feel – fast</h3>
                    <p className="text-gray-600">When you want results quickly without overthinking every detail</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Full Vertical Image Column */}
            <div className="order-first lg:order-last">
              <img 
                src={sunriseImage} 
                alt="Person celebrating success at sunrise" 
                className="w-full h-full rounded-lg shadow-lg object-cover min-h-[600px]"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* BLOCK 5: WHAT HAPPENS AFTER PURCHASE */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">
              📦 What Happens After You Buy?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The process is simple and immediate — you'll have everything you need in minutes:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-amber-50 rounded-xl p-6 border border-amber-100 text-center">
              <div className="inline-block bg-white rounded-full p-3 mb-4 shadow-sm">
                <MailOpen className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Step 1</h3>
              <p className="text-gray-700">You'll receive a confirmation email with your purchase details</p>
            </div>
            
            <div className="bg-amber-50 rounded-xl p-6 border border-amber-100 text-center">
              <div className="inline-block bg-white rounded-full p-3 mb-4 shadow-sm">
                <FileDown className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Step 2</h3>
              <p className="text-gray-700">You'll access the full plan, supplement guide, and recipes</p>
            </div>
            
            <div className="bg-amber-50 rounded-xl p-6 border border-amber-100 text-center">
              <div className="inline-block bg-white rounded-full p-3 mb-4 shadow-sm">
                <Sparkles className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Step 3</h3>
              <p className="text-gray-700">You'll begin your reset whenever you're ready</p>
            </div>
          </div>
          

        </div>
      </div>
      
      {/* Social Proof Section */}
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-3xl font-bold mb-10 text-center">What People Are Saying</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transform transition-transform hover:-translate-y-1">
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-amber-400" fill="#F59E0B" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "Followed this reset when I was feeling completely burnt out. By the end of the day, I felt like a new person. My mind was clear and my energy was back."
              </p>
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <p className="font-medium">Sophia R.</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transform transition-transform hover:-translate-y-1">
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-amber-400" fill="#F59E0B" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "The meal plans were so easy to follow, and the supplement recommendations made a noticeable difference. I'm making this reset a monthly ritual now."
              </p>
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <p className="font-medium">Michael T.</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transform transition-transform hover:-translate-y-1">
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-amber-400" fill="#F59E0B" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "As a busy mom, I never take time for myself. This reset was exactly what I needed - structured enough to follow but flexible enough to fit into my life."
              </p>
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-full p-2 mr-3 flex-shrink-0">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <p className="font-medium">Jennifer L.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* BLOCK 6: FINAL CTA SECTION */}
      <div className="py-16 bg-gradient-to-br from-primary/5 to-blue-50 border-t border-primary/10">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-6">Start Your Reset Now for Only $19</h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            One day designed to transform your energy, clarity, and focus. 
            Get immediate access and start whenever you're ready.
          </p>
          
          <div className="flex justify-center">
            <Link 
              href="/checkout"
              className="inline-block mb-4"
            >
              <Button className="bg-gradient-to-r from-primary to-green-500 hover:from-primary/90 hover:to-green-600 text-white px-6 sm:px-10 py-6 sm:py-7 rounded-lg h-auto text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 w-full sm:w-auto">
                <span className="hidden sm:inline">Get the Perfect Day Reset – $19</span>
                <span className="sm:hidden">Get Perfect Day Reset – $19</span>
                <ArrowRight className="ml-2 sm:ml-3 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
          </div>
          
          <p className="mt-6 text-sm text-gray-600 italic">
            Your new momentum starts today.
          </p>
          
          <div className="flex justify-center mt-8 space-x-5">
            <div className="flex items-center text-sm text-gray-600">
              <ShoppingBag className="h-4 w-4 text-primary mr-1" />
              <span>One-time purchase</span>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <MailOpen className="h-4 w-4 text-primary mr-1" />
              <span>Instant delivery</span>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}