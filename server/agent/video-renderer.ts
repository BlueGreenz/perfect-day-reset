import fs from "fs";
import os from "os";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";
import ffmpegStatic from "ffmpeg-static";
import {
  FLOW_ULTRA_PACKAGES,
  getFlowUltraPackageById,
  type FlowUltraVideoPackage,
} from "./flow-ultra-factory";
import {
  analyzeSceneClips,
  discoverWatchFolderClips,
  resolveEffectivePacingMode,
  resolveEffectiveTextStyle,
  type DirectorCutReport,
  type PacingMode,
  type SceneCutPlan,
  type TextSafeZone,
  type VideoTextStyle,
} from "./video-analyzer";
import { storage } from "../storage";
import type { AgentVideo } from "@shared/schema";

const execFileAsync = promisify(execFile);
const FFMPEG_BIN = (ffmpegStatic as unknown as string) || "ffmpeg";

const VISUAL_ASSETS_POOL = [
  "16x9_A_vibrant_golden_sunrise_gradual.webp",
  "16x9_the_morning_sun_on_a_plant_fille.webp",
  "21x9_A_diverse_group_of_confident_pro.webp",
  "16x9_A_vibrant_array_of_modern_sports.webp",
  "16x9_A_minimalist_gradient_transition.webp",
];

function resolveFontFileForFfmpeg(): string | null {
  const candidates = [
    "C:/Windows/Fonts/segoeuib.ttf",
    "C:/Windows/Fonts/arialbd.ttf",
    "C:/Windows/Fonts/calibrib.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    "/usr/share/fonts/TTF/DejaVuSans-Bold.ttf",
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) {
      return c.replace(/\\/g, "/").replace(/:/g, "\\:");
    }
  }
  return null;
}

