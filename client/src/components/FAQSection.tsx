import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { HelpCircle, CheckCircle2, Clock, Download, Zap, FlaskConical } from "lucide-react";

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
              <span>Feeling mentally foggy or physically drained</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
              <span>Stuck in unproductive patterns or habits</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
              <span>An entrepreneur, creator, or parent seeking balance</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
              <span>Ready to transform in just one focused day</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      question: "What format is the program?",
      answer: (
        <div className="space-y-4">
          <div className="flex items-start">
            <Download className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
            <p>Instantly downloadable PDF guide with step-by-step instructions</p>
          </div>
          <ul className="pl-7 space-y-2 list-disc">
            <li>Detailed hour-by-hour schedule</li>
            <li>Interactive checklist system</li>
            <li>Customizable meal plans (5 diet types)</li>
            <li>Reflection journal prompts</li>
          </ul>
          <p>Access on any device and print if preferred.</p>
        </div>
      )
    },
    {
      question: "How fast will I feel a difference?",
      answer: (
        <div className="space-y-4">
          <div className="flex items-start">
            <Zap className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
            <p><strong>Within hours</strong> - Most people report feeling noticeably more energized and focused by midday of their reset.</p>
          </div>
          <p>What you'll experience:</p>
          <ul className="space-y-2">
            <li className="flex items-start">
              <Clock className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">Morning:</span>
                <span className="block text-gray-600">Mental clarity and physical energy boost</span>
              </div>
            </li>
            <li className="flex items-start">
              <Clock className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">Midday:</span>
                <span className="block text-gray-600">Sustained focus without the usual slump</span>
              </div>
            </li>
            <li className="flex items-start">
              <Clock className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">Evening:</span>
                <span className="block text-gray-600">Deep relaxation and mental quiet</span>
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
          <p className="font-medium">Your 3-step instant access:</p>
          <ol className="space-y-2">
            <li className="flex items-start">
              <div className="bg-primary/10 rounded-full h-6 w-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <span className="text-primary font-medium">1</span>
              </div>
              <span>Immediate redirect to download page</span>
            </li>
            <li className="flex items-start">
              <div className="bg-primary/10 rounded-full h-6 w-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <span className="text-primary font-medium">2</span>
              </div>
              <span>Confirmation email with PDF guide + bonus materials</span>
            </li>
            <li className="flex items-start">
              <div className="bg-primary/10 rounded-full h-6 w-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <span className="text-primary font-medium">3</span>
              </div>
              <span>Welcome email with quick-start tips</span>
            </li>
          </ol>
          <p className="text-gray-600 mt-2">No waiting, no complicated setup - start your reset immediately.</p>
        </div>
      )
    },
    {
      question: "Is this backed by science?",
      answer: (
        <div className="space-y-4">
          <div className="flex items-start">
            <FlaskConical className="h-5 w-5 text-primary mr-2 mt-1 flex-shrink-0" />
            <p><strong>Yes</strong> - The Perfect Day Reset integrates research from multiple disciplines:</p>
          </div>
          <ul className="space-y-2">
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">Neuroscience:</span>
                <span className="block text-gray-600">Optimizing neurochemical balance and cognitive function</span>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">Circadian Biology:</span>
                <span className="block text-gray-600">Aligning activities with your body's natural rhythm</span>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">Behavioral Psychology:</span>
                <span className="block text-gray-600">Creating momentum through strategic habit stacking</span>
              </div>
            </li>
          </ul>
          <p className="text-gray-600">Every element is designed for maximum impact within the 24-hour timeframe.</p>
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
            Still have questions? <a href="/contact" className="text-primary font-medium hover:underline">Contact us</a> for quick answers.
          </p>
          <a 
            href="/what-you-get" 
            className="inline-block"
          >
            <Button size="lg" className="cta-button bg-primary text-white font-medium px-8 py-6 rounded-full hover:bg-green-600 transition text-lg">
              Get the Perfect Day Reset – $19
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}