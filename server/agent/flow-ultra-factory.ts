export type ViralFormatType =
  | "purple_cow_loop"
  | "trojan_horse_story"
  | "two_timelines_experiment"
  | "forensic_curiosity_hook";

export interface SceneBibleSpec {
  cast: string;
  wardrobe: string;
  lens: string;
  lightDirection: string;
}

export interface FlowUltraScene {
  sceneNumber: number;
  timeRange: string;
  shotType: string;
  whatWeWant: string;
  whatWeDontWant: string;
  negativePrompt: string;
  flowUltraPrompt: string;
  onScreenText: string;
  soundCue: string;
}

export interface CaptionThreeLayerBreakdown {
  hookContinuation: string;
  educationalBridge: string;
  committedCta: string;
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
  sceneBible: SceneBibleSpec;
  flowUltraPrompt: string;
  flowAgentPrompt: string;
  scenes: FlowUltraScene[];
  onScreenTextHook: {
    hook0to3s: string;
    payoff3to8s: string;
    ctaEndCard: string;
  };
  captionParts: CaptionThreeLayerBreakdown;
  caption: string;
  commentAutoReply: string;
  dmOpeningMessage: string;
}

/**
 * Hardcoded Google Flow Built-In Agent Constitution enforcing Veo 3.1 single-shot syntax,
 * Scene Bible continuity, upper-third caption safe zone, and 100% Entertain-First visuals.
 */
export const FLOW_AGENT_CONSTITUTION = `ROLE & GOAL:
Act as a viral short-form cinematographer generating 9:16 vertical clips (1080p, 6–8s) that 100% ENTERTAIN first (dark corporate humor, surreal visual metaphors, high-stakes executive storytelling) with ZERO advertising look.

RULE 1 — SCENE BIBLE CONTINUITY:
Across all clips in a storyboard, repeat the exact same Cast descriptor (age, hair, facial features), Wardrobe (exact colors and fabrics), Lens (35mm lens, shallow depth of field), and Light Direction verbatim so every cut matches seamlessly.

RULE 2 — SINGLE ACTION PER CLIP:
Never combine two locations or two separate actions in one prompt. Front-load every prompt with: One continuous unbroken 9:16 vertical shot, no cuts.

RULE 3 — UPPER-THIRD CAPTION SAFE ZONE:
Frame the subject in the center/lower-middle so the top 25% of the 9:16 frame remains clean, softly blurred negative space for editing captions.

RULE 4 — OFFICIAL VEO 3.1 SOUNDSTAGE SYNTAX:
End every prompt with explicit SFX: (1–2 tactile sounds) and Ambient noise: (room/environment tone), followed by No spoken dialogue, no singing, and no background music.

RULE 5 — TARGETED VEO 3.1 GUARDRAILS (NO QUOTATION MARKS):
Never use quotation marks "" inside prompts. End every prompt with: Keep the same face, outfit, and lighting throughout the shot. Keep hands natural and motion physically plausible. Keep all surfaces clean with no readable text, subtitles, UI labels, or logos.`;

const STANDARD_NEGATIVE_PROMPT =
  "No jump cuts, no scene changes, no camera angle switches, no split screen, no on-screen text, no subtitles, no UI labels, no logos, no distorted hands, no extra fingers, no morphing objects.";

const VEO_BLOCK_6_GUARDRAILS =
  "One continuous shot, no jump cuts, no camera angle switches, no sudden zooms. Keep the same face, outfit, and lighting throughout the shot. Keep hands natural and motion physically plausible. Keep all surfaces clean with no readable text, subtitles, UI labels, or logos.";

function buildSixBlockVeoPrompt(params: {
  shotSizeAndMove: string;
  sceneBible: SceneBibleSpec;
  singlePhysicalAction: string;
  environmentAndLighting: string;
  sfx: string;
  ambient: string;
}): string {
  const block1 = `One continuous unbroken 9:16 vertical shot, no cuts. ${params.shotSizeAndMove}, ${params.sceneBible.lens}. Frame the subject in the center-lower portion with clean, softly blurred negative space in the upper third of the frame for text overlay.`;
  const block2 = `${params.sceneBible.cast}, wearing ${params.sceneBible.wardrobe}.`;
  const block3 = params.singlePhysicalAction;
  const block4 = `${params.environmentAndLighting}, ${params.sceneBible.lightDirection}, natural 35mm film grain, realistic skin texture.`;
  const block5 = `SFX: ${params.sfx}. Ambient noise: ${params.ambient}. No spoken dialogue, no singing, and no background music.`;
  const block6 = VEO_BLOCK_6_GUARDRAILS;
  return `${block1} ${block2} ${block3} ${block4} ${block5} ${block6}`;
}

function buildFlowAgentMasterBrief(
  title: string,
  sceneBible: SceneBibleSpec,
  scenes: FlowUltraScene[]
): string {
  const shotCards = scenes
    .map(
      (s) =>
        `SHOT CARD ${s.sceneNumber} (${s.timeRange} • ${s.shotType}):\n${s.flowUltraPrompt}`
    )
    .join("\n\n");

  return `Generate ${scenes.length} separate 9:16 vertical video clips (6–8 seconds each) for storyboard: ${title}.
Follow this shared Scene Bible verbatim across all shots so cuts match seamlessly:
- Cast: ${sceneBible.cast}
- Wardrobe: ${sceneBible.wardrobe}
- Lens: ${sceneBible.lens}
- Light Direction: ${sceneBible.lightDirection}
- Framing Rule: Keep the top 25% of the 9:16 frame as clean, softly blurred negative space for upper-third captions. Generate each Shot Card below as a separate continuous unbroken 9:16 video clip with zero internal cuts and no quotation marks:

${shotCards}`;
}

function assembleThreeLayerCaption(parts: CaptionThreeLayerBreakdown): string {
  return `${parts.hookContinuation}\n\n${parts.educationalBridge}\n\n${parts.committedCta}`;
}

interface RawStoryboardSeed {
  id: string;
  archetypeId: FlowUltraVideoPackage["archetypeId"];
  archetypeName: string;
  angleTitle: string;
  viralFormat: ViralFormatType;
  viralFormatLabel: string;
  targetLengthSeconds: number;
  pacingRule: string;
  psychologicalAngle: string;
  cameraSpec: string;
  sceneBible: SceneBibleSpec;
  scenes: Array<{
    sceneNumber: number;
    timeRange: string;
    shotType: string;
    shotSizeAndMove: string;
    whatWeWant: string;
    singlePhysicalAction: string;
    environmentAndLighting: string;
    sfx: string;
    ambient: string;
    onScreenText: string;
  }>;
  captionParts: CaptionThreeLayerBreakdown;
  commentAutoReply: string;
  dmOpeningMessage: string;
}