function escapeFfmpegFilterPath(filePath: string): string {
  return filePath.replace(/\\/g, "/").replace(/:/g, "\\:").replace(/'/g, "\\'");
}

/**
 * Formats on-screen hook/payoff copy into max 2-3 compact lines for native TikTok/Reels
 * floating typography. Removes arrows (-> / →) and emojis so burned text is 100% clean.
 */
function wrapTextLines(text: string, maxCharsPerLine = 38): string {
  const cleaned = text
    .replace(/\s*→\s*Comment RESET\s*⚡?/gi, "\n(Comment RESET)")
    .replace(/\s*->\s*Comment RESET\s*⚡?/gi, "\n(Comment RESET)")
    .replace(/[→]|->/g, " ")
    .replace(/⚡|👋|🐄|🏎️|🔬/g, "")
    .replace(/—/g, " - ")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .trim();

  // Respect explicit line breaks first, then wrap long lines
  const paragraphs = cleaned
    .split(/\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const lines: string[] = [];
  for (const para of paragraphs) {
    const words = para.split(/\s+/);
    let current = "";
    for (const word of words) {
      if (!current) {
        current = word;
      } else if (current.length + 1 + word.length <= maxCharsPerLine) {
        current += " " + word;
      } else {
        lines.push(current);
        current = word;
      }
    }
    if (current) lines.push(current);
  }

  return lines.slice(0, 4).join("\n");
}

/**
 * Upper safe zone (y=160..260) so floating text never covers faces, hands, oak desk, or balcony action
 */
function safeZoneYCoordinate(zone: TextSafeZone): number {
  switch (zone) {
    case "upper_middle":
      return 235;
    case "bottom":
      return 250;
    case "top":
    default:
      return 185;
  }
}

export interface RenderAgentVideoOptions {
  packageId: string;
  outputFileName?: string;
  pacingMode?: PacingMode;
  textStyle?: VideoTextStyle;
  cleanNoText?: boolean;
  swapSceneOrder?: boolean;
  feedbackDirective?: string;
  fastSeedMode?: boolean;
  useWatchFolderClips?: boolean;
}

export interface RenderedVideoArtifact {
  videoUrl: string;
  absolutePath: string;
  directorReport: DirectorCutReport;
}

/**
 * Renders a 9:16 vertical (1080x1920) multi-scene H.264 + AAC MP4 video using FFmpeg
 * guided by the Multimodal AI Video Director's SceneCutPlan.
 * - Zero rectangular boxes, zero green footer bars, zero internal "SCENE X" labels.
 * - Preserves full natural clip durations in "natural_cinema" mode (e.g. full 6s+6s=12s).
 * - Preserves and crossfades native 48kHz stereo audio from dropped Flow Ultra clips.
 */
export async function renderStoryVideoWithDirector(
  options: RenderAgentVideoOptions
): Promise<RenderedVideoArtifact> {
  const pkg: FlowUltraVideoPackage =
    getFlowUltraPackageById(options.packageId) || FLOW_ULTRA_PACKAGES[0];

  const effectivePacingMode = resolveEffectivePacingMode(
    options.pacingMode,
    options.feedbackDirective
  );
  const effectiveTextStyle = resolveEffectiveTextStyle(
    options.textStyle,
    options.cleanNoText,
    options.feedbackDirective
  );

  const shouldSwapOrder =
    Boolean(options.swapSceneOrder) ||
    (options.feedbackDirective || "").toLowerCase().includes("swap scene");

  const useWatchClips = options.useWatchFolderClips !== false;
  const rawDropClips = useWatchClips ? discoverWatchFolderClips() : [];
  const dropClips = shouldSwapOrder ? [...rawDropClips].reverse() : rawDropClips;

  const directorReport = await analyzeSceneClips(rawDropClips, pkg, {
    pacingMode: effectivePacingMode,
    textStyle: effectiveTextStyle,
    cleanNoText: effectiveTextStyle === "none",
    swapSceneOrder: shouldSwapOrder,
    feedbackDirective: options.feedbackDirective,
  });

  const outDir = path.resolve(process.cwd(), "client", "public", "generated-videos");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const fileName =
    options.outputFileName ||
    `${pkg.id}-${Date.now().toString().slice(-6)}.mp4`;
  const outputAbsPath = path.join(outDir, fileName);
  const videoUrl = `/generated-videos/${fileName}`;

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "pdr-video-"));
  const fontSpec = resolveFontFileForFfmpeg();
  const fontArg = fontSpec ? `fontfile='${fontSpec}':` : "";

  try {
    // If real clips exist in attached_assets/flow_ultra_drop/, render as many scenes as match the storyboard (or dropped clips)
    // and NEVER cap their duration to 2.5s!
    let scenesToRender: SceneCutPlan[] = directorReport.sceneCuts;
    if (dropClips.length > 0 && scenesToRender.length > dropClips.length) {
      scenesToRender = scenesToRender.slice(0, dropClips.length);
    } else if (options.fastSeedMode && dropClips.length === 0) {
      scenesToRender = scenesToRender.slice(0, 3).map((s) => ({
        ...s,
        keptDurationSec: Math.min(s.keptDurationSec, 3.0),
      }));
    }

    const availableAssets = VISUAL_ASSETS_POOL.map((f) =>
      path.resolve(process.cwd(), "attached_assets", f)
    ).filter((p) => fs.existsSync(p));

    const segmentFiles: string[] = [];

    for (let i = 0; i < scenesToRender.length; i++) {
      const cut = scenesToRender[i];
      const segPath = path.join(tmpDir, `seg-${i}.mp4`);

      const rawClipPath = dropClips[i];
      const hasRawClip = Boolean(rawClipPath && fs.existsSync(rawClipPath));
      const assetPath =
        availableAssets[(i + pkg.id.length) % Math.max(1, availableAssets.length)];

      const vfSteps: string[] = [];

      if (hasRawClip) {
        // Real 9:16 video clip from Google Flow Ultra: scale cleanly to 1080x1920 without artificial horizontal panning
        vfSteps.push(
          "scale=1080:1920:force_original_aspect_ratio=increase",
          "crop=1080:1920",
          "setsar=1"
        );
      } else {
        // Static brand asset fallback: gentle cinematic pan
        const cropOffsetExpr =
          i % 2 === 0
            ? `(in_w-out_w)*0.28 + (in_w-out_w)*0.38*(t/${cut.keptDurationSec})`
            : `(in_w-out_w)*0.72 - (in_w-out_w)*0.38*(t/${cut.keptDurationSec})`;
        vfSteps.push(
          "scale=-2:1920",
          `crop=1080:1920:'${cropOffsetExpr}':0`,
          "setsar=1"
        );
      }

      // Smooth transition fades between scenes
      if (i > 0) {
        vfSteps.push("fade=t=in:st=0:d=0.18");
      }
      if (i < scenesToRender.length - 1 && cut.keptDurationSec > 1.0) {
        const fadeOutStart = Math.max(0, cut.keptDurationSec - 0.18).toFixed(2);
        vfSteps.push(`fade=t=out:st=${fadeOutStart}:d=0.18`);
      }

      // Optional Clean TikTok/Reels Floating Typography (NO boxes, NO green banners, NO scene labels)
      if (effectiveTextStyle !== "none" && cut.onScreenText.trim()) {
        const bodyFile = path.join(tmpDir, `body-${i}.txt`);
        fs.writeFileSync(bodyFile, wrapTextLines(cut.onScreenText, 38), "utf8");
        const bodyPathEsc = escapeFfmpegFilterPath(bodyFile);
        const textY = safeZoneYCoordinate(cut.textSafeZone);

        vfSteps.push(
          `drawtext=${fontArg}textfile='${bodyPathEsc}':fontsize=40:fontcolor=white:borderw=3:bordercolor=black@0.85:shadowx=0:shadowy=2:shadowcolor=black@0.6:line_spacing=12:x=(w-text_w)/2:y=${textY}`
        );
      }

      const vfChain = vfSteps.join(",");
      const ffmpegArgs: string[] = ["-y", "-hide_banner", "-loglevel", "error"];

      if (hasRawClip && cut.hasAudio) {
        // Input clip has native audio: preserve and smooth-fade audio at scene boundaries
        ffmpegArgs.push(
          "-ss",
          String(cut.trimStartSec),
          "-t",
          String(cut.keptDurationSec),
          "-i",
          rawClipPath,
          "-vf",
          vfChain,
          "-af",
          `aresample=48000,afade=t=in:st=0:d=0.15,afade=t=out:st=${Math.max(
            0,
            cut.keptDurationSec - 0.2
          ).toFixed(2)}:d=0.20`,
          "-r",
          "24",
          "-c:v",
          "libx264",
          "-preset",
          "fast",
          "-crf",
          "21",
          "-pix_fmt",
          "yuv420p",
          "-c:a",
          "aac",
          "-b:a",
          "192k",
          "-ar",
          "48000",
          "-ac",
          "2",
          segPath
        );
      } else if (hasRawClip) {
        // Input clip without audio track: attach silent 48kHz stereo track so concat streams match
        ffmpegArgs.push(
          "-ss",
          String(cut.trimStartSec),
          "-t",
          String(cut.keptDurationSec),
          "-i",
          rawClipPath,
          "-f",
          "lavfi",
          "-t",
          String(cut.keptDurationSec),
          "-i",
          "anullsrc=channel_layout=stereo:sample_rate=48000",
          "-vf",
          vfChain,
          "-map",
          "0:v:0",
          "-map",
          "1:a:0",
          "-r",
          "24",
          "-c:v",
          "libx264",
          "-preset",
          "fast",
          "-crf",
          "21",
          "-pix_fmt",
          "yuv420p",
          "-c:a",
          "aac",
          "-b:a",
          "128k",
          "-ar",
          "48000",
          "-ac",
          "2",
          "-shortest",
          segPath
        );
      } else if (assetPath) {
        ffmpegArgs.push(
          "-loop",
          "1",
          "-framerate",
          "24",
          "-t",
          String(cut.keptDurationSec),
          "-i",
          assetPath,
          "-f",
          "lavfi",
          "-t",
          String(cut.keptDurationSec),
          "-i",
          "anullsrc=channel_layout=stereo:sample_rate=48000",
          "-vf",
          vfChain,
          "-map",
          "0:v:0",
          "-map",
          "1:a:0",
          "-r",
          "24",
          "-c:v",
          "libx264",
          "-preset",
          "ultrafast",
          "-crf",
          "23",
          "-pix_fmt",
          "yuv420p",
          "-c:a",
          "aac",
          "-b:a",
          "128k",
          "-ar",
          "48000",
          "-ac",
          "2",
          "-shortest",
          segPath
        );
      } else {
        ffmpegArgs.push(
          "-f",
          "lavfi",
          "-t",
          String(cut.keptDurationSec),
          "-i",
          "color=c=0x0f172a:s=1080x1920:r=24",
          "-f",
          "lavfi",
          "-t",
          String(cut.keptDurationSec),
          "-i",
          "anullsrc=channel_layout=stereo:sample_rate=48000",
          "-vf",
          vfChain,
          "-map",
          "0:v:0",
          "-map",
          "1:a:0",
          "-r",
          "24",
          "-c:v",
          "libx264",
          "-preset",
          "ultrafast",
          "-crf",
          "23",
          "-pix_fmt",
          "yuv420p",
          "-c:a",
          "aac",
          "-b:a",
          "128k",
          "-ar",
          "48000",
          "-ac",
          "2",
          "-shortest",
          segPath
        );
      }

      await execFileAsync(FFMPEG_BIN, ffmpegArgs);
      segmentFiles.push(segPath);
    }

    // Concatenate all rendered scene segments (video + audio) into the final MP4 with +faststart
    const concatListPath = path.join(tmpDir, "concat.txt");
    const concatContent = segmentFiles
      .map((p) => `file '${p.replace(/\\/g, "/").replace(/'/g, "'\\''")}'`)
      .join("\n");
    fs.writeFileSync(concatListPath, concatContent, "utf8");

    await execFileAsync(FFMPEG_BIN, [
      "-y",
      "-hide_banner",
      "-loglevel",
      "error",
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      concatListPath,
      "-c",
      "copy",
      "-movflags",
      "+faststart",
      outputAbsPath,
    ]);
  } finally {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  }

  return {
    videoUrl,
    absolutePath: outputAbsPath,
    directorReport,
  };
}

