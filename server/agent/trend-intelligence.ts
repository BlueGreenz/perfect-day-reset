import fs from "fs";
import os from "os";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";
import ffmpegStatic from "ffmpeg-static";
import { storage } from "../storage";
import type { AgentTrendBlueprint, InsertAgentTrendBlueprint } from "@shared/schema";
import {
  assembleThreeLayerCaption,
  buildFlowAgentMasterBrief,
  buildSixBlockVeoPrompt,
  registerDynamicFlowUltraPackage,
  STANDARD_NEGATIVE_PROMPT,
  type CaptionThreeLayerBreakdown,
  type EditingTrickType,
  type FlowUltraScene,
  type FlowUltraVideoPackage,
  type SceneBibleSpec,
  type ViralFormatType,
} from "./flow-ultra-factory";

const execFileAsync = promisify(execFile);
const FFMPEG_BIN = (ffmpegStatic as unknown as string) || "ffmpeg";

export type TrendCategoryType =
  | "newsjack_cultural"
  | "editing_trick_trend"
  | "trending_audio_sync"
  | "niche_viral_outlier"
  | "url_clone";

export interface TrendDeconstruction {
  visualHookMechanic: string;
  editingTrickBreakdown: string;
  audioSyncRule: string;
  humorContrastFormula: string;
  shareTrigger: string;
}

export interface ScrapedNewsTopic {
  title: string;
  sourceUrl: string;
  approxTraffic: string;
  publishedAt: string;
}

export interface ScrapedTikTokOutlier {
  videoId: string;
  title: string;
  authorHandle: string;
  sourceUrl: string;
  videoDownloadUrl: string;
  views: number;
  shares: number;
  comments: number;
  viralVelocityScore: number;
  trendingSoundTitle: string;
  trendingSoundAuthor: string;
  trendingSoundUrl: string;
  detectedBeatDropSec: string;
  inferredEditingTrick: EditingTrickType;
}

export interface HydratedTrendBlueprint extends AgentTrendBlueprint {
  deconstruction: TrendDeconstruction;
  generatedPackage: FlowUltraVideoPackage;
}

const ARCHETYPE_LABELS: Record<FlowUltraVideoPackage["archetypeId"], string> = {
  cortisol_spiked: "Cortisol-Spiked High Performer",
  dopamine_depleted: "Dopamine-Depleted Multitasker",
  metabolic_crasher: "Metabolic Midday Crasher",
  systemic_burnout: "Systemic Burnout Recovery",
};

const EDITING_TRICK_LABELS: Record<EditingTrickType, string> = {
  beat_drop_match_cut: "Beat-Drop Match Cut",
  freeze_frame_hook: "Freeze-Frame Contrast Hook",
  infinite_loop_cut: "Seamless Infinite Loop Cut",
  zoom_punch_contrast: "Deadpan 1.12x Zoom-Punch",
  deadpan_single_take: "Unbroken Deadpan Single-Take",
};

