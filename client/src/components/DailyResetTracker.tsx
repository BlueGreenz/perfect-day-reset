import React from 'react';

export default function DailyResetTracker() {
  return (
    <div className="daily-reset-tracker bg-white p-8 max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-primary mb-1">Perfect Day Reset</h1>
        <h2 className="text-2xl font-medium text-gray-700">Daily Reset Guide</h2>
        <div className="mt-3 mb-6">
          <div className="flex items-center justify-center">
            <div className="mr-4">
              <span className="font-medium">Date:</span>
              <span className="ml-2 border-b border-gray-400 inline-block w-32">&nbsp;</span>
            </div>
            <div>
              <span className="font-medium">Day:</span>
              <span className="ml-2 border-b border-gray-400 inline-block w-32">&nbsp;</span>
            </div>
          </div>
        </div>
      </div>

      {/* Morning Section */}
      <div className="mb-8 border border-green-100 rounded-lg p-4 bg-green-50">
        <h3 className="text-xl font-semibold mb-3 text-primary flex items-center">
          <span className="mr-2">🌞</span> Morning
        </h3>
        <div className="space-y-3 ml-2">
          <div className="flex items-center">
            <input type="checkbox" className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary" />
            <span className="ml-3">Woke up at target time: <span className="border-b border-gray-400 inline-block w-20 ml-1">&nbsp;</span></span>
          </div>
          <div className="flex items-center">
            <input type="checkbox" className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary" />
            <span className="ml-3">10-minute mindfulness completed</span>
          </div>
          <div className="flex items-center">
            <input type="checkbox" className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary" />
            <span className="ml-3">Morning supplements taken</span>
          </div>
          <div className="flex items-center">
            <input type="checkbox" className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary" />
            <span className="ml-3">First meal followed (circle one): Option 1 / Option 2 / Option 3</span>
          </div>
        </div>
      </div>

      {/* Midday Section */}
      <div className="mb-8 border border-blue-100 rounded-lg p-4 bg-blue-50">
        <h3 className="text-xl font-semibold mb-3 text-blue-600 flex items-center">
          <span className="mr-2">💪</span> Midday
        </h3>
        <div className="space-y-3 ml-2">
          <div className="flex items-center">
            <input type="checkbox" className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span className="ml-3">Movement session completed (walk/gym/yoga)</span>
          </div>
          <div className="flex items-center">
            <input type="checkbox" className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span className="ml-3">Screen-free focus block completed</span>
          </div>
          <div className="flex items-center">
            <input type="checkbox" className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span className="ml-3">Second meal followed (circle one): Option 1 / Option 2 / Option 3</span>
          </div>
        </div>
      </div>

      {/* Evening Section */}
      <div className="mb-8 border border-purple-100 rounded-lg p-4 bg-purple-50">
        <h3 className="text-xl font-semibold mb-3 text-purple-600 flex items-center">
          <span className="mr-2">🌇</span> Evening
        </h3>
        <div className="space-y-3 ml-2">
          <div className="flex items-center">
            <input type="checkbox" className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
            <span className="ml-3">Digital detox after 8pm</span>
          </div>
          <div className="flex items-center">
            <input type="checkbox" className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
            <span className="ml-3">Supplements taken (evening)</span>
          </div>
          <div className="flex items-center">
            <input type="checkbox" className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
            <span className="ml-3">Final meal followed (circle one): Option 1 / Option 2 / Option 3</span>
          </div>
          <div className="flex items-center">
            <input type="checkbox" className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
            <span className="ml-3">5-minute gratitude or reflection done</span>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="text-xl font-semibold mb-3 text-gray-700 flex items-center">
          <span className="mr-2">🧠</span> Notes or Reflections:
        </h3>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-full border-b border-gray-300 h-6"></div>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Follow your reset for 7 consecutive days for optimal results.</p>
        <p>Your completed guide may be requested as proof of participation if requesting a refund.</p>
        <p className="font-medium mt-2">© Perfect Day Reset - www.perfectdayreset.com</p>
      </div>
    </div>
  );
}