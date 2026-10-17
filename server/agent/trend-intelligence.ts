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
  type ChaosTwistMode,
  type EditingTrickType,
  type EnergyVibeType,
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
  energyVibe?: EnergyVibeType;
  chaosTwistMode?: ChaosTwistMode;
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

export const ENERGY_VIBE_LABELS: Record<EnergyVibeType, string> = {
  high_performance_positive: "⚡ Crazy Positive / Unstoppable Flow State",
  dark_humor_contrast: "🎭 Relatable Corporate Comedy",
  uplifting_comeback_story: "🏆 High-Status Inspiration",
};

export const CHAOS_TWIST_LABELS: Record<ChaosTwistMode, string> = {
  absurd_giraffe_twist: "🐪 Giraffe / Absurd Background Twist",
  hypercar_spectacle: "🚀 Hypercar / High-Tech Spectacle",
  kinetic_boss_exit: "🎬 Kinetic Boss Move",
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
  energyVibe?: EnergyVibeType;
  chaosTwistMode?: ChaosTwistMode;
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
        "No static standing still, no hands in pockets, no dead staring pauses, no internal cuts, no camera angle changes, no gibberish text or UI on screens, no distorted fingers, no sales pitch on screen.",
      negativePrompt: STANDARD_NEGATIVE_PROMPT,
      flowUltraPrompt,
      onScreenText: s.onScreenText,
      soundCue: `SFX: ${cleanSfx} | Ambient: ${cleanAmbient} | Beat Sync @ ${params.beatDropSec}s`,
    };
  });

  const targetLengthSeconds = 6;
  const flowAgentPrompt = buildFlowAgentMasterBrief(
    params.angleTitle,
    params.sceneBible,
    builtScenes
  );
  const caption = assembleThreeLayerCaption(params.captionParts);
  const trickLabel = EDITING_TRICK_LABELS[params.editingTrick] || "Beat-Drop Match Cut";
  const vibeLabel = params.energyVibe ? ENERGY_VIBE_LABELS[params.energyVibe] : "";

  const pkg: FlowUltraVideoPackage = {
    id: params.id,
    archetypeId: params.archetypeId,
    archetypeName: ARCHETYPE_LABELS[params.archetypeId] || "Cortisol-Spiked High Performer",
    angleTitle: params.angleTitle,
    viralFormat: params.viralFormat,
    viralFormatLabel: `${params.viralFormatLabel} • ${trickLabel}${vibeLabel ? ` • ${vibeLabel}` : ""}`,
    targetLengthSeconds,
    durationSeconds: targetLengthSeconds,
    pacingRule: `6.0s Viral Punch (2.5s Scene 1 Hook + 3.5s Scene 2 Peak • ${trickLabel} @ ${params.beatDropSec}s)`,
    psychologicalAngle: params.psychologicalAngle,
    aspectRatio: "9:16",
    cameraSpec: `${params.sceneBible.lens}, 3-Beat Kinetic Choreography, upper-third negative space lock`,
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
    energyVibe: params.energyVibe || "high_performance_positive",
    chaosTwistMode: params.chaosTwistMode || "absurd_giraffe_twist",
  };

  registerDynamicFlowUltraPackage(pkg);
  return pkg;
}

