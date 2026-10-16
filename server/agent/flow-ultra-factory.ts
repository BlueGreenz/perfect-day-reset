export type ViralFormatType =
  | "purple_cow_loop"
  | "trojan_horse_story"
  | "two_timelines_experiment"
  | "forensic_curiosity_hook";

export interface FlowUltraScene {
  sceneNumber: number;
  timeRange: string;
  shotType: string;
  flowUltraPrompt: string;
  onScreenText: string;
  soundCue: string;
}

export interface FlowUltraVideoPackage {
  id: string;
  archetypeId:
    | "cortisol_spiked"
    | "dopamine_depleted"
    | "metabolic_crasher"
    | "systemic_burnout";
  archetypeName: string;
  angleTitle: string;
  viralFormat: ViralFormatType;
  viralFormatLabel: string;
  targetLengthSeconds: number;
  durationSeconds: number;
  pacingRule: string;
  psychologicalAngle: string;
  aspectRatio: "9:16";
  cameraSpec: string;
  flowUltraPrompt: string;
  scenes: FlowUltraScene[];
  onScreenTextHook: {
    hook0to3s: string;
    payoff3to8s: string;
    ctaEndCard: string;
  };
  caption: string;
  commentAutoReply: string;
  dmOpeningMessage: string;
}

export type FlowUltraPackage = FlowUltraVideoPackage;

