import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState } from "react";
import logoPath from "@assets/1x1_logo_for_website_which_sells_dig.png";

export default function PerfectDayResetPDF() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = () => {
    setIsGenerating(true);
    
    // Create a new window with the PDF content
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(getPDFContent());
      printWindow.document.close();
      
      // Trigger print dialog after content loads
      printWindow.onload = () => {
        printWindow.print();
        setIsGenerating(false);
      };
    } else {
      setIsGenerating(false);
    }
  };

  const getPDFContent = () => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>The Perfect Day Reset</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          background: white;
          padding: 40px;
          max-width: 210mm;
          margin: 0 auto;
        }
        
        .header {
          text-align: center;
          margin-bottom: 40px;
          border-bottom: 2px solid #10b981;
          padding-bottom: 30px;
        }
        
        .logo {
          width: 200px;
          height: auto;
          margin: 0 auto 20px;
          display: block;
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
          max-width: 100%;
          border-radius: 8px;
        }
        
        .title {
          font-size: 32px;
          font-weight: bold;
          color: #10b981;
          margin-bottom: 10px;
        }
        
        .subtitle {
          font-size: 18px;
          color: #6b7280;
          margin-bottom: 20px;
        }
        
        .quote {
          font-style: italic;
          font-size: 16px;
          color: #374151;
          background: #f9fafb;
          padding: 20px;
          border-left: 4px solid #10b981;
          margin: 20px 0;
        }
        
        .section {
          margin-bottom: 30px;
          page-break-inside: avoid;
        }
        
        .section-title {
          font-size: 28px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 30px;
          text-align: center;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          padding: 20px;
          border-radius: 12px;
        }
        
        .timeline {
          position: relative;
          margin-left: 40px;
        }
        
        .timeline::before {
          content: '';
          position: absolute;
          left: -20px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #10b981;
        }
        
        .time-block {
          position: relative;
          margin-bottom: 25px;
          padding: 20px 25px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          border: 1px solid #e5e7eb;
          margin-left: 20px;
        }
        
        .time-block::before {
          content: '';
          position: absolute;
          left: -32px;
          top: 25px;
          width: 12px;
          height: 12px;
          background: #10b981;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 0 0 2px #10b981;
        }
        
        .time-header {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
          gap: 15px;
        }
        
        .time {
          background: #10b981;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 14px;
          min-width: 100px;
          text-align: center;
        }
        
        .activity {
          font-weight: 700;
          color: #1f2937;
          font-size: 18px;
          flex: 1;
        }
        
        .description {
          color: #4b5563;
          font-size: 14px;
          line-height: 1.6;
          padding-left: 0;
        }
        
        .morning-section .time {
          background: linear-gradient(135deg, #f59e0b, #d97706);
        }
        
        .midday-section .time {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        }
        
        .afternoon-section .time {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
        }
        
        .supplement-section .time-block {
          background: linear-gradient(135deg, #ecfdf5, #f0fdf4);
          border-left: 4px solid #10b981;
        }
        
        .intro {
          background: #ecfdf5;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
          text-align: center;
        }
        
        .intro-text {
          font-size: 16px;
          color: #374151;
          margin-bottom: 15px;
        }
        
        .page-break {
          page-break-before: always;
        }
        
        @media print {
          body {
            padding: 20px;
          }
          
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <img src="${logoPath}" alt="Perfect Day Reset Logo" class="logo">
        <h1 class="title">THE PERFECT DAY RESET</h1>
        <p class="subtitle">A 1-Day Protocol to Reset Your Body, Mind & Purpose</p>
      </div>

      <div class="intro">
        <p class="intro-text">
          This guide contains your complete timeline for transformation. Follow each step mindfully, 
          and experience the power of a perfectly structured day that recharges your energy, 
          boosts mental clarity, and gets you back on track.
        </p>
      </div>

      <div class="quote">
        "The way you start your day determines how well you live your day. 
        How well you live your day determines how well you live your life." 
        — Robin Sharma
      </div>

      <div class="section morning-section">
        <h2 class="section-title">🌅 MORNING RESET (7:00 - 10:15)</h2>
        <div class="timeline">
          <div class="time-block">
            <div class="time-header">
              <div class="time">7:00</div>
              <div class="activity">Wake Up</div>
            </div>
            <div class="description">
              Use your alarm clock, not your phone. Open the windows. Take 3 deep breaths. Say: "Today, I reset."
            </div>
          </div>

          <div class="time-block">
            <div class="time-header">
              <div class="time">7:10</div>
              <div class="activity">Hydration Ritual</div>
            </div>
            <div class="description">
              Drink a large glass of warm water with lemon & a pinch of sea salt. Sit in silence for 5 minutes after drinking.
            </div>
          </div>

          <div class="time-block">
            <div class="time-header">
              <div class="time">7:20</div>
              <div class="activity">Light Movement</div>
            </div>
            <div class="description">
              10 minutes of stretching or yoga. Focus on breath. Feel your body wake up. 
              Optional: follow our short YouTube video (if offline mode is skipped): Morning Yoga Routine
            </div>
          </div>

          <div class="time-block">
            <div class="time-header">
              <div class="time">7:30</div>
              <div class="activity">Morning Grounding Walk</div>
            </div>
            <div class="description">
              30-minute walk outside without your phone. Reconnect with nature and absorb morning light.
              <br><br><strong>Why morning light exposure matters:</strong><br>
              Bright morning light advances your internal clock (earlier melatonin onset) and reduces "morning grogginess," 
              leading to deeper, more restorative sleep at night. Morning light exposure is linked to improved mood and 
              lower risk of Seasonal Affective Disorder, as it increases serotonin production and stabilizes cortisol dynamics.
              <br><br><strong>Grounding Tips & Benefits:</strong><br>
              • Walk barefoot on grass, sand, or dip your feet in water if possible<br>
              • Feel the earth beneath your feet and the air on your skin<br>
              • Face the morning sun to help reset your circadian rhythm<br>
              • Take deep breaths and notice the scents and sounds around you<br>
              • Express gratitude for this moment of connection<br>
              <br><strong>Benefits of barefoot walking:</strong> Connecting to the earth through barefoot contact allows 
              electrons from the earth's surface to transfer to your body, potentially reducing inflammation and improving sleep quality.
            </div>
          </div>

          <div class="time-block">
            <div class="time-header">
              <div class="time">8:00</div>
              <div class="activity">Mind Reset</div>
            </div>
            <div class="description">
              Write in a notebook (pen & paper — no phone):<br>
              • 3 things you're grateful for<br>
              • 1 intention for the day<br>
              • 1 affirmation (e.g., "I am clear, strong, and in control.")<br>
              • Your 3 biggest dreams in life (be specific and bold)<br>
              <br>This reflection helps align your day with your deepest values and long-term vision.
            </div>
          </div>

          <div class="time-block">
            <div class="time-header">
              <div class="time">8:30</div>
              <div class="activity">Breakfast Time (60 min)</div>
            </div>
            <div class="description">
              Omega Brain Bowl (eggs, avocado, spinach, chia seeds)<br>
              Take your time and enjoy your breakfast mindfully. Chew thoroughly and avoid screens.
              <br><strong>📋 See full breakfast recipe details below</strong>
            </div>
          </div>

          <div class="time-block">
            <div class="time-header">
              <div class="time">9:30</div>
              <div class="activity">Supplement Time</div>
            </div>
            <div class="description">
              Take your core supplements with or after food:<br>
              • Vitamin C (supports immune function)<br>
              • Vitamin D3 (enhances mood and immunity)<br>
              • Zinc (boosts immune system)<br>
              • L-Tyrosine (supports focus and mental clarity)<br>
              • Electrolytes (in a glass of water for hydration)
            </div>
          </div>

          <div class="time-block">
            <div class="time-header">
              <div class="time">10:00</div>
              <div class="activity">Integration Moment</div>
            </div>
            <div class="description">
              Sit quietly for 10 minutes. No agenda. Let your body and brain settle.
            </div>
          </div>
        </div>
      </div>

      <div class="quote page-break">
        "Energy flows where attention goes. Focus on what serves your highest good."
      </div>

      <div class="section midday-section">
        <h2 class="section-title">☀️ MIDDAY RECHARGE (10:30 - 15:30)</h2>
        <div class="timeline">
          <div class="time-block">
            <div class="time-header">
              <div class="time">10:30</div>
              <div class="activity">Light Focus Sprint</div>
            </div>
            <div class="description">
              Choose from the categories below. No phone. No multitasking. Work in full flow for 90 minutes.
              <br><br><strong>Time Management Options:</strong><br>
              • Choose one task for a deep 90-minute session<br>
              • Or select two tasks for 45 minutes each
              <br><br><strong>💭 Reflective Tasks</strong><br>
              • <strong>Guided Journaling:</strong> Reflect on personal growth or set intentions<br>
              • <strong>Mind Mapping:</strong> Visualize goals and steps to achieve them<br>
              • <strong>Gratitude List:</strong> Write down 10 things you're grateful for — big or small — to elevate mood and reframe perspective<br>
              • <strong>Life Audit:</strong> Evaluate core areas of life (health, work, relationships, finances) and note where you feel aligned or off-balance
              <br><br><strong>🎨 Creative Tasks</strong><br>
              • <strong>Artistic Expression:</strong> Engage in drawing, painting, or crafting<br>
              • <strong>Creative Writing:</strong> Write a short story or poem<br>
              • <strong>Mood Board Creation:</strong> Use magazine clippings, digital tools, or drawings to create a visual of your dream lifestyle or next big goal<br>
              • <strong>DIY or Mini Project:</strong> Build, fold origami, or make something simple from scratch (e.g., hand-written card, vision jar, small sculpture)
              <br><br><strong>💪 Productive Tasks</strong><br>
              • <strong>Organizational Sprint:</strong> Declutter a workspace or organize digital files<br>
              • <strong>Skill Development:</strong> Learn a new tool or technique relevant to personal or professional growth<br>
              • <strong>Inbox Zero Challenge:</strong> Process and archive all emails or messages for a mental clarity boost<br>
              • <strong>Future Planning Session:</strong> Sketch out the next 7–14 days in your calendar with top goals, habits, or projects — align time with intention
            </div>
          </div>

          <div class="time-block">
            <div class="time-header">
              <div class="time">12:00</div>
              <div class="activity">Midday Movement (60 Minutes)</div>
            </div>
            <div class="description">
              A full hour of intentional movement boosts endorphins, lowers cortisol, improves mood, sharpens focus, and supports metabolism.
              <br><br><strong>🧍‍♂️ No Equipment (Home or Outdoors)</strong><br>
              Move freely with bodyweight training, nature walks, or gentle flow.
              <br>• <strong>Option 1:</strong> Power Walk + Mobility Flow (30 min fast walk + 30 min stretching)<br>
              • <strong>Option 2:</strong> Bodyweight Circuit (Squats, push-ups, planks, jumping jacks)<br>
              • <strong>Option 3:</strong> Outdoor Nature Flow (Walk + lunges + yoga on grass)
              <br><br><strong>🚴 Gear-Based (Bike or Sports Equipment)</strong><br>
              If you have access to a ball, bike, or similar gear — use it with joy.
              <br>• <strong>Option 1:</strong> 60 min Bike Ride (Steady pace or intervals)<br>
              • <strong>Option 2:</strong> Solo Basketball/Football Drills (Dynamic movements and skills practice)<br>
              • <strong>Option 3:</strong> Rollerblading / Skate / Paddleboard (Any movement that brings you joy)
              <br><br><strong>🏋️ Gym Access</strong><br>
              Put your membership to good use — focus, move with intent.
              <br>• <strong>Option 1:</strong> Full-body Strength (Machines or free weights)<br>
              • <strong>Option 2:</strong> Treadmill HIIT + Core Circuit (Alternating cardio and strength)<br>
              • <strong>Option 3:</strong> Group Class (Spinning, Functional, BodyPump)
              <br><br><strong>📺 Follow-Along Video (YouTube-Based)</strong><br>
              No thinking required — follow a top trainer and sweat with ease.
              <br>• <strong>Option 1:</strong> 60-Minute Full Body Workout<br>
              • <strong>Option 2:</strong> Dynamic Yoga or Pilates Flow<br>
              • <strong>Option 3:</strong> Dance Workout
              <br><br><strong>✅ Benefits You'll Feel Instantly:</strong><br>
              • Mental clarity<br>
              • Energy boost<br>
              • Deeper sleep tonight<br>
              • Better posture & digestion<br>
              • Sense of achievement
            </div>
          </div>

          <div class="time-block">
            <div class="time-header">
              <div class="time">13:30</div>
              <div class="activity">Cold Shower Reset</div>
            </div>
            <div class="description">
              A 2-5 minute cold shower to boost circulation, mood, and immunity.
              <br><br><strong>Benefits of Cold Exposure:</strong><br>
              • Increases alertness and energy<br>
              • Reduces inflammation<br>
              • Boosts immune function<br>
              • Improves mood and mental clarity<br>
              • Enhances circulation
              <br><br><strong>Beginner's Guide:</strong><br>
              Start with a normal shower, then gradually turn temperature to cold for the last 30 seconds. 
              Each day, increase cold exposure time until you can do 2-5 minutes. Focus on controlled breathing 
              to manage the initial shock.
            </div>
          </div>

          <div class="time-block">
            <div class="time-header">
              <div class="time">14:00</div>
              <div class="activity">Lunch (60 Minutes)</div>
            </div>
            <div class="description">
              Quinoa bowl with grilled chicken, avocado, spinach, pumpkin seeds, olive oil
              <br><strong>📋 See full lunch recipe details below</strong>
            </div>
          </div>

          <div class="time-block">
            <div class="time-header">
              <div class="time">15:00</div>
              <div class="activity">Supplements (Round 2)</div>
            </div>
            <div class="description">
              Take your midday supplements to maintain focus and energy:<br>
              • Omega-3 (reduces inflammation, supports brain function)<br>
              • Magnesium (improves calm, reduces muscle tension)<br>
              • NAC (powerful antioxidant, supports detoxification)<br>
              • Ashwagandha (reduces stress, balances cortisol levels)<br>
              • Optional: small caffeine like green tea or coffee only if needed for focus
            </div>
          </div>

          <div class="time-block">
            <div class="time-header">
              <div class="time">15:15</div>
              <div class="activity">Reset Reflection</div>
            </div>
            <div class="description">
              5 minutes. Eyes closed. No music. Ask yourself: What's going well today? 
              What do I need to let go of? How do I want to show up for the second half of the day?
            </div>
          </div>
        </div>
      </div>

      <div class="section afternoon-section page-break">
        <h2 class="section-title">🌅 AFTERNOON FOCUS (15:30 - 22:00)</h2>
        <p style="text-align: center; font-style: italic; margin-bottom: 30px; color: #6b7280;">From focused work to restful sleep - your perfect day continues</p>
        <div class="timeline">
          <div class="time-block">
            <div class="time-header">
              <div class="time">15:30</div>
              <div class="activity">Mirror Task (1 Minute)</div>
            </div>
            <div class="description">
              "I'm proud of myself for showing up today. I'm kind, I'm doing my best, and I matter."
              <br><br><strong>Why:</strong> Triggers oxytocin and interrupts negative self-talk loops.
            </div>
          </div>

          <div class="time-block">
            <div class="time-header">
              <div class="time">15:35</div>
              <div class="activity">Breathing Exercise (5 Minutes)</div>
            </div>
            <div class="description">
              Center yourself with one of these powerful breathing techniques:
              <br><br><strong>Box Breathing</strong><br>
              • Inhale through nose for 4 seconds<br>
              • Hold breath for 4 seconds<br>
              • Exhale through mouth for 4 seconds<br>
              • Hold empty lungs for 4 seconds<br>
              • Repeat 5-10 times
              <br><br><strong>4-7-8 Breathing</strong><br>
              • Inhale through nose for 4 seconds<br>
              • Hold breath for 7 seconds<br>
              • Exhale completely through mouth for 8 seconds<br>
              • Repeat 4-5 times
              <br><br>Watch guided breathing exercise video
              <br><br><strong>Why:</strong> Reduces stress hormones, activates parasympathetic nervous system, improves focus
            </div>
          </div>

          <div class="time-block">
            <div class="time-header">
              <div class="time">16:00</div>
              <div class="activity">Nature Exposure (Forest Bathing / Greenspace)</div>
            </div>
            <div class="description">
              30-40 minutes exposure to green spaces or natural environments reduces stress and restores mental clarity.
              <br><br><strong>Benefits:</strong><br>
              • Reduces cortisol (stress hormone) by 10–25%<br>
              • Improves cognitive performance and working memory<br>
              • Lowers blood pressure and heart rate<br>
              • Mindful engagement enhances anxiety and depression reduction<br>
              • Benefits last for hours to days after exposure
              <br><br><strong>Why:</strong> Natural environments activate parasympathetic nervous system and reduce cognitive fatigue
            </div>
          </div>

          <div class="time-block">
            <div class="time-header">
              <div class="time">17:00</div>
              <div class="activity">Social Connection</div>
            </div>
            <div class="description">
              Strengthen bonds, feel seen and valued, and experience joy or laughter through interaction. These increase oxytocin, dopamine, and serotonin.
              <br><br><strong>🎲 Voice Note Roulette</strong><br>
              Pick 3 friends or family members and send them a quick voice note: "Hey, just wanted to send some love today — you're awesome." Bonus: Add a fun memory you shared together.
              <br><br><strong>👥 15-Minute 'Mini-Date' Challenge</strong><br>
              Call or meet one person today (can be a friend, neighbor, colleague) and: Share one good memory + ask them one deeper-than-usual question (e.g., "What's something you're excited about lately?") If they're not available, send a voice/video message instead.
              <br><br><strong>Connection Through Curiosity</strong><br>
              Message 2 people you haven't spoken to in a while and ask: "What's something unexpected that made you smile this week?" Frame it as curiosity, not obligation — people love being asked meaningful questions.
              <br><br><strong>Why:</strong> Social connection releases oxytocin and reduces stress, improving mood and emotional resilience
            </div>
          </div>

          <div class="time-block">
            <div class="time-header">
              <div class="time">17:30</div>
              <div class="activity">Act of Kindness</div>
            </div>
            <div class="description">
              Create a wave of positivity. Acts of kindness increase serotonin, endorphins, and reduce stress levels — even when observing others doing them.
              <br><br><strong>Sticky Note Ninja</strong><br>
              Write 3 kind or funny notes and leave them in public places: On bathroom mirrors, car windshields, coffee shop tables. Messages like: "You're more loved than you think." or "Hey, you're crushing it."
              <br><br><strong>Gratitude Bomb</strong><br>
              Send a thank-you message to someone who'd never expect it: Ex-boss, old teacher, friend's mom, security guard, shop owner. Be specific: "You helped me more than you knew when…"
              <br><br><strong>Make Someone's Day</strong><br>
              Send someone flowers or donate to a charity in their name. Even a small gesture can create a ripple effect of positivity. You'll experience a "helper's high" — the endorphin release from giving.
              <br><br><strong>Why:</strong> Kindness activates reward pathways in the brain, releasing dopamine and creating a positive feedback loop
            </div>
          </div>

          <div class="time-block">
            <div class="time-header">
              <div class="time">18:00</div>
              <div class="activity">Dinner Time</div>
            </div>
            <div class="description">
              Light, nourishing meal to avoid brain fog and promote restful sleep.
              <br><strong>Tip:</strong> No eating after 19:00 if possible to let your gut recover overnight.
              <br><strong>📋 See dinner options below</strong>
            </div>
          </div>

          <div class="time-block">
            <div class="time-header">
              <div class="time">19:00</div>
              <div class="activity">🔮 Create Your Vision Board</div>
            </div>
            <div class="description">
              <strong>Your Light in Picture Form</strong>
              <br><br><strong>🅰️ Paper + Pen Option (best for tactile connection):</strong><br>
              Grab paper, scissors, glue, magazines, or printouts. Write words and draw images of what you want: your dream environment, job, relationship, energy, and purpose. Don't judge. Let your soul draw it.
              <br><br><strong>🅱️ Digital Option (for those who prefer tech):</strong><br>
              Use Canva, Pinterest, or even a phone collage app. Choose 5–10 pictures that visually represent the life you want. Add powerful words like: freedom, love, discipline, clarity, peace, strength.
              <br><br><strong>🔁 Reflection</strong><br>
              "Look at your board and ask: What is one small step I can take tomorrow to walk toward this life? Write it down."
            </div>
          </div>

          <div class="time-block">
            <div class="time-header">
              <div class="time">20:45</div>
              <div class="activity">Night Supplements</div>
            </div>
            <div class="description">
              Take your evening supplements to promote relaxation and quality sleep:<br>
              • L-Theanine (promotes relaxation without drowsiness)<br>
              • Magnesium (e.g., Biomagnis B6 Premium)<br>
              • Ginkgo Biloba (improves blood circulation)<br>
              • Vitamin B12 or B Complex (supports nervous system)<br>
              • Melatonin (optional, for better sleep)<br>
              <br>Pair with calming herbal tea like chamomile, lemon balm, or ashwagandha
            </div>
          </div>

          <div class="time-block">
            <div class="time-header">
              <div class="time">21:00</div>
              <div class="activity">Gentle Movement</div>
            </div>
            <div class="description">
              Perform gentle stretching or mobility flow to relax your body before sleep:<br>
              • Neck rolls (5 each direction)<br>
              • Shoulder rolls (5 each direction)<br>
              • Light spinal twists (hold 10 seconds each side)<br>
              • Gentle forward folds to release tension
            </div>
          </div>

          <div class="time-block">
            <div class="time-header">
              <div class="time">21:15</div>
              <div class="activity">Quiet Reflection</div>
            </div>
            <div class="description">
              Write a final "3 good things" in your journal:<br>
              • One thing you're proud of today<br>
              • One thing you learned today<br>
              • One thing you're looking forward to tomorrow<br>
              <br>This practice refocuses your brain on positive experiences before sleep
            </div>
          </div>

          <div class="time-block">
            <div class="time-header">
              <div class="time">21:30</div>
              <div class="activity">Screen-Free Wind Down</div>
            </div>
            <div class="description">
              Choose one relaxing activity:<br>
              • Read a physical book (fiction/poetry)<br>
              • Practice guided imagery<br>
              • Listen to sleep meditation<br>
              • Gentle breathing exercises<br>
              <br><strong>Lights out by 22:00</strong> - phone outside the bedroom, bedside lamp on minimal setting or candle only
            </div>
          </div>
        </div>
      </div>

      <div class="quote page-break">
        "Every master was once a disaster. Every expert was once a beginner. 
        Every icon was once an unknown. Every champion was once a contender that refused to give up."
      </div>

      <div class="section supplement-section">
        <h2 class="section-title">🌟 SUPPLEMENT GUIDE</h2>
        <div class="timeline">
          <div class="time-block">
            <div class="time-header">
              <div class="time">9:30 AM</div>
              <div class="activity">Morning Supplements</div>
            </div>
            <div class="description">
              • Vitamin D3 - Supports immune function and mood<br>
              • Magnesium - Promotes muscle function and stress relief<br>
              • Vitamin B12 - Boosts energy and brain function<br>
              • Ashwagandha - Reduces stress and anxiety<br>
              • Zinc - Supports immune system and healing<br>
              • Vitamin C - Antioxidant protection and immune support
            </div>
          </div>

          <div class="time-block">
            <div class="time-header">
              <div class="time">3:00 PM</div>
              <div class="activity">Midday Supplements</div>
            </div>
            <div class="description">
              • Omega-3 - Brain health and anti-inflammatory<br>
              • Magnesium - Continued stress and muscle support<br>
              • NAC (N-Acetylcysteine) - Liver detox and antioxidant<br>
              • Ashwagandha - Sustained stress management
            </div>
          </div>

          <div class="time-block">
            <div class="time-header">
              <div class="time">8:45 PM</div>
              <div class="activity">Evening Supplements</div>
            </div>
            <div class="description">
              • L-Theanine - Promotes relaxation and calm focus<br>
              • Magnesium - Muscle relaxation and sleep quality<br>
              • Ginkgo Biloba - Supports circulation and brain health<br>
              • Vitamin B12/Complex - Evening energy balance<br>
              • Melatonin (optional) - Natural sleep hormone
            </div>
          </div>
        </div>
      </div>

      <div class="quote">
        "The groundwork for all happiness is good health." — Leigh Hunt
      </div>

      <div class="section page-break">
        <h2 class="section-title">🍽️ COMPLETE MEAL PLANS</h2>
        
        <div class="time-block">
          <div class="activity">🥩 OMNI RESET PLAN</div>
          <div class="description">
            <strong>Breakfast:</strong> Scrambled eggs with spinach, avocado, and smoked salmon<br>
            <strong>Lunch:</strong> Grilled chicken salad with mixed greens and olive oil dressing<br>
            <strong>Dinner:</strong> Baked cod with roasted vegetables and quinoa<br>
            <strong>Shopping List:</strong> Organic eggs, spinach, avocado, smoked salmon, chicken breast, mixed greens, olive oil, cod fillet, bell peppers, zucchini, quinoa
          </div>
        </div>

        <div class="time-block">
          <div class="activity">🌱 VEGETARIAN PLAN</div>
          <div class="description">
            <strong>Breakfast:</strong> Greek yogurt with berries, nuts, and chia seeds<br>
            <strong>Lunch:</strong> Lentil and vegetable soup with whole grain bread<br>
            <strong>Dinner:</strong> Stuffed bell peppers with quinoa and black beans<br>
            <strong>Shopping List:</strong> Greek yogurt, mixed berries, almonds, chia seeds, red lentils, carrots, celery, whole grain bread, bell peppers, quinoa, black beans
          </div>
        </div>

        <div class="time-block">
          <div class="activity">🌿 VEGAN PLAN</div>
          <div class="description">
            <strong>Breakfast:</strong> Smoothie bowl with banana, spinach, almond milk, and granola<br>
            <strong>Lunch:</strong> Buddha bowl with tofu, quinoa, and tahini dressing<br>
            <strong>Dinner:</strong> Vegetable stir-fry with brown rice and cashews<br>
            <strong>Shopping List:</strong> Bananas, spinach, almond milk, granola, firm tofu, quinoa, tahini, broccoli, carrots, brown rice, cashews, ginger, garlic
          </div>
        </div>

        <div class="time-block">
          <div class="activity">🌾 GLUTEN-FREE PLAN</div>
          <div class="description">
            <strong>Breakfast:</strong> Gluten-free oatmeal with fruits and nuts<br>
            <strong>Lunch:</strong> Grilled salmon with sweet potato and steamed broccoli<br>
            <strong>Dinner:</strong> Turkey meatballs with zucchini noodles<br>
            <strong>Shopping List:</strong> Gluten-free oats, mixed fruits, nuts, salmon fillet, sweet potato, broccoli, ground turkey, zucchini, tomato sauce
          </div>
        </div>

        <div class="time-block">
          <div class="activity">🥑 KETO PLAN</div>
          <div class="description">
            <strong>Breakfast:</strong> Keto coffee with MCT oil and scrambled eggs with cheese<br>
            <strong>Lunch:</strong> Avocado and bacon salad with olive oil<br>
            <strong>Dinner:</strong> Grilled steak with asparagus and butter<br>
            <strong>Shopping List:</strong> Coffee, MCT oil, eggs, cheese, avocado, bacon, mixed greens, olive oil, steak, asparagus, grass-fed butter
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">💝 FINAL THOUGHTS</h2>
        <div class="intro">
          <p class="intro-text">
            Remember, transformation happens one day at a time. Be patient with yourself, 
            trust the process, and celebrate small wins. This Perfect Day Reset is your 
            foundation for building the life you deserve.
          </p>
          <p class="intro-text">
            "You are never too old to set another goal or to dream a new dream." — C.S. Lewis
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return (
    <div className="flex flex-col items-center space-y-4">
      <Button 
        onClick={generatePDF}
        disabled={isGenerating}
        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2"
      >
        <Download className="w-5 h-5" />
        <span>{isGenerating ? "Generating PDF..." : "Download The Perfect Day Reset PDF"}</span>
      </Button>
      <p className="text-sm text-gray-600 text-center">
        Complete timeline with all activities, supplements, and motivational content
      </p>
    </div>
  );
}