const RAW_SEEDS: RawStoryboardSeed[] = [
  // ==========================================================
  // ARCHETYPE 1: CORTISOL-SPIKED HIGH PERFORMER (3 Storyboards)
  // ==========================================================
  {
    id: "cortisol-1-ocean-desk-purple-cow",
    archetypeId: "cortisol_spiked",
    archetypeName: "Cortisol-Spiked High Performer",
    angleTitle: "The Ocean Desk POV: Typing 'Happy to Jump on a Quick Call!' on 4 Hours of Sleep",
    viralFormat: "purple_cow_loop",
    viralFormatLabel: "Purple Cow Loop",
    targetLengthSeconds: 12,
    pacingRule: "2-cut full-arc comedy loop (6.0s Surreal Ocean Desk POV -> 6.0s Balcony Exhale Relief)",
    psychologicalAngle:
      "Layer 1 pure corporate dark humor: every burned-out professional knows the surreal contrast between typing a polite Slack reply while internally drowning, followed by the visceral relief of clicking Leave Meeting.",
    cameraSpec:
      "35mm lens, shallow depth of field, Kodak Vision3 250D film grain, upper-third negative space lock",
    sceneBible: {
      cast: "A 40-year-old European executive with short salt-and-pepper hair, light stubble, and tired focused eyes",
      wardrobe: "a tailored charcoal wool suit jacket over a crisp pale-blue dress shirt",
      lens: "35mm lens, shallow depth of field",
      lightDirection: "moody blue-hour dawn sidelight transitioning to warm golden sunrise",
    },
    scenes: [
      {
        sceneNumber: 1,
        timeRange: "0.0s – 6.0s",
        shotType: "Medium-Wide Surreal Ocean Desk Hook",
        shotSizeAndMove: "Medium-wide shot with a slow steady push-in",
        whatWeWant:
          "Single unbroken 6s shot of the executive calmly typing on a laptop at an oak desk standing chest-deep in dark crashing ocean waves, with clean sky in the top 25% for text.",
        singlePhysicalAction:
          "He sits calmly typing on a brushed aluminum laptop at a solid oak desk while dark ocean waves roll and splash against the desk legs.",
        environmentAndLighting:
          "Open grey-blue ocean surf at dawn with misty horizon in the upper third",
        sfx: "Heavy ocean wave splash and crisp mechanical laptop keystrokes",
        ambient: "Low coastal wind and distant surf rumble",
        onScreenText:
          "Typing 'No worries at all, happy to jump on a quick call!' on 4 hours of sleep and 3 espressos",
      },
      {
        sceneNumber: 2,
        timeRange: "6.0s – 12.0s",
        shotType: "Medium Sunlit Balcony Exhale Payoff",
        shotSizeAndMove: "Medium tracking shot following from behind",
        whatWeWant:
          "Single unbroken 6s shot setting down a glass of water beside a closed laptop and stepping onto a warm sunlit balcony with a full deep exhale, keeping upper-third negative space clean.",
        singlePhysicalAction:
          "A hand sets a frosted glass of mineral water onto a dry oak table beside a closed laptop, then walks out onto a sunlit balcony and lets out a slow, visible shoulder-dropping exhale.",
        environmentAndLighting:
          "Warm golden morning sunlight streaming through floor-to-ceiling glass balcony doors",
        sfx: "Crisp glass set down on oak wood and a deep human exhale",
        ambient: "Quiet morning air and soft distant birdsong",
        onScreenText: "Me 14 seconds after clicking Leave Meeting",
      },
    ],
    captionParts: {
      hookContinuation:
        "Nothing humbles you faster than typing 'Sounds great, let's circle back!' while your nervous system feels like it's standing chest-deep in the Baltic Sea.",
      educationalBridge:
        "When I was Head of Sales at BMW, I used to run on 4 hours of fragmented sleep and 3 morning espressos—wondering why I felt exhausted at 7:00 AM yet completely wired at 11:00 PM. Biologically, chronic late-night screen work and immediate morning caffeine invert your cortisol-melatonin curve, trapping your brain in low-grade fight-or-flight all day. You don't fix an inverted stress curve with a rigid 30-day boot camp; you recalibrate it in one structured 24-hour reset.",
      committedCta:
        "Comment RESET and I'll DM you the free 60-second Burnout & Nervous System Diagnostic I built after leaving corporate.",
    },
    commentAutoReply:
      "Just sent the free 60-second Diagnostic to your DMs! Check your message requests.",
    dmOpeningMessage:
      "Hey! Reiko's team here. Glad that video hit home! Here is the free 60-Second Burnout & Nervous System Diagnostic -> https://perfectdayreset.com/quiz — it identifies your exact stress bottleneck and maps out a custom 24-hour reset around your wake time.",
  },
  {
    id: "cortisol-2-bmw-m5-trojan-horse",
    archetypeId: "cortisol_spiked",
    archetypeName: "Cortisol-Spiked High Performer",
    angleTitle: "The €145,000 BMW M5 Buyer Who Fell Asleep in the Dealership Lot",
    viralFormat: "trojan_horse_story",
    viralFormatLabel: "BMW Trojan Horse Story",
    targetLengthSeconds: 24,
    pacingRule: "4-scene insider dealership story (6.0s per continuous shot)",
    psychologicalAngle:
      "Trojan Horse storytelling: hooks the viewer with an unforgettable true story from the BMW showroom floor before connecting the dots to executive nervous system exhaustion in the caption.",
    cameraSpec:
      "35mm lens, shallow depth of field, twilight showroom glass reflections, upper-third negative space",
    sceneBible: {
      cast: "A 41-year-old founder with dark neatly combed hair, tired circles under his eyes, and a calm expression",
      wardrobe: "a navy cashmere blazer over a charcoal crewneck knit shirt",
      lens: "35mm lens, shallow depth of field",
      lightDirection: "cool twilight dealership glass light with soft warm overhead key light",
    },
    scenes: [
      {
        sceneNumber: 1,
        timeRange: "0.0s – 6.0s",
        shotType: "Medium Over-the-Shoulder Showroom Contract Shot",
        shotSizeAndMove: "Medium shot with a slow push-in",
        whatWeWant:
          "Single unbroken shot of the founder rubbing his tired eyes while holding a pen over a leather delivery folder beside a matte-black sedan.",
        singlePhysicalAction:
          "He sits at a glass dealership desk holding a heavy metal pen over a leather folder and rubs his tired eyes with his free hand.",
        environmentAndLighting:
          "Modern luxury automotive showroom at twilight with soft blurred ceiling lights in the upper third",
        sfx: "Subtle metal pen click and soft leather folder rustle",
        ambient: "Quiet luxury showroom room tone",
        onScreenText:
          "I watched a 41-year-old founder buy a €145,000 BMW M5 in cash...",
      },
      {
        sceneNumber: 2,
        timeRange: "6.0s – 12.0s",
        shotType: "Medium Exterior Car Window Shot",
        shotSizeAndMove: "Medium shot with a slow lateral dolly move",
        whatWeWant:
          "Single unbroken shot looking through the side window of a parked black sedan as the founder leans his head back against the leather headrest with eyes closed.",
        singlePhysicalAction:
          "Sitting in the driver seat of the parked black performance sedan, he rests his head back against the leather headrest and closes his eyes before even starting the engine.",
        environmentAndLighting:
          "Evening dealership parking lot with soft bokeh streetlights in the upper third",
        sfx: "Soft car door seal thud and quiet leather creak",
        ambient: "Distant muffled evening city rain",
        onScreenText:
          "...and fall asleep in the driver's seat before leaving the parking lot.",
      },
      {
        sceneNumber: 3,
        timeRange: "12.0s – 18.0s",
        shotType: "Medium-Close Dashboard Espresso & Phone Shot",
        shotSizeAndMove: "Medium-close shot with a slow push-in",
        whatWeWant:
          "Single unbroken shot of his hand turning off a buzzing phone on the center console while letting out a quiet sigh.",
        singlePhysicalAction:
          "His hand reaches down to flip a buzzing smartphone face-down on the console beside a paper espresso cup, and his shoulders drop in relief.",
        environmentAndLighting:
          "Warm amber dashboard glow inside the dark cabin with soft blurred windshield above",
        sfx: "Brief phone vibration cut short as it touches the console",
        ambient: "Silent insulated car cabin tone",
        onScreenText:
          "When you have €145k for your dream car, but zero energy left to drive it home.",
      },
      {
        sceneNumber: 4,
        timeRange: "18.0s – 24.0s",
        shotType: "Medium Morning Sunlit Kitchen Table Shot",
        shotSizeAndMove: "Medium shot with a slow gentle pan",
        whatWeWant:
          "Single unbroken shot of the same founder standing by a sunlit oak window drinking mineral water in total morning quiet.",
        singlePhysicalAction:
          "He stands calmly by a sunlit oak table drinking from a tall glass of water while looking out at the morning trees.",
        environmentAndLighting:
          "Warm golden morning sunlight streaming across a minimalist room with soft wall space in the upper third",
        sfx: "Crisp glass sip and a slow calm breath",
        ambient: "Peaceful morning room tone and distant birdsong",
        onScreenText:
          "The Sunday he finally turned his phone off for 24 hours straight",
      },
    ],
    captionParts: {
      hookContinuation:
        "I will never forget handing over the keys to a €145,000 M5 and watching the buyer fall asleep in the driver's seat before he even put it in drive.",
      educationalBridge:
        "During my years as Head of Sales at Inchcape Motors BMW, I met dozens of founders and executives who had won the financial game—yet their nervous systems were running on pure fumes. When you spend years waking up to Slack pings and overriding exhaustion with four espressos before noon, your HPA-axis stays locked in sympathetic overdrive. You don't need a 30-day retreat in Bali to feel human again; you need 24 intentional hours to clear adenosine, stabilize blood sugar, and let your nervous system down-regulate.",
      committedCta:
        "Comment RESET and I'll DM you the free 60-second Burnout & Nervous System Diagnostic I built after leaving corporate.",
    },
    commentAutoReply:
      "Just sent the free 60-second Diagnostic to your DMs! Check your message requests.",
    dmOpeningMessage:
      "Hey! Reiko's team here. That BMW showroom story is the exact reason Perfect Day Reset exists. Take the free 60-Second Burnout & Nervous System Diagnostic here -> https://perfectdayreset.com/quiz",
  },
  {
    id: "cortisol-3-coffee-oil-overflow",
    archetypeId: "cortisol_spiked",
    archetypeName: "Cortisol-Spiked High Performer",
    angleTitle: "POV: Your 3rd Espresso Before 9:30 AM Trying to Fix 5 Hours of Sleep",
    viralFormat: "forensic_curiosity_hook",
    viralFormatLabel: "Forensic Curiosity Hook",
    targetLengthSeconds: 12,
    pacingRule: "2-cut visual comedy & relief loop (6.0s per continuous shot)",
    psychologicalAngle:
      "Relatable caffeine humor: poking fun at the executive ritual of using a triple espresso as duct tape over sleep debt.",
    cameraSpec:
      "35mm macro-documentary lens, shallow depth of field, natural morning sidelight",
    sceneBible: {
      cast: "A 38-year-old executive with neatly styled dark-brown hair and rolled-up shirt sleeves",
      wardrobe: "a crisp white Oxford shirt with sleeves rolled to the forearms and a minimalist steel watch",
      lens: "35mm lens, shallow depth of field",
      lightDirection: "cool morning window sidelight transitioning to warm sunlit oak tones",
    },
    scenes: [
      {
        sceneNumber: 1,
        timeRange: "0.0s – 6.0s",
        shotType: "Medium-Close Espresso Overflow Shot",
        shotSizeAndMove: "Medium-close shot with a slow push-in",
        whatWeWant:
          "Single unbroken shot of dark espresso slowly overflowing the rim of a white ceramic cup onto a saucer while the executive stares at it deadpan.",
        singlePhysicalAction:
          "He stands at a marble counter staring deadpan as dark espresso brims over the top of a small ceramic cup onto the saucer.",
        environmentAndLighting:
          "Minimalist kitchen counter in cool early morning light with soft blurred wall in the upper third",
        sfx: "Espresso machine drip and gentle liquid spill onto porcelain",
        ambient: "Quiet morning kitchen hum",
        onScreenText:
          "My 3rd espresso at 9:15 AM trying to hold my entire personality together",
      },
      {
        sceneNumber: 2,
        timeRange: "6.0s – 12.0s",
        shotType: "Medium Sunlit Hydration & Window Shot",
        shotSizeAndMove: "Medium shot with a slow dolly in",
        whatWeWant:
          "Single unbroken shot of the executive sliding the coffee cup aside, picking up a tall glass of water in warm sunlight, and smiling with calm clarity.",
        singlePhysicalAction:
          "He gently slides the espresso saucer aside, picks up a tall glass of cold mineral water in the morning sun, and takes a calm sip.",
        environmentAndLighting:
          "Warm golden sunlight streaming through a tall window with clean negative space above",
        sfx: "Ceramic saucer slide on stone and crisp water glass lift",
        ambient: "Warm quiet morning room tone",
        onScreenText:
          "When you actually wait 90 minutes before your first coffee and don't crash at 2 PM",
      },
    ],
    captionParts: {
      hookContinuation:
        "We've all had that Tuesday morning where espresso #3 isn't for enjoyment—it's structural engineering.",
      educationalBridge:
        "When I was running sales teams at BMW, my coffee machine started before my eyes were even open. What nobody tells high performers is that caffeine doesn't create energy—it just blocks adenosine receptors. If you drink espresso within 15 minutes of waking while you're still dehydrated, all that trapped adenosine dumps back onto your brain at 2:15 PM the second the caffeine wears off. Delaying your first coffee by 90 minutes and anchoring your morning with mineral hydration + natural light eliminates the afternoon wall in a single day.",
      committedCta:
        "Comment RESET and I'll DM you the free 60-second Burnout & Nervous System Diagnostic I built after leaving corporate.",
    },
    commentAutoReply:
      "Sent the 60-Second Diagnostic straight to your DMs!",
    dmOpeningMessage:
      "Hey! Reiko's team here. Ready to ditch the 2:15 PM caffeine crash? Take the free 60-Second Diagnostic here -> https://perfectdayreset.com/quiz",
  },

  // ==========================================================
  // ARCHETYPE 2: DOPAMINE-DEPLETED MULTITASKER (3 Storyboards)
  // ==========================================================
  {
    id: "dopamine-1-highway-bed-purple-cow",
    archetypeId: "dopamine_depleted",
    archetypeName: "Dopamine-Depleted Multitasker",
    angleTitle: "The Highway Bed Anomaly: My Body at 11:45 PM vs. My Brain Replaying an Email",
    viralFormat: "purple_cow_loop",
    viralFormatLabel: "Purple Cow Loop",
    targetLengthSeconds: 12,
    pacingRule: "2-cut surreal loop (6.0s Highway Bed Visual Metaphor -> 6.0s Quiet Bedroom Relief)",
    psychologicalAngle:
      "Surreal visual comedy: showing what doomscrolling or checking work emails in bed actually feels like to a fried prefrontal cortex.",
    cameraSpec:
      "35mm lens, shallow depth of field, motion-blurred traffic vs. sunlit bedroom",
    sceneBible: {
      cast: "A 37-year-old creative director with tousled medium-brown hair and expressive eyes",
      wardrobe: "a heather-grey linen lounge shirt",
      lens: "35mm lens, shallow depth of field",
      lightDirection: "cool blue smartphone glow and streaking headlights transitioning to warm morning sunlight",
    },
    scenes: [
      {
        sceneNumber: 1,
        timeRange: "0.0s – 6.0s",
        shotType: "Medium-Wide Surreal Highway Bed Hook",
        shotSizeAndMove: "Medium-wide shot with a slow push-in",
        whatWeWant:
          "Single unbroken shot of the executive lying in a wooden bed with white linen sheets in the middle of a city avenue while blurred traffic streaks past.",
        singlePhysicalAction:
          "He lies propped against white linen pillows in a wooden bed staring at a glowing smartphone while blurred car headlights streak past on both sides.",
        environmentAndLighting:
          "Dusk city avenue with soft dark sky in the upper third of the frame",
        sfx: "Whooshing city traffic and subtle phone notification chime",
        ambient: "Low urban evening rumble",
        onScreenText:
          "My body in bed at 11:45 PM vs. my brain replaying an email from 2019",
      },
      {
        sceneNumber: 2,
        timeRange: "6.0s – 12.0s",
        shotType: "Medium Sunlit Nightstand Payoff Shot",
        shotSizeAndMove: "Medium shot with a slow pan",
        whatWeWant:
          "Single unbroken shot in a silent sunlit bedroom placing the phone face-down on a walnut nightstand and opening wooden blinds.",
        singlePhysicalAction:
          "In a quiet bedroom, he sets his smartphone face-down on a walnut nightstand and pulls open wooden blinds to let warm sunlight flood across the bed.",
        environmentAndLighting:
          "Quiet sunlit bedroom with soft warm wall space in the upper third",
        sfx: "Soft phone tap on wood and crisp wooden blinds opening",
        ambient: "Total morning stillness and gentle breeze",
        onScreenText:
          "Putting my phone in another room at 9:30 PM like it's a live grenade",
      },
    ],
    captionParts: {
      hookContinuation:
        "Why does lying in bed with your phone at 11:45 PM feel like camping on the center median of the Autobahn?",
      educationalBridge:
        "When I led sales at BMW, my phone was the last thing I touched at midnight and the first thing I touched at 6:15 AM. Every Slack message or news scroll in bed triggers a micro-spike of dopamine followed by an immediate cortisol alert—keeping your brain's threat-detection center scanning all night. Creating a 60-minute digital sunset at night and a 45-minute phone-free morning window gives you back 4 hours of deep, uninterrupted focus the very next day.",
      committedCta:
        "Comment RESET and I'll DM you the free 60-second Burnout & Nervous System Diagnostic I built after leaving corporate.",
    },
    commentAutoReply:
      "Just sent the 60-Second Focus & Nervous System Diagnostic to your DMs!",
    dmOpeningMessage:
      "Hey! Reiko's team here. Take the free 60-Second Focus & Burnout Diagnostic here -> https://perfectdayreset.com/quiz — it shows you how to reclaim deep focus in 24 hours.",
  },
  {
    id: "dopamine-2-two-executives-ab-timeline",
    archetypeId: "dopamine_depleted",
    archetypeName: "Dopamine-Depleted Multitasker",
    angleTitle: "47 Open Browser Tabs vs. The Guy Who Left His Phone in the Kitchen",
    viralFormat: "two_timelines_experiment",
    viralFormatLabel: "A/B Two Timelines",
    targetLengthSeconds: 18,
    pacingRule: "3-scene relatable workday contrast (6.0s per continuous shot)",
    psychologicalAngle:
      "Self-deprecating office humor contrasting the chaos of reactive multitasking with the calm of single-tasking.",
    cameraSpec:
      "35mm lens, shallow depth of field, natural office window light",
    sceneBible: {
      cast: "A 39-year-old executive with short dark hair and clean-shaven jawline",
      wardrobe: "a charcoal merino polo sweater and matte steel wristwatch",
      lens: "35mm lens, shallow depth of field",
      lightDirection: "natural side window light with soft upper-third wall space",
    },
    scenes: [
      {
        sceneNumber: 1,
        timeRange: "0.0s – 6.0s",
        shotType: "Medium Desk Multitasking Chaos Shot",
        shotSizeAndMove: "Medium shot with a slow push-in",
        whatWeWant:
          "Single unbroken shot of the executive staring at his laptop while his phone buzzes on the desk and he rubs his temples.",
        singlePhysicalAction:
          "Sitting at an oak desk, he glances back and forth between his laptop and a buzzing smartphone before rubbing his temples in disbelief.",
        environmentAndLighting:
          "Modern home office with soft neutral wall space in the upper third",
        sfx: "Rapid keyboard taps and repeated phone vibration on wood",
        ambient: "Quiet office room tone",
        onScreenText:
          "Me opening my 47th browser tab to research why I can't focus on tab #1",
      },
      {
        sceneNumber: 2,
        timeRange: "6.0s – 12.0s",
        shotType: "Medium Outdoor Pine Trail Walk Shot",
        shotSizeAndMove: "Medium tracking shot moving smoothly backward",
        whatWeWant:
          "Single unbroken shot of the executive walking calmly along a sunlit tree-lined path with hands in pockets and zero phone in sight.",
        singlePhysicalAction:
          "He walks at a relaxed pace along a sunlit gravel park path, looking up at the trees and breathing deeply with no phone in his hands.",
        environmentAndLighting:
          "Dappled afternoon sunlight filtering through green canopy in the upper third",
        sfx: "Crisp footsteps on gravel path",
        ambient: "Gentle breeze through leaves and distant birds",
        onScreenText:
          "Going for a 15-minute walk without a podcast or phone like a 19th-century poet",
      },
      {
        sceneNumber: 3,
        timeRange: "12.0s – 18.0s",
        shotType: "Medium Calm Deep Work Payoff Shot",
        shotSizeAndMove: "Medium shot with a slow dolly in",
        whatWeWant:
          "Single unbroken shot of the executive returning to a clean desk, closing his laptop with a satisfied nod at 4:30 PM.",
        singlePhysicalAction:
          "Sitting at a clutter-free oak desk in warm afternoon light, he finishes typing a final line and smoothly closes the laptop lid with a calm smile.",
        environmentAndLighting:
          "Warm golden late-afternoon window light with clean negative space above",
        sfx: "Final crisp keystroke and solid aluminum laptop lid close",
        ambient: "Calm afternoon room stillness",
        onScreenText:
          "Finishing 6 hours of work in 90 minutes when nobody pings you on Teams",
      },
    ],
    captionParts: {
      hookContinuation:
        "Tab #1: Q3 Revenue Forecast. Tab #47: 'Why does my left eye twitch when someone says quick sync?'",
      educationalBridge:
        "Context-switching is the silent killer of executive IQ. Every time you toggle between a spreadsheet, Slack, and your inbox, your prefrontal cortex pays a 23-minute 'attention residue' tax—burning through synaptic dopamine and glucose without actually finishing the hard thing. When I was Head of Sales at BMW, I learned that a 15-minute phone-free optic-flow walk followed by a single 90-minute single-tab block outperforms 8 hours of fragmented multitasking.",
      committedCta:
        "Comment RESET and I'll DM you the free 60-second Burnout & Nervous System Diagnostic I built after leaving corporate.",
    },
    commentAutoReply:
      "Sent the 60-Second Focus Diagnostic to your DMs!",
    dmOpeningMessage:
      "Hey! Reiko's team here. Close those 47 tabs and take the 60-Second Focus & Burnout Diagnostic here -> https://perfectdayreset.com/quiz",
  },
  {
    id: "dopamine-3-3pm-brain-fog-cure",
    archetypeId: "dopamine_depleted",
    archetypeName: "Dopamine-Depleted Multitasker",
    angleTitle: "POV: Reading the Same 3-Sentence Email 6 Times at 2:45 PM",
    viralFormat: "forensic_curiosity_hook",
    viralFormatLabel: "Forensic Curiosity Hook",
    targetLengthSeconds: 12,
    pacingRule: "2-cut afternoon brain fog comedy loop (6.0s per continuous shot)",
    psychologicalAngle:
      "Painfully relatable 2:45 PM brain fog humor that makes coworkers tag each other.",
    cameraSpec:
      "35mm lens, shallow depth of field, afternoon window light",
    sceneBible: {
      cast: "A 36-year-old executive woman with sleek chestnut hair in a low bun and intelligent eyes",
      wardrobe: "an ivory silk blouse and minimalist gold stud earrings",
      lens: "35mm lens, shallow depth of field",
      lightDirection: "soft afternoon window light from camera left",
    },
    scenes: [
      {
        sceneNumber: 1,
        timeRange: "0.0s – 6.0s",
        shotType: "Medium Afternoon Stare Hook Shot",
        shotSizeAndMove: "Medium shot with a slow push-in",
        whatWeWant:
          "Single unbroken shot of the executive staring blankly at her laptop screen at 2:45 PM, blinking slowly while holding a lukewarm coffee mug.",
        singlePhysicalAction:
          "She sits at her desk holding a ceramic mug mid-air, blinking slowly as she re-reads the same line on her laptop screen with a blank expression.",
        environmentAndLighting:
          "Afternoon office with soft blurred bookshelf in the upper third",
        sfx: "Single slow mouse click and a quiet sigh",
        ambient: "Soft office ventilation hum",
        onScreenText:
          "Reading the same 3-sentence email for the 6th time at 2:45 PM",
      },
      {
        sceneNumber: 2,
        timeRange: "6.0s – 12.0s",
        shotType: "Medium Sunlit Terrace Breath Payoff",
        shotSizeAndMove: "Medium shot with a slow pan",
        whatWeWant:
          "Single unbroken shot of her stepping outside onto a sunlit terrace, taking a double nasal inhale and long exhale as her posture resets.",
        singlePhysicalAction:
          "Standing outside on a sunlit stone terrace, she takes a deep breath in through her nose and exhales slowly as her shoulders relax.",
        environmentAndLighting:
          "Bright afternoon sunlight with soft green trees in the upper third",
        sfx: "Deep nasal inhale and slow steady exhale",
        ambient: "Fresh outdoor afternoon breeze",
        onScreenText:
          "What 10 minutes of actual daylight and oxygen does to a corporate brain",
      },
    ],
    captionParts: {
      hookContinuation:
        "At 2:45 PM the words in the email are technically in English, yet none of them are forming a sentence in your head.",
      educationalBridge:
        "That afternoon wall isn't a character flaw—it's the intersection of your natural circadian dip, indoor CO2 build-up, and prefrontal dopamine depletion from 5 straight hours of near-field screen focus. Reaching for a 3rd coffee at 3:00 PM only wrecks your deep sleep architecture that night. Stepping outside for 10 minutes of panoramic optic-flow walking paired with two physiological sighs resets your autonomic alertness in minutes.",
      committedCta:
        "Comment RESET and I'll DM you the free 60-second Burnout & Nervous System Diagnostic I built after leaving corporate.",
    },
    commentAutoReply:
      "Just DM'd you the 60-Second Afternoon Crash Diagnostic!",
    dmOpeningMessage:
      "Hey! Reiko's team here. Here is your free 60-Second Afternoon Crash & Focus Diagnostic -> https://perfectdayreset.com/quiz",
  },

  // ==========================================================
  // ARCHETYPE 3: METABOLIC MIDDAY CRASHER (3 Storyboards)
  // ==========================================================
  {
    id: "metabolic-1-215pm-desk-brick-wall",
    archetypeId: "metabolic_crasher",
    archetypeName: "Metabolic Midday Crasher",
    angleTitle: "POV: Fighting for Your Life on a 2:15 PM Zoom Call After a Heavy Lunch",
    viralFormat: "purple_cow_loop",
    viralFormatLabel: "Purple Cow Loop",
    targetLengthSeconds: 12,
    pacingRule: "2-cut post-lunch food coma comedy loop (6.0s per continuous shot)",
    psychologicalAngle:
      "Universal post-lunch Zoom coma humor that every office worker has experienced.",
    cameraSpec:
      "35mm lens, shallow depth of field, warm natural daylight",
    sceneBible: {
      cast: "A 42-year-old executive man with short dark hair and tailored navy overshirt",
      wardrobe: "a structured navy cotton overshirt over a white tee",
      lens: "35mm lens, shallow depth of field",
      lightDirection: "warm midday window light from the side",
    },
    scenes: [
      {
        sceneNumber: 1,
        timeRange: "0.0s – 6.0s",
        shotType: "Medium Post-Lunch Zoom Nod Shot",
        shotSizeAndMove: "Medium shot with a slow push-in",
        whatWeWant:
          "Single unbroken shot of the executive nodding earnestly at his laptop webcam while his eyelids fight gravity beside an empty takeout wrapper.",
        singlePhysicalAction:
          "He sits in front of his open laptop nodding politely at the webcam while his eyelids droop heavily and he tries to widen his eyes.",
        environmentAndLighting:
          "Midday study with clean softly blurred upper-third wall space",
        sfx: "Faint laptop fan hum and a quiet throat clear",
        ambient: "Warm quiet afternoon room tone",
        onScreenText:
          "Fighting for my life on a 2:15 PM Zoom call after eating a panini at my desk",
      },
      {
        sceneNumber: 2,
        timeRange: "6.0s – 12.0s",
        shotType: "Medium-Close Crisp Whole-Food Lunch Shot",
        shotSizeAndMove: "Medium-close shot with a slow overhead-angled push",
        whatWeWant:
          "Single unbroken shot squeezing fresh lemon over grilled salmon, avocado, and greens on a sunlit wood table.",
        singlePhysicalAction:
          "His hand squeezes a fresh lemon half over a stoneware bowl of grilled salmon, ripe avocado, and greens on a sunlit oak table.",
        environmentAndLighting:
          "Bright natural window light across a warm oak dining table with blurred background above",
        sfx: "Crisp citrus squeeze and fork clink against stoneware",
        ambient: "Bright daytime room ambiance",
        onScreenText:
          "Discovering you don't actually need a nap at 2 PM when lunch isn't 90g of refined carbs",
      },
    ],
    captionParts: {
      hookContinuation:
        "There is no battle on earth harder than trying to look 'strategic' on camera at 2:15 PM after a fast-casual sandwich.",
      educationalBridge:
        "When I was Head of Sales at BMW, I used to grab a quick pasta or sandwich between client meetings and wonder why my brain felt like wet cement by 2:30 PM. A starch-heavy lunch spikes blood glucose and triggers an aggressive insulin wave that drives blood sugar below baseline 90 minutes later—starving your prefrontal cortex of fuel and activating sleep-inducing orexin suppression. Switching to a protein-and-healthy-fat-first midday meal keeps your energy dead-flat until dinner.",
      committedCta:
        "Comment RESET and I'll DM you the free 60-second Burnout & Nervous System Diagnostic I built after leaving corporate.",
    },
    commentAutoReply:
      "Just sent the 60-Second Energy & Metabolic Diagnostic to your DMs!",
    dmOpeningMessage:
      "Hey! Reiko's team here. Take the free 60-Second Metabolic & Energy Diagnostic here -> https://perfectdayreset.com/quiz — it includes our 5 anti-crash meal tracks (Omni, Veg, Keto, Paleo & Vegan).",
  },
  {
    id: "metabolic-2-meal-prep-burnout-hook",
    archetypeId: "metabolic_crasher",
    archetypeName: "Metabolic Midday Crasher",
    angleTitle: "Sunday Night Meal-Prep Ambition vs. Wednesday Night Reality",
    viralFormat: "two_timelines_experiment",
    viralFormatLabel: "A/B Two Timelines",
    targetLengthSeconds: 12,
    pacingRule: "2-cut kitchen reality comedy loop (6.0s per continuous shot)",
    psychologicalAngle:
      "Poking fun at overly complicated 22-ingredient wellness meal prep vs. realistic 10-minute executive assembly.",
    cameraSpec:
      "35mm lens, shallow depth of field, warm kitchen lighting",
    sceneBible: {
      cast: "A 39-year-old executive woman with shoulder-length blonde hair and a relaxed smile",
      wardrobe: "an olive-green linen shirt with rolled sleeves",
      lens: "35mm lens, shallow depth of field",
      lightDirection: "warm evening kitchen pendant light",
    },
    scenes: [
      {
        sceneNumber: 1,
        timeRange: "0.0s – 6.0s",
        shotType: "Medium Tupperware Tower Sigh Shot",
        shotSizeAndMove: "Medium shot with a slow push-in",
        whatWeWant:
          "Single unbroken shot of her looking skeptically at a stack of empty plastic meal-prep containers on a kitchen island.",
        singlePhysicalAction:
          "She stands behind a kitchen island staring at a stack of plastic containers, then gently pushes the stack to the side with one finger.",
        environmentAndLighting:
          "Modern kitchen island with clean softly lit cabinetry in the upper third",
        sfx: "Light plastic container tap and a dry chuckle",
        ambient: "Quiet kitchen room tone",
        onScreenText:
          "Me buying 14 glass meal-prep containers on Sunday knowing full well I'll hate them by Tuesday",
      },
      {
        sceneNumber: 2,
        timeRange: "6.0s – 12.0s",
        shotType: "Medium-Close 5-Ingredient Cast-Iron Plate Shot",
        shotSizeAndMove: "Medium-close shot with a slow pan",
        whatWeWant:
          "Single unbroken shot plating seared steak strips, roasted greens, and olive oil onto a warm ceramic plate in seconds.",
        singlePhysicalAction:
          "She plates warm seared protein and greens from a cast-iron skillet onto a matte ceramic plate and drizzles olive oil over top.",
        environmentAndLighting:
          "Warm golden kitchen counter light with blurred upper-third background",
        sfx: "Gentle cast-iron sizzle and ceramic plate set down",
        ambient: "Cozy kitchen evening ambiance",
        onScreenText:
          "When you realize 5 whole ingredients in 10 minutes beats a 40-page diet binder every time",
      },
    ],
    captionParts: {
      hookContinuation:
        "Nobody with a full-time career and a family wants to spend 4 hours on Sunday weighing steamed broccoli into 14 identical plastic boxes.",
      educationalBridge:
        "Over 35+ years in competitive sports and corporate leadership at BMW, I watched 85% of high performers quit wellness programs by Day 4 because the nutrition rules required a culinary degree. Your metabolism doesn't care about fancy recipes—it cares about glycemic stability, clean protein, and micronutrients you can assemble in 10 minutes whether you eat Omnivore, Vegetarian, Keto, Paleo, or Vegan.",
      committedCta:
        "Comment RESET and I'll DM you the free 60-second Burnout & Nervous System Diagnostic I built after leaving corporate.",
    },
    commentAutoReply:
      "Sent the 60-Second Diagnostic & 5-Diet Preview to your DMs!",
    dmOpeningMessage:
      "Hey! Reiko's team here. Preview your custom 5-ingredient meal track inside the free 60-Second Diagnostic -> https://perfectdayreset.com/quiz",
  },
  {
    id: "metabolic-3-executive-lunch-trap",
    archetypeId: "metabolic_crasher",
    archetypeName: "Metabolic Midday Crasher",
    angleTitle: "The Bread Basket Stare-Down at Every Client Lunch",
    viralFormat: "trojan_horse_story",
    viralFormatLabel: "BMW Trojan Horse Story",
    targetLengthSeconds: 12,
    pacingRule: "2-cut client restaurant story (6.0s per continuous shot)",
    psychologicalAngle:
      "Relatable executive dining humor: the willpower battle against the complimentary warm bread basket before the menu even arrives.",
    cameraSpec:
      "35mm lens, shallow depth of field, warm restaurant window light",
    sceneBible: {
      cast: "A 43-year-old executive man with silver-flecked hair and a confident calm demeanor",
      wardrobe: "a tailored charcoal blazer over an open-collar white shirt",
      lens: "35mm lens, shallow depth of field",
      lightDirection: "warm restaurant window sidelight",
    },
    scenes: [
      {
        sceneNumber: 1,
        timeRange: "0.0s – 6.0s",
        shotType: "Medium Restaurant Table Bread Basket Shot",
        shotSizeAndMove: "Medium shot with a slow push-in",
        whatWeWant:
          "Single unbroken shot of the executive at a white-tablecloth bistro table looking at a warm bread basket before pouring sparkling water.",
        singlePhysicalAction:
          "Sitting at a sunlit restaurant table, he glances at a linen-lined bread basket, smiles knowingly, and pours sparkling mineral water into a crystal glass instead.",
        environmentAndLighting:
          "Upscale bistro with softly blurred warm interior in the upper third",
        sfx: "Crisp sparkling water pour and glass clink",
        ambient: "Low murmured restaurant dining room ambiance",
        onScreenText:
          "Me vs. the complimentary warm sourdough basket 30 seconds into a client lunch",
      },
      {
        sceneNumber: 2,
        timeRange: "6.0s – 12.0s",
        shotType: "Medium Post-Lunch City Walk Shot",
        shotSizeAndMove: "Medium tracking shot walking along a sunny sidewalk",
        whatWeWant:
          "Single unbroken shot of the executive walking briskly and sharply down a sunlit city sidewalk after lunch with zero sluggishness.",
        singlePhysicalAction:
          "He walks briskly along a sunlit tree-lined avenue after lunch, checking his watch with sharp, alert energy.",
        environmentAndLighting:
          "Sunny afternoon city street with soft architectural bokeh in the upper third",
        sfx: "Crisp leather shoe footsteps on pavement",
        ambient: "Light daytime city breeze",
        onScreenText:
          "Walking into the 2:00 PM negotiation wide awake while everyone else is in a carb coma",
      },
    ],
    captionParts: {
      hookContinuation:
        "That warm restaurant bread basket has undefeated closing stats against hungry executives.",
      educationalBridge:
        "During my years negotiating fleet deals as Head of Sales at BMW, client lunches were mandatory—and I noticed whoever ate the bread basket and risotto on an empty stomach lost their edge by 2:30 PM. Eating naked carbohydrates first causes a rapid glucose spike followed by a post-prandial dip right in the middle of your afternoon meetings. Ordering sparkling water + protein and greens first, followed by a 10-minute walk back to the office, flattens that glucose curve by up to 60%.",
      committedCta:
        "Comment RESET and I'll DM you the free 60-second Burnout & Nervous System Diagnostic I built after leaving corporate.",
    },
    commentAutoReply:
      "Just sent the 60-Second Executive Energy Diagnostic to your DMs!",
    dmOpeningMessage:
      "Hey! Reiko's team here. Take the free 60-Second Executive Energy Diagnostic here -> https://perfectdayreset.com/quiz",
  },

  // ==========================================================
  // ARCHETYPE 4: SYSTEMIC BURNOUT RECOVERY (3 Storyboards)
  // ==========================================================
  {
    id: "burnout-1-rigid-schedule-shatter",
    archetypeId: "burnout_recovery" as any,
    archetypeName: "Systemic Burnout Recovery",
    angleTitle: "5:00 AM Influencer Routine vs. One 9:15 AM Meeting Running Late",
    viralFormat: "purple_cow_loop",
    viralFormatLabel: "Purple Cow Loop",
    targetLengthSeconds: 12,
    pacingRule: "2-cut routine perfectionism comedy loop (6.0s per continuous shot)",
    psychologicalAngle:
      "Mocking unrealistic 17-step '5 AM CEO routines' that collapse the second real life happens at 9:15 AM.",
    cameraSpec:
      "35mm lens, shallow depth of field, warm morning desk light",
    sceneBible: {
      cast: "A 40-year-old executive man with short brown hair and relatable expressive eyes",
      wardrobe: "a navy merino crew sweater",
      lens: "35mm lens, shallow depth of field",
      lightDirection: "warm morning window light from camera right",
    },
    scenes: [
      {
        sceneNumber: 1,
        timeRange: "0.0s – 6.0s",
        shotType: "Medium Color-Coded Planner Sigh Shot",
        shotSizeAndMove: "Medium shot with a slow push-in",
        whatWeWant:
          "Single unbroken shot of the executive looking at a color-coded paper planner at 9:15 AM and closing it with a resigned laugh.",
        singlePhysicalAction:
          "Sitting at his oak desk, he looks at a tightly written paper schedule, glances at his watch, and closes the notebook with a wry, relatable head shake.",
        environmentAndLighting:
          "Warm sunlit study with clean upper-third wall space",
        sfx: "Crisp paper notebook snap shut and a quiet laugh",
        ambient: "Quiet morning study room tone",
        onScreenText:
          "My 14-step '5:00 AM CEO Morning Routine' the second one 9:00 AM call runs 12 minutes late",
      },
      {
        sceneNumber: 2,
        timeRange: "6.0s – 12.0s",
        shotType: "Medium Calm Coffee & Reset Shot",
        shotSizeAndMove: "Medium shot with a slow pan",
        whatWeWant:
          "Single unbroken shot of the executive tapping his phone once, setting it down, and enjoying a calm morning by the window.",
        singlePhysicalAction:
          "He taps his phone screen once on the desk, sets it down effortlessly, and leans back in his chair looking out the sunlit window.",
        environmentAndLighting:
          "Golden morning sunlight across the desk with soft negative space above",
        sfx: "Single soft screen tap and chair leather creak",
        ambient: "Calm morning room stillness",
        onScreenText:
          "When your schedule actually adapts to real life instead of making you start over next Monday",
      },
    ],
    captionParts: {
      hookContinuation:
        "Nothing ruins a 'perfect routine' faster than a real job, a real family, and a 9:00 AM call that goes 12 minutes over.",
      educationalBridge:
        "All-or-nothing perfectionism is why 85% of high performers abandon rigid 30-day wellness challenges by Day 4. When you're already operating at 98% capacity, a static schedule that breaks the moment a meeting runs late just adds guilt on top of exhaustion. After 35+ years in competitive sports and leading BMW sales, I built a 24-hour protocol with an adaptive 1-tap delay rescheduler—so if your day shifts by 30 minutes, your plan shifts with you.",
      committedCta:
        "Comment RESET and I'll DM you the free 60-second Burnout & Nervous System Diagnostic I built after leaving corporate.",
    },
    commentAutoReply:
      "Sent the 60-Second Burnout Diagnostic to your DMs!",
    dmOpeningMessage:
      "Hey! Reiko's team here. Ditch the rigid 30-day guilt and take the free 60-Second Burnout Diagnostic here -> https://perfectdayreset.com/quiz",
  },
  {
    id: "burnout-2-sunday-scaries-30day-myth",
    archetypeId: "systemic_burnout",
    archetypeName: "Systemic Burnout Recovery",
    angleTitle: "Sunday at 4:00 PM: When the Weekend Didn't Even Touch Your Exhaustion",
    viralFormat: "trojan_horse_story",
    viralFormatLabel: "BMW Trojan Horse Story",
    targetLengthSeconds: 12,
    pacingRule: "2-cut Sunday reflection story (6.0s per continuous shot)",
    psychologicalAngle:
      "Validating the exact feeling of 'Sunday Scaries' when two days on the couch still leaves you exhausted for Monday.",
    cameraSpec:
      "35mm lens, shallow depth of field, golden Sunday afternoon light",
    sceneBible: {
      cast: "A 41-year-old executive with short salt-and-pepper hair and thoughtful expression",
      wardrobe: "an oatmeal cashmere crewneck sweater",
      lens: "35mm lens, shallow depth of field",
      lightDirection: "warm late-afternoon Sunday sunlight",
    },
    scenes: [
      {
        sceneNumber: 1,
        timeRange: "0.0s – 6.0s",
        shotType: "Medium Sunday Couch Stare Shot",
        shotSizeAndMove: "Medium shot with a slow push-in",
        whatWeWant:
          "Single unbroken shot of the executive sitting on a linen sofa on Sunday afternoon staring out the window with his phone in hand.",
        singlePhysicalAction:
          "He sits on a linen sofa holding his phone, looking out the window with a tired, distant expression as late-afternoon shadows lengthen.",
        environmentAndLighting:
          "Quiet living room at dusk with soft wall space in the upper third",
        sfx: "Soft fabric rustle and a slow deep sigh",
        ambient: "Quiet Sunday evening room tone",
        onScreenText:
          "Me at 4:30 PM on Sunday realizing I spent 48 hours 'resting' and I'm still exhausted for Monday",
      },
      {
        sceneNumber: 2,
        timeRange: "6.0s – 12.0s",
        shotType: "Medium Evening Journal & Tea Payoff Shot",
        shotSizeAndMove: "Medium shot with a slow dolly in",
        whatWeWant:
          "Single unbroken shot writing three lines in a leather notebook beside a warm lamp and closing the cover with genuine peace.",
        singlePhysicalAction:
          "Sitting at a warm wooden table, he writes a final line in a linen notebook with a fountain pen and closes the cover with a calm smile.",
        environmentAndLighting:
          "Warm amber table lamp light with soft dark negative space in the upper third",
        sfx: "Fountain pen stroke on paper and soft notebook cover close",
        ambient: "Peaceful evening room stillness",
        onScreenText:
          "What happens when you do an actual nervous system reset instead of doomscrolling on the couch",
      },
    ],
    captionParts: {
      hookContinuation:
        "Why can you spend an entire weekend on the couch and still wake up Monday morning feeling like you never stopped working?",
      educationalBridge:
        "Because passive couch rest while checking emails and scrolling social media doesn't rest your nervous system—it keeps your brain in 'open-loop' cognitive load. When I hit corporate burnout as Head of Sales at BMW, I realized true recovery requires active vagal decompression: morning solar light, stable blood sugar, outdoor movement, and an evening cognitive offload that empties Monday's mental tabs out of your head before sleep. One intentional Sunday resets what ten passive weekends can't.",
      committedCta:
        "Comment RESET and I'll DM you the free 60-second Burnout & Nervous System Diagnostic I built after leaving corporate.",
    },
    commentAutoReply:
      "Just sent the 60-Second Sunday Reset Diagnostic to your DMs!",
    dmOpeningMessage:
      "Hey! Reiko's team here. Make this Sunday actually restore your energy—take the free 60-Second Diagnostic here -> https://perfectdayreset.com/quiz",
  },
  {
    id: "burnout-3-emergency-2hour-tuesday-triage",
    archetypeId: "systemic_burnout",
    archetypeName: "Systemic Burnout Recovery",
    angleTitle: "When It's Only Tuesday at 11:30 AM and It Already Feels Like Friday",
    viralFormat: "forensic_curiosity_hook",
    viralFormatLabel: "Forensic Curiosity Hook",
    targetLengthSeconds: 12,
    pacingRule: "2-cut mid-week workday rescue loop (6.0s per continuous shot)",
    psychologicalAngle:
      "Classic mid-week corporate humor ('How is it only Tuesday?') paired with a realistic mid-day reset.",
    cameraSpec:
      "35mm lens, shallow depth of field, crisp office daylight",
    sceneBible: {
      cast: "A 38-year-old executive woman with dark-brown hair and sharp blazer",
      wardrobe: "a camel wool blazer over a crisp white tee",
      lens: "35mm lens, shallow depth of field",
      lightDirection: "bright natural midday window light",
    },
    scenes: [
      {
        sceneNumber: 1,
        timeRange: "0.0s – 6.0s",
        shotType: "Medium Tuesday Calendar Disbelief Shot",
        shotSizeAndMove: "Medium shot with a slow push-in",
        whatWeWant:
          "Single unbroken shot of her looking at her laptop calendar on a chaotic Tuesday morning and leaning back in her chair.",
        singlePhysicalAction:
          "Sitting at her desk, she looks at her packed laptop screen, checks the day of the week on her watch, and leans back in disbelief.",
        environmentAndLighting:
          "Modern bright office with clean upper-third wall space",
        sfx: "Gentle office chair lean and a relatable exhale",
        ambient: "Quiet office room tone",
        onScreenText:
          "Checking the calendar after surviving 4 back-to-back crises and realizing it's Tuesday at 11:15 AM",
      },
      {
        sceneNumber: 2,
        timeRange: "6.0s – 12.0s",
        shotType: "Medium Outdoor Park Bench Reset Shot",
        shotSizeAndMove: "Medium shot with a slow pan",
        whatWeWant:
          "Single unbroken shot of her walking outside in the sun with a bottle of mineral water, visibly recharging.",
        singlePhysicalAction:
          "She walks along a sunlit courtyard path holding a glass bottle of mineral water, rolling her shoulders back as her expression brightens.",
        environmentAndLighting:
          "Warm midday sunlight with soft green foliage in the upper third",
        sfx: "Crisp footsteps on stone and a deep refreshing breath",
        ambient: "Gentle outdoor midday breeze",
        onScreenText:
          "Me taking a ruthless 2-hour no-phone midday reset so I don't quit my job by Thursday",
      },
    ],
    captionParts: {
      hookContinuation:
        "There is no calendar math more disrespectful than working 18 hours of emergencies and finding out it's still Tuesday before lunch.",
      educationalBridge:
        "Sometimes you can't wait until Sunday for a full 24-hour reset—you're getting crushed on a chaotic Tuesday and need to stop the cortisol spiral right now. That's why we built the 2-Hour Emergency Workday Triage protocol: 15 minutes of mineral hydration and physiological sighs to drop heart rate, a 30-minute protein-first lunch with a no-phone outdoor walk, and a 75-minute single-tab focus lock.",
      committedCta:
        "Comment RESET and I'll DM you the free 60-second Burnout & Nervous System Diagnostic I built after leaving corporate.",
    },
    commentAutoReply:
      "Sent the 60-Second Diagnostic & Mid-Week Triage preview to your DMs!",
    dmOpeningMessage:
      "Hey! Reiko's team here. Surviving a chaotic week? Take the free 60-Second Burnout & Energy Diagnostic here -> https://perfectdayreset.com/quiz",
  },
];