export const FLOW_ULTRA_PACKAGES: FlowUltraVideoPackage[] = [
  // ==========================================================
  // ARCHETYPE 1: CORTISOL-SPIKED HIGH PERFORMER (3 PACKAGES)
  // ==========================================================
  {
    id: "cortisol-1-ocean-desk-purple-cow",
    archetypeId: "cortisol_spiked",
    archetypeName: "Cortisol-Spiked High Performer",
    angleTitle: "The Ocean Desk Anomaly: Working With an Inverted Cortisol Curve",
    viralFormat: "purple_cow_loop",
    viralFormatLabel: "Purple Cow Loop",
    targetLengthSeconds: 12,
    durationSeconds: 12,
    pacingRule: "2-cut full-arc loop (6.0s Visual Anomaly -> 6.0s Grounded Balcony Exhale)",
    psychologicalAngle:
      "Pattern-interrupt surrealism: visualizing what 10:30 PM 'tired but wired' adrenaline actually feels like inside a high performer's nervous system.",
    aspectRatio: "9:16",
    cameraSpec:
      "35mm handheld documentary, f/1.8 shallow DOF, Kodak Vision3 250D film grain, raw natural ocean & sunrise lighting",
    flowUltraPrompt:
      "9:16 vertical video, organic 35mm handheld documentary cinematography, moody blue-hour dawn lighting, subtle film grain, shallow depth of field, zero CGI gloss. Immediate frame-0 motion: a 40-year-old executive in a tailored charcoal wool suit sits calmly typing on a brushed aluminum laptop at a solid oak desk positioned chest-deep in dark, foaming Baltic ocean waves crashing against the desk legs, salt spray catching the cold morning light, hyper-real tactile water and wet wool fabric textures.",
    scenes: [
      {
        sceneNumber: 1,
        timeRange: "0.0s – 6.0s",
        shotType: "Medium Wide Surreal Anomaly Hook",
        flowUltraPrompt:
          "9:16 vertical video, organic 35mm handheld documentary cinematography, moody blue-hour dawn lighting, subtle film grain, shallow depth of field, zero CGI gloss. Immediate frame-0 motion: a 40-year-old executive in a tailored charcoal wool suit sits calmly typing on a brushed aluminum laptop at a solid oak desk positioned chest-deep in dark, foaming ocean waves crashing against the desk legs, salt spray catching the cold morning light, hyper-real tactile water and wet wool fabric textures.",
        onScreenText: "Exhausted at 7:00 AM...\nyet wired at 10:30 PM?",
        soundCue: "Heavy ocean wave crash + rapid mechanical keyboard clicks",
      },
      {
        sceneNumber: 2,
        timeRange: "6.0s – 12.0s",
        shotType: "Close-Up Tactile Contrast Cut",
        flowUltraPrompt:
          "9:16 vertical video, organic 35mm handheld documentary close-up, warm golden sunrise light flooding across a dry solid oak table, subtle 35mm film grain, shallow depth of field. Immediate frame-0 motion: a hand sets down a tall frosted glass of mineral water with real condensation beads and dissolving sea salt crystals beside a closed laptop, then steps onto a sunlit balcony taking a slow nasal inhale, authentic skin texture. Comment RESET.",
        onScreenText:
          "Your cortisol curve is inverted.\nReset it in 24 hours (Comment RESET)",
        soundCue: "Sudden silence + crisp glass clink on wood + deep exhale",
      },
    ],
    onScreenTextHook: {
      hook0to3s: "Exhausted at 7:00 AM... yet your brain won't shut off at 10:30 PM?",
      payoff3to8s: "Your cortisol-melatonin curve is inverted. Reset it in 24 intentional hours.",
      ctaEndCard: "Comment RESET for the 60-Second Cortisol Diagnostic ⚡",
    },
    caption:
      "When your cortisol-melatonin curve is inverted, sitting at your desk at 9:00 AM feels like trying to answer emails chest-deep in rough surf. When I was Head of Sales at BMW, I used to lie awake at 11 PM replaying meetings—then wake up at 6:30 AM feeling hit by a truck. You don't fix that with a 30-day challenge; you fix it in 24 structured hours. Comment RESET and I'll send you our free 60-second Burnout & Cortisol Diagnostic.",
    commentAutoReply:
      "Just sent the 60-Second Cortisol & Energy Diagnostic to your DMs! Check your message requests ⚡",
    dmOpeningMessage:
      "Hey! Reiko's team here 👋 Thanks for commenting RESET. Take your free 60-Second Cortisol & Energy Diagnostic here → https://perfectdayreset.com/quiz — it maps your inverted cortisol curve and builds a custom 24-hour reset schedule around your exact wake time.",
  },
  {
    id: "cortisol-2-bmw-m5-trojan-horse",
    archetypeId: "cortisol_spiked",
    archetypeName: "Cortisol-Spiked High Performer",
    angleTitle: "The €145,000 BMW M5 Buyer Who Almost Fell Asleep Signing the Contract",
    viralFormat: "trojan_horse_story",
    viralFormatLabel: "BMW Trojan Horse Story",
    targetLengthSeconds: 28,
    durationSeconds: 28,
    pacingRule: "Cut every 2.0s–3.0s across 5 cinematic narrative scenes",
    psychologicalAngle:
      "Status-contrarian Trojan Horse story: hooks viewers with an insider BMW dealership story before pivoting to high-performer nervous system burnout.",
    aspectRatio: "9:16",
    cameraSpec:
      "35mm anamorphic documentary storytelling, f/1.8 shallow DOF, dealership glass reflections to warm morning sunlight",
    flowUltraPrompt:
      "9:16 vertical video, 35mm documentary realism, cool twilight showroom lighting reflecting off a matte black performance sedan hood, subtle film grain, shallow depth of field. Immediate frame-0 motion: a 41-year-old founder in an expensive navy cashmere blazer rubs his bloodshot eyes while holding a heavy Montblanc pen over a leather contract folder on a glass desk, hand trembling slightly from caffeine and exhaustion.",
    scenes: [
      {
        sceneNumber: 1,
        timeRange: "0.0s – 5.5s",
        shotType: "Showroom Over-the-Shoulder Hook",
        flowUltraPrompt:
          "9:16 vertical video, 35mm documentary realism, cool twilight showroom lighting reflecting off a matte black luxury performance sedan hood, subtle film grain, shallow depth of field. Immediate frame-0 motion: a 41-year-old founder in an expensive navy cashmere blazer rubs his bloodshot eyes while holding a heavy Montblanc pen over a leather contract folder on a glass desk.",
        onScreenText:
          "A 41-year-old founder wired €145,000 cash for a new BMW M5—and almost fell asleep signing the contract.",
        soundCue: "Low showroom ambiance + heavy pen click",
      },
      {
        sceneNumber: 2,
        timeRange: "5.5s – 11.0s",
        shotType: "Macro Espresso & Trembling Hand",
        flowUltraPrompt:
          "9:16 vertical video, 35mm macro documentary shot, shallow depth of field, natural showroom side light. Immediate frame-0 motion: a third double espresso in a porcelain cup is placed beside a buzzing smartphone with 47 unread notifications; the founder stares blankly at the dark coffee surface reflecting his tired face.",
        onScreenText: "He was drinking 4 espressos before noon just to feel normal.",
        soundCue: "Phone vibration hum + espresso cup clink",
      },
      {
        sceneNumber: 3,
        timeRange: "11.0s – 16.5s",
        shotType: "Nighttime Steering Wheel Reflection",
        flowUltraPrompt:
          "9:16 vertical video, 35mm handheld interior car shot at night, amber dashboard glow and passing streetlamps across leather steering wheel, shallow depth of field, authentic film grain. Immediate frame-0 motion: the executive sits parked in his driveway at 10:45 PM, engine off, staring through the windshield unable to turn off his racing mind.",
        onScreenText: " He bought his dream car—but his nervous system was too fried to enjoy driving it.",
        soundCue: "Engine ticking as it cools + muffled city night rain",
      },
      {
        sceneNumber: 4,
        timeRange: "16.5s – 22.5s",
        shotType: "Morning Sunlight & Mineral Hydration Pivot",
        flowUltraPrompt:
          "9:16 vertical video, 35mm handheld documentary cinematography, crisp golden 7:00 AM sunrise flooding a minimalist wooden kitchen, subtle film grain. Immediate frame-0 motion: coarse sea salt and fresh lemon drop into a tall glass of cold filtered water as the executive steps barefoot onto a sunlit terrace, phone left inside.",
        onScreenText: "You don't fix HPA-axis burnout with a 30-day challenge. You need 1 engineered 24-hour reset.",
        soundCue: "Crisp water pour + morning birdsong",
      },
      {
        sceneNumber: 5,
        timeRange: "22.5s – 28.0s",
        shotType: "Direct-to-Lens Calm Authority Payoff",
        flowUltraPrompt:
          "9:16 vertical video, 35mm documentary medium close-up, warm morning window light, shallow depth of field, tactile merino wool sweater and oak desk with journal. Immediate frame-0 motion: a rested, sharp executive closes his leather notebook with a calm smile and looks toward the sunlit window.",
        onScreenText: "Comment RESET for the free 60-Second Burnout & Cortisol Diagnostic ⚡",
        soundCue: "Crisp leather notebook close + warm acoustic chord",
      },
    ],
    onScreenTextHook: {
      hook0to3s:
        "A 41-year-old founder wired €145,000 cash for a BMW M5—and almost fell asleep signing the contract.",
      payoff3to8s:
        "He didn't need another 30-day challenge. He needed one engineered 24-hour nervous system reset.",
      ctaEndCard: "Comment RESET for the 60-Second Burnout Diagnostic ⚡",
    },
    caption:
      "When I was Head of Sales for Inchcape Motors BMW, I watched a 41-year-old founder buy a €145,000 BMW M5 in cash—and he was so burned out he could barely keep his eyes open signing the handover papers. He told me: 'Reiko, I have the car I wanted at 20, and I haven't felt rested in 3 years.' That moment is why I built the Perfect Day Reset. Not a rigid 30-day challenge that 85% quit by Day 4—one engineered 24-hour protocol to reset your cortisol, glucose, and sleep. Comment RESET and I'll send you our free 60-second Diagnostic.",
    commentAutoReply:
      "Just sent the 60-Second Burnout & Cortisol Diagnostic to your DMs! Check your message requests ⚡",
    dmOpeningMessage:
      "Hey! Reiko's team here 👋 Thanks for commenting RESET on the BMW story. Take our free 60-Second Burnout & Cortisol Diagnostic here → https://perfectdayreset.com/quiz — it maps your exact energy bottleneck and builds your custom 24-hour reset timeline.",
  },
  {
    id: "cortisol-3-coffee-first-forensic-hook",
    archetypeId: "cortisol_spiked",
    archetypeName: "Cortisol-Spiked High Performer",
    angleTitle: "Forensic Breakdown: Why 06:45 AM Espresso Borrows Adrenaline From 2:00 PM",
    viralFormat: "forensic_curiosity_hook",
    viralFormatLabel: "Forensic Curiosity Hook",
    targetLengthSeconds: 20,
    durationSeconds: 20,
    pacingRule: "Cut every 2.2s across 3 physiological forensic shots",
    psychologicalAngle:
      "Contrarian biological mechanism: exposes why early caffeine blocks adenosine clearance and causes the afternoon crash.",
    aspectRatio: "9:16",
    cameraSpec:
      "35mm macro-to-medium documentary, high-contrast morning kitchen side light, tactile ceramic & glass",
    flowUltraPrompt:
      "9:16 vertical video, 35mm macro documentary cinematography, dramatic early-morning side window light across a dark matte stone countertop, subtle film grain. Immediate frame-0 motion: black espresso overflows the rim of a white ceramic cup in slow motion like dark oil across a paper daily schedule at 06:45 AM.",
    scenes: [
      {
        sceneNumber: 1,
        timeRange: "0.0s – 6.5s",
        shotType: "Macro Overflowing Espresso Anomaly",
        flowUltraPrompt:
          "9:16 vertical video, 35mm macro documentary cinematography, dramatic early-morning side window light across a dark matte stone countertop, subtle film grain. Immediate frame-0 motion: dark crema espresso overflows the rim of a minimalist ceramic cup in slow motion across a paper daily calendar marked 06:45 AM.",
        onScreenText: "Drinking espresso within 15 minutes of waking doesn't give you energy.",
        soundCue: "High-pressure espresso hiss + low sub-bass drop",
      },
      {
        sceneNumber: 2,
        timeRange: "6.5s – 13.5s",
        shotType: "Hand Swap: Espresso to Mineral Carafe",
        flowUltraPrompt:
          "9:16 vertical video, 35mm handheld medium close-up, bright natural morning light, shallow depth of field. Immediate frame-0 motion: a hand slides the dark espresso cup out of frame and pulls forward a frosted glass carafe of filtered water with coarse sea salt crystals swirling in golden sunlight.",
        onScreenText: "It traps morning adenosine and triggers a 2:15 PM adrenaline crash.",
        soundCue: "Ceramic slide on stone + crisp water swirl",
      },
      {
        sceneNumber: 3,
        timeRange: "13.5s – 20.0s",
        shotType: "Balcony Morning Light Anchor",
        flowUltraPrompt:
          "9:16 vertical video, 35mm documentary tracking shot, warm golden sunrise, subtle film grain. Immediate frame-0 motion: an athletic 38-year-old founder steps onto a wooden balcony with mineral water, squinting into natural morning sunbeams before taking a calm breath.",
        onScreenText: "Delay caffeine 90 mins + mineral water first. Comment RESET for your schedule ⚡",
        soundCue: "Warm ambient swell + deep nasal breath",
      },
    ],
    onScreenTextHook: {
      hook0to3s: "Stop drinking coffee within 15 minutes of waking up.",
      payoff3to8s: "Hydrate with minerals + 10 mins of daylight first to stop the 2 PM adrenaline crash.",
      ctaEndCard: "Comment RESET for your custom Wake-Time Schedule →",
    },
    caption:
      "Pouring caffeine onto a dehydrated nervous system at 6:45 AM doesn't give you energy—it borrows adrenaline from your afternoon. Inside our 24-Hour Reset, we sequence 500ml mineral hydration and 10 minutes of natural light before your first coffee so your cortisol peaks cleanly without the jittery crash. Comment RESET and I'll send you our free 60-second Burnout & Cortisol Diagnostic.",
    commentAutoReply:
      "Sent your custom morning hydration + wake-time diagnostic link to your DMs! ⚡",
    dmOpeningMessage:
      "Hey! Thanks for commenting RESET 👋 Here is your free 60-Second Reset Diagnostic → https://perfectdayreset.com/quiz — pick your wake time (06:00–09:00) and see your exact morning hydration & caffeine timing window.",
  },

  // ==========================================================
  // ARCHETYPE 2: DOPAMINE-DEPLETED MULTITASKER (3 PACKAGES)
  // ==========================================================
  {
    id: "dopamine-1-highway-bed-purple-cow",
    archetypeId: "dopamine_depleted",
    archetypeName: "Dopamine-Depleted Multitasker",
    angleTitle: "The Highway Bed Anomaly: What Checking Slack at 06:30 AM Does to Your Brain",
    viralFormat: "purple_cow_loop",
    viralFormatLabel: "Purple Cow Loop",
    targetLengthSeconds: 7,
    durationSeconds: 7,
    pacingRule: "2-cut surreal visual metaphor loop (3.5s Anomaly -> 3.5s Sanctuary)",
    psychologicalAngle:
      "Visualizes the neurological shock of inviting 100 people into your bedroom via smartphone notifications before your feet hit the floor.",
    aspectRatio: "9:16",
    cameraSpec: "35mm handheld documentary, f/2.0, motion-blurred traffic vs. still linen bedroom",
    flowUltraPrompt:
      "9:16 vertical video, organic 35mm handheld documentary cinematography, early dawn twilight, subtle film grain, zero CGI look. Immediate frame-0 motion: a wooden bed with rumpled white flax linen sheets sits directly in the center median of a busy city avenue as motion-blurred headlights and commuters streak past on both sides while a tired executive lies under the covers staring at a glowing smartphone screen.",
    scenes: [
      {
        sceneNumber: 1,
        timeRange: "0.0s – 3.5s",
        shotType: "Surreal Highway Bedroom Wide Hook",
        flowUltraPrompt:
          "9:16 vertical video, organic 35mm handheld documentary cinematography, early dawn twilight, subtle film grain, zero CGI look. Immediate frame-0 motion: a wooden bed with rumpled white flax linen sheets sits in the middle of a busy city street as motion-blurred headlights streak past on both sides while a tired executive lies under the covers staring at a glowing smartphone screen.",
        onScreenText: "Checking Slack in bed at 6:30 AM is like sleeping in the middle of rush-hour traffic.",
        soundCue: "Rushing highway traffic whoosh + notification pings",
      },
      {
        sceneNumber: 2,
        timeRange: "3.5s – 7.0s",
        shotType: "Quiet Sunlit Blinds Payoff Cut",
        flowUltraPrompt:
          "9:16 vertical video, organic 35mm handheld documentary close-up, silent sunlit bedroom, warm golden morning rays through wooden blinds, subtle film grain. Immediate frame-0 motion: a hand flips a smartphone face-down onto a walnut nightstand and pulls open wooden blinds to flood the room with warm morning sunlight.",
        onScreenText: "Protect your first 45 mins. Reclaim 4 hours of focus (Comment RESET)",
        soundCue: "Instant dead silence + wooden blinds click + calm exhale",
      },
    ],
    onScreenTextHook: {
      hook0to3s: "Checking notifications in bed hijacks your prefrontal cortex before your feet hit the floor.",
      payoff3to8s: "Protect your first 45 minutes. Reclaim 4 hours of deep focus.",
      ctaEndCard: "Comment RESET for the 60-Second Focus Diagnostic ⚡",
    },
    caption:
      "When you check Slack, email, or news within 5 minutes of waking, you invite rush-hour traffic straight into your bedroom—flooding your prefrontal cortex with cheap dopamine micro-spikes before your feet even touch the floor. Our 24-Hour Reset gives you a structured 45-minute phone-free morning anchor that restores laser focus in a single day. Comment RESET and I'll send you our free 60-second Diagnostic.",
    commentAutoReply:
      "Sent your 60-Second Dopamine & Focus Diagnostic link to your DMs! ⚡",
    dmOpeningMessage:
      "Hey! Thanks for commenting RESET 👋 Take our free 60-Second Diagnostic here → https://perfectdayreset.com/quiz — it diagnoses Dopamine Receptor Fatigue and maps a custom 24-hour phone-free morning schedule around your wake time.",
  },
  {
    id: "dopamine-2-two-executives-ab-timeline",
    archetypeId: "dopamine_depleted",
    archetypeName: "Dopamine-Depleted Multitasker",
    angleTitle: "Executive A vs. Executive B: How 06:30–08:00 AM Decides Your 2:00 PM Focus",
    viralFormat: "two_timelines_experiment",
    viralFormatLabel: "A/B Timeline Experiment",
    targetLengthSeconds: 25,
    durationSeconds: 25,
    pacingRule: "Cut every 2.0s alternating Timeline A (Reactive) vs. Timeline B (Reset)",
    psychologicalAngle:
      "Side-by-side behavioral contrast: shows how 3 tiny choices in the first 90 minutes create two completely different workdays.",
    aspectRatio: "9:16",
    cameraSpec: "35mm documentary cinematography, cool blue tungsten vs. warm golden daylight",
    flowUltraPrompt:
      "9:16 vertical video, 35mm documentary realism, cool blue dawn light in a dark bedroom, shallow depth of field. Immediate frame-0 motion: a fatigued executive squints at a harsh blue smartphone screen on his pillow at 06:32 AM while rubbing his temples.",
    scenes: [
      {
        sceneNumber: 1,
        timeRange: "0.0s – 6.0s",
        shotType: "Timeline A (06:30 AM): Doomscrolling + Immediate Coffee",
        flowUltraPrompt:
          "9:16 vertical video, 35mm documentary realism, cool blue dawn light in a dark bedroom, shallow depth of field. Immediate frame-0 motion: a fatigued executive squints at a harsh blue smartphone screen on his pillow at 06:32 AM, then gulps black coffee while standing over a kitchen sink.",
        onScreenText: "EXECUTIVE A (06:30 AM): 20 mins of Slack in bed + espresso on an empty stomach.",
        soundCue: "Rapid notification chimes + tense ticking clock",
      },
      {
        sceneNumber: 2,
        timeRange: "6.0s – 12.0s",
        shotType: "Timeline B (06:30 AM): Phone-Free Mineral Water + Daylight",
        flowUltraPrompt:
          "9:16 vertical video, 35mm documentary realism, warm golden sunrise light on a wooden balcony, shallow depth of field. Immediate frame-0 motion: a calm executive drinks a tall glass of mineral water with lemon while looking out at morning trees, phone nowhere in sight.",
        onScreenText: "EXECUTIVE B (06:30 AM): Phone in kitchen + 500ml mineral water + 10m daylight.",
        soundCue: "Deep breath + calm morning acoustic pulse",
      },
      {
        sceneNumber: 3,
        timeRange: "12.0s – 18.5s",
        shotType: "Timeline A at 2:15 PM: 37 Open Tabs & Brain Fog Crash",
        flowUltraPrompt:
          "9:16 vertical video, 35mm handheld over-the-shoulder office shot, harsh overhead fluorescent light, shallow depth of field. Immediate frame-0 motion: Executive A slumps in his chair staring unfocused at a laptop screen crowded with 37 browser tabs and an empty energy drink can.",
        onScreenText: "2:15 PM RESULT: Executive A hits a dopamine & glucose wall.",
        soundCue: "Low muffled hum + frustrated sigh",
      },
      {
        sceneNumber: 4,
        timeRange: "18.5s – 25.0s",
        shotType: "Timeline B at 2:15 PM: Deep Flow & Single-Task Clarity",
        flowUltraPrompt:
          "9:16 vertical video, 35mm handheld documentary shot, bright natural window light over a clean solid ash wood desk, subtle film grain. Immediate frame-0 motion: Executive B checks off a bold priority on a heavy white index card with a fountain pen and closes his laptop with calm energy.",
        onScreenText: "Executive B finishes 6 hours of work in 3. Comment RESET for Timeline B ⚡",
        soundCue: "Crisp pen stroke + laptop close click",
      },
    ],
    onScreenTextHook: {
      hook0to3s: "Two executives wake up at 6:30 AM. By 2:15 PM, one is fried and one is in flow.",
      payoff3to8s: "The difference isn't willpower—it's 3 micro-anchors between 06:30 and 08:00 AM.",
      ctaEndCard: "Comment RESET to get the Timeline B 24-Hour Protocol ⚡",
    },
    caption:
      "Two founders wake up at 06:30 AM with the exact same workload. Executive A checks Slack in bed and drinks espresso on an empty stomach—and crashes into brain fog by 2:15 PM. Executive B runs the Perfect Day Reset sequence: 500ml mineral water, 10 minutes of optic daylight, and a 45-minute phone-free deep focus block. Comment RESET and I'll send you our free 60-second Diagnostic to build your Timeline B schedule.",
    commentAutoReply:
      "Just DMed you the 60-Second Timeline B Diagnostic link! Check your messages ⚡",
    dmOpeningMessage:
      "Hey! Reiko's team here 👋 Here is your free 60-Second Focus & Burnout Diagnostic → https://perfectdayreset.com/quiz — see how the 24-Hour Reset builds your custom Timeline B schedule.",
  },
  {
    id: "dopamine-3-midday-forest-reboot",
    archetypeId: "dopamine_depleted",
    archetypeName: "Dopamine-Depleted Multitasker",
    angleTitle: "Why a 3rd Coffee at 2:00 PM Fails (And the 15-Minute NSDR + Walk Alternative)",
    viralFormat: "forensic_curiosity_hook",
    viralFormatLabel: "Forensic Curiosity Hook",
    targetLengthSeconds: 19,
    durationSeconds: 19,
    pacingRule: "Cut every 2.2s from cluttered desk to sunlit pine trail",
    psychologicalAngle:
      "Replaces the afternoon caffeine crutch with optic-flow walking + 4-7-8 breathwork from 35+ years of competitive sports recovery.",
    aspectRatio: "9:16",
    cameraSpec: "35mm handheld documentary, sunlit Nordic pine trail, natural lens flare",
    flowUltraPrompt:
      "9:16 vertical video, organic 35mm handheld documentary cinematography, dappled midday sunlight filtering through tall Nordic pine trees onto a needle-covered trail, subtle 35mm film grain, shallow depth of field. Immediate frame-0 motion: a fit 40-year-old executive walks briskly without headphones or phone, pausing in a beam of golden sunlight for a deep 4-7-8 nasal breath.",
    scenes: [
      {
        sceneNumber: 1,
        timeRange: "0.0s – 6.0s",
        shotType: "Close-Up: Rejecting the 2:00 PM 3rd Coffee",
        flowUltraPrompt:
          "9:16 vertical video, 35mm handheld close-up, office kitchen counter at 2:00 PM, shallow depth of field. Immediate frame-0 motion: a hand reaches for an espresso machine button, stops mid-air, sets the empty mug down, and picks up a lightweight merino jacket instead.",
        onScreenText: "Stop reaching for a 3rd cup of coffee at 2:00 PM.",
        soundCue: "Espresso machine hum cut short + jacket zip",
      },
      {
        sceneNumber: 2,
        timeRange: "6.0s – 13.0s",
        shotType: "Tracking Shot: Optic-Flow Sunlit Walk",
        flowUltraPrompt:
          "9:16 vertical video, organic 35mm handheld documentary cinematography, dappled midday sunlight filtering through tall pine trees onto a trail, subtle film grain. Immediate frame-0 motion: tracking medium shot of a fit 40-year-old walking briskly without phone or earbuds, shoulders dropping as sunlight catches the trees.",
        onScreenText: "15 mins of panoramic outdoor walking + 4-7-8 breath clears prefrontal fatigue.",
        soundCue: "Footsteps on pine needles + deep rhythmic breath",
      },
      {
        sceneNumber: 3,
        timeRange: "13.0s – 19.0s",
        shotType: "Afternoon Desk Return with Clean Focus",
        flowUltraPrompt:
          "9:16 vertical video, 35mm handheld medium shot, bright afternoon window light over an oak desk. Immediate frame-0 motion: the executive sits down refreshed, pours cold sparkling mineral water, and types with effortless speed.",
        onScreenText: "Restore your afternoon dopamine in 1 day (Comment RESET)",
        soundCue: "Sparkling water fizz + crisp keyboard flow",
      },
    ],
    onScreenTextHook: {
      hook0to3s: "Instead of a 3rd cup of coffee at 2:00 PM, do this 15-minute nervous system reset.",
      payoff3to8s: "Brisk outdoor walk + 4-7-8 breathwork + thermal rinse = clean afternoon dopamine.",
      ctaEndCard: "Comment RESET to test your Energy Archetype ⚡",
    },
    caption:
      "After 35+ years in competitive sports, the biggest lesson I brought into the executive world is that you cannot push high cognitive output for 10 straight hours without a midday nervous system flush. Phase 2 of the Perfect Day Reset pairs a brisk outdoor walk with guided 4-7-8 breathwork so your afternoon feels as sharp as 8:00 AM. Comment RESET and I'll send you our free 60-second Burnout & Cortisol Diagnostic.",
    commentAutoReply:
      "Sent the 60-Second Energy Archetype Diagnostic straight to your DMs! ⚡",
    dmOpeningMessage:
      "Hey! 👋 Thanks for commenting RESET. Take the free 60-Second Diagnostic here → https://perfectdayreset.com/quiz to get your custom Midday Recharge & Dopamine Reset timeline.",
  },

  // ==========================================================
  // ARCHETYPE 3: METABOLIC MIDDAY CRASHER (3 PACKAGES)
  // ==========================================================
  {
    id: "metabolic-1-conference-table-purple-cow",
    archetypeId: "metabolic_crasher",
    archetypeName: "Metabolic Midday Crasher",
    angleTitle: "The 2:15 PM Glucose Cliff: Why Client Pasta Lunches Destroy Executive Focus",
    viralFormat: "purple_cow_loop",
    viralFormatLabel: "Purple Cow Loop",
    targetLengthSeconds: 8,
    durationSeconds: 8,
    pacingRule: "2-cut visual shock loop (4.0s Midday Slump Anomaly -> 4.0s Anti-Crash Fuel)",
    psychologicalAngle:
      "Exposes reactive hypoglycemia as the hidden cause of 2:00 PM brain fog—even when you slept 8 hours.",
    aspectRatio: "9:16",
    cameraSpec: "35mm handheld culinary & executive documentary, f/1.8, natural side daylight",
    flowUltraPrompt:
      "9:16 vertical video, organic 35mm handheld documentary cinematography, harsh 2:15 PM glass boardroom light, subtle film grain, shallow depth of field. Immediate frame-0 motion: a wall clock ticks to 2:15 PM as three executives in tailored suits simultaneously rest their heads flat on a polished walnut conference table beside half-eaten white-bread sandwich plates and iced lattes.",
    scenes: [
      {
        sceneNumber: 1,
        timeRange: "0.0s – 4.0s",
        shotType: "Surreal Boardroom 2:15 PM Slump Hook",
        flowUltraPrompt:
          "9:16 vertical video, organic 35mm handheld documentary cinematography, 2:15 PM glass boardroom light, subtle film grain, shallow depth of field. Immediate frame-0 motion: three executives in tailored suits simultaneously rest their foreheads flat on a polished walnut conference table beside empty pasta and sandwich plates while a presentation screen flickers behind them.",
        onScreenText: "Crashing hard at 2:15 PM even when you slept 8 hours?",
        soundCue: "Power-down synth drop + muffled boardroom hum",
      },
      {
        sceneNumber: 2,
        timeRange: "4.0s – 8.0s",
        shotType: "Macro Anti-Crash Salmon & Avocado Bowl Cut",
        flowUltraPrompt:
          "9:16 vertical video, organic 35mm handheld culinary documentary close-up, bright natural window light over a rustic wood table, subtle film grain. Immediate frame-0 motion: fresh lemon juice and extra-virgin olive oil are squeezed over crisp-skin wild grilled salmon, ripe avocado slices, and toasted pumpkin seeds in a matte stoneware bowl.",
        onScreenText: "It's reactive hypoglycemia. Get the 5-Diet Reset Menu (Comment RESET)",
        soundCue: "Crisp citrus squeeze + sizzling whole-food texture",
      },
    ],
    onScreenTextHook: {
      hook0to3s: "Crashing hard at 2:15 PM even when you slept 8 hours?",
      payoff3to8s: "Your lunch glucose spike is starving your brain of afternoon ATP.",
      ctaEndCard: "Comment RESET for your custom 5-Diet Reset Menu ⚡",
    },
    caption:
      "The 2:15 PM brain fog cliff isn't caused by working too hard—it's reactive hypoglycemia from rushed, carb-heavy lunches and dehydrated mornings. Inside the Perfect Day Reset portal, you choose from 5 whole-food nutrition tracks (Omnivore, Vegetarian, Keto, Paleo, or Vegan) with 15-minute anti-crash meals and a 1-click grocery list. Comment RESET and I'll send you our free 60-second Burnout & Cortisol Diagnostic.",
    commentAutoReply:
      "Just sent the 60-Second Diagnostic + 5-Diet Reset Menu preview to your DMs! ⚡",
    dmOpeningMessage:
      "Hey! Reiko's team here 👋 Take the free 60-Second Diagnostic here → https://perfectdayreset.com/quiz — choose your preferred nutrition track (Omni, Veg, Keto, Paleo, or Vegan) and see your exact 3 anti-crash meals!",
  },
  {
    id: "metabolic-2-five-nutrition-tracks-ab",
    archetypeId: "metabolic_crasher",
    archetypeName: "Metabolic Midday Crasher",
    angleTitle: "3-Hour Sunday Meal Prep vs. 15-Minute Anti-Crash Reset Meals",
    viralFormat: "two_timelines_experiment",
    viralFormatLabel: "A/B Timeline Experiment",
    targetLengthSeconds: 24,
    durationSeconds: 24,
    pacingRule: "Cut every 2.0s contrasting 22-ingredient chaos vs. 15-minute Omega Brain Bowl",
    psychologicalAngle:
      "Removes the #1 dietary objection ('I don't have time to cook complicated meals') by showing 15-minute 5-ingredient whole-food plates.",
    aspectRatio: "9:16",
    cameraSpec: "35mm handheld kitchen documentary, warm morning sunlight, cast iron & stoneware",
    flowUltraPrompt:
      "9:16 vertical video, organic 35mm handheld documentary cinematography, warm morning sunlight streaming across a butcher-block counter, subtle film grain, shallow depth of field. Immediate frame-0 motion: a wooden spoon plates pasture-raised eggs with rich orange yolks, wilted baby spinach, and halved ripe avocado from a cast-iron skillet into a handmade ceramic bowl.",
    scenes: [
      {
        sceneNumber: 1,
        timeRange: "0.0s – 6.0s",
        shotType: "Cluttered Counter: Why 20-Ingredient Meal Prep Fails",
        flowUltraPrompt:
          "9:16 vertical video, 35mm handheld kitchen shot, harsh overhead light. Immediate frame-0 motion: an overwhelmed professional stares at a kitchen counter piled with 18 plastic Tupperware containers, complex recipe printouts, and unwashed pots.",
        onScreenText: "Why do 85% of people quit wellness meal plans by Wednesday?",
        soundCue: "Clattering plastic containers + sigh",
      },
      {
        sceneNumber: 2,
        timeRange: "6.0s – 12.0s",
        shotType: "Cast-Iron 15-Minute Omega Brain Bowl",
        flowUltraPrompt:
          "9:16 vertical video, organic 35mm handheld documentary cinematography, warm morning sunlight across a butcher-block counter, shallow depth of field. Immediate frame-0 motion: pasture-raised eggs, wilted spinach, and ripe avocado are plated from a warm cast-iron pan into a ceramic dish in 15 minutes.",
        onScreenText: "Because high performers need 15-minute, 5-ingredient anti-crash fuel.",
        soundCue: "Gentle cast-iron sizzle + ceramic plating",
      },
      {
        sceneNumber: 3,
        timeRange: "12.0s – 18.0s",
        shotType: "5 Customizable Tracks (Omni, Veg, Keto, Paleo, Vegan)",
        flowUltraPrompt:
          "9:16 vertical video, 35mm overhead-to-angle documentary shot, natural daylight, rustic oak table. Immediate frame-0 motion: a hand taps a clean meal-track selector on a phone beside a vibrant Mediterranean grilled salmon & olive oil bowl and a tall glass of lemon water.",
        onScreenText: "Switch seamlessly between Omni, Veg, Keto, Paleo & Vegan inside your portal.",
        soundCue: "Soft UI tap + crisp fork clink",
      },
      {
        sceneNumber: 4,
        timeRange: "18.0s – 24.0s",
        shotType: "Afternoon Energy Payoff",
        flowUltraPrompt:
          "9:16 vertical video, 35mm handheld medium shot, sunlit study at 3:30 PM. Immediate frame-0 motion: the founder works standing at an adjustable oak desk with steady, calm focus and zero afternoon slump.",
        onScreenText: "Comment RESET to preview your custom 24-Hour Meal Track ⚡",
        soundCue: "Upbeat acoustic finish",
      },
    ],
    onScreenTextHook: {
      hook0to3s: "Hate complicated 20-ingredient meal prep?",
      payoff3to8s: "Every meal in the 24-Hour Reset takes 15 minutes and stabilizes blood sugar all day.",
      ctaEndCard: "Comment RESET to preview your Nutrition Track ⚡",
    },
    caption:
      "Most wellness plans fail because they expect you to spend 3 hours on Sunday cooking 22-ingredient recipes you don't even enjoy. We built 5 simple, 15-minute whole-food tracks inside the Perfect Day Reset (Omni, Veg, Keto, Paleo, Vegan) with a 1-click printable grocery list. Comment RESET and I'll send you our free 60-second Burnout & Cortisol Diagnostic.",
    commentAutoReply:
      "Sent your 60-Second Diagnostic + 15-Minute Meal Track preview to your DMs! ⚡",
    dmOpeningMessage:
      "Hey! 👋 Thanks for commenting RESET. Preview your custom 15-minute meal track (Omni, Veg, Keto, Paleo, or Vegan) in our 60-Second Diagnostic here → https://perfectdayreset.com/quiz",
  },
  {
    id: "metabolic-3-executive-dining-trojan-horse",
    archetypeId: "metabolic_crasher",
    archetypeName: "Metabolic Midday Crasher",
    angleTitle: "How I Survived 3-Hour Executive Client Lunches Without the 3:00 PM Coma",
    viralFormat: "trojan_horse_story",
    viralFormatLabel: "BMW Trojan Horse Story",
    targetLengthSeconds: 26,
    durationSeconds: 26,
    pacingRule: "Cut every 2.2s across 4 executive restaurant & travel scenes",
    psychologicalAngle:
      "Shows busy executives how to stay in metabolic reset mode at restaurants, airports, and client meetings using the Protein-First + Electrolyte rule.",
    aspectRatio: "9:16",
    cameraSpec: "35mm handheld documentary, sunlit bistro window table, crystal glassware & navy blazer",
    flowUltraPrompt:
      "9:16 vertical video, organic 35mm handheld documentary cinematography, natural afternoon sunlight through a tall European bistro window onto a crisp white linen table, subtle film grain, shallow depth of field. Immediate frame-0 motion: a waiter sets down sparkling mineral water with fresh lime and a grilled herb sea bass & avocado plate in front of an executive in a tailored navy blazer.",
    scenes: [
      {
        sceneNumber: 1,
        timeRange: "0.0s – 6.5s",
        shotType: "Bistro Bread Basket Rejection Hook",
        flowUltraPrompt:
          "9:16 vertical video, 35mm handheld close-up, sunlit restaurant table with white linen, shallow depth of field. Immediate frame-0 motion: a waiter places a warm bread basket on the table; a calm executive in a navy blazer politely gestures it away and pours sparkling mineral water over fresh lime.",
        onScreenText: "The #1 mistake executives make at client lunches isn't what they order—it's the first 5 minutes.",
        soundCue: "Restaurant clink + sparkling water pour",
      },
      {
        sceneNumber: 2,
        timeRange: "6.5s – 13.0s",
        shotType: "Protein & Fiber First Plating",
        flowUltraPrompt:
          "9:16 vertical video, 35mm culinary documentary medium shot, natural window light. Immediate frame-0 motion: grilled herb chicken, olive oil greens, and avocado are served on white porcelain while the executive stays sharp and engaged in conversation.",
        onScreenText: "Order protein + greens first. Flatten the post-lunch insulin spike by 60%.",
        soundCue: "Subtle cutlery clink + warm ambient conversation",
      },
      {
        sceneNumber: 3,
        timeRange: "13.0s – 19.5s",
        shotType: "10-Minute Post-Meal Sunlight Walk",
        flowUltraPrompt:
          "9:16 vertical video, 35mm handheld tracking shot, tree-lined city sidewalk in afternoon sun, shallow depth of field. Immediate frame-0 motion: the executive walks briskly for 10 minutes after lunch, jacket slung over shoulder, muscles clearing blood glucose naturally.",
        onScreenText: "Pair it with a 10-minute outdoor walk before your 2:00 PM call.",
        soundCue: "Crisp footsteps on pavement + city breeze",
      },
      {
        sceneNumber: 4,
        timeRange: "19.5s – 26.0s",
        shotType: "Executive Travel & Dining Cheat Sheet CTA",
        flowUltraPrompt:
          "9:16 vertical video, 35mm close-up, executive lounge oak table with laptop and mineral water. Immediate frame-0 motion: the executive reviews the Executive Dining & Travel Cheat Sheet on his phone and smiles.",
        onScreenText: "Comment RESET for the 60-Second Executive Energy Diagnostic ⚡",
        soundCue: "Clean acoustic resolution",
      },
    ],
    onScreenTextHook: {
      hook0to3s: "Think you can't reset your energy because of client lunches or travel?",
      payoff3to8s: "Use the protein-first + electrolyte rule to stay razor-sharp anywhere.",
      ctaEndCard: "Comment RESET for the Executive Reset Diagnostic ⚡",
    },
    caption:
      "Real life includes client lunches, airport terminals, and busy Tuesdays. That's why alongside our 24-Hour Reset, we created the Executive Travel & Dining-Out Cheat Sheet and 2-Hour Workday Triage toolkit—so you never lose your Hour-24 clarity. Comment RESET and I'll send you our free 60-second Burnout & Cortisol Diagnostic.",
    commentAutoReply:
      "Just DMed you the 60-Second Executive Diagnostic link! ⚡",
    dmOpeningMessage:
      "Hey! Reiko's team here 👋 Take the free 60-Second Diagnostic here → https://perfectdayreset.com/quiz (and check out our $19 Core + $12 Emergency Workday & Travel Toolkit at https://perfectdayreset.com/checkout).",
  },

  // ==========================================================
  // ARCHETYPE 4: SYSTEMIC BURNOUT RECOVERY (3 PACKAGES)
  // ==========================================================
  {
    id: "burnout-1-shattering-clock-purple-cow",
    archetypeId: "systemic_burnout",
    archetypeName: "Systemic Burnout Recovery",
    angleTitle: "Why One Late Meeting Ruins Static Schedules (And How the 1-Tap Rescheduler Works)",
    viralFormat: "purple_cow_loop",
    viralFormatLabel: "Purple Cow Loop",
    targetLengthSeconds: 8,
    durationSeconds: 8,
    pacingRule: "2-cut visual contrast loop (4.0s Rigid Schedule Breakdown -> 4.0s 1-Tap Recalculation)",
    psychologicalAngle:
      "Attacks the 'all-or-nothing perfectionism' trap where running 15 minutes behind causes people to quit their entire reset day.",
    aspectRatio: "9:16",
    cameraSpec: "35mm handheld close-up documentary, natural daylight, tactile paper & phone screen",
    flowUltraPrompt:
      "9:16 vertical video, organic 35mm handheld documentary cinematography, dramatic side window light over an oak desk, subtle film grain, shallow depth of field. Immediate frame-0 motion: red ink bleeds across a rigid printed paper timetable marked 09:00 AM as a heavy brass clock ticks past 09:15 AM and a frustrated hand crumples the paper schedule.",
    scenes: [
      {
        sceneNumber: 1,
        timeRange: "0.0s – 4.0s",
        shotType: "Macro Rigid Paper Schedule Crumple Hook",
        flowUltraPrompt:
          "9:16 vertical video, organic 35mm handheld documentary cinematography, dramatic side window light over an oak desk, subtle film grain, shallow depth of field. Immediate frame-0 motion: a brass desk clock reads 09:15 AM while a frustrated founder crosses out a rigid paper schedule in red ink and crumples the page.",
        onScreenText: "Ever quit a daily routine at 9:15 AM because one meeting ran 15 minutes late?",
        soundCue: "Loud clock tick + paper crumple",
      },
      {
        sceneNumber: 2,
        timeRange: "4.0s – 8.0s",
        shotType: "1-Tap Live Rescheduler Relief Cut",
        flowUltraPrompt:
          "9:16 vertical video, organic 35mm handheld close-up, warm sunlit oak desk beside a steaming ceramic mug, subtle film grain. Immediate frame-0 motion: a calm thumb taps a '+15m Delay' button on a clean emerald web app interface, smoothly shifting the day's timeline blocks forward as the founder exhales with relief.",
        onScreenText: "Our 1-Tap Delay Rescheduler recalculates your whole day (Comment RESET)",
        soundCue: "Soft UI chime + calm exhale",
      },
    ],
    onScreenTextHook: {
      hook0to3s: "Ever quit a daily routine at 9:15 AM because one meeting ran 15 minutes late?",
      payoff3to8s: "Our live 1-Tap Delay Rescheduler shifts your entire 24-hour timeline automatically.",
      ctaEndCard: "Comment RESET to try the 60-Second Diagnostic ⚡",
    },
    caption:
      "Static PDFs break the moment real life happens. If your morning slips by 15 or 30 minutes, guilt sets in and you abandon the whole day. That's why we engineered a live 1-Tap Delay Rescheduler inside the Perfect Day Reset web companion—tap +15m, +30m, or +45m and your entire remaining schedule recalculates automatically. Comment RESET and I'll send you our free 60-second Burnout & Cortisol Diagnostic.",
    commentAutoReply:
      "Sent the 60-Second Diagnostic + 1-Tap Delay Rescheduler preview to your DMs! ⚡",
    dmOpeningMessage:
      "Hey! Reiko's team here 👋 See how our live 1-Tap Delay Rescheduler solves running behind schedule—take the free 60-Second Diagnostic here → https://perfectdayreset.com/quiz",
  },
  {
    id: "burnout-2-why-30-day-challenges-fail-trojan",
    archetypeId: "systemic_burnout",
    archetypeName: "Systemic Burnout Recovery",
    angleTitle: "Why 85% of High Performers Quit 30-Day Challenges by Day 4 (And Why 24 Hours Works)",
    viralFormat: "trojan_horse_story",
    viralFormatLabel: "BMW Trojan Horse Story",
    targetLengthSeconds: 28,
    durationSeconds: 28,
    pacingRule: "Cut every 2.2s across 5 documentary scenes from corporate exhaustion to coastal reset",
    psychologicalAngle:
      "Validates the viewer's past failures with 30-day programs and reframes recovery as a 24-hour physiological circuit breaker.",
    aspectRatio: "9:16",
    cameraSpec: "35mm handheld documentary portrait, late-night office to golden-hour Baltic coast walk",
    flowUltraPrompt:
      "9:16 vertical video, organic 35mm handheld documentary cinematography, warm golden-hour sunset light across a quiet coastal path with tall dune grass swaying in the breeze, subtle 35mm film grain, shallow depth of field. Immediate frame-0 motion: a grounded executive in a knitted oatmeal wool sweater pauses on the coastal trail to watch the horizon, visibly releasing shoulder tension with a slow exhale.",
    scenes: [
      {
        sceneNumber: 1,
        timeRange: "0.0s – 5.5s",
        shotType: "Day 4 Habit Tracker Abandonment Hook",
        flowUltraPrompt:
          "9:16 vertical video, 35mm handheld close-up, dim desk lamp light at night, shallow depth of field. Immediate frame-0 motion: a hand closes a thick '30-Day Challenge' binder with only 3 days checked off and 27 blank pages remaining, tossing the pen onto the desk.",
        onScreenText: "85% of burned-out high performers quit 30-day wellness challenges by Day 4.",
        soundCue: "Heavy binder thud + pen drop",
      },
      {
        sceneNumber: 2,
        timeRange: "5.5s – 11.0s",
        shotType: "Corporate Overload Context",
        flowUltraPrompt:
          "9:16 vertical video, 35mm handheld medium shot, glass office at dusk overlooking city traffic. Immediate frame-0 motion: an exhausted sales director loosens his tie while staring at back-to-back calendar blocks on dual monitors.",
        onScreenText: "Because when you're already at 98% capacity, a 30-day rulebook feels like a second job.",
        soundCue: "Muted city traffic hum",
      },
      {
        sceneNumber: 3,
        timeRange: "11.0s – 17.0s",
        shotType: "The 24-Hour Circuit Breaker Pivot",
        flowUltraPrompt:
          "9:16 vertical video, 35mm handheld shot, crisp Sunday morning sunlight entering a quiet kitchen, subtle film grain. Immediate frame-0 motion: the executive places his work phone into a wooden drawer, closes it, and picks up a glass of mineral water.",
        onScreenText: "You don't need 30 days. Anyone can commit to 24 intentional hours this Sunday.",
        soundCue: "Wooden drawer close + morning quiet",
      },
      {
        sceneNumber: 4,
        timeRange: "17.0s – 23.0s",
        shotType: "Golden-Hour Coastal Horizon Exhale",
        flowUltraPrompt:
          "9:16 vertical video, organic 35mm handheld documentary cinematography, warm golden-hour sunset light across a quiet coastal path with tall dune grass swaying in the breeze. Immediate frame-0 motion: the executive pauses to watch the horizon, visibly releasing shoulder tension with a slow exhale.",
        onScreenText: "One day to reset your cortisol, blood sugar, and deep sleep architecture.",
        soundCue: "Gentle coastal wind + ocean waves",
      },
      {
        sceneNumber: 5,
        timeRange: "23.0s – 28.0s",
        shotType: "Evening Journal & Certificate Completion",
        flowUltraPrompt:
          "9:16 vertical video, 35mm warm lamp-lit close-up, heavy cream journal and chamomile tea on oak desk. Immediate frame-0 motion: a fountain pen writes the final line of the 5-Prompt Evening Cognitive Unload before closing the book.",
        onScreenText: "Comment RESET for the free 60-Second Burnout Diagnostic ⚡",
        soundCue: "Pen on cotton paper + warm acoustic chord",
      },
    ],
    onScreenTextHook: {
      hook0to3s: "When you're already burned out, a 30-day challenge feels like a second full-time job.",
      payoff3to8s: "You don't need 30 days. Anyone can commit to 24 intentional hours.",
      ctaEndCard: "Comment RESET for your 24-Hour Burnout Diagnostic ⚡",
    },
    caption:
      "85% of people quit 30-day wellness programs by Day 4 because committing to a month of extreme rules when your nervous system is already fried only adds more stress. Anyone can commit to 24 intentional hours this Sunday—and wake up Monday morning with a completely reset baseline. Comment RESET and I'll send you our free 60-second Burnout & Cortisol Diagnostic.",
    commentAutoReply:
      "Just DMed you the 60-Second Burnout & Cortisol Diagnostic! Check your messages ⚡",
    dmOpeningMessage:
      "Hey! 👋 Thanks for commenting RESET. Take our 60-Second Burnout & Cortisol Diagnostic here → https://perfectdayreset.com/quiz and see how a single 24-hour protocol resets your nervous system.",
  },
  {
    id: "burnout-3-emergency-two-hour-triage-forensic",
    archetypeId: "systemic_burnout",
    archetypeName: "Systemic Burnout Recovery",
    angleTitle: "The Emergency 2-Hour Workday Triage (For Chaotic Tuesdays When You Can't Take a Day Off)",
    viralFormat: "forensic_curiosity_hook",
    viralFormatLabel: "Forensic Curiosity Hook",
    targetLengthSeconds: 22,
    durationSeconds: 22,
    pacingRule: "Cut every 2.0s through the 4-Step 120-Minute Emergency Triage sequence",
    psychologicalAngle:
      "Solves mid-week burnout in real time: shows the exact 120-minute protocol executives run on a chaotic Tuesday without clearing their calendar.",
    aspectRatio: "9:16",
    cameraSpec: "35mm handheld documentary, glass office interior to sunlit green courtyard",
    flowUltraPrompt:
      "9:16 vertical video, organic 35mm handheld documentary cinematography, natural late-morning daylight transitioning from a glass-walled office interior to a quiet sunlit courtyard with green trees, subtle film grain, shallow depth of field. Immediate frame-0 motion: a stressed executive in a crisp Oxford shirt with rolled sleeves steps out of the building into natural sunlight, drinks mineral water, and walks calmly under the trees.",
    scenes: [
      {
        sceneNumber: 1,
        timeRange: "0.0s – 5.5s",
        shotType: "Tuesday 11:30 AM Calendar Overload Hook",
        flowUltraPrompt:
          "9:16 vertical video, 35mm handheld close-up, glass office desk at 11:30 AM. Immediate frame-0 motion: an executive closes a laptop after a tense video call, rubs his neck, and looks at a packed Tuesday afternoon calendar.",
        onScreenText: "Getting crushed on a chaotic Tuesday and can't spare a full 24 hours?",
        soundCue: "Laptop lid snap + tense exhale",
      },
      {
        sceneNumber: 2,
        timeRange: "5.5s – 11.0s",
        shotType: "Step 1 & 2: 500ml Mineral Hydration + 4-7-8 Breath",
        flowUltraPrompt:
          "9:16 vertical video, 35mm handheld close-up, natural window light. Immediate frame-0 motion: the executive drinks 500ml of mineral water with sea salt and performs a slow 4-second nasal inhale, 7-second hold, and 8-second exhale.",
        onScreenText: "Min 0–15: 500ml mineral water + 3 rounds of 4-7-8 breathwork to drop cortisol.",
        soundCue: "Water pour + deep rhythmic breath",
      },
      {
        sceneNumber: 3,
        timeRange: "11.0s – 16.5s",
        shotType: "Step 3: 20-Minute No-Phone Courtyard Walk",
        flowUltraPrompt:
          "9:16 vertical video, 35mm handheld tracking shot, sunlit green courtyard outside office building. Immediate frame-0 motion: the executive walks briskly under green trees with rolled shirt sleeves and no phone in hand.",
        onScreenText: "Min 15–45: Low-glycemic protein lunch + 20-minute no-phone outdoor walk.",
        soundCue: "Footsteps + outdoor sunlight ambiance",
      },
      {
        sceneNumber: 4,
        timeRange: "16.5s – 22.0s",
        shotType: "Step 4: 75-Minute Single-Task Deep Work Lock",
        flowUltraPrompt:
          "9:16 vertical video, 35mm handheld medium shot, clean desk with phone in drawer. Immediate frame-0 motion: the executive completes a 75-minute single-task sprint with calm, razor-sharp focus.",
        onScreenText: "Min 45–120: 1-Tab Deep Work Lock. Comment RESET for the 2-Hour Triage Kit ⚡",
        soundCue: "Focused typing + clean chime",
      },
    ],
    onScreenTextHook: {
      hook0to3s: "Getting crushed on a chaotic Tuesday and can't spare a full 24 hours?",
      payoff3to8s: "Run the 4-Step Emergency 2-Hour Workday Triage without clearing your calendar.",
      ctaEndCard: "Comment RESET for the 60-Second Diagnostic + Toolkit ⚡",
    },
    caption:
      "What do you do when burnout hits on a chaotic Tuesday afternoon and you can't take a full day off? We built the Emergency 2-Hour Workday Reset (15m Hydration + 4-7-8 Breath, 15m Low-Glycemic Fuel, 20m Cortisol Flush Walk, and 75m Single-Task Lock) so you can rescue your week in 120 minutes. Comment RESET and I'll send you our free 60-second Burnout & Cortisol Diagnostic.",
    commentAutoReply:
      "Sent the 60-Second Diagnostic + 2-Hour Workday Triage info to your DMs! ⚡",
    dmOpeningMessage:
      "Hey! Reiko's team here 👋 Take the free 60-Second Diagnostic at https://perfectdayreset.com/quiz — and if you need our Emergency 2-Hour Workday Reset Toolkit, you can add it with 1 click at https://perfectdayreset.com/checkout!",
  },
];

