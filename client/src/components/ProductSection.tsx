import { Button } from "@/components/ui/button";
import { Book, Video, ClipboardList, Users } from "lucide-react";
import { Link } from "wouter";

export default function ProductSection() {
  return (
    <section id="program" className="section bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Introducing:<br />The Perfect Day Reset</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">A comprehensive system designed to transform your daily routine and create lasting positive changes in your life.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-12 items-start">
          <div className="md:w-1/2 md:mt-24">
            <img 
              src="/sunrise-stretching.webp" 
              alt="Man stretching at sunrise" 
              loading="lazy"
              decoding="async"
              className="rounded-lg shadow-md w-full object-cover h-[400px] md:h-[500px]"
            />
          </div>
          
          <div className="md:w-1/2">
            <h3 className="text-2xl font-semibold mb-6">What you'll get:</h3>
            
            <div className="space-y-6">
              <div className="flex items-start" id="guidebook-section">
                <div className="bg-secondary rounded-full w-10 h-10 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                  <Book className="text-primary h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Perfect Day Guidebook</h4>
                  <p className="text-gray-600">Comprehensive guide with all techniques, exercises, and implementation strategies.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-secondary rounded-full w-10 h-10 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                  <Video className="text-primary h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Video Masterclass</h4>
                  <p className="text-gray-600">6-part video series walking you through each element of the system step-by-step.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-secondary rounded-full w-10 h-10 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                  <ClipboardList className="text-primary h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Daily Reset Planner</h4>
                  <p className="text-gray-600">Printable worksheets to implement your perfect day routine with daily tracking.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-secondary rounded-full w-10 h-10 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                  <Users className="text-primary h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Community Membership</h4>
                  <p className="text-gray-600">Access to our private community of like-minded individuals on the same journey.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-10">
              <div className="flex items-center mb-4">
                <span className="text-3xl font-bold text-primary">$19</span>
                <span className="ml-3 line-through text-gray-500">$147</span>
                <span className="ml-3 bg-red-100 text-red-700 px-2 py-1 rounded-md text-sm font-medium">55% OFF</span>
              </div>
              
              <Link 
                href="/what-you-get"
                className="inline-block w-full md:w-auto"
              >
                <Button className="cta-button bg-primary text-white font-medium px-8 py-3 rounded-full hover:bg-green-600 transition w-full">
                  Get the Perfect Day Reset – $19
                </Button>
              </Link>
              
              <div className="mt-4 border border-gray-200 rounded-lg p-4 bg-white/60 backdrop-blur-sm">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="text-primary mr-3 flex-shrink-0 text-xl">
                      <span className="font-bold">✔️</span>
                    </div>
                    <p className="font-semibold text-gray-700">
                      <Link href="/refund-policy">
                        <span className="cursor-pointer hover:text-primary transition-colors">
                          30-Day Money Back Guarantee
                        </span>
                      </Link>
                    </p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="text-primary mr-3 flex-shrink-0 text-xl">
                      <span>📩</span>
                    </div>
                    <p className="font-semibold text-gray-700">Direct Support During Your Reset</p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="text-primary mr-3 flex-shrink-0 text-xl">
                      <span>📘</span>
                    </div>
                    <p className="font-semibold text-gray-700">Structured, No-Guesswork Plan for Maximum Results</p>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mt-3">One-time purchase. Lifetime access. Instant download.</p>
              </div>
              
              <p className="text-sm text-gray-500 mt-3 flex items-center justify-center md:justify-start">
                <span className="inline-block mr-1">🔒</span> Secure payment via credit card or PayPal
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
