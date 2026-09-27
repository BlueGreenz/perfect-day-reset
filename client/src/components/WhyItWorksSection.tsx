import { Brain, FileText, Zap, Check, ArrowRight, Clock, Sparkles } from "lucide-react";

export default function WhyItWorksSection() {
  return (
    <section className="bg-white">
      <div className="container">
        <div className="section-heading">
          <h2>Why This Works</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">The Perfect Day Reset is built on proven principles that deliver real results.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="bg-secondary rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <Brain className="text-primary h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Body + Mind Synergy</h3>
            <ul className="space-y-3 text-left">
              <li className="flex items-start">
                <Check className="text-primary h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Neurochemical balancing</span>
              </li>
              <li className="flex items-start">
                <Check className="text-primary h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Strategic nutrition timing</span>
              </li>
              <li className="flex items-start">
                <Check className="text-primary h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Cognitive-physical pairing</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="bg-secondary rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <FileText className="text-primary h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Instant Structure</h3>
            <ul className="space-y-3 text-left">
              <li className="flex items-start">
                <Check className="text-primary h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Hour-by-hour guidance</span>
              </li>
              <li className="flex items-start">
                <Check className="text-primary h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">No decisions needed</span>
              </li>
              <li className="flex items-start">
                <Check className="text-primary h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Customizable to your diet</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="bg-secondary rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <Zap className="text-primary h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Quick Wins</h3>
            <ul className="space-y-3 text-left">
              <li className="flex items-start">
                <Check className="text-primary h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Feel difference in hours</span>
              </li>
              <li className="flex items-start">
                <Check className="text-primary h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Break digital addiction</span>
              </li>
              <li className="flex items-start">
                <Check className="text-primary h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Measurable mood improvement</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center bg-primary/5 p-8 rounded-xl max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="bg-primary/20 p-3 rounded-full">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-lg">Just One Day</h4>
              <p className="text-gray-700">Only 24 hours needed</p>
            </div>
          </div>
          
          <div className="hidden md:block">
            <ArrowRight className="h-8 w-8 text-primary" />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-primary/20 p-3 rounded-full">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-lg">Lasting Effects</h4>
              <p className="text-gray-700">Momentum for weeks</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}