export function getFlowUltraPackageById(packageId: string): FlowUltraVideoPackage | undefined {
  return FLOW_ULTRA_PACKAGES.find((p) => p.id === packageId);
}

export function getFlowUltraBatch(archetypeFilter?: string, viralFormatFilter?: string) {
  let packages = FLOW_ULTRA_PACKAGES;
  if (archetypeFilter && archetypeFilter !== "all") {
    packages = packages.filter((p) => p.archetypeId === archetypeFilter);
  }
  if (viralFormatFilter && viralFormatFilter !== "all") {
    packages = packages.filter((p) => p.viralFormat === viralFormatFilter);
  }

  const manyChatAutomationConfig = {
    triggerType: "instagram_or_tiktok_comment_keyword",
    keywords: ["RESET", "reset", "Reset"],
    excludeKeywords: [],
    publicCommentReplies: [
      "Just sent your 60-Second Burnout & Cortisol Diagnostic to your DMs! Check your message requests ⚡",
      "Sent the 60-Second Reset Diagnostic straight to your inbox! 👋",
      "Check your DMs! Just sent over your custom 24-Hour Reset Diagnostic link ⚡",
    ],
    webhookAction: {
      method: "POST",
      url: "https://perfectdayreset.com/api/agent/dm-reply",
      headers: {
        "Content-Type": "application/json",
        "X-Agent-Secret": "{{optional_AGENT_WEBHOOK_SECRET}}",
      },
      bodyTemplate: {
        platform: "instagram",
        handle: "{{user_handle}}",
        message: "{{last_input_text}}",
        triggerType: "comment",
      },
    },
    fallbackDirectDmText:
      "Hey! Reiko's team here 👋 Thanks for commenting RESET! Take our free 60-Second Burnout & Cortisol Diagnostic here → https://perfectdayreset.com/quiz — it maps your #1 energy bottleneck and builds your custom 24-hour schedule around your wake time & food track.",
  };

  return {
    totalPackages: packages.length,
    productionSpecs: {
      model: "Google Flow Ultra (Veo 3.1 Multi-Scene Cinematography Engine)",
      aspectRatio: "9:16 Vertical (1080x1920)",
      cameraAesthetic:
        "Multi-Scene Purple Cow & Trojan Horse Storyboards: Organic 35mm handheld documentary cinematography, immediate frame-0 motion, 2.0s–3.5s rapid scene cuts, tactile real-world textures (linen, ceramic, condensation on glass, warm wood), zero plastic/CGI look",
      conversionFlow:
        "9:16 Multi-Scene Reel/Short -> AI Video Director Trim & Safe-Zone Burn-in -> Approval Queue -> 'Comment RESET' CTA -> Instant Comment + DM Closer (/api/agent/dm-reply) -> /quiz 60-Second Diagnostic -> /checkout ($19 Core + $12 Order Bump)",
    },
    manyChatAutomationConfig,
    packages,
  };
}