function sanitizeNoQuotes(str: string): string {
  return str.replace(/["“”]/g, "'").trim();
}

function buildDynamicPackageFromSeed(params: {
  id: string;
  archetypeId: FlowUltraVideoPackage["archetypeId"];
  angleTitle: string;
  viralFormat: ViralFormatType;
  viralFormatLabel: string;
  editingTrick: EditingTrickType;
  beatDropSec: string;
  trendingSoundTitle: string;
  trendingSoundAuthor: string;
  trendingSoundUrl: string;
  trendCategory: TrendCategoryType;
  viralVelocityScore: number;
  psychologicalAngle: string;
  sceneBible: SceneBibleSpec;
  rawScenes: Array<{
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
}): FlowUltraVideoPackage {
  const builtScenes: FlowUltraScene[] = params.rawScenes.map((s) => {
    const cleanAction = sanitizeNoQuotes(s.singlePhysicalAction);
    const cleanEnv = sanitizeNoQuotes(s.environmentAndLighting);
    const cleanSfx = sanitizeNoQuotes(s.sfx);
    const cleanAmbient = sanitizeNoQuotes(s.ambient);
    const flowUltraPrompt = buildSixBlockVeoPrompt({
      shotSizeAndMove: sanitizeNoQuotes(s.shotSizeAndMove),
      sceneBible: {
        cast: sanitizeNoQuotes(params.sceneBible.cast),
        wardrobe: sanitizeNoQuotes(params.sceneBible.wardrobe),
        lens: sanitizeNoQuotes(params.sceneBible.lens),
        lightDirection: sanitizeNoQuotes(params.sceneBible.lightDirection),
      },
      singlePhysicalAction: cleanAction,
      environmentAndLighting: cleanEnv,
      sfx: cleanSfx,
      ambient: cleanAmbient,
    });
    return {
      sceneNumber: s.sceneNumber,
      timeRange: s.timeRange,
      shotType: s.shotType,
      whatWeWant: s.whatWeWant,
      whatWeDontWant:
        "No internal cuts, no camera angle changes, no gibberish text or UI on screens, no distorted fingers, no sales pitch on screen.",
      negativePrompt: STANDARD_NEGATIVE_PROMPT,
      flowUltraPrompt,
      onScreenText: s.onScreenText,
      soundCue: `SFX: ${cleanSfx} | Ambient: ${cleanAmbient} | Beat Sync @ ${params.beatDropSec}s`,
    };
  });

  const targetLengthSeconds = builtScenes.length * 6;
  const flowAgentPrompt = buildFlowAgentMasterBrief(
    params.angleTitle,
    params.sceneBible,
    builtScenes
  );
  const caption = assembleThreeLayerCaption(params.captionParts);
  const trickLabel = EDITING_TRICK_LABELS[params.editingTrick] || "Beat-Drop Match Cut";

  const pkg: FlowUltraVideoPackage = {
    id: params.id,
    archetypeId: params.archetypeId,
    archetypeName: ARCHETYPE_LABELS[params.archetypeId] || "Cortisol-Spiked High Performer",
    angleTitle: params.angleTitle,
    viralFormat: params.viralFormat,
    viralFormatLabel: `${params.viralFormatLabel} • ${trickLabel}`,
    targetLengthSeconds,
    durationSeconds: targetLengthSeconds,
    pacingRule: `${trickLabel} synced @ ${params.beatDropSec}s (${builtScenes.length} continuous 6–8s Veo 3.1 shots)`,
    psychologicalAngle: params.psychologicalAngle,
    aspectRatio: "9:16",
    cameraSpec: `${params.sceneBible.lens}, upper-third negative space lock, ${trickLabel}`,
    sceneBible: params.sceneBible,
    flowUltraPrompt: builtScenes[0]?.flowUltraPrompt || "",
    flowAgentPrompt,
    scenes: builtScenes,
    onScreenTextHook: {
      hook0to3s: builtScenes[0]?.onScreenText || "",
      payoff3to8s: builtScenes[1]?.onScreenText || builtScenes[0]?.onScreenText || "",
      ctaEndCard: "See caption for the free 60-Second Diagnostic (Comment RESET)",
    },
    captionParts: params.captionParts,
    caption,
    commentAutoReply:
      "Just sent the free 60-second Burnout & Nervous System Diagnostic to your DMs! Check your message requests.",
    dmOpeningMessage:
      "Hey! Reiko's team here. Glad that video hit home! Here is the free 60-Second Burnout & Nervous System Diagnostic -> https://perfectdayreset.com/quiz — it identifies your exact stress bottleneck and maps out a custom 24-hour reset around your wake time.",
    editingTrick: params.editingTrick,
    beatDropSec: params.beatDropSec,
    trendingSoundTitle: params.trendingSoundTitle,
    trendingSoundAuthor: params.trendingSoundAuthor,
    trendingSoundUrl: params.trendingSoundUrl,
    trendCategory: params.trendCategory,
    viralVelocityScore: params.viralVelocityScore,
  };

  registerDynamicFlowUltraPackage(pkg);
  return pkg;
}

/**
 * 4 Pre-Seeded High-Velocity Trend Blueprints (Newsjacking, Editing Tricks, Audio Sync & Niche Outliers)
 */
const INITIAL_TREND_BLUEPRINT_SEEDS: Array<{
  trendCategory: TrendCategoryType;
  trendTopicOrHook: string;
  sourcePlatform: "tiktok" | "google_trends_news" | "url_clone";
  sourceUrl: string;
  sourceAuthor: string;
  sourceViews: number;
  sourceShares: number;
  sourceComments: number;
  viralVelocityScore: number;
  trendingSoundTitle: string;
  trendingSoundAuthor: string;
  trendingSoundUrl: string;
  beatDropSec: string;
  editingTrick: EditingTrickType;
  deconstruction: TrendDeconstruction;
  packageSeed: Parameters<typeof buildDynamicPackageFromSeed>[0];
}> = [
  {
    trendCategory: "newsjack_cultural",
    trendTopicOrHook: "The Flying Tesla Roadster Demo vs. 2:30 PM Executive Brain",
    sourcePlatform: "google_trends_news",
    sourceUrl: "https://trends.google.com/trending?geo=US",
    sourceAuthor: "Tech & Auto Breaking Radar",
    sourceViews: 1480000,
    sourceShares: 94200,
    sourceComments: 6840,
    viralVelocityScore: 98,
    trendingSoundTitle: "Synthwave Bass Drop - Slowed & Reverb Edit",
    trendingSoundAuthor: "@cinema_drop_audio",
    trendingSoundUrl: "https://www.tiktok.com/music/Synthwave-Bass-Drop",
    beatDropSec: "2.4",
    editingTrick: "beat_drop_match_cut",
    deconstruction: {
      visualHookMechanic:
        "Juxtaposes an ultra-futuristic aerospace-grade hypercar spectacle in Scene 1 with the deadpan reality of an executive staring blankly at a spreadsheet at 2:30 PM in Scene 2.",
      editingTrickBreakdown:
        "Beat-Drop Match Cut at 2.4s with a 1.10x zoom-punch on Scene 2 as the bass drops, turning futuristic tech hype into relatable corporate comedy.",
      audioSyncRule:
        "Build tension for 0.0s–2.4s during the sleek silver hypercar hover shot, then hard-cut on the 2.4s sub-bass drop to silent office room tone and slow blinking.",
      humorContrastFormula:
        "Humanity in 2026 building flying electric hypercars vs. my brain trying to write one polite email after 2:15 PM.",
      shareTrigger:
        "Coworkers and founders immediately DM this to their team Slack/WhatsApp with 'literally me right now'.",
    },
    packageSeed: {
      id: "trend-1-tesla-roadster-newsjack-drop",
      archetypeId: "metabolic_crasher",
      angleTitle: "Newsjack Contrast: Flying Hypercar Engineering vs. My Brain at 2:30 PM",
      viralFormat: "purple_cow_loop",
      viralFormatLabel: "Newsjack Contrast Loop",
      editingTrick: "beat_drop_match_cut",
      beatDropSec: "2.4",
      trendingSoundTitle: "Synthwave Bass Drop - Slowed & Reverb Edit",
      trendingSoundAuthor: "@cinema_drop_audio",
      trendingSoundUrl: "https://www.tiktok.com/music/Synthwave-Bass-Drop",
      trendCategory: "newsjack_cultural",
      viralVelocityScore: 98,
      psychologicalAngle:
        "Newsjacking a massive tech/automotive spectacle and flipping it on the beat drop into the universal 2:30 PM afternoon brain crash.",
      sceneBible: {
        cast: "A 40-year-old European executive with short salt-and-pepper hair, light stubble, and tired eyes",
        wardrobe: "a tailored charcoal wool blazer over a crisp white open-collar dress shirt",
        lens: "35mm lens, shallow depth of field",
        lightDirection: "cool twilight glass reflections contrasting with flat afternoon office daylight",
      },
      rawScenes: [
        {
          sceneNumber: 1,
          timeRange: "0.0s – 6.0s",
          shotType: "Low-Angle Futuristic Silver Electric Hypercar Levitation Hook",
          shotSizeAndMove: "Medium-wide low-angle shot with a slow steady push-in",
          whatWeWant:
            "Single unbroken shot of the executive standing in a minimalist glass test hangar watching a sleek silver aerodynamic electric sports car hovering two inches above polished concrete with cold thruster mist.",
          singlePhysicalAction:
            "He stands calmly with hands in his pockets watching a sleek silver electric sports car hover two inches above wet concrete as cool white air-thruster mist swirls around the tires.",
          environmentAndLighting:
            "Minimalist architectural glass hangar at twilight with clean dark ceiling space in the upper third",
          sfx: "Deep futuristic electric turbine hum and pressurized air hiss",
          ambient: "Vast echoing concrete hangar room tone",
          onScreenText:
            "Engineers in 2026: making electric sports cars literally hover off the ground",
        },
        {
          sceneNumber: 2,
          timeRange: "6.0s – 12.0s",
          shotType: "Medium Deadpan Office Desk 2:30 PM Blank Stare Payoff",
          shotSizeAndMove: "Medium shot with a subtle 1.10x zoom-in push",
          whatWeWant:
            "Single unbroken shot on the beat drop of the same executive sitting frozen at an oak office desk holding a cold half-empty espresso cup while staring blankly ahead.",
          singlePhysicalAction:
            "He sits completely motionless at a sunlit oak desk holding a half-empty glass espresso cup mid-air, blinking slowly in a deadpan afternoon daze beside an open aluminum laptop.",
          environmentAndLighting:
            "Quiet modern glass office in late afternoon with clean blurred wall space in the upper third",
          sfx: "Single quiet ceramic cup clink and a slow tired sigh",
          ambient: "Dead-silent office air conditioning hum",
          onScreenText:
            "Me at 2:30 PM trying to remember how to spell the word 'Wednesday' in an email",
        },
      ],
      captionParts: {
        hookContinuation:
          "We have rockets catching themselves with chopsticks and cars hovering in wind tunnels, yet my prefrontal cortex still shuts down like Windows 95 every day at 2:30 PM.",
        educationalBridge:
          "During my years as Head of Sales at BMW, I watched brilliant executives try to brute-force their way through the 2:15 PM brain crash with a fourth espresso. Biologically, when you combine morning caffeine on an empty stomach with a heavy midday meal, your post-prandial glucose and adenosine rebound collide right after 2:00 PM—dropping cognitive throughput by up to 40%. You don't fix that with more willpower; you reset your metabolic and circadian timing over one structured 24-hour day.",
        committedCta:
          "Comment RESET and I'll DM you the free 60-second Burnout & Nervous System Diagnostic.",
      },
    },
  },
  {
    trendCategory: "editing_trick_trend",
    trendTopicOrHook: "The 02:47 AM Sleep Math Freeze-Frame Hook",
    sourcePlatform: "tiktok",
    sourceUrl: "https://www.tiktok.com/tag/corporatetiktok",
    sourceAuthor: "@exec_dark_humor",
    sourceViews: 920000,
    sourceShares: 71400,
    sourceComments: 4190,
    viralVelocityScore: 95,
    trendingSoundTitle: "Clock Ticking into Lo-Fi Tape Stop",
    trendingSoundAuthor: "@late_night_loops",
    trendingSoundUrl: "https://www.tiktok.com/music/Clock-Ticking-Tape-Stop",
    beatDropSec: "2.1",
    editingTrick: "freeze_frame_hook",
    deconstruction: {
      visualHookMechanic:
        "Opens on an ultra-relatable nocturnal micro-habit—calculating exact hours and minutes of sleep remaining if you fall asleep right this second.",
      editingTrickBreakdown:
        "Freeze-Frame Contrast Hook at 2.1s followed by a slow, atmospheric push-in that lets the viewer read the painful math and tag their insomniac friends.",
      audioSyncRule:
        "Crisp mechanical clock ticks for the first 2.1s, then a warm tape-stop slowdown into dead bedroom silence.",
      humorContrastFormula:
        "Treating sleep like a high-stakes corporate financial negotiation at 2:47 AM.",
      shareTrigger:
        "High save-and-share rate among tired professionals scrolling in bed late at night.",
    },
    packageSeed: {
      id: "trend-2-3am-sleep-math-freeze-frame",
      archetypeId: "cortisol_spiked",
      angleTitle: "The 02:47 AM Sleep Math Negotiation (Freeze-Frame Hook)",
      viralFormat: "purple_cow_loop",
      viralFormatLabel: "Freeze-Frame POV Loop",
      editingTrick: "freeze_frame_hook",
      beatDropSec: "2.1",
      trendingSoundTitle: "Clock Ticking into Lo-Fi Tape Stop",
      trendingSoundAuthor: "@late_night_loops",
      trendingSoundUrl: "https://www.tiktok.com/music/Clock-Ticking-Tape-Stop",
      trendCategory: "editing_trick_trend",
      viralVelocityScore: 95,
      psychologicalAngle:
        "Captures the universal 'tired but wired' 2:47 AM mental math that every cortisol-spiked high performer does in the dark.",
      sceneBible: {
        cast: "A 39-year-old executive with tousled dark hair and wide-awake tired eyes",
        wardrobe: "a soft charcoal cotton crewneck t-shirt",
        lens: "35mm lens, shallow depth of field",
        lightDirection: "cool moonlight from a bedroom window transitioning to warm morning kitchen sunlight",
      },
      rawScenes: [
        {
          sceneNumber: 1,
          timeRange: "0.0s – 6.0s",
          shotType: "Medium-Close Moonlit Bedroom Ceiling Stare Hook",
          shotSizeAndMove: "Medium-close overhead angle with a slow push-in",
          whatWeWant:
            "Single unbroken shot of the executive lying awake in crisp white linen sheets in a dark moonlit bedroom staring straight up at the ceiling while rubbing his forehead.",
          singlePhysicalAction:
            "He lies wide awake in dark linen bedding staring up at the ceiling and slowly rubs his forehead with one hand while the rest of the room is completely still.",
          environmentAndLighting:
            "Minimalist dark bedroom with soft silver moonlight and clean dark negative space in the upper third",
          sfx: "Quiet linen sheet rustle and a slow frustrated exhale through the nose",
          ambient: "Faint distant night city hush",
          onScreenText:
            "Me at 02:47 AM calculating that if I fall asleep in the next 4 minutes, I still get 4 hours and 13 minutes of sleep",
        },
        {
          sceneNumber: 2,
          timeRange: "6.0s – 12.0s",
          shotType: "Medium Morning Sunlit Window Deep Exhale Payoff",
          shotSizeAndMove: "Medium profile shot with a smooth lateral dolly",
          whatWeWant:
            "Single unbroken shot of the same executive standing by an open sunlit window in the morning setting his phone face-down and taking a slow deep breath.",
          singlePhysicalAction:
            "He places a smartphone face-down on a warm oak windowsill, opens the glass window slightly, and breathes in the fresh morning sun with visibly relaxed shoulders.",
          environmentAndLighting:
            "Warm golden sunrise streaming into a quiet minimalist room with soft blurred wall in the upper third",
          sfx: "Solid wooden click of phone placed face-down and a calm deep inhale",
          ambient: "Peaceful morning breeze and distant birdsong",
          onScreenText:
            "How the first morning feels after you finally fix your 10 PM cortisol spike",
        },
      ],
      captionParts: {
        hookContinuation:
          "Why does your brain wait until 2:47 AM to suddenly remember an awkward handshake from 2018 while simultaneously negotiating 4 hours and 13 minutes of sleep?",
        educationalBridge:
          "When you spend 12 hours a day making rapid-fire decisions and checking notifications right up until bed, your HPA-axis stays locked in sympathetic overdrive. Instead of melatonin rising at 10:00 PM, your evening cortisol spikes—leaving your body exhausted in bed while your mind races at 120 mph. That's why I engineered a 24-hour protocol that resets your light, caffeine, and evening decompression windows in a single day.",
        committedCta:
          "Comment RESET and I'll DM you the free 60-second Burnout & Nervous System Diagnostic.",
      },
    },
  },
  {
    trendCategory: "niche_viral_outlier",
    trendTopicOrHook: "The Parked BMW Driveway Sit (22 Minutes With the Engine Off)",
    sourcePlatform: "tiktok",
    sourceUrl: "https://www.tiktok.com/tag/founderlife",
    sourceAuthor: "@founder_confessions",
    sourceViews: 2150000,
    sourceShares: 168000,
    sourceComments: 11200,
    viralVelocityScore: 99,
    trendingSoundTitle: "Muffled Rain & Luxury Cabin Silence (Original Audio)",
    trendingSoundAuthor: "@founder_confessions",
    trendingSoundUrl: "https://www.tiktok.com/music/Luxury-Cabin-Silence",
    beatDropSec: "3.0",
    editingTrick: "infinite_loop_cut",
    deconstruction: {
      visualHookMechanic:
        "Shows the unspoken ritual of high-pressure leaders: pulling into the driveway at 7:15 PM, turning the engine off, and sitting in total silence for 20 minutes before going inside.",
      editingTrickBreakdown:
        "Seamless Infinite Loop Cut where the quiet cabin exhale in Scene 2 flows directly back into the exterior window shot of Scene 1.",
      audioSyncRule:
        "Natural ASMR soundstage: engine shutting off, muffled rain on the windshield, leather seat creak—zero music needed.",
      humorContrastFormula:
        "Everyone thinks executives want a nicer car to drive fast; in reality, they just want a soundproof box to sit in alone for 20 minutes.",
      shareTrigger:
        "Massive comment section engagement ('I'm literally watching this sitting in my parked car in the driveway right now').",
    },
    packageSeed: {
      id: "trend-3-parked-bmw-driveway-sit-loop",
      archetypeId: "systemic_burnout",
      angleTitle: "The Parked BMW Driveway Sit: 22 Minutes With the Engine Off",
      viralFormat: "trojan_horse_story",
      viralFormatLabel: "Viral Outlier Loop",
      editingTrick: "infinite_loop_cut",
      beatDropSec: "3.0",
      trendingSoundTitle: "Muffled Rain & Luxury Cabin Silence (Original Audio)",
      trendingSoundAuthor: "@founder_confessions",
      trendingSoundUrl: "https://www.tiktok.com/music/Luxury-Cabin-Silence",
      trendCategory: "niche_viral_outlier",
      viralVelocityScore: 99,
      psychologicalAngle:
        "Taps into the #1 secret behavior of burned-out high performers: sitting in a parked car in the driveway because their nervous system has zero bandwidth left.",
      sceneBible: {
        cast: "A 41-year-old founder with dark neatly combed hair, tired circles under his eyes, and a quiet expression",
        wardrobe: "a navy cashmere blazer over a charcoal crewneck knit shirt",
        lens: "35mm lens, shallow depth of field",
        lightDirection: "warm amber dashboard glow and soft evening twilight reflections on glass",
      },
      rawScenes: [
        {
          sceneNumber: 1,
          timeRange: "0.0s – 6.0s",
          shotType: "Medium Exterior Car Window Driveway Silence Hook",
          shotSizeAndMove: "Medium shot with a slow lateral dolly move",
          whatWeWant:
            "Single unbroken shot looking through the side window of a parked black sedan at dusk as the founder leans his head back against the leather headrest in silence.",
          singlePhysicalAction:
            "Sitting in the driver seat of a parked black performance sedan with the engine off, he leans his head back against the leather headrest and stares quietly through the windshield.",
          environmentAndLighting:
            "Quiet evening driveway at dusk with soft blurred trees and twilight sky in the upper third",
          sfx: "Soft leather headrest creak and gentle raindrop tap on glass",
          ambient: "Muffled insulated car cabin silence",
          onScreenText:
            "Nobody talks about the 22 minutes you spend sitting in your parked car with the engine off before walking into the house",
        },
        {
          sceneNumber: 2,
          timeRange: "6.0s – 12.0s",
          shotType: "Medium-Close Center Console Phone Flip Payoff",
          shotSizeAndMove: "Medium-close shot with a slow push-in",
          whatWeWant:
            "Single unbroken shot inside the dark cabin as his hand flips a buzzing smartphone face-down on the console and his shoulders drop in relief.",
          singlePhysicalAction:
            "His hand reaches down to flip a buzzing smartphone face-down onto the matte carbon center console, then rests both hands calmly in his lap with a deep exhale.",
          environmentAndLighting:
            "Warm amber dashboard glow inside the dark leather cabin with softly blurred windshield above",
          sfx: "Brief phone buzz silenced against the console and a slow human exhale",
          ambient: "Deep quiet luxury car cabin room tone",
          onScreenText:
            "Not scrolling. Not listening to a podcast. Just staring at the steering wheel in complete silence.",
        },
      ],
      captionParts: {
        hookContinuation:
          "If you've ever pulled into your driveway at 7:15 PM, turned the ignition off, and just sat there in dead silence for 20 minutes—you aren't lazy. Your nervous system is full.",
        educationalBridge:
          "When I was Head of Sales at Inchcape BMW, clients used to joke that the best feature of a new 5-Series wasn't the horsepower—it was the soundproof cabin where nobody could ask them a question for 15 minutes. That 'driveway sit' is a classic sign of autonomic decision fatigue: after 10 hours of context-switching, your brain craves zero-input sensory recovery. Instead of waiting until you're running on fumes, one structured 24-hour reset gives your nervous system a complete unload.",
        committedCta:
          "Comment RESET and I'll DM you the free 60-second Burnout & Nervous System Diagnostic.",
      },
    },
  },
  {
    trendCategory: "trending_audio_sync",
    trendTopicOrHook: "The 4th Espresso Deadpan Zoom-Punch",
    sourcePlatform: "tiktok",
    sourceUrl: "https://www.tiktok.com/tag/coffeetok",
    sourceAuthor: "@workday_realities",
    sourceViews: 1120000,
    sourceShares: 83500,
    sourceComments: 5310,
    viralVelocityScore: 94,
    trendingSoundTitle: "Classical Strings into Sudden Record Scratch",
    trendingSoundAuthor: "@audio_trends_daily",
    trendingSoundUrl: "https://www.tiktok.com/music/Classical-Strings-Scratch",
    beatDropSec: "1.9",
    editingTrick: "zoom_punch_contrast",
    deconstruction: {
      visualHookMechanic:
        "Starts with an aesthetic, cinematic slow-motion espresso pour, then uses a progressive zoom-punch into the irony of feeling sleepier 20 minutes AFTER drinking it.",
      editingTrickBreakdown:
        "1.12x Deadpan Zoom-Punch synced to the 1.9s audio shift, highlighting the physiological paradox of caffeine on fatigued adenosine receptors.",
      audioSyncRule:
        "Elegant espresso extraction audio for 0.0s–1.9s, cutting into quiet room tone as the camera pushes in.",
      humorContrastFormula:
        "Drinking a triple espresso to wake up -> yawning 14 minutes later with a 110 BPM heart rate.",
      shareTrigger:
        "Immediate tag-a-coworker relatability for anyone who drinks 3+ coffees a day.",
    },
    packageSeed: {
      id: "trend-4-fourth-espresso-zoom-punch",
      archetypeId: "dopamine_depleted",
      angleTitle: "The 4th Espresso Paradox: Sleepy With a Fast Heartbeat (Zoom-Punch)",
      viralFormat: "forensic_curiosity_hook",
      viralFormatLabel: "Zoom-Punch POV",
      editingTrick: "zoom_punch_contrast",
      beatDropSec: "1.9",
      trendingSoundTitle: "Classical Strings into Sudden Record Scratch",
      trendingSoundAuthor: "@audio_trends_daily",
      trendingSoundUrl: "https://www.tiktok.com/music/Classical-Strings-Scratch",
      trendCategory: "trending_audio_sync",
      viralVelocityScore: 94,
      psychologicalAngle:
        "Turns the paradox of 'anxious and still sleepy after 3 coffees' into a deadpan visual comedy cut.",
      sceneBible: {
        cast: "A 40-year-old European executive with short salt-and-pepper hair, light stubble, and tired focused eyes",
        wardrobe: "a tailored charcoal wool suit jacket over a crisp pale-blue dress shirt",
        lens: "35mm lens, shallow depth of field",
        lightDirection: "moody morning kitchen sidelight transitioning to bright sunlit oak table",
      },
      rawScenes: [
        {
          sceneNumber: 1,
          timeRange: "0.0s – 6.0s",
          shotType: "Medium-Close Espresso Cup & Tired Blink Zoom-Punch Hook",
          shotSizeAndMove: "Medium-close shot with a steady progressive zoom-in",
          whatWeWant:
            "Single unbroken shot of the executive holding a small glass espresso cup at his desk and letting out a slow yawn right after taking a sip.",
          singlePhysicalAction:
            "He takes a sip from a double espresso glass at his oak desk, sets the cup down, and immediately stifles a slow yawn while staring at his laptop.",
          environmentAndLighting:
            "Modern executive office in morning light with clean blurred upper-third wall space",
          sfx: "Delicate glass espresso cup clink on wood and a quiet stifled yawn",
          ambient: "Subtle office room tone",
          onScreenText:
            "When the 3rd espresso doesn't wake your brain up, so now you're just sleepy at 115 beats per minute",
        },
        {
          sceneNumber: 2,
          timeRange: "6.0s – 12.0s",
          shotType: "Medium Sunlit Balcony Mineral Water Reset Payoff",
          shotSizeAndMove: "Medium tracking shot following from behind",
          whatWeWant:
            "Single unbroken shot of setting down a tall frosted glass of mineral water on an oak table and stepping out onto a warm sunlit balcony with a deep exhale.",
          singlePhysicalAction:
            "A hand sets a tall frosted glass of mineral water onto a sunlit oak table beside a closed laptop, then walks out onto a bright balcony and exhales deeply.",
          environmentAndLighting:
            "Warm golden morning sunlight streaming through floor-to-ceiling balcony doors",
          sfx: "Crisp glass set down on oak wood and a slow relieved exhale",
          ambient: "Quiet morning air and distant birdsong",
          onScreenText:
            "What happens when you delay your first coffee by 90 minutes and hydrate first",
        },
      ],
      captionParts: {
        hookContinuation:
          "There is no betrayal quite like drinking a double espresso at 10:30 AM and feeling ready for a nap 18 minutes later—just with a faster heartbeat.",
        educationalBridge:
          "Caffeine doesn't actually create energy; it only blocks adenosine receptors in your brain. When you drink espresso within 15 minutes of waking on a dehydrated nervous system, un-cleared overnight adenosine piles up behind the blockade while vasoconstriction reduces cerebral blood flow. By delaying caffeine 90 minutes after waking and front-loading electrolytes + natural sunlight during a 24-hour reset, your natural morning drive comes back online without the afternoon crash.",
        committedCta:
          "Comment RESET and I'll DM you the free 60-second Burnout & Nervous System Diagnostic.",
      },
    },
  },
];

let trendSeedPromise: Promise<void> | null = null;

/**
 * Ensures the 4 high-velocity Trend Blueprints are seeded in storage and registered
 * in the dynamic FlowUltraPackage registry.
 */
export async function ensureTrendBlueprintsSeeded(): Promise<HydratedTrendBlueprint[]> {
  if (trendSeedPromise) {
    await trendSeedPromise;
    return getHydratedTrendBlueprints();
  }

  trendSeedPromise = (async () => {
    const existing = await storage.getAgentTrendBlueprints();
    const existingTopics = new Set(existing.map((e) => e.trendTopicOrHook));

    for (const seed of INITIAL_TREND_BLUEPRINT_SEEDS) {
      const pkg = buildDynamicPackageFromSeed(seed.packageSeed);
      if (existingTopics.has(seed.trendTopicOrHook)) {
        continue;
      }
      await storage.createAgentTrendBlueprint({
        trendCategory: seed.trendCategory,
        trendTopicOrHook: seed.trendTopicOrHook,
        sourcePlatform: seed.sourcePlatform,
        sourceUrl: seed.sourceUrl,
        sourceAuthor: seed.sourceAuthor,
        sourceViews: seed.sourceViews,
        sourceShares: seed.sourceShares,
        sourceComments: seed.sourceComments,
        viralVelocityScore: seed.viralVelocityScore,
        trendingSoundTitle: seed.trendingSoundTitle,
        trendingSoundAuthor: seed.trendingSoundAuthor,
        trendingSoundUrl: seed.trendingSoundUrl,
        beatDropSec: seed.beatDropSec,
        editingTrick: seed.editingTrick,
        deconstructionJson: JSON.stringify(seed.deconstruction),
        generatedPackageJson: JSON.stringify(pkg),
      });
    }
  })().finally(() => {
    trendSeedPromise = null;
  });

  await trendSeedPromise;
  return getHydratedTrendBlueprints();
}

export async function getHydratedTrendBlueprints(): Promise<HydratedTrendBlueprint[]> {
  const rows = await storage.getAgentTrendBlueprints();
  const hydrated: HydratedTrendBlueprint[] = [];

  for (const row of rows) {
    try {
      const deconstruction: TrendDeconstruction = JSON.parse(row.deconstructionJson);
      const generatedPackage: FlowUltraVideoPackage = JSON.parse(row.generatedPackageJson);
      registerDynamicFlowUltraPackage(generatedPackage);
      hydrated.push({
        ...row,
        deconstruction,
        generatedPackage,
      });
    } catch {
      // Skip malformed row
    }
  }
  return hydrated;
}

/**
 * Pillar 1: Scrape live Google Trends RSS + Tech/Auto breaking headlines for Newsjacking
 */
export async function scrapeBreakingNewsjackTrends(
  customTopic?: string
): Promise<ScrapedNewsTopic[]> {
  if (customTopic && customTopic.trim()) {
    return [
      {
        title: customTopic.trim(),
        sourceUrl: "https://trends.google.com/trending?geo=US",
        approxTraffic: "500K+ searches today",
        publishedAt: new Date().toISOString(),
      },
    ];
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5500);
    const resp = await fetch("https://trends.google.com/trending/rss?geo=US", {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125.0.0.0 Safari/537.36",
      },
    });
    clearTimeout(timeout);

    if (resp.ok) {
      const xml = await resp.text();
      const items = Array.from(xml.matchAll(/<item>([\s\S]*?)<\/item>/g)).slice(0, 8);
      const parsed: ScrapedNewsTopic[] = [];
      for (const m of items) {
        const block = m[1];
        const titleMatch = block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/);
        const trafficMatch = block.match(/<ht:approx_traffic>(.*?)<\/ht:approx_traffic>/);
        const linkMatch = block.match(/<ht:news_item_url>(.*?)<\/ht:news_item_url>|<link>(.*?)<\/link>/);
        const rawTitle = (titleMatch?.[1] || titleMatch?.[2] || "").trim();
        if (rawTitle) {
          parsed.push({
            title: rawTitle,
            sourceUrl: (linkMatch?.[1] || linkMatch?.[2] || "https://trends.google.com/trending?geo=US").trim(),
            approxTraffic: (trafficMatch?.[1] || "200K+").trim(),
            publishedAt: new Date().toISOString(),
          });
        }
      }
      if (parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Fallback below if RSS is blocked or offline
  }

  return [
    {
      title: "Next-Gen Autonomous Electric Roadster & AI Robotics Demo",
      sourceUrl: "https://trends.google.com/trending?geo=US",
      approxTraffic: "500K+",
      publishedAt: new Date().toISOString(),
    },
    {
      title: "Fortune 500 5-Day Return-to-Office Mandate Wave",
      sourceUrl: "https://trends.google.com/trending?geo=US",
      approxTraffic: "250K+",
      publishedAt: new Date().toISOString(),
    },
  ];
}

/**
 * Pillar 2 & 3: Scrape live TikTok Viral Outliers, Share-to-View Velocity & Trending Sound Metadata
 */
export async function scrapeViralTikToks(params: {
  query?: string;
  tiktokUrl?: string;
}): Promise<ScrapedTikTokOutlier[]> {
  const searchQuery = (params.query || "corporate humor pov burnout").trim();

  // If a specific TikTok URL was provided, query TikWM video info + oEmbed first
  if (params.tiktokUrl && params.tiktokUrl.trim()) {
    const cleanUrl = params.tiktokUrl.trim();
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6500);
      const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(cleanUrl)}`;
      const resp = await fetch(apiUrl, { signal: controller.signal });
      clearTimeout(timeout);

      if (resp.ok) {
        const json: any = await resp.json();
        const d = json?.data;
        if (d && (d.title || d.id)) {
          const views = Number(d.play_count || 420000);
          const shares = Number(d.share_count || 34000);
          const comments = Number(d.comment_count || 2100);
          const ratioScore = Math.min(99, Math.max(82, Math.round((shares / Math.max(1, views)) * 1100)));
          return [
            {
              videoId: String(d.id || Date.now()),
              title: String(d.title || "Cloned TikTok Viral Hook"),
              authorHandle: `@${d.author?.unique_id || "viral_creator"}`,
              sourceUrl: cleanUrl,
              videoDownloadUrl: String(d.play || ""),
              views,
              shares,
              comments,
              viralVelocityScore: ratioScore,
              trendingSoundTitle: String(d.music_info?.title || "Original Sound - Trending TikTok Cut"),
              trendingSoundAuthor: `@${d.music_info?.author || "tiktok_audio"}`,
              trendingSoundUrl: String(d.music_info?.play || cleanUrl),
              detectedBeatDropSec: Number(d.duration || 10) <= 8 ? "2.1" : "2.4",
              inferredEditingTrick: "beat_drop_match_cut",
            },
          ];
        }
      }
    } catch {
      // Fallback if TikWM URL lookup is rate-limited
    }

    return [
      {
        videoId: String(Date.now()),
        title: `Cloned Viral TikTok Structure (${cleanUrl.slice(0, 48)})`,
        authorHandle: "@tiktok_viral_outlier",
        sourceUrl: cleanUrl,
        videoDownloadUrl: "",
        views: 840000,
        shares: 64200,
        comments: 3890,
        viralVelocityScore: 96,
        trendingSoundTitle: "Original Sound - High-Retention Beat Drop",
        trendingSoundAuthor: "@tiktok_viral_outlier",
        trendingSoundUrl: cleanUrl,
        detectedBeatDropSec: "2.4",
        inferredEditingTrick: "beat_drop_match_cut",
      },
    ];
  }

  // Otherwise search live TikTok feed via TikWM search API
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6500);
    const searchUrl = `https://www.tikwm.com/api/feed/search?keywords=${encodeURIComponent(
      searchQuery
    )}&count=8&cursor=0`;
    const resp = await fetch(searchUrl, { signal: controller.signal });
    clearTimeout(timeout);

    if (resp.ok) {
      const json: any = await resp.json();
      const videos: any[] = json?.data?.videos || [];
      if (videos.length > 0) {
        const mapped: ScrapedTikTokOutlier[] = videos.map((v) => {
          const views = Math.max(15000, Number(v.play_count || 250000));
          const shares = Math.max(800, Number(v.share_count || 18000));
          const comments = Math.max(150, Number(v.comment_count || 1400));
          const shareRatio = shares / Math.max(1, views);
          const velocityScore = Math.min(
            99,
            Math.max(80, Math.round(78 + shareRatio * 650))
          );
          const dur = Number(v.duration || 10);
          const trick: EditingTrickType =
            dur <= 7
              ? "infinite_loop_cut"
              : shareRatio > 0.04
              ? "beat_drop_match_cut"
              : "zoom_punch_contrast";

          return {
            videoId: String(v.video_id || v.id || Date.now()),
            title: String(v.title || searchQuery).slice(0, 180),
            authorHandle: `@${v.author?.unique_id || "creator"}`,
            sourceUrl: `https://www.tiktok.com/@${v.author?.unique_id || "creator"}/video/${
              v.video_id || ""
            }`,
            videoDownloadUrl: String(v.play || ""),
            views,
            shares,
            comments,
            viralVelocityScore: velocityScore,
            trendingSoundTitle: String(
              v.music_info?.title || "Original Sound - Viral POV Audio"
            ),
            trendingSoundAuthor: `@${v.music_info?.author || "trending_audio"}`,
            trendingSoundUrl: String(
              v.music_info?.play || `https://www.tiktok.com/tag/${encodeURIComponent(searchQuery)}`
            ),
            detectedBeatDropSec: dur <= 7 ? "2.0" : "2.4",
            inferredEditingTrick: trick,
          };
        });

        mapped.sort((a, b) => b.viralVelocityScore - a.viralVelocityScore || b.shares - a.shares);
        return mapped.slice(0, 4);
      }
    }
  } catch {
    // Graceful fallback if TikWM rate-limits
  }

  return [
    {
      videoId: String(Date.now()),
      title: `POV: ${searchQuery} — when your calendar has 9 back-to-back calls and your soul leaves your body`,
      authorHandle: "@corporate_pov_daily",
      sourceUrl: `https://www.tiktok.com/search?q=${encodeURIComponent(searchQuery)}`,
      videoDownloadUrl: "",
      views: 1290000,
      shares: 98400,
      comments: 6120,
      viralVelocityScore: 96,
      trendingSoundTitle: "Ambient Synth Beat Drop (Viral Edit)",
      trendingSoundAuthor: "@corporate_pov_daily",
      trendingSoundUrl: `https://www.tiktok.com/search?q=${encodeURIComponent(searchQuery)}`,
      detectedBeatDropSec: "2.4",
      inferredEditingTrick: "beat_drop_match_cut",
    },
  ];
}

