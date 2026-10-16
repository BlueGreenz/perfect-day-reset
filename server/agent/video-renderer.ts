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
  type DirectorCutReport,
  type SceneCutPlan,
  type TextSafeZone,
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
    "C:/Windows/Fonts/arialbd.ttf",
    "C:/Windows/Fonts/calibrib.ttf",
    "C:/Windows/Fonts/segoeuib.ttf",
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

function wrapTextLines(text: string, maxCharsPerLine = 28): string {
  const clean = text
    .replace(/[⚡👋]/g, "")
    .replace(/—/g, " - ")
    .replace(/→/g, "->")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .trim();
  const words = clean.split(/\s+/);
  const lines: string[] = [];
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
  return lines.slice(0, 4).join("\n");
}

function safeZoneYCoordinate(zone: TextSafeZone): { boxY: number; textY: number } {
  switch (zone) {
    case "top":
      return { boxY: 160, textY: 205 };
    case "bottom":
      return { boxY: 1320, textY: 1365 };
    case "upper_middle":
    default:
      return { boxY: 460, textY: 505 };
  }
}

export interface RenderAgentVideoOptions {
  packageId: string;
  outputFileName?: string;
  feedbackDirective?: string;
  fastSeedMode?: boolean;
}

export interface RenderedVideoArtifact {
  videoUrl: string;
  absolutePath: string;
  directorReport: DirectorCutReport;
}

/**
 * Renders a 9:16 vertical (1080x1920) multi-scene H.264 MP4 video using FFmpeg
 * guided by the Multimodal AI Video Director's SceneCutPlan.
 */
