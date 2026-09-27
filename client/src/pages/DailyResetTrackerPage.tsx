import React from 'react';
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import DailyResetTracker from '@/components/DailyResetTracker';
import { Button } from '@/components/ui/button';
import { Printer, Download } from 'lucide-react';

export default function DailyResetTrackerPage() {
  // Function to handle printing
  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="print:hidden">
        <NavBar />
      </div>
      
      <div className="container mx-auto px-6 pt-32 pb-16">
        <div className="print:hidden mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Daily Reset Guide</h1>
            <p className="text-gray-600 max-w-2xl">
              Follow your daily reset protocol with this comprehensive guide. 
              Complete it for 7 consecutive days for optimal results.
            </p>
          </div>
          
          <div className="flex gap-4">
            <Button 
              onClick={handlePrint}
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Print Guides
            </Button>
            
            <a 
              href="/tracker.pdf" 
              download="perfect-day-reset-guide.pdf"
              className="inline-block"
            >
              <Button className="flex items-center gap-2 bg-primary text-white">
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </a>
            
            {/* Alternative HTML version link for browsers that don't support PDF */}
            <a 
              href="/tracker.html" 
              target="_blank"
              className="inline-block ml-4"
            >
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                View HTML Version
              </Button>
            </a>
          </div>
        </div>
        
        {/* Instructions - print:hidden means this won't show in print mode */}
        <div className="print:hidden mb-12 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h2 className="text-xl font-semibold mb-2 text-blue-800">Instructions:</h2>
          <ol className="list-decimal pl-5 space-y-2 text-blue-800">
            <li>Print this tracker or save the PDF to fill digitally.</li>
            <li>Complete all sections daily for at least 7 consecutive days.</li>
            <li>Keep this tracker as proof of participation if you need to request a refund.</li>
            <li>Use the notes section to record insights, challenges, or improvements in your routine.</li>
          </ol>
        </div>
        
        {/* This wraps all the trackers */}
        <div className="space-y-8 print:space-y-0">
          {/* Printing will automatically create page breaks between each tracker */}
          {[...Array(7)].map((_, i) => (
            <div key={i} className="print:page-break-after">
              {/* In print preview, only show the day number at the top of pages after first */}
              {i > 0 && <div className="hidden print:block text-center text-xl font-bold pt-8 pb-4">Day {i + 1}</div>}
              <DailyResetTracker />
            </div>
          ))}
        </div>
      </div>
      
      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}