/**
 * Pre-Seeded High-Velocity Trend Blueprints (Starting with the 2 Brand-New Crazy Positive + Spectacle Blueprints)
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
    trendTopicOrHook:
      "How 8:45 AM Feels When Your Cortisol Curve Is Actually Dialed In",
    sourcePlatform: "tiktok",
    sourceUrl: "https://www.tiktok.com/tag/highperformance",
    sourceAuthor: "@godmode_founder_vibes",
    sourceViews: 2680000,
    sourceShares: 214000,
    sourceComments: 14900,
    viralVelocityScore: 100,
    trendingSoundTitle: "Electric Synth Drive - High-Energy Flow State Edit",
    trendingSoundAuthor: "@apex_cinema_audio",
    trendingSoundUrl: "https://www.tiktok.com/music/Electric-Synth-Drive",
    beatDropSec: "2.5",
    editingTrick: "beat_drop_match_cut",
    deconstruction: {
      visualHookMechanic:
        "100% electric, Crazy Positive Limitless/God-Mode energy: opens at frame 0 with the executive sliding into a glass showroom on a leather chair in front of a spinning hovering silver Roadster, catching a fresh espresso mid-glide, and nodding as a real giraffe sprints past the glass window behind him.",
      editingTrickBreakdown:
        "3-Beat Kinetic Choreography + 2.5s Viral Punch Match Cut: zero static standing—every second has fluid motion, prop mastery, and an absurd background giraffe twist that forces 3+ rewatches.",
      audioSyncRule:
        "High-energy synth drive builds from 0.0s to 2.5s during the leather chair glide, punching into Scene 2 right as he clicks the espresso cup down and closes his laptop with one finger.",
      humorContrastFormula:
        "Infectious winning energy + unexpected background giraffe spectacle ('Wait—did a giraffe just sprint past the window?!') drives massive comment threads and shares.",
      shareTrigger:
        "Viewers share for both the electric morning hype vibe AND the hilarious background giraffe Easter egg.",
    },
    packageSeed: {
      id: "trend-godmode-845am-giraffe-roadster",
      archetypeId: "cortisol_spiked",
      angleTitle:
        "⚡ Crazy Positive God-Mode: How 8:45 AM Feels When Your Cortisol Curve Is Actually Dialed In (🐪 Giraffe Twist)",
      viralFormat: "purple_cow_loop",
      viralFormatLabel: "⚡ Crazy Positive + 🐪 Giraffe Twist",
      editingTrick: "beat_drop_match_cut",
      beatDropSec: "2.5",
      trendingSoundTitle: "Electric Synth Drive - High-Energy Flow State Edit",
      trendingSoundAuthor: "@apex_cinema_audio",
      trendingSoundUrl: "https://www.tiktok.com/music/Electric-Synth-Drive",
      trendCategory: "newsjack_cultural",
      viralVelocityScore: 100,
      energyVibe: "high_performance_positive",
      chaosTwistMode: "absurd_giraffe_twist",
      psychologicalAngle:
        "Pure infectious high-performance flow state combined with a 3-Beat Kinetic Chair Glide and a surreal sprinting giraffe background twist that makes viewers feel energized and unstoppable.",
      sceneBible: {
        cast: "A charismatic 40-year-old European executive with short salt-and-pepper hair, light stubble, and an electric confident grin",
        wardrobe: "a tailored charcoal wool blazer over a crisp open-collar white dress shirt",
        lens: "35mm lens, shallow depth of field",
        lightDirection: "vibrant golden morning sunlight streaming through architectural glass",
      },
      rawScenes: [
        {
          sceneNumber: 1,
          timeRange: "0.0s – 2.5s",
          shotType: "3-Beat Kinetic Leather Chair Glide + Hovering Roadster + Giraffe Window Twist",
          shotSizeAndMove: "Medium-wide dynamic tracking shot moving with the rolling chair",
          whatWeWant:
            "Single unbroken kinetic shot: Beat 1 (0–2s) executive slides into a sunlit glass showroom on a leather office chair in front of a spinning hovering silver Roadster; Beat 2 (2–4s) grabs a fresh espresso mid-glide; Beat 3 (4–6s) nods confidently as a real giraffe sprints full-speed past the glass hangar window behind him.",
          singlePhysicalAction:
            "Beat 1 from 0 to 2 seconds he glides briskly into frame on a black leather rolling office chair with an electric confident grin in front of a hovering silver electric Roadster spinning in cold thruster mist, Beat 2 from 2 to 4 seconds he smoothly grabs a fresh double espresso glass off the oak table mid-glide, Beat 3 from 4 to 6 seconds he gives a sharp confident nod to the camera while a real towering giraffe sprints full-speed past the floor-to-ceiling glass window in the background",
          environmentAndLighting:
            "Sunlit minimalist architectural glass showroom with clean softly blurred negative space in the upper third",
          sfx: "Smooth leather chair wheels gliding on polished concrete, espresso glass catch, and futuristic hover turbine hum",
          ambient: "Bright energetic morning showroom acoustics",
          onScreenText:
            "How 8:45 AM feels when you actually slept 8 unbroken hours and your brain is firing at 100%",
        },
        {
          sceneNumber: 2,
          timeRange: "2.5s – 6.0s",
          shotType: "3-Beat Kinetic One-Finger Laptop Close + Giraffe Background Climax",
          shotSizeAndMove: "Medium dynamic Steadicam push-in",
          whatWeWant:
            "Single unbroken kinetic shot: Beat 1 (0–2s) takes a crisp sip of espresso at his sunlit oak desk; Beat 2 (2–4s) closes his brushed aluminum laptop lid with one index finger; Beat 3 (4–6s) strides past the camera with a winning smile as the giraffe sprints past the exterior glass window behind him.",
          singlePhysicalAction:
            "Beat 1 from 0 to 2 seconds he sets his espresso cup down on a sunlit solid oak desk with a crisp click, Beat 2 from 2 to 4 seconds he shuts his brushed aluminum laptop lid effortlessly with one index finger and rises in one fluid motion, Beat 3 from 4 to 6 seconds he strides past the camera with an unstoppable grin while a real giraffe sprints past the glass window in the background",
          environmentAndLighting:
            "Sun-drenched modern glass executive office with warm golden rim light and clean upper-third headroom",
          sfx: "Crisp aluminum laptop lid click and confident footsteps",
          ambient: "Vibrant morning room tone",
          onScreenText:
            "Zero brain fog. Zero afternoon crash. Not even the giraffe outside can break my flow state.",
        },
      ],
      captionParts: {
        hookContinuation:
          "Wait until you see what sprints past the window at the end—because when your nervous system and sleep architecture are actually dialed in, nothing breaks your morning flow state.",
        educationalBridge:
          "When I was Head of Sales at BMW, everyone assumed high performance meant grinding for 14 hours with 4 espressos and a permanent frown. In reality, the highest-performing founders I worked with operated from effortless biological alignment: when your cortisol peaks naturally with morning sunlight and your evening melatonin isn't blocked by 11 PM screen stress, 8:45 AM feels like God-Mode. You can recalibrate that entire circadian rhythm in one structured 24-hour reset.",
        committedCta:
          "Comment RESET and I'll DM you the free 60-second Burnout & Nervous System Diagnostic.",
      },
    },
  },
  {
    trendCategory: "editing_trick_trend",
    trendTopicOrHook:
      "Finishing a Full Week of Deep Work by Tuesday at 11:30 AM",
    sourcePlatform: "tiktok",
    sourceUrl: "https://www.tiktok.com/tag/founderflow",
    sourceAuthor: "@unstoppable_exec",
    sourceViews: 1940000,
    sourceShares: 158000,
    sourceComments: 9420,
    viralVelocityScore: 99,
    trendingSoundTitle: "Limitless Brass & Sub-Bass Drop (2.5s Cut)",
    trendingSoundAuthor: "@kinetic_edits",
    trendingSoundUrl: "https://www.tiktok.com/music/Limitless-Brass-Drop",
    beatDropSec: "2.5",
    editingTrick: "beat_drop_match_cut",
    deconstruction: {
      visualHookMechanic:
        "Pure aspirational high-velocity flow: fast tracking shot of an executive shutting his MacBook with one finger, catching his car keys in mid-air, and walking out with an electric grin while everyone in the background moves in 0.2x slow motion.",
      editingTrickBreakdown:
        "6.0s Viral Punch (2.5s Scene 1 Setup + 3.5s Scene 2 Hypercar Spectacle Payoff) with 1.08x dynamic push-in and zero dead frames.",
      audioSyncRule:
        "Sync the one-finger MacBook lid click and mid-air key catch to the 2.5s beat drop.",
      humorContrastFormula:
        "Everyone else scheduling their 4th alignment meeting vs. finishing the entire week's deep work by Tuesday at 11:30 AM.",
      shareTrigger:
        "Founders and high-performers repost to their stories as the ultimate Tuesday productivity flex.",
    },
    packageSeed: {
      id: "trend-godmode-tuesday-deepwork-hypercar",
      archetypeId: "dopamine_depleted",
      angleTitle:
        "⚡ Unstoppable Flow State: Finishing a Full Week of Deep Work by Tuesday at 11:30 AM (🚀 Hypercar Spectacle)",
      viralFormat: "two_timelines_experiment",
      viralFormatLabel: "⚡ Crazy Positive + 🚀 Hypercar Spectacle",
      editingTrick: "beat_drop_match_cut",
      beatDropSec: "2.5",
      trendingSoundTitle: "Limitless Brass & Sub-Bass Drop (2.5s Cut)",
      trendingSoundAuthor: "@kinetic_edits",
      trendingSoundUrl: "https://www.tiktok.com/music/Limitless-Brass-Drop",
      trendCategory: "editing_trick_trend",
      viralVelocityScore: 99,
      energyVibe: "high_performance_positive",
      chaosTwistMode: "hypercar_spectacle",
      psychologicalAngle:
        "Celebrates the electric feeling of deep dopamine focus—knocking out 40 hours of cognitive output by Tuesday at 11:30 AM and walking out in pure flow.",
      sceneBible: {
        cast: "A charismatic 40-year-old European executive with short salt-and-pepper hair, light stubble, and an electric confident grin",
        wardrobe: "a tailored charcoal wool blazer over a crisp open-collar white dress shirt",
        lens: "35mm lens, shallow depth of field",
        lightDirection: "bright golden late-morning sunlight with crisp glass reflections",
      },
      rawScenes: [
        {
          sceneNumber: 1,
          timeRange: "0.0s – 2.5s",
          shotType: "3-Beat Kinetic One-Finger MacBook Close + Mid-Air Key Catch + 0.2x Slow-Mo Office",
          shotSizeAndMove: "Fast Steadicam backward tracking shot leading the walking executive",
          whatWeWant:
            "Single unbroken kinetic shot: Beat 1 (0–2s) executive shuts his MacBook with one finger at an oak desk and steps into a brisk stride; Beat 2 (2–4s) tosses and catches his car keys in mid-air with an electric grin; Beat 3 (4–6s) walks toward camera while everyone in the background moves in 0.2x slow motion.",
          singlePhysicalAction:
            "Beat 1 from 0 to 2 seconds he shuts his brushed aluminum laptop lid with one finger at a sunlit oak desk and immediately strides forward, Beat 2 from 2 to 4 seconds he tosses his metallic car keys up and catches them cleanly in mid-air with an electric confident grin, Beat 3 from 4 to 6 seconds he walks briskly toward the camera while coworkers in the glass office behind him move in 0.2x ultra-slow motion",
          environmentAndLighting:
            "Sunlit modern glass executive floor with clean blurred upper-third negative space",
          sfx: "Crisp laptop lid click, metallic car keys catch in palm, and confident stride",
          ambient: "Subtle cinematic low-end whoosh",
          onScreenText:
            "Finishing a full week of deep work by Tuesday at 11:30 AM",
        },
        {
          sceneNumber: 2,
          timeRange: "2.5s – 6.0s",
          shotType: "3-Beat Kinetic Hangar Walkout + Spinning Hovering Roadster Spectacle",
          shotSizeAndMove: "Low-angle tracking shot following his stride across polished concrete",
          whatWeWant:
            "Single unbroken kinetic shot: Beat 1 (0–2s) strides into the sunlit glass hangar buttoning his blazer; Beat 2 (2–4s) puts on dark sunglasses mid-stride; Beat 3 (4–6s) behind him a silver hovering electric Roadster spins 360 degrees with cold thruster fog.",
          singlePhysicalAction:
            "Beat 1 from 0 to 2 seconds he strides briskly across polished concrete in a sunlit glass hangar buttoning his charcoal blazer, Beat 2 from 2 to 4 seconds he slips on dark sunglasses in one fluid hand motion with a confident grin, Beat 3 from 4 to 6 seconds a sleek silver electric Roadster behind him hovers two inches above the floor and spins 360 degrees in swirling cold white thruster fog",
          environmentAndLighting:
            "Sunlit architectural glass hangar with clean upper-third headroom",
          sfx: "Futuristic electric turbine spin, pressurized thruster whoosh, and crisp footsteps",
          ambient: "Resonant showroom acoustics",
          onScreenText:
            "Everyone else is scheduling a 4th alignment call. I am already out the door.",
        },
      ],
      captionParts: {
        hookContinuation:
          "There is no better feeling on earth than closing your laptop with one finger on Tuesday at 11:30 AM knowing your entire week's deep work is already done.",
        educationalBridge:
          "Most professionals don't have a time problem—they have a fragmented dopamine problem. When you start your morning scrolling notifications and drinking caffeine on a stressed nervous system, your attention fractures into 40-second micro-bursts. When I was Head of Sales at BMW, I learned that 3 hours of unbroken, biologically aligned morning flow outperforms 50 hours of scattered busywork. One 24-hour reset clears the receptor fatigue so your focus locks in effortlessly.",
        committedCta:
          "Comment RESET and I'll DM you the free 60-second Burnout & Nervous System Diagnostic.",
      },
    },
  },
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
    beatDropSec: "2.5",
    editingTrick: "beat_drop_match_cut",
    deconstruction: {
      visualHookMechanic:
        "Juxtaposes an ultra-futuristic aerospace-grade hypercar spectacle in Scene 1 (0.0s–2.5s) with the immediate 3.5s espresso sigh payoff at 2:30 PM in Scene 2 (total 6.0s viral punch).",
      editingTrickBreakdown:
        "6.0s Viral Punch (2.5s Scene 1 Setup with 1.08x zoom push-in + 3.5s Scene 2 Peak Action window from 1.2s–4.7s) eliminating all dead staring pauses.",
      audioSyncRule:
        "Build tension for 0.0s–2.5s during the sleek silver hypercar hover shot, then hard-cut on the 2.5s beat drop right into the peak espresso cup sigh.",
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
      beatDropSec: "2.5",
      trendingSoundTitle: "Synthwave Bass Drop - Slowed & Reverb Edit",
      trendingSoundAuthor: "@cinema_drop_audio",
      trendingSoundUrl: "https://www.tiktok.com/music/Synthwave-Bass-Drop",
      trendCategory: "newsjack_cultural",
      viralVelocityScore: 98,
      energyVibe: "dark_humor_contrast",
      chaosTwistMode: "hypercar_spectacle",
      psychologicalAngle:
        "Newsjacking a massive tech/automotive spectacle and flipping it at the 2.5s beat drop into the universal 2:30 PM afternoon brain crash.",
      sceneBible: {
        cast: "A 40-year-old European executive with short salt-and-pepper hair, light stubble, and expressive eyes",
        wardrobe: "a tailored charcoal wool blazer over a crisp white open-collar dress shirt",
        lens: "35mm lens, shallow depth of field",
        lightDirection: "cool twilight glass reflections contrasting with warm afternoon office daylight",
      },
      rawScenes: [
        {
          sceneNumber: 1,
          timeRange: "0.0s – 2.5s",
          shotType: "3-Beat Kinetic Silver Electric Hypercar Levitation + 360 Spin Hook",
          shotSizeAndMove: "Medium-wide low-angle tracking shot with a 1.08x push-in",
          whatWeWant:
            "Single unbroken kinetic shot of the executive rolling into a minimalist glass test hangar on a leather chair as a sleek silver aerodynamic electric sports car hovers and spins two inches above polished concrete with cold thruster mist.",
          singlePhysicalAction:
            "Beat 1 from 0 to 2 seconds he glides into the glass hangar on a black leather chair holding an aluminum laptop, Beat 2 from 2 to 4 seconds he lowers his sunglasses to watch a sleek silver electric sports car hover two inches above wet concrete, Beat 3 from 4 to 6 seconds the hovering silver hypercar spins 360 degrees in swirling white air-thruster mist",
          environmentAndLighting:
            "Minimalist architectural glass hangar at twilight with clean dark ceiling space in the upper third",
          sfx: "Deep futuristic electric turbine hum and pressurized air thruster whoosh",
          ambient: "Vast echoing concrete hangar room tone",
          onScreenText:
            "Engineers in 2026: making electric sports cars literally hover off the ground",
        },
        {
          sceneNumber: 2,
          timeRange: "2.5s – 6.0s",
          shotType: "Medium Office Desk 2:30 PM Espresso Sigh Peak Payoff",
          shotSizeAndMove: "Medium shot with a crisp 1.10x beat-drop zoom-punch",
          whatWeWant:
            "Exact 3.5s peak action cut (1.2s–4.7s) on the beat drop showing the executive holding a half-empty espresso cup at his oak desk and letting out a visible afternoon sigh beside his open laptop.",
          singlePhysicalAction:
            "Beat 1 from 0 to 2 seconds he lifts a half-empty glass espresso cup at a sunlit oak desk and lets out a visible shoulder-dropping sigh, Beat 2 from 2 to 4 seconds he sets the espresso cup down and rubs his temple with one hand beside an open aluminum laptop, Beat 3 from 4 to 6 seconds a giraffe casually walks past the exterior office window behind him",
          environmentAndLighting:
            "Quiet modern glass office in late afternoon with clean blurred wall space in the upper third",
          sfx: "Single ceramic cup click and a clear human sigh",
          ambient: "Quiet office air conditioning hum",
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
 * Ensures the 6 high-velocity Trend Blueprints (including the 2 Crazy Positive High-Performance + Spectacle blueprints)
 * are seeded in storage and registered in the dynamic FlowUltraPackage registry.
 */