export async function renderStoryVideoWithDirector(
  options: RenderAgentVideoOptions
): Promise<RenderedVideoArtifact> {
  const pkg: FlowUltraVideoPackage =
    getFlowUltraPackageById(options.packageId) || FLOW_ULTRA_PACKAGES[0];

  const dropClips = discoverWatchFolderClips();
  const directorReport = await analyzeSceneClips(dropClips, pkg, {
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
    // In fastSeedMode (or standard multi-scene render), cap total scenes to 3 cuts so render completes in ~2.5s
    const scenesToRender: SceneCutPlan[] = options.fastSeedMode
      ? directorReport.sceneCuts.slice(0, 3).map((s) => ({
          ...s,
          keptDurationSec: Math.min(s.keptDurationSec, 2.2),
        }))
      : directorReport.sceneCuts.slice(0, 4).map((s) => ({
          ...s,
          keptDurationSec: Math.min(s.keptDurationSec, 2.5),
        }));

    const availableAssets = VISUAL_ASSETS_POOL.map((f) =>
      path.resolve(process.cwd(), "attached_assets", f)
    ).filter((p) => fs.existsSync(p));

    const segmentFiles: string[] = [];

    for (let i = 0; i < scenesToRender.length; i++) {
      const cut = scenesToRender[i];
      const segPath = path.join(tmpDir, `seg-${i}.mp4`);

      // Write scene caption & badge to temp UTF-8 files for FFmpeg drawtext textfile=...
      const badgeFile = path.join(tmpDir, `badge-${i}.txt`);
      const bodyFile = path.join(tmpDir, `body-${i}.txt`);
      const ctaFile = path.join(tmpDir, `cta-${i}.txt`);

      fs.writeFileSync(
        badgeFile,
        `SCENE ${cut.sceneNumber}  |  ${pkg.viralFormatLabel.toUpperCase()}`,
        "utf8"
      );
      fs.writeFileSync(bodyFile, wrapTextLines(cut.onScreenText, 27), "utf8");
      fs.writeFileSync(
        ctaFile,
        i === scenesToRender.length - 1
          ? "Comment RESET for the 60-Second Diagnostic"
          : "PERFECT DAY RESET  •  24-HOUR PROTOCOL",
        "utf8"
      );

      const { boxY, textY } = safeZoneYCoordinate(cut.textSafeZone);
      const badgePathEsc = escapeFfmpegFilterPath(badgeFile);
      const bodyPathEsc = escapeFfmpegFilterPath(bodyFile);
      const ctaPathEsc = escapeFfmpegFilterPath(ctaFile);

      // Select visual source: watch-folder video clip if present, otherwise rotate through brand assets
      const rawClipPath = dropClips[i];
      const hasRawClip = Boolean(rawClipPath && fs.existsSync(rawClipPath));
      const assetPath =
        availableAssets[(i + pkg.id.length) % Math.max(1, availableAssets.length)];

      // Alternate horizontal crop pan & subtle contrast/saturation per scene so cuts are visually distinct
      const cropOffsetExpr =
        i % 2 === 0
          ? `(in_w-out_w)*0.25 + (in_w-out_w)*0.45*(t/${cut.keptDurationSec})`
          : `(in_w-out_w)*0.75 - (in_w-out_w)*0.45*(t/${cut.keptDurationSec})`;

      const colorTint =
        i === 0
          ? "eq=contrast=1.12:brightness=-0.04:saturation=1.15"
          : i === scenesToRender.length - 1
          ? "eq=contrast=1.08:brightness=0.02:saturation=1.25"
          : "eq=contrast=1.06:brightness=-0.01:saturation=1.10";

      const vfChain = [
        `scale=-2:1920`,
        `crop=1080:1920:'${cropOffsetExpr}':0`,
        colorTint,
        // Top header bar
        `drawbox=x=60:y=${boxY - 56}:w=960:h=54:color=0x064e3b@0.92:t=fill`,
        // Main text safe-zone card
        `drawbox=x=60:y=${boxY}:w=960:h=310:color=0x090d16@0.82:t=fill`,
        // Bottom CTA bar
        `drawbox=x=60:y=1680:w=960:h=96:color=0x047857@0.92:t=fill`,
        // Scene badge text
        `drawtext=${fontArg}textfile='${badgePathEsc}':fontsize=26:fontcolor=0x6ee7b7:x=(w-text_w)/2:y=${
          boxY - 40
        }`,
        // Main hook/payoff text
        `drawtext=${fontArg}textfile='${bodyPathEsc}':fontsize=44:fontcolor=white:line_spacing=16:x=(w-text_w)/2:y=${textY}`,
        // Bottom CTA pill text
        `drawtext=${fontArg}textfile='${ctaPathEsc}':fontsize=32:fontcolor=white:x=(w-text_w)/2:y=1714`,
      ].join(",");

      const ffmpegArgs: string[] = ["-y", "-hide_banner", "-loglevel", "error"];
      if (hasRawClip) {
        ffmpegArgs.push(
          "-ss",
          String(cut.trimStartSec),
          "-t",
          String(cut.keptDurationSec),
          "-i",
          rawClipPath
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
          assetPath
        );
      } else {
        ffmpegArgs.push(
          "-f",
          "lavfi",
          "-t",
          String(cut.keptDurationSec),
          "-i",
          "color=c=0x0f172a:s=1080x1920:r=24"
        );
      }

      ffmpegArgs.push(
        "-vf",
        vfChain,
        "-r",
        "24",
        "-c:v",
        "libx264",
        "-preset",
        "ultrafast",
        "-crf",
        "24",
        "-pix_fmt",
        "yuv420p",
        "-an",
        segPath
      );

      await execFileAsync(FFMPEG_BIN, ffmpegArgs);
      segmentFiles.push(segPath);
    }

    // Concatenate all rendered scene segments into the final MP4 with +faststart
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
    }> = [
      {
        packageId: "cortisol-1-ocean-desk-purple-cow",
        fileName: "sample-1-ocean-desk-purple-cow.mp4",
        status: "pending_review",
      },
      {
        packageId: "cortisol-2-bmw-m5-trojan-horse",
        fileName: "sample-2-bmw-m5-trojan-horse.mp4",
        status: "pending_review",
      },
      {
        packageId: "dopamine-1-highway-bed-purple-cow",
        fileName: "sample-3-highway-bed-purple-cow.mp4",
        status: "pending_review",
      },
      {
        packageId: "dopamine-2-two-executives-ab-timeline",
        fileName: "sample-4-two-executives-ab-timeline.mp4",
        status: "approved",
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
        directorReport = await analyzeSceneClips([], pkg);
      } else {
        const rendered = await renderStoryVideoWithDirector({
          packageId: cfg.packageId,
          outputFileName: cfg.fileName,
          fastSeedMode: true,
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
