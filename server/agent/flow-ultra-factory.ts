export interface FlowUltraVideoPackage {
  id: string;
  archetypeId:
    | "cortisol_spiked"
    | "dopamine_depleted"
    | "metabolic_crasher"
    | "systemic_burnout";
  archetypeName: string;
  angleTitle: string;
  durationSeconds: number;
  aspectRatio: "9:16";
  cameraSpec: string;
  flowUltraPrompt: string;
  onScreenTextHook: {
    hook0to3s: string;
    payoff3to8s: string;
    ctaEndCard: string;
  };
  caption: string;
  commentAutoReply: string;
  dmOpeningMessage: string;
}

export const FLOW_ULTRA_PACKAGES: FlowUltraVideoPackage[] = [
  // ==========================================================
  // ARCHETYPE 1: CORTISOL-SPIKED HIGH PERFORMER (3 PACKAGES)
  // ==========================================================
  {
    id: "cortisol-1-tired-but-wired",
    archetypeId: "cortisol_spiked",
    archetypeName: "Cortisol-Spiked High Performer",
    angleTitle: "The 10:30 PM 'Tired But Wired' Cortisol Inversion",
    durationSeconds: 8,
    aspectRatio: "9:16",
    cameraSpec: "35mm handheld documentary, f/1.8 shallow DOF, Kodak Vision3 250D subtle film grain",
    flowUltraPrompt:
      "9:16 vertical video, organic 35mm handheld documentary cinematography, natural morning window lighting transitioning from warm indoor tungsten to crisp golden sunrise light, subtle 35mm film grain, shallow depth of field, zero plastic or CGI look. Close-up of a tall clear glass of mineral water with real condensation beads and a slice of fresh lemon being placed onto a tactile warm oak table beside a linen-bound journal and a ceramic mug; a calm 38-year-old athletic executive in a soft heather-grey merino sweater steps onto a sunlit wooden balcony, takes a slow nasal inhale as natural golden-hour light catches the steam and dust motes in the air, authentic skin texture, serene grounded atmosphere.",
    onScreenTextHook: {
      hook0to3s: "Exhausted at 7:00 AM... yet your brain won't shut off at 10:30 PM?",
      payoff3to8s: "You don't have a discipline problem. Your cortisol-melatonin curve is inverted.",
      ctaEndCard: "Comment RESET for the 60-Second Cortisol Diagnostic ⚡",
    },
    caption:
      "When I was Head of Sales at BMW, I used to lie awake at 11 PM replaying meetings in my head—then wake up at 6:30 AM feeling like I'd been hit by a truck. That's an inverted cortisol curve. You don't fix it with a 30-day challenge; you fix it by anchoring morning light + mineral hydration and locking in a 90-minute Digital Sunset for 24 intentional hours. Comment RESET and I'll send you our free 60-second Burnout & Cortisol Diagnostic.",
    commentAutoReply:
      "Just sent the 60-Second Cortisol & Energy Diagnostic to your DMs! Check your message requests ⚡",
    dmOpeningMessage:
      "Hey! Reiko's team here 👋 Thanks for commenting RESET. Take your free 60-Second Cortisol & Energy Diagnostic here → https://perfectdayreset.com/quiz — it maps your inverted cortisol curve and builds a custom 24-hour reset schedule around your exact wake time.",
  },
  {
    id: "cortisol-2-coffee-first-mistake",
    archetypeId: "cortisol_spiked",
    archetypeName: "Cortisol-Spiked High Performer",
    angleTitle: "Why Espresso on an Empty Stomach Spikes Anxiety",
    durationSeconds: 8,
    aspectRatio: "9:16",
    cameraSpec: "35mm handheld macro-to-medium, natural side window light, tactile kitchen textures",
    flowUltraPrompt:
      "9:16 vertical video, organic 35mm handheld documentary cinematography, natural early-morning kitchen window light casting soft long shadows across a matte stone countertop, subtle film grain, shallow depth of field, tactile real-world textures, zero CGI look. A hand gently pushes aside a dark ceramic espresso cup and pulls forward a frosted glass carafe of filtered water with coarse sea salt crystals dissolving at the bottom and fresh lemon; sunlight refracts through the swirling water in slow motion, natural linen sleeve, authentic documentary realism.",
    onScreenTextHook: {
      hook0to3s: "Stop drinking coffee within 10 minutes of waking up.",
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
  {
    id: "cortisol-3-evening-cognitive-unload",
    archetypeId: "cortisol_spiked",
    archetypeName: "Cortisol-Spiked High Performer",
    angleTitle: "The 5-Prompt Evening Cognitive Unload Ritual",
    durationSeconds: 8,
    aspectRatio: "9:16",
    cameraSpec: "35mm handheld intimate close-up, warm 2700K lamp light, natural paper & linen grain",
    flowUltraPrompt:
      "9:16 vertical video, organic 35mm handheld documentary cinematography, warm amber evening lamp light beside a rain-kissed window, subtle film grain, shallow depth of field, tactile real-world textures (woven oatmeal linen, heavy cream cotton paper, brushed brass pen, steaming chamomile tea in handmade stoneware), zero plastic/CGI look. Close-up of a founder's hand writing slow, deliberate reflection notes in an open journal while a smartphone sits face-down in the soft out-of-focus background, calm parasympathetic breathing, cinematic documentary authenticity.",
    onScreenTextHook: {
      hook0to3s: "Your brain keeps solving work problems at midnight because you never closed the tabs.",
      payoff3to8s: "Use the 5-Prompt Evening Cognitive Unload 60 minutes before sleep.",
      ctaEndCard: "Comment RESET to see the 24-Hour Protocol ⚡",
    },
    caption:
      "High performers don't struggle to fall asleep because they aren't tired—they struggle because their prefrontal cortex still has 14 open loops from the workday. That's why Phase 3 of the Perfect Day Reset locks in a guided 5-Prompt Evening Reflection Journal right inside your web portal before lights out. Comment RESET and I'll send you our free 60-second Burnout & Cortisol Diagnostic.",
    commentAutoReply:
      "Just DMed you the 60-Second Diagnostic + Evening Unload preview! Check your inbox ⚡",
    dmOpeningMessage:
      "Hey! Reiko's team here 👋 Here is the link to our free 60-Second Burnout & Cortisol Diagnostic → https://perfectdayreset.com/quiz — it shows you how our 24-Hour Reset + 5-Prompt Evening Cognitive Unload quiets racing thoughts before bed.",
  },

  // ==========================================================
  // ARCHETYPE 2: DOPAMINE-DEPLETED MULTITASKER (3 PACKAGES)
  // ==========================================================
  {
    id: "dopamine-1-phone-first-thing",
    archetypeId: "dopamine_depleted",
    archetypeName: "Dopamine-Depleted Multitasker",
    angleTitle: "What Checking Slack at 6:30 AM Does to Prefrontal Dopamine",
    durationSeconds: 8,
    aspectRatio: "9:16",
    cameraSpec: "35mm handheld documentary, natural dawn bedroom light, organic linen textures",
    flowUltraPrompt:
      "9:16 vertical video, organic 35mm handheld documentary cinematography, soft blue-gold dawn window lighting across rumpled natural flax linen bedsheets, subtle film grain, shallow depth of field, tactile real-world textures, zero plastic/CGI look. A hand reaches toward a glowing smartphone on a solid walnut nightstand, pauses mid-air, flips the phone face-down, and instead opens the wooden blinds to let warm golden morning sunbeams flood the room, authentic skin tones, grounded documentary realism.",
    onScreenTextHook: {
      hook0to3s: "Checking notifications in bed hijacks your prefrontal cortex before your feet hit the floor.",
      payoff3to8s: "Protect your first 45 minutes. Reclaim 4 hours of deep focus.",
      ctaEndCard: "Comment RESET for the 60-Second Focus Diagnostic ⚡",
    },
    caption:
      "If you check email or social feeds within 5 minutes of waking, you flood your brain with cheap micro-spikes of dopamine—making deep work feel impossible by 1:00 PM. Our 24-Hour Reset gives you a structured 45-minute phone-free morning anchor that restores your baseline focus in a single day. Comment RESET and I'll send you our free 60-second Burnout & Cortisol Diagnostic.",
    commentAutoReply:
      "Sent your 60-Second Dopamine & Focus Diagnostic link to your DMs! ⚡",
    dmOpeningMessage:
      "Hey! Thanks for commenting RESET 👋 Take our free 60-Second Diagnostic here → https://perfectdayreset.com/quiz — it diagnoses Dopamine Receptor Fatigue and maps a custom 24-hour phone-free morning schedule around your wake time.",
  },
  {
    id: "dopamine-2-context-switching-drain",
    archetypeId: "dopamine_depleted",
    archetypeName: "Dopamine-Depleted Multitasker",
    angleTitle: "Why 37 Open Browser Tabs Feel Like Physical Exhaustion",
    durationSeconds: 8,
    aspectRatio: "9:16",
    cameraSpec: "35mm handheld over-the-shoulder documentary, natural daylight studio desk",
    flowUltraPrompt:
      "9:16 vertical video, organic 35mm handheld documentary cinematography, bright diffused natural window light over a minimalist solid ash wood desk, subtle film grain, shallow depth of field, tactile textures (brushed aluminum laptop, matte black ceramic pour-over, crisp white index card, condensation on a glass of water), zero CGI look. A focused founder closes their laptop lid halfway, writes a single bold priority on a heavy textured card with a fountain pen, and exhales calmly as natural light shifts across the wood grain.",
    onScreenTextHook: {
      hook0to3s: "You aren't lazy—your dopamine receptors are fried from 11 hours of context-switching.",
      payoff3to8s: "Reset your baseline attention span in 24 structured hours.",
      ctaEndCard: "Comment RESET for your 24-Hour Reset Blueprint ⚡",
    },
    caption:
      "Context-switching between Slack, email, and meetings burns through oxygenated glucose in your prefrontal cortex faster than heavy physical training. You don't need a week in Bali to fix it—you need 24 hours of single-task pacing, tyrosine-rich whole foods, and our midday thermal contrast reset. Comment RESET and I'll send you our free 60-second Burnout & Cortisol Diagnostic.",
    commentAutoReply:
      "Just DMed you the 60-Second Diagnostic link! Check your messages ⚡",
    dmOpeningMessage:
      "Hey! Reiko's team here 👋 Here is your free 60-Second Focus & Burnout Diagnostic → https://perfectdayreset.com/quiz — see how the 24-Hour Reset restores laser-sharp attention in one day.",
  },
  {
    id: "dopamine-3-midday-contrast-reboot",
    archetypeId: "dopamine_depleted",
    archetypeName: "Dopamine-Depleted Multitasker",
    angleTitle: "The 15-Minute Midday Thermal + 4-7-8 Breath Dopamine Reboot",
    durationSeconds: 8,
    aspectRatio: "9:16",
    cameraSpec: "35mm handheld documentary, sunlit pine forest trail, natural lens flare",
    flowUltraPrompt:
      "9:16 vertical video, organic 35mm handheld documentary cinematography, dappled midday sunlight filtering through tall Nordic pine trees onto a needle-covered trail, subtle 35mm film grain, shallow depth of field, tactile textures (weathered tree bark, breathable merino wool athletic jacket, crisp forest air), zero plastic/CGI look. Tracking medium shot of a fit 40-year-old walking briskly without headphones or phone, pausing in a beam of golden sunlight for a deep 4-7-8 nasal breath, authentic documentary pacing.",
    onScreenTextHook: {
      hook0to3s: "Instead of a 3rd cup of coffee at 2:00 PM, do this 15-minute nervous system reset.",
      payoff3to8s: "Brisk outdoor walk + 4-7-8 breathwork + thermal rinse = clean afternoon dopamine.",
      ctaEndCard: "Comment RESET to test your Energy Archetype ⚡",
    },
    caption:
      "After 35+ years in competitive sports, the biggest lesson I brought into the executive world is that you cannot push high cognitive output for 10 straight hours without a midday nervous system flush. Phase 2 of the Perfect Day Reset pairs a 45-minute outdoor walk with guided 4-7-8 breathwork so your afternoon feels as sharp as 8:00 AM. Comment RESET and I'll send you our free 60-second Burnout & Cortisol Diagnostic.",
    commentAutoReply:
      "Sent the 60-Second Energy Archetype Diagnostic straight to your DMs! ⚡",
    dmOpeningMessage:
      "Hey! 👋 Thanks for commenting RESET. Take the free 60-Second Diagnostic here → https://perfectdayreset.com/quiz to get your custom Midday Recharge & Dopamine Reset timeline.",
  },

  // ==========================================================
  // ARCHETYPE 3: METABOLIC MIDDAY CRASHER (3 PACKAGES)
  // ==========================================================
  {
    id: "metabolic-1-two-pm-energy-cliff",
    archetypeId: "metabolic_crasher",
    archetypeName: "Metabolic Midday Crasher",
    angleTitle: "Why You Hit a Brick Wall at 2:00 PM Every Afternoon",
    durationSeconds: 8,
    aspectRatio: "9:16",
    cameraSpec: "35mm handheld culinary documentary, natural overhead/side daylight, tactile ceramic & greens",
    flowUltraPrompt:
      "9:16 vertical video, organic 35mm handheld documentary cinematography, bright natural side window lighting over a rustic wooden kitchen table, subtle film grain, shallow depth of field, tactile real-world textures (matte speckled stoneware bowl, wild grilled salmon with crisp skin, vibrant green avocado slices, toasted pumpkin seeds, extra-virgin olive oil drizzle catching the light), zero plastic/CGI look. Slow handheld push-in as fresh lemon juice is squeezed over the bowl, droplets glistening naturally, appetizing whole-food documentary realism.",
    onScreenTextHook: {
      hook0to3s: "Crashing hard at 2:00 PM even when you slept 8 hours?",
      payoff3to8s: "Your breakfast & lunch glucose curve is starving your brain of afternoon ATP.",
      ctaEndCard: "Comment RESET for your custom 5-Diet Reset Menu ⚡",
    },
    caption:
      "The 2:00 PM brain fog cliff isn't caused by working too hard—it's reactive hypoglycemia from rushed, carb-heavy lunches and dehydrated mornings. Inside the Perfect Day Reset portal, you choose from 5 whole-food nutrition tracks (Omnivore, Vegetarian, Keto, Paleo, or Vegan) with 15-minute anti-crash meals and a 1-click grocery list. Comment RESET and I'll send you our free 60-second Burnout & Cortisol Diagnostic.",
    commentAutoReply:
      "Just sent the 60-Second Diagnostic + 5-Diet Reset Menu preview to your DMs! ⚡",
    dmOpeningMessage:
      "Hey! Reiko's team here 👋 Take the free 60-Second Diagnostic here → https://perfectdayreset.com/quiz — choose your preferred nutrition track (Omni, Veg, Keto, Paleo, or Vegan) and see your exact 3 anti-crash meals!",
  },
  {
    id: "metabolic-2-five-nutrition-tracks",
    archetypeId: "metabolic_crasher",
    archetypeName: "Metabolic Midday Crasher",
    angleTitle: "15-Minute Anti-Crash Meals (Omni, Veg, Keto, Paleo, Vegan)",
    durationSeconds: 8,
    aspectRatio: "9:16",
    cameraSpec: "35mm handheld documentary, warm morning kitchen light, real whole-food textures",
    flowUltraPrompt:
      "9:16 vertical video, organic 35mm handheld documentary cinematography, warm morning sunlight streaming across a butcher-block counter, subtle film grain, shallow depth of field, tactile real-world textures (pasture-raised eggs with rich orange yolks, halved ripe avocados, wilted baby spinach in cast iron, flaky sea salt, coarse black pepper), zero plastic/CGI look. A wooden spoon plates the warm Omega Brain Bowl into a handmade ceramic dish while steam rises softly in the morning light.",
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
    id: "metabolic-3-executive-dining-triage",
    archetypeId: "metabolic_crasher",
    archetypeName: "Metabolic Midday Crasher",
    angleTitle: "How to Eat for All-Day Clarity During Client Lunches & Travel",
    durationSeconds: 8,
    aspectRatio: "9:16",
    cameraSpec: "35mm handheld documentary, sunlit bistro window table, natural glassware & linen",
    flowUltraPrompt:
      "9:16 vertical video, organic 35mm handheld documentary cinematography, natural afternoon sunlight through a tall café window onto a crisp white linen table, subtle film grain, shallow depth of field, tactile textures (sparkling mineral water with lime in crystal glass, grilled herb chicken and avocado salad on porcelain, tailored navy blazer sleeve), zero plastic/CGI look. Calm, confident executive dining moment with warm natural bokeh of city trees outside.",
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
    id: "burnout-1-one-tap-delay-rescheduler",
    archetypeId: "systemic_burnout",
    archetypeName: "Systemic Burnout Recovery",
    angleTitle: "Why Rigid Schedules Fail (And How the 1-Tap Delay Rescheduler Works)",
    durationSeconds: 8,
    aspectRatio: "9:16",
    cameraSpec: "35mm handheld close-up documentary, natural daylight, real phone screen & ceramic mug",
    flowUltraPrompt:
      "9:16 vertical video, organic 35mm handheld documentary cinematography, soft natural afternoon window light across a warm oak desk, subtle film grain, shallow depth of field, tactile real-world textures (linen shirt cuff, handmade ceramic tea mug, brushed metal watch), zero plastic/CGI look. Close-up of a calm founder tapping once on a clean emerald-and-white schedule interface on their phone, taking a relieved breath, and stepping outside onto a sunny terrace, authentic documentary feel.",
    onScreenTextHook: {
      hook0to3s: "Ever quit a daily routine at 10:15 AM because one meeting ran 15 minutes late?",
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
    id: "burnout-2-why-30-day-challenges-fail",
    archetypeId: "systemic_burnout",
    archetypeName: "Systemic Burnout Recovery",
    angleTitle: "Why 85% Quit 30-Day Challenges by Day 4 (And Why 24 Hours Works)",
    durationSeconds: 8,
    aspectRatio: "9:16",
    cameraSpec: "35mm handheld documentary portrait, golden-hour coastal/park walk, natural film grain",
    flowUltraPrompt:
      "9:16 vertical video, organic 35mm handheld documentary cinematography, warm golden-hour sunset light across a quiet coastal path with tall dune grass swaying in the breeze, subtle 35mm film grain, shallow depth of field, tactile textures (knitted oatmeal wool sweater, natural wind in hair, warm golden sunlight on skin), zero plastic/CGI look. Medium handheld shot of a grounded executive pausing to watch the horizon, visibly releasing shoulder tension with a slow exhale, cinematic documentary realism.",
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
    id: "burnout-3-emergency-two-hour-workday-triage",
    archetypeId: "systemic_burnout",
    archetypeName: "Systemic Burnout Recovery",
    angleTitle: "The Emergency 2-Hour Mid-Week Workday Triage Protocol",
    durationSeconds: 8,
    aspectRatio: "9:16",
    cameraSpec: "35mm handheld documentary, late-morning office to sunlit courtyard transition",
    flowUltraPrompt:
      "9:16 vertical video, organic 35mm handheld documentary cinematography, natural late-morning daylight transitioning from a glass-walled office interior to a quiet sunlit courtyard with green trees, subtle film grain, shallow depth of field, tactile textures (crisp cotton Oxford shirt with rolled sleeves, tall glass of mineral water, warm stone bench), zero plastic/CGI look. A stressed executive steps out of the building into natural sunlight, drinks mineral water, and walks calmly under the trees, authentic documentary cinematography.",
    onScreenTextHook: {
      hook0to3s: "Getting crushed on a chaotic Tuesday and can't spare a full 24 hours?",
      payoff3to8s: "Run the 4-Step Emergency 2-Hour Workday Triage without clearing your calendar.",
      ctaEndCard: "Comment RESET for the 60-Second Diagnostic + Toolkit ⚡",
    },
    caption:
      "What do you do when burnout hits on a chaotic Tuesday afternoon and you can't take a full day off? We built the Emergency 2-Hour Workday Reset (15m Hydration + 4-7-8 Breath, 15m Low-Glycemic Fuel, 20m Cortisol Flush Walk, and 90m Single-Task Lock) so you can rescue your week in 120 minutes. Comment RESET and I'll send you our free 60-second Burnout & Cortisol Diagnostic.",
    commentAutoReply:
      "Sent the 60-Second Diagnostic + 2-Hour Workday Triage info to your DMs! ⚡",
    dmOpeningMessage:
      "Hey! Reiko's team here 👋 Take the free 60-Second Diagnostic at https://perfectdayreset.com/quiz — and if you need our Emergency 2-Hour Workday Reset Toolkit, you can add it with 1 click at https://perfectdayreset.com/checkout!",
  },
];

export function getFlowUltraBatch(archetypeFilter?: string) {
  const packages = archetypeFilter
    ? FLOW_ULTRA_PACKAGES.filter((p) => p.archetypeId === archetypeFilter)
    : FLOW_ULTRA_PACKAGES;

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
      model: "Google Flow Ultra (Veo Cinematography Engine)",
      aspectRatio: "9:16 Vertical (1080x1920)",
      cameraAesthetic:
        "Organic 35mm handheld documentary cinematography, natural morning or golden-hour window lighting, subtle film grain, shallow depth of field, tactile real-world textures (linen, ceramic, condensation on glass, warm wood), zero plastic/CGI look",
      conversionFlow:
        "9:16 Reel/Short -> 'Comment RESET' CTA -> Instant Comment + DM Closer (/api/agent/dm-reply) -> /quiz 60-Second Diagnostic -> Autonomous 4-Stage Email Nurture -> /checkout ($19 Core + $12 Order Bump)",
    },
    manyChatAutomationConfig,
    packages,
  };
}
