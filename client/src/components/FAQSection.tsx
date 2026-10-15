import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { HelpCircle, CheckCircle2, Clock, Download, Zap, FlaskConical, Smartphone, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function FAQSection() {
  const faqs = [
    {
      question: "Who is this for?",
      answer: (
        <div className="space-y-4">
          <p>Perfect for you if you're:</p>
          <ul className="space-y-2">
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
              <span>Feeling mentally foggy, scattered, or physically drained</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
              <span>Stuck in unproductive digital habits or afternoon energy crashes</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
              <span>An entrepreneur, executive, creator, or parent seeking a realistic 1-day reboot</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
              <span>Ready to reset your momentum in just one focused 24-hour window</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      question: "What format is the program?",
      answer: (
        <div className="space-y-4">
          <p className="font-medium text-gray-900">
            You get both our Live Interactive Web Companion Portal (works on any phone, tablet, or laptop) AND the complete Printable PDF Guide:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/15">
              <div className="flex items-center font-semibold text-gray-900 mb-2">
                <Smartphone className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                Interactive Web Companion
              </div>
              <ul className="pl-5 space-y-1.5 list-disc text-sm text-gray-700">
                <li>Dynamic 24-hour schedule anchored to your wake &amp; sleep times</li>
                <li>1-Tap Delay Rescheduler (+5m to +30m) if you run late</li>
                <li>5 customizable diet tracks (Omnivore, Vegetarian, Keto, Paleo, Vegan)</li>
                <li>Interactive Hydration Calculator &amp; saved Reflection Journal</li>
              </ul>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center font-semibold text-gray-900 mb-2">
                <Download className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                Printable PDF &amp; Offline Kit
              </div>
              <ul className="pl-5 space-y-1.5 list-disc text-sm text-gray-700">
                <li>Complete step-by-step 24-Hour Reset PDF blueprint</li>
                <li>Printable 7-Day Daily Reset Tracker for going 100% screen-free</li>
                <li>1-click grocery lists &amp; meal prep recipes</li>
                <li>Personalized Certificate of Completion</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      question: "How fast will I feel a difference?",
      answer: (
        <div className="space-y-4">
          <div className="flex items-start">
            <Zap className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
            <p><strong>Within hours</strong> — Most people report feeling noticeably calmer, clearer, and more energized by midday of their reset.</p>
          </div>
          <p>What you'll experience across the 24 hours:</p>
          <ul className="space-y-2">
            <li className="flex items-start">
              <Clock className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">Morning (07:00–10:00):</span>
                <span className="block text-gray-600">Cortisol &amp; hydration anchor, screen-free clarity, and steady physical energy</span>
              </div>
            </li>
            <li className="flex items-start">
              <Clock className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">Midday (10:30–15:15):</span>
                <span className="block text-gray-600">90-minute deep flow state and endorphin boost without the afternoon crash</span>
              </div>
            </li>
            <li className="flex items-start">
              <Clock className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">Evening (15:30–21:30):</span>
                <span className="block text-gray-600">Nervous system decompression, cognitive unload, and deep restorative sleep</span>
              </div>
            </li>
          </ul>
        </div>
      )
    },
    {
      question: "What happens after I purchase?",
      answer: (
        <div className="space-y-3">
          <p className="font-medium">Your 3-step instant access ($19 one-time payment):</p>
          <ol className="space-y-2">
            <li className="flex items-start">
              <div className="bg-primary/10 rounded-full h-6 w-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <span className="text-primary font-medium">1</span>
              </div>
              <span>Instant account creation on the confirmation page + welcome email with your personal login credentials</span>
            </li>
            <li className="flex items-start">
              <div className="bg-primary/10 rounded-full h-6 w-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <span className="text-primary font-medium">2</span>
              </div>
              <span>Immediate access to the Interactive Web Companion Portal to set your wake time and choose 1 of 5 nutrition modes</span>
            </li>
            <li className="flex items-start">
              <div className="bg-primary/10 rounded-full h-6 w-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <span className="text-primary font-medium">3</span>
              </div>
              <span>Instant download of the Printable PDF Guide, Meal Plan Recipes, and 7-Day Daily Reset Tracker</span>
            </li>
          </ol>
          <p className="text-gray-600 mt-2">Lifetime access included — repeat your 24-Hour Reset whenever you need a fresh start.</p>
        </div>
      )
    },
    {
      question: "Is this backed by science?",
      answer: (
        <div className="space-y-4">
          <div className="flex items-start">
            <FlaskConical className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
            <p><strong>Yes</strong> — The Perfect Day Reset integrates research from multiple disciplines:</p>
          </div>
          <ul className="space-y-2">
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">Neuroscience &amp; Dopamine Regulation:</span>
                <span className="block text-gray-600">Interrupting digital overstimulation and restoring baseline focus</span>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">Circadian Biology:</span>
                <span className="block text-gray-600">Aligning light, movement, and meal timing with your body's natural clock</span>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">Behavioral Psychology:</span>
                <span className="block text-gray-600">Building immediate self-efficacy through a completable 24-hour structure</span>
              </div>
            </li>
          </ul>
          <p className="text-gray-600">Every element is designed for maximum impact within a single 24-hour timeframe.</p>
        </div>
      )
    }
  ];

  return (
    <section id="faq" className="bg-gray-50">
      <div className="container">
        <div className="section-heading">
          <div className="flex justify-center mb-4">
            <span className="p-2 bg-primary/10 rounded-full">
              <HelpCircle className="h-8 w-8 text-primary" />
            </span>
          </div>
          <h2>Frequently Asked Questions</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Everything you need to know about the Perfect Day Reset program.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-6 md:p-8">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200 last:border-0">
                <AccordionTrigger className="text-lg md:text-xl font-medium text-left py-5 hover:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 py-4 text-base md:text-lg">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        
        <div className="text-center mt-16">
          <p className="text-gray-700 mb-8 text-lg">
            Still have questions? <Link href="/contact" className="text-primary font-medium hover:underline">Contact us</Link> for quick answers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/checkout">
              <Button size="lg" className="cta-button bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold px-8 py-6 rounded-full transition text-lg shadow-lg w-full sm:w-auto">
                Start My 24-Hour Reset — $19
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/what-you-get">
              <Button variant="outline" size="lg" className="border-gray-300 text-gray-800 hover:bg-white font-medium px-8 py-6 rounded-full text-lg w-full sm:w-auto">
                See Full Program Breakdown
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}