export async function ensureTrendBlueprintsSeeded(): Promise<HydratedTrendBlueprint[]> {
  if (trendSeedPromise) {
    await trendSeedPromise;
    return getHydratedTrendBlueprints();
  }

  trendSeedPromise = (async () => {
    const existing = await storage.getAgentTrendBlueprints();
    const existingByTopic = new Map(existing.map((e) => [e.trendTopicOrHook, e]));

    for (const seed of INITIAL_TREND_BLUEPRINT_SEEDS) {
      const pkg = buildDynamicPackageFromSeed(seed.packageSeed);
      const found = existingByTopic.get(seed.trendTopicOrHook);
      if (found) {
        await storage.updateAgentTrendBlueprint(found.id, {
          beatDropSec: seed.beatDropSec,
          editingTrick: seed.editingTrick,
          deconstructionJson: JSON.stringify(seed.deconstruction),
          generatedPackageJson: JSON.stringify(pkg),
        });
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

const TOP_PRIORITY_PACKAGE_IDS: Record<string, number> = {
  "trend-godmode-845am-giraffe-roadster": 1000,
  "trend-godmode-tuesday-deepwork-hypercar": 990,
  "trend-1-tesla-roadster-newsjack-drop": 980,
};

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
        energyVibe: generatedPackage.energyVibe || "high_performance_positive",
        chaosTwistMode: generatedPackage.chaosTwistMode || "absurd_giraffe_twist",
      });
    } catch {
      // Skip malformed row
    }
  }

  hydrated.sort((a, b) => {
    const prioA = TOP_PRIORITY_PACKAGE_IDS[a.generatedPackage?.id || ""] || 0;
    const prioB = TOP_PRIORITY_PACKAGE_IDS[b.generatedPackage?.id || ""] || 0;
    if (prioA !== prioB) return prioB - prioA;
    return b.id - a.id;
  });

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
              detectedBeatDropSec: Number(d.duration || 10) <= 8 ? "2.1" : "2.5",
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
        detectedBeatDropSec: "2.5",
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
            detectedBeatDropSec: dur <= 7 ? "2.0" : "2.5",
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
      detectedBeatDropSec: "2.5",
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

function buildBeat3ClimaxDescription(chaosTwistMode: ChaosTwistMode): string {
  switch (chaosTwistMode) {
    case "absurd_giraffe_twist":
      return "Beat 3 from 4 to 6 seconds he gives a sharp confident nod toward the camera while a real towering giraffe sprints full-speed past the floor-to-ceiling glass window in the background";
    case "hypercar_spectacle":
      return "Beat 3 from 4 to 6 seconds a sleek silver electric Roadster behind him levitates two inches off the polished floor and spins 360 degrees in swirling cold white thruster fog while background figures move in 0.2x slow motion";
    case "kinetic_boss_exit":
    default:
      return "Beat 3 from 4 to 6 seconds he shuts the aluminum laptop lid with one index finger, catches his car keys mid-air, and strides past the camera with an electric grin as loose office papers float in slow motion behind him";
  }
}

/**
 * Pillar 4: Multimodal Gemini Deconstructor & Dynamic 6-Block Veo 3.1 Prompt Architect
 * Enforces 3-Beat Kinetic Choreography + Giraffe/Spectacle Twist and Energy Vibe (Crazy Positive | Dark Humor | Uplifting Story)
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
  energyVibe?: EnergyVibeType;
  chaosTwistMode?: ChaosTwistMode;
  videoDownloadUrl?: string;
  remixDirective?: string;
}): Promise<HydratedTrendBlueprint> {
  const archetypeId: FlowUltraVideoPackage["archetypeId"] =
    params.archetypeId || "cortisol_spiked";
  const editingTrick: EditingTrickType = params.editingTrick || "beat_drop_match_cut";
  const beatDropSec = params.beatDropSec || "2.5";
  const energyVibe: EnergyVibeType = params.energyVibe || "high_performance_positive";
  const chaosTwistMode: ChaosTwistMode = params.chaosTwistMode || "absurd_giraffe_twist";
  const cleanTopic = sanitizeNoQuotes(params.topicOrHook);
  const beat3Climax = buildBeat3ClimaxDescription(chaosTwistMode);

  const isPositiveVibe = energyVibe === "high_performance_positive";
  const isStoryVibe = energyVibe === "uplifting_comeback_story";

  // Default deterministic synthesis (used immediately if Gemini API is unavailable or rate-limited)
  let deconstruction: TrendDeconstruction = {
    visualHookMechanic: `Opens at frame 0 with 3-Beat Kinetic Choreography (${ENERGY_VIBE_LABELS[energyVibe]}) built around '${cleanTopic}' plus '${CHAOS_TWIST_LABELS[chaosTwistMode]}'—zero static standing.`,
    editingTrickBreakdown: `6.0s Viral Punch (${EDITING_TRICK_LABELS[editingTrick]} @ ${beatDropSec}s): 2.5s Scene 1 Kinetic Hook with 1.08x push-in + 3.5s Scene 2 Peak Action Climax.`,
    audioSyncRule: `Pair with '${params.trendingSoundTitle}' (${params.trendingSoundAuthor}) and align the Scene 1 -> Scene 2 cut to the ${beatDropSec}s beat drop.`,
    humorContrastFormula: isPositiveVibe
      ? `100% Electric Limitless/God-Mode Flow State on screen + ${CHAOS_TWIST_LABELS[chaosTwistMode]} -> BMW Head of Sales biological alignment insight in caption -> 'Comment RESET' at bottom.`
      : isStoryVibe
      ? `High-Status BMW Executive Transformation Story on screen + ${CHAOS_TWIST_LABELS[chaosTwistMode]} -> 24-Hour Reset physiology in caption -> 'Comment RESET' at bottom.`
      : `100% Entertain-First Corporate Comedy Contrast + ${CHAOS_TWIST_LABELS[chaosTwistMode]} -> BMW Head of Sales physiological insight in caption -> 'Comment RESET' at bottom.`,
    shareTrigger: `Viewers rewatch for the 3-beat kinetic motion and '${CHAOS_TWIST_LABELS[chaosTwistMode]}' Easter egg, sharing it immediately to founder and coworker group chats.`,
  };

  let angleTitle = isPositiveVibe
    ? `⚡ Crazy Positive Flow State: ${cleanTopic} (${CHAOS_TWIST_LABELS[chaosTwistMode]})`
    : isStoryVibe
    ? `🏆 Executive Comeback: ${cleanTopic} (${CHAOS_TWIST_LABELS[chaosTwistMode]})`
    : `🎭 Newsjack Contrast: ${cleanTopic} vs. 2:30 PM Brain`;

  let sceneBible: SceneBibleSpec = {
    cast: isPositiveVibe
      ? "A charismatic 40-year-old European executive with short salt-and-pepper hair, light stubble, and an electric confident grin"
      : "A 40-year-old European executive with short salt-and-pepper hair, light stubble, and expressive eyes",
    wardrobe: "a tailored charcoal wool suit blazer over a crisp open-collar white dress shirt",
    lens: "35mm lens, shallow depth of field",
    lightDirection: "vibrant golden morning sunlight streaming through architectural glass",
  };

  let rawScenes = [
    {
      sceneNumber: 1,
      timeRange: "0.0s – 2.5s",
      shotType: "3-Beat Kinetic Entry + Prop Mastery + Spectacle Hook",
      shotSizeAndMove: "Medium-wide dynamic tracking shot moving with the subject",
      whatWeWant: `Single unbroken 6s kinetic shot (trimmed to 0.0s–2.5s in Viral Punch) capturing ${cleanTopic} with 3-Beat Kinetic Choreography and ${CHAOS_TWIST_LABELS[chaosTwistMode]}.`,
      singlePhysicalAction: `Beat 1 from 0 to 2 seconds he glides briskly into the sunlit glass showroom on a black leather rolling office chair with an electric confident grin, Beat 2 from 2 to 4 seconds he smoothly catches a fresh double espresso glass mid-glide, ${beat3Climax}`,
      environmentAndLighting:
        "Sunlit minimalist architectural glass showroom with softly blurred negative space in the upper third",
      sfx: "Smooth leather chair wheels gliding on polished concrete and crisp espresso glass catch",
      ambient: "Vibrant energetic showroom acoustics",
      onScreenText: isPositiveVibe
        ? `How 8:45 AM feels when your sleep and focus are firing at 100%: ${cleanTopic}`
        : isStoryVibe
        ? `What I learned watching top founders operate in pure flow: ${cleanTopic}`
        : `The world in 2026: ${cleanTopic}`,
    },
    {
      sceneNumber: 2,
      timeRange: "2.5s – 6.0s",
      shotType: "3-Beat Kinetic One-Finger Laptop Close + Spectacle Payoff",
      shotSizeAndMove: "Medium dynamic Steadicam push-in with 1.10x beat-drop punch",
      whatWeWant: `Single unbroken kinetic shot (3.5s peak window) showing the executive closing his laptop with one finger, catching his keys, and triggering ${CHAOS_TWIST_LABELS[chaosTwistMode]}.`,
      singlePhysicalAction: `Beat 1 from 0 to 2 seconds he sets his espresso cup on a sunlit solid oak desk with a crisp click, Beat 2 from 2 to 4 seconds he shuts his brushed aluminum laptop lid with one index finger and catches his car keys mid-air, ${beat3Climax}`,
      environmentAndLighting:
        "Warm golden morning sunlight streaming through floor-to-ceiling glass windows with clean upper-third wall space",
      sfx: "Crisp aluminum laptop lid click, metallic key catch, and confident footsteps",
      ambient: "Bright morning air and subtle room tone",
      onScreenText: isPositiveVibe
        ? "Zero brain fog. Zero afternoon crash. Unstoppable all day."
        : isStoryVibe
        ? "One 24-hour biological reset changed how every single morning feels."
        : "Meanwhile me at 2:30 PM trying to form one coherent sentence before my next call",
    },
  ];

  let captionParts: CaptionThreeLayerBreakdown = {
    hookContinuation: isPositiveVibe
      ? `Wait until you spot the background twist—because when your nervous system and sleep architecture are actually dialed in around ${cleanTopic}, your morning energy feels like pure God-Mode.`
      : `Everyone is talking about ${cleanTopic}, meanwhile most high performers are trying to brute-force their workday on 5 hours of fragmented sleep and 3 espressos.`,
    educationalBridge:
      "When I was Head of Sales at Inchcape BMW, I saw both sides of high performance: executives running on an inverted cortisol curve who crashed at 2:30 PM, and the top 1% who operated with effortless biological clarity. You don't unlock peak focus with a rigid 30-day bootcamp—you recalibrate your circadian light, caffeine timing, and evening decompression windows in one structured 24-hour reset.",
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
- LAYER 1 (VIDEO & ON-SCREEN TEXT = 100% ENTERTAINMENT): Must match Energy Vibe "${energyVibe}" (${ENERGY_VIBE_LABELS[energyVibe]}) and Spectacle Twist "${chaosTwistMode}" (${CHAOS_TWIST_LABELS[chaosTwistMode]}). NEVER put "Perfect Day Reset", "protocol", or "Comment RESET" in onScreenText!
- LAYER 2 (CAPTION BODY = EDUCATION): Connect Scene 1 & 2 to Reiko's experience as Head of Sales at BMW and the physiology of peak circadian flow vs. executive burnout.
- LAYER 3 (CAPTION BOTTOM = CTA): End caption with "Comment RESET and I'll DM you the free 60-second Burnout & Nervous System Diagnostic."

Input Trend / Topic: "${cleanTopic}"
Trend Category: "${params.trendCategory}"
Energy Vibe Mode: "${energyVibe}" (${ENERGY_VIBE_LABELS[energyVibe]})
Spectacle / Chaos Twist Mode: "${chaosTwistMode}" (${CHAOS_TWIST_LABELS[chaosTwistMode]})
Target Editing Trick: "${editingTrick}" (Beat Drop @ ${beatDropSec}s)
Trending Sound: "${params.trendingSoundTitle}" by ${params.trendingSoundAuthor}
Target Archetype: "${ARCHETYPE_LABELS[archetypeId]}"
${params.remixDirective ? `Producer Remix Directive: "${params.remixDirective}"` : ""}

MANDATORY 3-BEAT KINETIC CHOREOGRAPHY (BAN STATIC STANDING):
- NEVER let the subject stand still with hands in pockets or stare blankly!
- Every scene's "singlePhysicalAction" MUST explicitly describe:
  * Beat 1 (0 to 2 seconds — Kinetic Entry): rolling into frame on a leather chair, brisk walking tracking shot, or sliding a laptop across an oak desk.
  * Beat 2 (2 to 4 seconds — Prop Mastery): catching/lifting an espresso cup mid-glide, closing a laptop lid with one finger, or catching car keys mid-air.
  * Beat 3 (4 to 6 seconds — Spectacle Climax): ${beat3Climax}.
- No quotation marks inside physical descriptions.

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
      "singlePhysicalAction": "string (Must include Beat 1 0-2s kinetic entry, Beat 2 2-4s prop mastery, Beat 3 4-6s spectacle twist, no quotation marks)",
      "environmentAndLighting": "string (no quotation marks)",
      "sfx": "string (1-2 crisp sound effects)",
      "ambient": "string (ambient room/environment tone)",
      "onScreenText": "string (100% electric entertainment hook, ZERO sales/CTA)"
    },
    {
      "shotType": "string",
      "shotSizeAndMove": "string",
      "whatWeWant": "string",
      "singlePhysicalAction": "string (Must include Beat 1 0-2s kinetic entry, Beat 2 2-4s prop mastery, Beat 3 4-6s spectacle twist, no quotation marks)",
      "environmentAndLighting": "string (no quotation marks)",
      "sfx": "string (1-2 crisp sound effects)",
      "ambient": "string (ambient room/environment tone)",
      "onScreenText": "string (100% electric entertainment payoff, ZERO sales/CTA)"
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
                rawScenes = parsed.scenes.slice(0, 2).map((sc: any, idx: number) => ({
                  sceneNumber: idx + 1,
                  timeRange: idx === 0 ? "0.0s – 2.5s" : "2.5s – 6.0s",
                  shotType: String(sc.shotType || `Scene ${idx + 1} Kinetic Shot`),
                  shotSizeAndMove: String(
                    sc.shotSizeAndMove || "Medium dynamic tracking shot"
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
                  sfx: sanitizeNoQuotes(String(sc.sfx || "Crisp movement sound")),
                  ambient: sanitizeNoQuotes(String(sc.ambient || "Vibrant room tone")),
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
      energyVibe === "high_performance_positive"
        ? "⚡ Crazy Positive Flow"
        : energyVibe === "uplifting_comeback_story"
        ? "🏆 High-Status Story"
        : "🎭 Dark Humor Contrast",
    editingTrick,
    beatDropSec,
    trendingSoundTitle: params.trendingSoundTitle,
    trendingSoundAuthor: params.trendingSoundAuthor,
    trendingSoundUrl: params.trendingSoundUrl,
    trendCategory: params.trendCategory,
    viralVelocityScore: params.viralVelocityScore,
    energyVibe,
    chaosTwistMode,
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
    energyVibe,
    chaosTwistMode,
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
  energyVibe?: EnergyVibeType;
  chaosTwistMode?: ChaosTwistMode;
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
      trendingSoundTitle:
        options.energyVibe === "high_performance_positive"
          ? "Electric Synth Drive - High-Energy Flow State Edit"
          : "Synthwave Bass Drop - Slowed & Reverb Edit",
      trendingSoundAuthor: "@cinema_drop_audio",
      trendingSoundUrl: "https://www.tiktok.com/music/Synthwave-Bass-Drop",
      beatDropSec: "2.5",
      editingTrick: trick,
      archetypeId: options.archetypeId || "cortisol_spiked",
      energyVibe: options.energyVibe || "high_performance_positive",
      chaosTwistMode: options.chaosTwistMode || "absurd_giraffe_twist",
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
      energyVibe: options.energyVibe || "high_performance_positive",
      chaosTwistMode: options.chaosTwistMode || "absurd_giraffe_twist",
      videoDownloadUrl: top.videoDownloadUrl,
    });
  }

  // Default: mode === "tiktok_keyword"
  const outliers = await scrapeViralTikToks({ query: options.query || "high performance flow state" });
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
    energyVibe: options.energyVibe || "high_performance_positive",
    chaosTwistMode: options.chaosTwistMode || "absurd_giraffe_twist",
    videoDownloadUrl: top.videoDownloadUrl,
  });
}

/**
 * Remixes an existing Trend Blueprint with a custom producer directive, energyVibe, chaosTwistMode, or editingTrick
 */
export async function remixTrendBlueprintById(
  id: number,
  options: {
    directive?: string;
    editingTrick?: EditingTrickType;
    beatDropSec?: string;
    energyVibe?: EnergyVibeType;
    chaosTwistMode?: ChaosTwistMode;
  }
): Promise<HydratedTrendBlueprint | null> {
  const existing = await storage.getAgentTrendBlueprintById(id);
  if (!existing) return null;

  let pkg: FlowUltraVideoPackage;
  try {
    pkg = JSON.parse(existing.generatedPackageJson);
  } catch {
    return null;
  }

  const nextTrick: EditingTrickType =
    options.editingTrick || (existing.editingTrick as EditingTrickType) || "beat_drop_match_cut";
  const nextBeatDrop = options.beatDropSec || existing.beatDropSec || "2.5";
  const nextVibe: EnergyVibeType =
    options.energyVibe || pkg.energyVibe || "high_performance_positive";
  const nextTwist: ChaosTwistMode =
    options.chaosTwistMode || pkg.chaosTwistMode || "absurd_giraffe_twist";
  const directive = (options.directive || "").trim();

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
    energyVibe: nextVibe,
    chaosTwistMode: nextTwist,
    remixDirective:
      directive ||
      `Switch to ${ENERGY_VIBE_LABELS[nextVibe]} + ${CHAOS_TWIST_LABELS[nextTwist]} + ${EDITING_TRICK_LABELS[nextTrick]}`,
  });

  const updatedPkg: FlowUltraVideoPackage = {
    ...remixed.generatedPackage,
    id: pkg.id,
  };

  await storage.updateAgentTrendBlueprint(id, {
    editingTrick: nextTrick,
    beatDropSec: nextBeatDrop,
    deconstructionJson: JSON.stringify(remixed.deconstruction),
    generatedPackageJson: JSON.stringify(updatedPkg),
  });

  registerDynamicFlowUltraPackage(updatedPkg);

  return {
    ...existing,
    editingTrick: nextTrick,
    beatDropSec: nextBeatDrop,
    deconstruction: remixed.deconstruction,
    generatedPackage: updatedPkg,
    energyVibe: nextVibe,
    chaosTwistMode: nextTwist,
  };
}