// Normalize archetypeId on burnout-1 and build the full 6-block Veo 3.1 prompts + master Agent prompts
export const FLOW_ULTRA_PACKAGES: FlowUltraVideoPackage[] = RAW_SEEDS.map((seed) => {
  const normalizedArchetypeId =
    (seed.archetypeId as string) === "burnout_recovery"
      ? "systemic_burnout"
      : seed.archetypeId;

  const builtScenes: FlowUltraScene[] = seed.scenes.map((s) => {
    const flowUltraPrompt = buildSixBlockVeoPrompt({
      shotSizeAndMove: s.shotSizeAndMove,
      sceneBible: seed.sceneBible,
      singlePhysicalAction: s.singlePhysicalAction,
      environmentAndLighting: s.environmentAndLighting,
      sfx: s.sfx,
      ambient: s.ambient,
    });

    return {
      sceneNumber: s.sceneNumber,
      timeRange: s.timeRange,
      shotType: s.shotType,
      whatWeWant: s.whatWeWant,
      whatWeDontWant: STANDARD_NEGATIVE_PROMPT,
      negativePrompt: STANDARD_NEGATIVE_PROMPT,
      flowUltraPrompt,
      onScreenText: s.onScreenText,
      soundCue: `SFX: ${s.sfx}. Ambient noise: ${s.ambient}. No spoken dialogue and no background music.`,
    };
  });

  const flowAgentPrompt = buildFlowAgentMasterBrief(
    seed.angleTitle,
    seed.sceneBible,
    builtScenes
  );

  const caption = assembleThreeLayerCaption(seed.captionParts);

  return {
    id: seed.id,
    archetypeId: normalizedArchetypeId,
    archetypeName: seed.archetypeName,
    angleTitle: seed.angleTitle,
    viralFormat: seed.viralFormat,
    viralFormatLabel: seed.viralFormatLabel,
    targetLengthSeconds: seed.targetLengthSeconds,
    durationSeconds: seed.targetLengthSeconds,
    pacingRule: seed.pacingRule,
    psychologicalAngle: seed.psychologicalAngle,
    aspectRatio: "9:16",
    cameraSpec: seed.cameraSpec,
    sceneBible: seed.sceneBible,
    flowUltraPrompt: builtScenes[0].flowUltraPrompt,
    flowAgentPrompt,
    scenes: builtScenes,
    onScreenTextHook: {
      hook0to3s: builtScenes[0]?.onScreenText || "",
      payoff3to8s: builtScenes[1]?.onScreenText || "",
      ctaEndCard: "See caption for the free 60-Second Diagnostic (Comment RESET)",
    },
    captionParts: seed.captionParts,
    caption,
    commentAutoReply: seed.commentAutoReply,
    dmOpeningMessage: seed.dmOpeningMessage,
  };
});