let seedPromise: Promise<void> | null = null;

/**
 * Seeds 4 playable sample 9:16 MP4 videos into client/public/generated-videos/
 * and populates agent_videos so the Approval Queue is immediately testable.
 */
export async function ensureSampleAgentVideosSeeded(): Promise<AgentVideo[]> {
  const existing = await storage.getAgentVideos();
  if (existing.length >= 4) {
    return existing;
  }

  if (seedPromise) {
    await seedPromise;
    return storage.getAgentVideos();
  }

  seedPromise = (async () => {
    const sampleConfigs: Array<{
      packageId: string;
      fileName: string;
      status: "pending_review" | "approved";
      useWatchClips: boolean;
    }> = [
      {
        packageId: "cortisol-1-ocean-desk-purple-cow",
        fileName: "sample-1-ocean-desk-purple-cow.mp4",
        status: "pending_review",
        useWatchClips: true,
      },
      {
        packageId: "cortisol-2-bmw-m5-trojan-horse",
        fileName: "sample-2-bmw-m5-trojan-horse.mp4",
        status: "pending_review",
        useWatchClips: false,
      },
      {
        packageId: "dopamine-1-highway-bed-purple-cow",
        fileName: "sample-3-highway-bed-purple-cow.mp4",
        status: "pending_review",
        useWatchClips: false,
      },
      {
        packageId: "dopamine-2-two-executives-ab-timeline",
        fileName: "sample-4-two-executives-ab-timeline.mp4",
        status: "approved",
        useWatchClips: false,
      },
    ];

    const currentVideos = await storage.getAgentVideos();
    const existingPackageIds = new Set(currentVideos.map((v) => v.packageId));

    for (const cfg of sampleConfigs) {
      if (existingPackageIds.has(cfg.packageId)) continue;
      const pkg = getFlowUltraPackageById(cfg.packageId);
      if (!pkg) continue;

      const outFile = path.resolve(
        process.cwd(),
        "client",
        "public",
        "generated-videos",
        cfg.fileName
      );

      let directorReport: DirectorCutReport;
      if (fs.existsSync(outFile) && fs.statSync(outFile).size > 1000) {
        const clips = cfg.useWatchClips ? discoverWatchFolderClips() : [];
        directorReport = await analyzeSceneClips(clips, pkg, {
          pacingMode: "natural_cinema",
          textStyle: "floating_tiktok",
        });
      } else {
        const rendered = await renderStoryVideoWithDirector({
          packageId: cfg.packageId,
          outputFileName: cfg.fileName,
          pacingMode: "natural_cinema",
          textStyle: "floating_tiktok",
          fastSeedMode: !cfg.useWatchClips,
          useWatchFolderClips: cfg.useWatchClips,
        });
        directorReport = rendered.directorReport;
      }

      await storage.createAgentVideo({
        packageId: pkg.id,
        title: pkg.angleTitle,
        archetypeId: pkg.archetypeId,
        viralFormat: pkg.viralFormat,
        status: cfg.status,
        videoUrl: `/generated-videos/${cfg.fileName}`,
        caption: pkg.caption,
        hookText: pkg.onScreenTextHook.hook0to3s,
        directorReport: JSON.stringify(directorReport),
        declineReason: null,
      });
    }
  })().finally(() => {
    seedPromise = null;
  });

  await seedPromise;
  return storage.getAgentVideos();
}