/**
 * Optional keyframe extraction using ffmpeg-static when a downloadable video stream URL is available
 */
async function extractKeyframesBase64FromVideoUrl(videoUrl: string): Promise<string[]> {
  if (!videoUrl || !/^https?:\/\//i.test(videoUrl)) return [];
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "pdr-trend-frames-"));
  try {
    const framePattern = path.join(tmpDir, "frame-%d.jpg");
    await execFileAsync(
      FFMPEG_BIN,
      [
        "-y",
        "-hide_banner",
        "-loglevel",
        "error",
        "-t",
        "4",
        "-i",
        videoUrl,
        "-vf",
        "fps=1,scale=360:-2",
        "-vframes",
        "3",
        framePattern,
      ],
      { timeout: 6000 }
    );
    const files = fs
      .readdirSync(tmpDir)
      .filter((f) => f.endsWith(".jpg"))
      .slice(0, 2);
    return files.map((f) => fs.readFileSync(path.join(tmpDir, f)).toString("base64"));
  } catch {
    return [];
  } finally {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  }
}

/**
 * Pillar 4: Multimodal Gemini Deconstructor & Dynamic 6-Block Veo 3.1 Prompt Architect
 */
export async function deconstructAndSynthesizeTrend(params: {
  trendCategory: TrendCategoryType;
  topicOrHook: string;
  sourcePlatform: "tiktok" | "google_trends_news" | "url_clone";
  sourceUrl: string;
  sourceAuthor: string;
  sourceViews: number;
  sourceShares: number;
  sourceComments: number;
  viralVelocityScore: number;
  trendingSoundTitle: string;
  trendingSoundAuthor: string;
  trendingSoundUrl: string;
  beatDropSec: string;
  editingTrick: EditingTrickType;
  archetypeId?: FlowUltraVideoPackage["archetypeId"];
  videoDownloadUrl?: string;
  remixDirective?: string;
}): Promise<HydratedTrendBlueprint> {
  const archetypeId: FlowUltraVideoPackage["archetypeId"] =
    params.archetypeId || "cortisol_spiked";
  const editingTrick: EditingTrickType = params.editingTrick || "beat_drop_match_cut";
  const beatDropSec = params.beatDropSec || "2.4";
  const cleanTopic = sanitizeNoQuotes(params.topicOrHook);

  // Default deterministic synthesis (used immediately if Gemini API is unavailable or rate-limited)
  let deconstruction: TrendDeconstruction = {
    visualHookMechanic: `Opens with a high-contrast visual hook built around '${cleanTopic}' that stops the scroll in 1.2s without looking like a wellness ad.`,
    editingTrickBreakdown: `${EDITING_TRICK_LABELS[editingTrick]} synced at ${beatDropSec}s: Scene 1 sets up the spectacle or corporate tension, and Scene 2 delivers the deadpan human payoff.`,
    audioSyncRule: `Pair with '${params.trendingSoundTitle}' (${params.trendingSoundAuthor}) and align the Scene 1 -> Scene 2 transition or zoom-punch to the ${beatDropSec}s beat drop.`,
    humorContrastFormula: `100% Entertain-First dark humor on screen -> Founder BMW Head of Sales physiological insight in the caption -> 'Comment RESET' only at the bottom of the caption.`,
    shareTrigger: `High-performing professionals recognize themselves immediately and forward the reel to coworkers or founder group chats.`,
  };

  let angleTitle =
    params.trendCategory === "newsjack_cultural"
      ? `Newsjack Contrast: ${cleanTopic} vs. My Brain at 2:30 PM`
      : `Viral Outlier Clone: ${cleanTopic}`;

  let sceneBible: SceneBibleSpec = {
    cast: "A 40-year-old European executive with short salt-and-pepper hair, light stubble, and tired focused eyes",
    wardrobe: "a tailored charcoal wool suit blazer over a crisp open-collar white dress shirt",
    lens: "35mm lens, shallow depth of field",
    lightDirection: "cinematic twilight glass sidelight contrasting with warm morning sunlight",
  };

  let rawScenes = [
    {
      sceneNumber: 1,
      timeRange: "0.0s – 6.0s",
      shotType: "Medium-Wide High-Contrast Spectacle / Tension Hook Shot",
      shotSizeAndMove: "Medium-wide shot with a slow steady push-in",
      whatWeWant: `Single unbroken 6s shot capturing the visual premise of ${cleanTopic} with the executive in the center-lower frame and clean negative space in the upper third.`,
      singlePhysicalAction:
        "He sits at a sleek oak desk in a glass-walled office staring in deadpan disbelief at his open laptop while rubbing his tired eyes with one hand.",
      environmentAndLighting:
        "Modern architectural glass office at twilight with softly blurred city lights in the upper third",
      sfx: "Crisp mechanical keyboard click and a quiet tired sigh",
      ambient: "Low insulated office room tone",
      onScreenText:
        params.trendCategory === "newsjack_cultural"
          ? `The world in 2026: ${cleanTopic}`
          : `${cleanTopic}`,
    },
    {
      sceneNumber: 2,
      timeRange: "6.0s – 12.0s",
      shotType: "Medium Deadpan Reaction & Sunlit Exhale Payoff Shot",
      shotSizeAndMove: "Medium shot with a subtle 1.10x zoom-in push",
      whatWeWant:
        "Single unbroken 6s shot on the beat drop showing the same executive closing his laptop, setting down a glass of mineral water, and letting out a slow relieved exhale.",
      singlePhysicalAction:
        "He calmly closes the brushed aluminum laptop, sets a frosted glass of mineral water on the oak table, and leans back with a visible shoulder-dropping exhale.",
      environmentAndLighting:
        "Warm golden morning sunlight streaming through floor-to-ceiling windows with clean upper-third wall space",
      sfx: "Soft laptop lid close and a deep human exhale",
      ambient: "Peaceful morning air and distant birdsong",
      onScreenText:
        params.trendCategory === "newsjack_cultural"
          ? "Meanwhile me at 2:30 PM staring at my screen trying to form one coherent sentence"
          : "Me 14 seconds after finally turning my phone off for 24 hours",
    },
  ];

  let captionParts: CaptionThreeLayerBreakdown = {
    hookContinuation: `Everyone is talking about ${cleanTopic}, meanwhile most high performers are just trying to survive their 2:30 PM afternoon crash on 5 hours of sleep and 3 espressos.`,
    educationalBridge:
      "When I was Head of Sales at Inchcape BMW, I saw this exact pattern every single week: outwardly successful founders and executives operating with an inverted cortisol curve and depleted afternoon dopamine. You don't fix chronic nervous system overload with another rigid 30-day habit tracker that you quit by Day 4—you recalibrate your circadian, hydration, and cognitive unload windows in one structured 24-hour reset.",
    committedCta:
      "Comment RESET and I'll DM you the free 60-second Burnout & Nervous System Diagnostic.",
  };

  // Optional Multimodal Gemini Flash refinement (uses extracted keyframes if available)
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const keyframesBase64 = params.videoDownloadUrl
        ? await extractKeyframesBase64FromVideoUrl(params.videoDownloadUrl)
        : [];

      const promptText = `You are an elite Viral Short-Form Creative Director and Google Flow Ultra (Veo 3.1) Prompt Architect for "Perfect Day Reset" (founded by Reiko Kevvai, Ex Head of Sales at BMW).
We follow the strict 3-Layer Viral Funnel:
- LAYER 1 (VIDEO & ON-SCREEN TEXT = 100% ENTERTAINMENT): Dark corporate humor, newsjacking contrast, or relatable founder POV. NEVER put "Perfect Day Reset", "cortisol", "protocol", or "Comment RESET" in onScreenText!
- LAYER 2 (CAPTION BODY = EDUCATION): Connect the humor from Scene 1 & 2 to Reiko's experience as Head of Sales at BMW and the physiology of executive burnout.
- LAYER 3 (CAPTION BOTTOM = CTA): End caption with "Comment RESET and I'll DM you the free 60-second Burnout & Nervous System Diagnostic."

Input Trend / Topic: "${cleanTopic}"
Trend Category: "${params.trendCategory}"
Target Editing Trick: "${editingTrick}" (Beat Drop @ ${beatDropSec}s)
Trending Sound: "${params.trendingSoundTitle}" by ${params.trendingSoundAuthor}
Target Archetype: "${ARCHETYPE_LABELS[archetypeId]}"
${params.remixDirective ? `Producer Remix Directive: "${params.remixDirective}"` : ""}

CRITICAL VEO 3.1 RULES FOR SCENES:
- Each scene must be ONE continuous unbroken 9:16 single shot (no internal cuts, no quotation marks inside physical descriptions).
- Both scenes must share the exact same Scene Bible (cast, wardrobe, lens, lightDirection).

Return ONLY valid JSON with this exact structure:
{
  "angleTitle": "string",
  "deconstruction": {
    "visualHookMechanic": "string",
    "editingTrickBreakdown": "string",
    "audioSyncRule": "string",
    "humorContrastFormula": "string",
    "shareTrigger": "string"
  },
  "sceneBible": {
    "cast": "string (no quotes)",
    "wardrobe": "string (no quotes)",
    "lens": "35mm lens, shallow depth of field",
    "lightDirection": "string (no quotes)"
  },
  "scenes": [
    {
      "shotType": "string",
      "shotSizeAndMove": "string",
      "whatWeWant": "string",
      "singlePhysicalAction": "string (1 physical action, no quotation marks)",
      "environmentAndLighting": "string (no quotation marks)",
      "sfx": "string (1-2 crisp sound effects)",
      "ambient": "string (ambient room/environment tone)",
      "onScreenText": "string (100% witty entertainment POV/contrast, ZERO sales/CTA)"
    },
    {
      "shotType": "string",
      "shotSizeAndMove": "string",
      "whatWeWant": "string",
      "singlePhysicalAction": "string (1 physical action, no quotation marks)",
      "environmentAndLighting": "string (no quotation marks)",
      "sfx": "string (1-2 crisp sound effects)",
      "ambient": "string (ambient room/environment tone)",
      "onScreenText": "string (100% witty entertainment payoff, ZERO sales/CTA)"
    }
  ],
  "captionParts": {
    "hookContinuation": "string",
    "educationalBridge": "string",
    "committedCta": "Comment RESET and I'll DM you the free 60-second Burnout & Nervous System Diagnostic."
  }
}`;

      const parts: any[] = [{ text: promptText }];
      for (const b64 of keyframesBase64) {
        parts.push({
          inlineData: {
            mimeType: "image/jpeg",
            data: b64,
          },
        });
      }

      const modelsToTry = ["gemini-3.8-flash", "gemini-2.5-flash"];
      for (const modelName of modelsToTry) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 9000);
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiKey}`,
            {
              method: "POST",
              signal: controller.signal,
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts }],
                generationConfig: {
                  temperature: 0.35,
                  responseMimeType: "application/json",
                },
              }),
            }
          );
          clearTimeout(timeout);

          if (response.ok) {
            const data: any = await response.json();
            const rawJsonText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (rawJsonText) {
              const parsed = JSON.parse(rawJsonText);
              if (parsed.angleTitle) angleTitle = String(parsed.angleTitle);
              if (parsed.deconstruction?.visualHookMechanic) {
                deconstruction = {
                  visualHookMechanic: String(parsed.deconstruction.visualHookMechanic),
                  editingTrickBreakdown: String(
                    parsed.deconstruction.editingTrickBreakdown ||
                      deconstruction.editingTrickBreakdown
                  ),
                  audioSyncRule: String(
                    parsed.deconstruction.audioSyncRule || deconstruction.audioSyncRule
                  ),
                  humorContrastFormula: String(
                    parsed.deconstruction.humorContrastFormula ||
                      deconstruction.humorContrastFormula
                  ),
                  shareTrigger: String(
                    parsed.deconstruction.shareTrigger || deconstruction.shareTrigger
                  ),
                };
              }
              if (parsed.sceneBible?.cast && parsed.sceneBible?.wardrobe) {
                sceneBible = {
                  cast: sanitizeNoQuotes(String(parsed.sceneBible.cast)),
                  wardrobe: sanitizeNoQuotes(String(parsed.sceneBible.wardrobe)),
                  lens: sanitizeNoQuotes(
                    String(parsed.sceneBible.lens || "35mm lens, shallow depth of field")
                  ),
                  lightDirection: sanitizeNoQuotes(
                    String(parsed.sceneBible.lightDirection || sceneBible.lightDirection)
                  ),
                };
              }
              if (Array.isArray(parsed.scenes) && parsed.scenes.length >= 2) {
                rawScenes = parsed.scenes.slice(0, 3).map((sc: any, idx: number) => ({
                  sceneNumber: idx + 1,
                  timeRange: `${idx * 6}.0s – ${(idx + 1) * 6}.0s`,
                  shotType: String(sc.shotType || `Scene ${idx + 1} Shot`),
                  shotSizeAndMove: String(
                    sc.shotSizeAndMove || "Medium shot with a slow steady push-in"
                  ),
                  whatWeWant: String(sc.whatWeWant || rawScenes[idx]?.whatWeWant || ""),
                  singlePhysicalAction: sanitizeNoQuotes(
                    String(
                      sc.singlePhysicalAction || rawScenes[idx]?.singlePhysicalAction || ""
                    )
                  ),
                  environmentAndLighting: sanitizeNoQuotes(
                    String(
                      sc.environmentAndLighting ||
                        rawScenes[idx]?.environmentAndLighting ||
                        ""
                    )
                  ),
                  sfx: sanitizeNoQuotes(String(sc.sfx || "Subtle room sound")),
                  ambient: sanitizeNoQuotes(String(sc.ambient || "Quiet room tone")),
                  onScreenText: String(
                    sc.onScreenText || rawScenes[idx]?.onScreenText || ""
                  ),
                }));
              }
              if (parsed.captionParts?.hookContinuation && parsed.captionParts?.educationalBridge) {
                captionParts = {
                  hookContinuation: String(parsed.captionParts.hookContinuation),
                  educationalBridge: String(parsed.captionParts.educationalBridge),
                  committedCta: String(
                    parsed.captionParts.committedCta ||
                      "Comment RESET and I'll DM you the free 60-second Burnout & Nervous System Diagnostic."
                  ),
                };
              }
              break;
            }
          }
        } catch {
          clearTimeout(timeout);
        }
      }
    } catch {
      // Fallback to deterministic synthesis
    }
  }

  const slug = cleanTopic
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 28);
  const pkgId = `trend-${slug || "outlier"}-${Date.now().toString().slice(-5)}`;

  const generatedPackage = buildDynamicPackageFromSeed({
    id: pkgId,
    archetypeId,
    angleTitle,
    viralFormat:
      params.trendCategory === "newsjack_cultural"
        ? "purple_cow_loop"
        : params.trendCategory === "niche_viral_outlier"
        ? "trojan_horse_story"
        : "forensic_curiosity_hook",
    viralFormatLabel:
      params.trendCategory === "newsjack_cultural"
        ? "Newsjack Contrast"
        : params.trendCategory === "url_clone"
        ? "Cloned Viral Structure"
        : "Trend Outlier Hook",
    editingTrick,
    beatDropSec,
    trendingSoundTitle: params.trendingSoundTitle,
    trendingSoundAuthor: params.trendingSoundAuthor,
    trendingSoundUrl: params.trendingSoundUrl,
    trendCategory: params.trendCategory,
    viralVelocityScore: params.viralVelocityScore,
    psychologicalAngle: deconstruction.humorContrastFormula,
    sceneBible,
    rawScenes,
    captionParts,
  });

  const insertPayload: InsertAgentTrendBlueprint = {
    trendCategory: params.trendCategory,
    trendTopicOrHook: cleanTopic,
    sourcePlatform: params.sourcePlatform,
    sourceUrl: params.sourceUrl,
    sourceAuthor: params.sourceAuthor,
    sourceViews: params.sourceViews,
    sourceShares: params.sourceShares,
    sourceComments: params.sourceComments,
    viralVelocityScore: params.viralVelocityScore,
    trendingSoundTitle: params.trendingSoundTitle,
    trendingSoundAuthor: params.trendingSoundAuthor,
    trendingSoundUrl: params.trendingSoundUrl,
    beatDropSec,
    editingTrick,
    deconstructionJson: JSON.stringify(deconstruction),
    generatedPackageJson: JSON.stringify(generatedPackage),
  };

  const created = await storage.createAgentTrendBlueprint(insertPayload);
  return {
    ...created,
    deconstruction,
    generatedPackage,
  };
}

/**
 * High-level orchestrator for POST /api/agent/trends/scrape
 */
export async function scrapeAndSynthesizeTrendBlueprint(options: {
  mode: "newsjack" | "tiktok_keyword" | "tiktok_url";
  query?: string;
  tiktokUrl?: string;
  customTopic?: string;
  editingTrick?: EditingTrickType;
  archetypeId?: FlowUltraVideoPackage["archetypeId"];
}): Promise<HydratedTrendBlueprint> {
  await ensureTrendBlueprintsSeeded();

  if (options.mode === "newsjack") {
    const newsItems = await scrapeBreakingNewsjackTrends(options.customTopic || options.query);
    const topNews = newsItems[0];
    const trick: EditingTrickType = options.editingTrick || "beat_drop_match_cut";
    return deconstructAndSynthesizeTrend({
      trendCategory: "newsjack_cultural",
      topicOrHook: topNews.title,
      sourcePlatform: "google_trends_news",
      sourceUrl: topNews.sourceUrl,
      sourceAuthor: `Google Trends (${topNews.approxTraffic})`,
      sourceViews: 950000,
      sourceShares: 72000,
      sourceComments: 4900,
      viralVelocityScore: 97,
      trendingSoundTitle: "Synthwave Bass Drop - Slowed & Reverb Edit",
      trendingSoundAuthor: "@cinema_drop_audio",
      trendingSoundUrl: "https://www.tiktok.com/music/Synthwave-Bass-Drop",
      beatDropSec: "2.4",
      editingTrick: trick,
      archetypeId: options.archetypeId || "metabolic_crasher",
    });
  }

  if (options.mode === "tiktok_url") {
    const outliers = await scrapeViralTikToks({ tiktokUrl: options.tiktokUrl || options.query });
    const top = outliers[0];
    return deconstructAndSynthesizeTrend({
      trendCategory: "url_clone",
      topicOrHook: top.title,
      sourcePlatform: "url_clone",
      sourceUrl: top.sourceUrl,
      sourceAuthor: top.authorHandle,
      sourceViews: top.views,
      sourceShares: top.shares,
      sourceComments: top.comments,
      viralVelocityScore: top.viralVelocityScore,
      trendingSoundTitle: top.trendingSoundTitle,
      trendingSoundAuthor: top.trendingSoundAuthor,
      trendingSoundUrl: top.trendingSoundUrl,
      beatDropSec: top.detectedBeatDropSec,
      editingTrick: options.editingTrick || top.inferredEditingTrick,
      archetypeId: options.archetypeId || "cortisol_spiked",
      videoDownloadUrl: top.videoDownloadUrl,
    });
  }

  // Default: mode === "tiktok_keyword"
  const outliers = await scrapeViralTikToks({ query: options.query || "corporate humor pov" });
  const top = outliers[0];
  return deconstructAndSynthesizeTrend({
    trendCategory: "niche_viral_outlier",
    topicOrHook: top.title,
    sourcePlatform: "tiktok",
    sourceUrl: top.sourceUrl,
    sourceAuthor: top.authorHandle,
    sourceViews: top.views,
    sourceShares: top.shares,
    sourceComments: top.comments,
    viralVelocityScore: top.viralVelocityScore,
    trendingSoundTitle: top.trendingSoundTitle,
    trendingSoundAuthor: top.trendingSoundAuthor,
    trendingSoundUrl: top.trendingSoundUrl,
    beatDropSec: top.detectedBeatDropSec,
    editingTrick: options.editingTrick || top.inferredEditingTrick,
    archetypeId: options.archetypeId || "cortisol_spiked",
    videoDownloadUrl: top.videoDownloadUrl,
  });
}

/**
 * Remixes an existing Trend Blueprint with a custom producer directive or new editing trick
 */
export async function remixTrendBlueprintById(
  id: number,
  options: {
    directive?: string;
    editingTrick?: EditingTrickType;
    beatDropSec?: string;
  }
): Promise<HydratedTrendBlueprint | null> {
  const existing = await storage.getAgentTrendBlueprintById(id);
  if (!existing) return null;

  let pkg: FlowUltraVideoPackage;
  let deconstruction: TrendDeconstruction;
  try {
    pkg = JSON.parse(existing.generatedPackageJson);
    deconstruction = JSON.parse(existing.deconstructionJson);
  } catch {
    return null;
  }

  const nextTrick: EditingTrickType =
    options.editingTrick || (existing.editingTrick as EditingTrickType) || "beat_drop_match_cut";
  const nextBeatDrop = options.beatDropSec || existing.beatDropSec || "2.4";
  const directive = (options.directive || "").trim();

  // Re-synthesize via deconstructAndSynthesizeTrend or deterministic update
  const remixed = await deconstructAndSynthesizeTrend({
    trendCategory: (existing.trendCategory as TrendCategoryType) || "newsjack_cultural",
    topicOrHook: existing.trendTopicOrHook,
    sourcePlatform: (existing.sourcePlatform as any) || "tiktok",
    sourceUrl: existing.sourceUrl,
    sourceAuthor: existing.sourceAuthor,
    sourceViews: existing.sourceViews,
    sourceShares: existing.sourceShares,
    sourceComments: existing.sourceComments,
    viralVelocityScore: existing.viralVelocityScore,
    trendingSoundTitle: existing.trendingSoundTitle,
    trendingSoundAuthor: existing.trendingSoundAuthor,
    trendingSoundUrl: existing.trendingSoundUrl,
    beatDropSec: nextBeatDrop,
    editingTrick: nextTrick,
    archetypeId: pkg.archetypeId,
    remixDirective: directive || `Switch editing trick to ${EDITING_TRICK_LABELS[nextTrick]}`,
  });

  // Update the existing blueprint in-place as well so its ID stays fresh
  await storage.updateAgentTrendBlueprint(id, {
    editingTrick: nextTrick,
    beatDropSec: nextBeatDrop,
    deconstructionJson: JSON.stringify(remixed.deconstruction),
    generatedPackageJson: JSON.stringify({
      ...remixed.generatedPackage,
      id: pkg.id,
    }),
  });

  const updatedPkg: FlowUltraVideoPackage = {
    ...remixed.generatedPackage,
    id: pkg.id,
  };
  registerDynamicFlowUltraPackage(updatedPkg);

  return {
    ...existing,
    editingTrick: nextTrick,
    beatDropSec: nextBeatDrop,
    deconstruction: remixed.deconstruction,
    generatedPackage: updatedPkg,
  };
}