export function getFlowUltraPackageById(
  packageId: string
): FlowUltraVideoPackage | undefined {
  return FLOW_ULTRA_PACKAGES.find((p) => p.id === packageId);
}

export const MANYCHAT_AUTOMATION_CONFIG = {
  platform: ["Instagram Reels", "TikTok", "YouTube Shorts"],
  funnelArchitecture:
    "Layer 1: 100% Entertainment Video (Zero Ads/Zero On-Screen CTAs) -> Layer 2: Founder Education in Caption -> Layer 3: Comment RESET at Bottom of Caption",
  triggerType: "COMMENT_KEYWORD",
  keywords: ["RESET", "reset", "Reset", "PROTOCOL", "QUIZ"],
  publicReplyDelaySeconds: 8,
  webhookEndpoint: "https://perfectdayreset.com/api/agent/dm-reply",
  webhookMethod: "POST",
  webhookHeaders: {
    "Content-Type": "application/json",
    "X-Agent-Secret": "{{AGENT_WEBHOOK_SECRET}}",
  },
  webhookPayloadTemplate: {
    platform: "instagram",
    handle: "{{user_handle}}",
    message: "{{last_input_text}}",
    triggerType: "comment",
    archetypeHint: "cortisol_spiked",
  },
  conversionFlow: [
    "1. Viewer watches 100% entertainment POV/story video (zero ads on screen) and reads the BMW founder educational caption.",
    "2. Viewer comments 'RESET' -> ManyChat posts rotating public comment reply & sends personalized DM with https://perfectdayreset.com/quiz.",
    "3. Viewer completes 60-second Diagnostic Quiz -> captured in agent_leads -> Autonomous 4-Stage Email Nurture sends Stage 1 immediately.",
    "4. If prospect replies to any DM or email with a question -> Two-Way Closer answers and guides to $19 Checkout (+ $12 Order Bump).",
  ],
};

export function getFlowUltraBatch(
  archetypeFilter?: string,
  viralFormatFilter?: string
) {
  let packages = FLOW_ULTRA_PACKAGES;

  if (archetypeFilter && archetypeFilter !== "all") {
    packages = packages.filter((p) => p.archetypeId === archetypeFilter);
  }

  if (viralFormatFilter && viralFormatFilter !== "all") {
    packages = packages.filter((p) => p.viralFormat === viralFormatFilter);
  }

  return {
    totalPackages: packages.length,
    flowAgentConstitution: FLOW_AGENT_CONSTITUTION,
    productionSpecs: {
      model: "Google Flow Ultra (Veo 3.1 6-Block Single-Shot Syntax)",
      aspectRatio: "9:16 Vertical (1080x1920)",
      cameraAesthetic:
        "35mm lens, shallow depth of field, upper-third negative space lock, Scene Bible continuity",
      conversionFlow:
        "Entertain First (Video) -> Educate Second (Caption Body) -> Convert Third ('Comment RESET' at Bottom of Caption)",
    },
    manyChatAutomationConfig: MANYCHAT_AUTOMATION_CONFIG,
    packages,
  };
}
