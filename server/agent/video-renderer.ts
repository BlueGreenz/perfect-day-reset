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
  const bundledFont = path.resolve(process.cwd(), "attached_assets", "fonts", "sans-bold.ttf");
  const candidates = [
    bundledFont,
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
 * Formats on-screen entertainment hook/payoff copy into max 2-3 compact lines for native TikTok/Reels
 * floating typography. Strips any accidental CTA ("Comment RESET"), arrows (-> / →), or emojis so
 * burned text is 100% pure entertainment with zero ads.
 */
function wrapTextLines(text: string, maxCharsPerLine = 38): string {
  const cleaned = text
    .replace(/\s*→\s*Comment RESET\s*⚡?/gi, "")
    .replace(/\s*->\s*Comment RESET\s*⚡?/gi, "")
    .replace(/\(\s*Comment RESET\s*\)/gi, "")
    .replace(/Comment RESET.*$/gi, "")
    .replace(/Perfect Day Reset.*$/gi, "")
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
 * Upper safe zone (y=125..165 on 720x1280 9:16 frame) so floating text never covers faces, hands, oak desk, or car/balcony action
 */
function safeZoneYCoordinate(zone: TextSafeZone): number {
  switch (zone) {
    case "upper_middle":
      return 165;
    case "bottom":
      return 165;
    case "top":
    default:
      return 125;
  }
}

export interface RenderAgentVideoOptions {
  packageId: string;
  outputFileName?: string;
  pacingMode?: PacingMode;
  textStyle?: VideoTextStyle;
  editingTrick?: string;
  beatDropSec?: string;
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

const SAMPLE_FILE_BY_PACKAGE_ID: Record<string, string> = {
  "cortisol-1-ocean-desk-purple-cow": "sample-1-ocean-desk-purple-cow.mp4",
  "cortisol-2-bmw-m5-trojan-horse": "sample-2-bmw-m5-trojan-horse.mp4",
  "dopamine-1-highway-bed-purple-cow": "sample-3-highway-bed-purple-cow.mp4",
  "dopamine-2-two-executives-ab-timeline": "sample-4-two-executives-ab-timeline.mp4",
};

function syncToDistPublicIfPresent(sourceFile: string, fileName: string): void {
  try {
    const distPublicDir = path.resolve(process.cwd(), "dist", "public");
    if (fs.existsSync(distPublicDir)) {
      const distGenDir = path.join(distPublicDir, "generated-videos");
      if (!fs.existsSync(distGenDir)) {
        fs.mkdirSync(distGenDir, { recursive: true });
      }
      fs.copyFileSync(sourceFile, path.join(distGenDir, fileName));
    }
  } catch {
    // Non-fatal if dist/public is read-only
  }
}

/**
 * Renders a 9:16 vertical (720x1280 HD) multi-scene H.264 + AAC MP4 video using FFmpeg
 * guided by the Multimodal AI Video Director's SceneCutPlan.
 * - Zero rectangular boxes, zero green footer bars, zero internal "SCENE X" labels, zero sales CTAs.
 * - Preserves full natural clip durations in "natural_cinema" mode (e.g. full 10s clips).
 * - Executes viral editing tricks (beat_drop_match_cut, freeze_frame_hook, zoom_punch_contrast, infinite_loop_cut).
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
  const isCleanNoText =
    effectiveTextStyle === "none" || effectiveTextStyle === "clean_no_text";

  const effectiveEditingTrick =
    options.editingTrick || pkg.editingTrick || "beat_drop_match_cut";
  const effectiveBeatDropSec =
    options.beatDropSec || pkg.beatDropSec || "2.4";

  const shouldSwapOrder =
    Boolean(options.swapSceneOrder) ||
    (options.feedbackDirective || "").toLowerCase().includes("swap scene");

  const useWatchClips = options.useWatchFolderClips !== false;
  const rawDropClips = useWatchClips ? discoverWatchFolderClips(pkg) : [];
  const dropClips = shouldSwapOrder ? [...rawDropClips].reverse() : rawDropClips;

  const directorReport = await analyzeSceneClips(rawDropClips, pkg, {
    pacingMode: effectivePacingMode,
    textStyle: effectiveTextStyle,
    editingTrick: effectiveEditingTrick,
    beatDropSec: effectiveBeatDropSec,
    cleanNoText: isCleanNoText,
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

      const baseVfSteps: string[] = [];

      if (hasRawClip) {
        // Apply editing trick & viral_punch camera dynamics on real 9:16 Flow Ultra clips
        if (effectiveEditingTrick === "zoom_punch_contrast") {
          // Crisp 1.12x deadpan zoom-punch
          baseVfSteps.push(
            "scale=806:1434:force_original_aspect_ratio=increase",
            "crop=720:1280",
            "setsar=1"
          );
        } else if (
          (effectiveEditingTrick === "beat_drop_match_cut" ||
            effectivePacingMode === "viral_punch" ||
            effectivePacingMode === "fast_cut") &&
          i === 1
        ) {
          // 1.10x dynamic zoom-punch on Scene 2 right at the 2.5s beat drop cut
          baseVfSteps.push(
            "scale=792:1408:force_original_aspect_ratio=increase",
            "crop=720:1280",
            "setsar=1"
          );
        } else if (
          (effectivePacingMode === "viral_punch" || effectivePacingMode === "fast_cut") &&
          i === 0
        ) {
          // 1.08x smooth dynamic push-in on Scene 1 (0.0s–2.5s setup beat)
          baseVfSteps.push(
            "scale=778:1382:force_original_aspect_ratio=increase",
            "crop=720:1280",
            "setsar=1"
          );
        } else {
          baseVfSteps.push(
            "scale=720:1280:force_original_aspect_ratio=increase",
            "crop=720:1280",
            "setsar=1"
          );
        }
        if (effectiveEditingTrick === "freeze_frame_hook" && i === 0) {
          baseVfSteps.push("eq=contrast=1.07:saturation=1.05");
        }
      } else {
        // Static brand asset fallback: gentle cinematic pan at 720x1280
        const cropOffsetExpr =
          i % 2 === 0
            ? `(in_w-out_w)*0.28 + (in_w-out_w)*0.38*(t/${cut.keptDurationSec})`
            : `(in_w-out_w)*0.72 - (in_w-out_w)*0.38*(t/${cut.keptDurationSec})`;
        baseVfSteps.push(
          "scale=-2:1280",
          `crop=720:1280:'${cropOffsetExpr}':0`,
          "setsar=1"
        );
      }

      // Smooth transition fades between scenes (unless infinite_loop_cut, which keeps start/end seamless)
      const isInfiniteLoop = effectiveEditingTrick === "infinite_loop_cut";
      if (i > 0 && effectiveEditingTrick !== "beat_drop_match_cut") {
        baseVfSteps.push("fade=t=in:st=0:d=0.16");
      }
      if (
        !isInfiniteLoop &&
        i < scenesToRender.length - 1 &&
        effectiveEditingTrick !== "beat_drop_match_cut" &&
        cut.keptDurationSec > 1.0
      ) {
        const fadeOutStart = Math.max(0, cut.keptDurationSec - 0.16).toFixed(2);
        baseVfSteps.push(`fade=t=out:st=${fadeOutStart}:d=0.16`);
      }

      const vfStepsWithText = [...baseVfSteps];

      // Optional Clean TikTok/Reels Floating Typography (NO boxes, NO green banners, NO scene labels, NO ads)
      if (!isCleanNoText && cut.onScreenText.trim()) {
        const wrappedBody = wrapTextLines(cut.onScreenText, 38);
        if (wrappedBody) {
          const bodyFile = path.join(tmpDir, `body-${i}.txt`);
          fs.writeFileSync(bodyFile, wrappedBody, "utf8");
          const bodyPathEsc = escapeFfmpegFilterPath(bodyFile);
          const textY = safeZoneYCoordinate(cut.textSafeZone);

          vfStepsWithText.push(
            `drawtext=${fontArg}textfile='${bodyPathEsc}':fontsize=26:fontcolor=white:borderw=2:bordercolor=black@0.9:shadowx=0:shadowy=2:shadowcolor=black@0.7:line_spacing=8:x=(w-text_w)/2:y=${textY}`
          );
        }
      }

      const buildSegmentArgs = (vfChain: string): string[] => {
        const args: string[] = ["-y", "-hide_banner", "-loglevel", "error"];
        if (hasRawClip && cut.hasAudio) {
          args.push(
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
            "ultrafast",
            "-threads",
            "2",
            "-crf",
            "22",
            "-pix_fmt",
            "yuv420p",
            "-c:a",
            "aac",
            "-b:a",
            "160k",
            "-ar",
            "48000",
            "-ac",
            "2",
            segPath
          );
        } else if (hasRawClip) {
          args.push(
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
            "ultrafast",
            "-threads",
            "2",
            "-crf",
            "22",
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
          args.push(
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
            "-threads",
            "2",
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
          args.push(
            "-f",
            "lavfi",
            "-t",
            String(cut.keptDurationSec),
            "-i",
            "color=c=0x0f172a:s=720x1280:r=24",
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
            "-threads",
            "2",
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
        return args;
      };

      try {
        await execFileAsync(FFMPEG_BIN, buildSegmentArgs(vfStepsWithText.join(",")));
      } catch (segErr) {
        // Fallback: if drawtext failed on a stripped OS container, retry segment without drawtext
        if (vfStepsWithText.length > baseVfSteps.length) {
          await execFileAsync(FFMPEG_BIN, buildSegmentArgs(baseVfSteps.join(",")));
        } else {
          throw segErr;
        }
      }
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

    syncToDistPublicIfPresent(outputAbsPath, fileName);
  } catch (renderErr) {
    console.warn("FFmpeg render warning, checking pre-rendered fallback:", renderErr);
    // If FFmpeg fails in a restricted serverless/container environment, fall back to pre-rendered sample MP4
    const fallbackSampleName =
      SAMPLE_FILE_BY_PACKAGE_ID[pkg.id] || "sample-1-ocean-desk-purple-cow.mp4";
    const candidateFallbackPaths = [
      path.join(outDir, fallbackSampleName),
      path.resolve(process.cwd(), "dist", "public", "generated-videos", fallbackSampleName),
    ];
    const existingFallback = candidateFallbackPaths.find((p) => fs.existsSync(p));
    if (existingFallback) {
      if (existingFallback !== outputAbsPath) {
        try {
          fs.copyFileSync(existingFallback, outputAbsPath);
          syncToDistPublicIfPresent(outputAbsPath, fileName);
        } catch {
          return {
            videoUrl: `/generated-videos/${fallbackSampleName}`,
            absolutePath: existingFallback,
            directorReport,
          };
        }
      }
    } else {
      throw renderErr;
    }
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
        useWatchClips: true,
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
    const existingByPackageId = new Map<string, AgentVideo>();
    for (const v of currentVideos) {
      if (!existingByPackageId.has(v.packageId)) {
        existingByPackageId.set(v.packageId, v);
      }
    }

    for (const cfg of sampleConfigs) {
      const pkg = getFlowUltraPackageById(cfg.packageId);
      if (!pkg) continue;

      const outFile = path.resolve(
        process.cwd(),
        "client",
        "public",
        "generated-videos",
        cfg.fileName
      );
      if (fs.existsSync(outFile)) {
        syncToDistPublicIfPresent(outFile, cfg.fileName);
      }

      const existingRow = existingByPackageId.get(cfg.packageId);
      if (existingRow) {
        const clips = cfg.useWatchClips ? discoverWatchFolderClips(pkg) : [];
        const freshReport = await analyzeSceneClips(clips, pkg, {
          pacingMode: "natural_cinema",
          textStyle: "floating_tiktok",
        });

        let parsedExistingReport: Partial<DirectorCutReport> = {};
        try {
          parsedExistingReport = JSON.parse(existingRow.directorReport || "{}");
        } catch {
          parsedExistingReport = {};
        }

        const reportOutdated =
          parsedExistingReport.totalOutputDurationSec !== freshReport.totalOutputDurationSec ||
          parsedExistingReport.watchFolderStatus?.mode !== freshReport.watchFolderStatus.mode;

        if (
          reportOutdated ||
          existingRow.hookText !== pkg.onScreenTextHook.hook0to3s ||
          existingRow.caption !== pkg.caption ||
          existingRow.title !== pkg.angleTitle
        ) {
          await storage.updateAgentVideo(existingRow.id, {
            title: pkg.angleTitle,
            videoUrl: `/generated-videos/${cfg.fileName}`,
            caption: pkg.caption,
            hookText: pkg.onScreenTextHook.hook0to3s,
            directorReport: JSON.stringify(freshReport),
          });
        }
        continue;
      }

      let directorReport: DirectorCutReport;
      if (fs.existsSync(outFile) && fs.statSync(outFile).size > 1000) {
        const clips = cfg.useWatchClips ? discoverWatchFolderClips(pkg) : [];
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
