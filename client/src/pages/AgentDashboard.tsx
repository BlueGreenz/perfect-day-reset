import { useState, useEffect, FormEvent } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  apiRequest,
  queryClient,
  getStoredAdminPasscode,
  setStoredAdminPasscode,
} from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Sparkles,
  Video,
  MessageSquare,
  Mail,
  Webhook,
  Copy,
  Check,
  Send,
  Play,
  RefreshCw,
  ArrowLeft,
  ShieldCheck,
  Zap,
  Clock,
  Users,
  CheckCircle2,
  ExternalLink,
  Bot,
  Film,
  Terminal,
  XCircle,
  Download,
  Scissors,
  ChevronDown,
  ChevronUp,
  Clapperboard,
  Lock,
  Eye,
  EyeOff,
  LogOut,
} from "lucide-react";

interface FlowUltraScene {
  sceneNumber: number;
  timeRange: string;
  shotType: string;
  flowUltraPrompt: string;
  whatWeWant: string;
  whatWeDontWant: string;
  negativePrompt: string;
  onScreenText: string;
  soundCue: string;
}

interface FlowSceneBible {
  cast: string;
  wardrobe: string;
  lens: string;
  lightDirection: string;
}

interface FlowCaptionParts {
  hookContinuation: string;
  educationalBridge: string;
  committedCta: string;
}

interface FlowUltraPackage {
  id: string;
  archetypeId: string;
  archetypeName: string;
  angleTitle: string;
  viralFormat: string;
  viralFormatLabel: string;
  energyVibe?: string;
  chaosTwistMode?: string;
  targetLengthSeconds: number;
  durationSeconds: number;
  pacingRule: string;
  psychologicalAngle: string;
  aspectRatio: string;
  cameraSpec: string;
  sceneBible: FlowSceneBible;
  flowAgentPrompt: string;
  flowUltraPrompt: string;
  scenes: FlowUltraScene[];
  onScreenTextHook: {
    hook0to3s: string;
    payoff3to8s: string;
    ctaEndCard: string;
  };
  captionParts: FlowCaptionParts;
  caption: string;
  commentAutoReply: string;
  dmOpeningMessage: string;
}

interface FlowUltraBatchResponse {
  totalPackages: number;
  flowAgentConstitution: string;
  productionSpecs: {
    model: string;
    aspectRatio: string;
    cameraAesthetic: string;
    conversionFlow: string;
  };
  manyChatAutomationConfig: Record<string, unknown>;
  packages: FlowUltraPackage[];
}

interface SceneCutPlan {
  sceneNumber: number;
  matchedSceneNumber: number;
  sourceClip: string;
  shotType: string;
  rawDurationSec: number;
  trimStartSec: number;
  trimEndSec: number;
  keptDurationSec: number;
  actionPeakReason: string;
  qualityPass: boolean;
  qualityScore: number;
  glitchNotes: string;
  textSafeZone: "top" | "upper_middle" | "bottom";
  onScreenText: string;
  soundCue: string;
}

interface DirectorCutReport {
  packageId: string;
  packageTitle: string;
  viralFormat: string;
  analysisEngine: string;
  analyzedAt: string;
  overallQualityScore: number;
  totalOutputDurationSec: number;
  pacingSummary: string;
  appliedDirective: string | null;
  watchFolderStatus: {
    folderPath: string;
    discoveredClipsCount: number;
    mode: string;
  };
  sceneCuts: SceneCutPlan[];
}

interface AgentVideoRecord {
  id: number;
  packageId: string;
  title: string;
  archetypeId: string;
  viralFormat: string;
  status:
    | "analyzing"
    | "rendering"
    | "pending_review"
    | "approved"
    | "declined"
    | "published";
  videoUrl: string;
  caption: string;
  hookText: string;
  directorReport: string;
  declineReason: string | null;
  createdAt: string;
  updatedAt: string;
}

interface NurtureEmailPreview {
  stage: 1 | 2 | 3 | 4;
  delayLabel: string;
  subject: string;
  preheader: string;
  html: string;
  text: string;
}

interface AgentLeadRecord {
  id: number;
  email: string;
  firstName: string | null;
  source: string;
  archetypeId: string;
  wakeTime: string;
  foodPreference: string;
  pastBlocker: string;
  nurtureStage: number;
  nextEmailAt: string | null;
  hasPurchased: boolean;
  unsubscribed: boolean;
  updatedAt: string;
}

interface AgentInteractionRecord {
  id: number;
  channel: string;
  senderIdentifier: string;
  inboundMessage: string | null;
  agentReply: string;
  metadata: string | null;
  createdAt: string;
}

interface TrendDeconstruction {
  visualHookMechanic: string;
  editingTrickBreakdown: string;
  audioSyncRule: string;
  humorContrastFormula: string;
  shareTrigger: string;
}

interface TrendBlueprintRecord {
  id: number;
  trendCategory: string;
  trendTopicOrHook: string;
  sourcePlatform: string;
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
  editingTrick: string;
  createdAt: string;
  deconstruction: TrendDeconstruction;
  generatedPackage: FlowUltraPackage;
  energyVibe?: string;
  chaosTwistMode?: string;
}

interface AgentOverviewResponse {
  stats: {
    totalLeads: number;
    activeInSequence: number;
    convertedBuyers: number;
    unsubscribedCount: number;
    totalInteractions: number;
  };
  leads: AgentLeadRecord[];
  interactions: AgentInteractionRecord[];
  emailSequencePreview: NurtureEmailPreview[];
}

export default function AgentDashboard() {
  const { toast } = useToast();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [checkingPasscode, setCheckingPasscode] = useState<boolean>(true);
  const [passcodeInput, setPasscodeInput] = useState<string>("");
  const [showPasscodeText, setShowPasscodeText] = useState<boolean>(false);
  const [passcodeError, setPasscodeError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<
    "flow-ultra" | "video-queue" | "simulator" | "nurture" | "webhooks"
  >("flow-ultra");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Tab 1 Trend Radar & Newsjacking Engine state
  const [trendMode, setTrendMode] = useState<"newsjack" | "tiktok_keyword" | "tiktok_url">(
    "newsjack"
  );
  const [newsjackTopicInput, setNewsjackTopicInput] = useState<string>(
    "How 8:45 AM feels when your cortisol curve is dialed in"
  );
  const [tiktokQueryInput, setTiktokQueryInput] = useState<string>(
    "high performance flow state pov"
  );
  const [tiktokUrlInput, setTiktokUrlInput] = useState<string>("");
  const [selectedEnergyVibe, setSelectedEnergyVibe] = useState<
    "high_performance_positive" | "dark_humor_contrast" | "uplifting_comeback_story"
  >("high_performance_positive");
  const [selectedChaosTwist, setSelectedChaosTwist] = useState<
    "absurd_giraffe_twist" | "hypercar_spectacle" | "kinetic_boss_exit"
  >("absurd_giraffe_twist");
  const [selectedEditingTrick, setSelectedEditingTrick] = useState<
    | "beat_drop_match_cut"
    | "freeze_frame_hook"
    | "infinite_loop_cut"
    | "zoom_punch_contrast"
    | "deadpan_single_take"
  >("beat_drop_match_cut");
  const [selectedTrendArchetype, setSelectedTrendArchetype] =
    useState<string>("cortisol_spiked");

  // Tab 1 & Tab 2 AI Director Pacing & Text Style state (Default: 6.0s viral_punch)
  const [archetypeFilter, setArchetypeFilter] = useState<string>("all");
  const [viralFormatFilter, setViralFormatFilter] = useState<string>("all");
  const [pacingMode, setPacingMode] = useState<
    "viral_punch" | "balanced_story" | "natural_cinema" | "fast_cut"
  >("viral_punch");
  const [textStyle, setTextStyle] = useState<"floating_tiktok" | "clean_no_text" | "none">(
    "floating_tiktok"
  );
  const [showConstitution, setShowConstitution] = useState<boolean>(false);
  const [expandedReports, setExpandedReports] = useState<Record<number, boolean>>({});
  const [renderingPackageId, setRenderingPackageId] = useState<string | null>(null);

  // Tab 2 simulator state
  const [simChannel, setSimChannel] = useState<"comment" | "dm" | "email">("comment");
  const [simPlatform, setSimPlatform] = useState<"instagram" | "tiktok">("instagram");
  const [simSender, setSimSender] = useState<string>("@marcus_exec");
  const [simSubject, setSimSubject] = useState<string>(
    "Question before I buy the 24-Hour Reset"
  );
  const [simMessage, setSimMessage] = useState<string>("RESET");
  const [lastSimResult, setLastSimResult] = useState<any>(null);

  // Tab 3 nurture preview state
  const [previewArchetype, setPreviewArchetype] = useState<string>("cortisol_spiked");
  const [previewWake, setPreviewWake] = useState<string>("07:00");
  const [previewDiet, setPreviewDiet] = useState<string>("omni");
  const [previewBlocker, setPreviewBlocker] = useState<string>("ran_late");
  const [selectedStage, setSelectedStage] = useState<1 | 2 | 3 | 4>(1);
  const [testEmailInput, setTestEmailInput] = useState<string>(
    "demo.executive@perfectdayreset.com"
  );
  const [testFirstNameInput, setTestFirstNameInput] = useState<string>("Alex");

  useEffect(() => {
    const existingCode = getStoredAdminPasscode();
    if (!existingCode) {
      setCheckingPasscode(false);
      return;
    }

    fetch("/api/agent/verify-passcode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Passcode": existingCode,
      },
      body: JSON.stringify({ passcode: existingCode }),
    })
      .then((res) => {
        if (res.ok) {
          setIsAdminAuthenticated(true);
        } else {
          setStoredAdminPasscode("");
          setIsAdminAuthenticated(false);
        }
      })
      .catch(() => {
        setIsAdminAuthenticated(false);
      })
      .finally(() => {
        setCheckingPasscode(false);
      });
  }, []);

  const handleUnlockSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPasscodeError(null);
    const trimmed = passcodeInput.trim();
    if (!trimmed) {
      setPasscodeError("Please enter the admin password.");
      return;
    }

    setCheckingPasscode(true);
    try {
      const res = await fetch("/api/agent/verify-passcode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Passcode": trimmed,
        },
        body: JSON.stringify({ passcode: trimmed }),
      });

      if (res.ok) {
        setStoredAdminPasscode(trimmed);
        setIsAdminAuthenticated(true);
        setPasscodeInput("");
        toast({
          title: "Command Center Unlocked",
          description: "Welcome to the AI Growth & Video Director Command Center.",
        });
      } else {
        setPasscodeError("Invalid admin password. Access denied.");
      }
    } catch {
      setPasscodeError("Unable to verify admin password. Please try again.");
    } finally {
      setCheckingPasscode(false);
    }
  };

  const handleLockAdmin = () => {
    setStoredAdminPasscode("");
    setIsAdminAuthenticated(false);
    queryClient.removeQueries({
      predicate: (q) => String(q.queryKey[0]).startsWith("/api/agent/"),
    });
    toast({
      title: "Command Center Locked",
      description: "Admin session cleared from this browser.",
    });
  };

  const {
    data: flowBatch,
    isLoading: loadingFlow,
    refetch: refetchFlowBatch,
  } = useQuery<FlowUltraBatchResponse>({
    queryKey: ["/api/agent/flow-ultra-batch"],
    enabled: isAdminAuthenticated,
  });

  const {
    data: trendsData,
    isLoading: loadingTrends,
    refetch: refetchTrends,
  } = useQuery<{ blueprints: TrendBlueprintRecord[] }>({
    queryKey: ["/api/agent/trends"],
    enabled: isAdminAuthenticated,
  });

  const {
    data: videosData,
    isLoading: loadingVideos,
    refetch: refetchVideos,
  } = useQuery<{ videos: AgentVideoRecord[] }>({
    queryKey: ["/api/agent/videos"],
    enabled: isAdminAuthenticated,
  });

  const {
    data: overview,
    isLoading: loadingOverview,
    refetch: refetchOverview,
  } = useQuery<AgentOverviewResponse>({
    queryKey: [
      `/api/agent/overview?archetype=${previewArchetype}&wake=${previewWake}&diet=${previewDiet}&blocker=${previewBlocker}`,
    ],
    enabled: isAdminAuthenticated,
  });

  const copyToClipboard = async (text: string, key: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      toast({
        title: `Copied ${label}`,
        description: "Ready to paste into your workflow.",
      });
      setTimeout(() => {
        setCopiedKey((prev) => (prev === key ? null : prev));
      }, 2000);
    } catch {
      toast({
        title: "Copy failed",
        description: "Please select and copy manually.",
        variant: "destructive",
      });
    }
  };

  const scrapeTrendMutation = useMutation({
    mutationFn: async (payload: {
      mode: "newsjack" | "tiktok_keyword" | "tiktok_url";
      query?: string;
      tiktokUrl?: string;
      customTopic?: string;
      editingTrick?: string;
      archetypeId?: string;
      energyVibe?: string;
      chaosTwistMode?: string;
    }) => {
      const res = await apiRequest("POST", "/api/agent/trends/scrape", {
        ...payload,
        energyVibe: payload.energyVibe ?? selectedEnergyVibe,
        chaosTwistMode: payload.chaosTwistMode ?? selectedChaosTwist,
      });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/agent/trends"] });
      queryClient.invalidateQueries({ queryKey: ["/api/agent/flow-ultra-batch"] });
      refetchTrends();
      refetchFlowBatch();
      toast({
        title: "⚡ 3-Beat Kinetic Storyboard & Veo 3.1 Prompts Built!",
        description: `Created "${data.blueprint?.generatedPackage?.angleTitle || data.blueprint?.trendTopicOrHook}" with ${data.blueprint?.editingTrick} @ ${data.blueprint?.beatDropSec}s.`,
      });
    },
    onError: (err: any) => {
      toast({
        title: "Trend Radar Error",
        description: err?.message || "Could not scrape or synthesize trend.",
        variant: "destructive",
      });
    },
  });

  const remixTrendMutation = useMutation({
    mutationFn: async (payload: {
      id: number;
      directive?: string;
      editingTrick?: string;
      beatDropSec?: string;
      energyVibe?: string;
      chaosTwistMode?: string;
    }) => {
      const res = await apiRequest(
        "POST",
        `/api/agent/trends/${payload.id}/remix`,
        {
          ...payload,
          energyVibe: payload.energyVibe ?? selectedEnergyVibe,
          chaosTwistMode: payload.chaosTwistMode ?? selectedChaosTwist,
        }
      );
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/agent/trends"] });
      queryClient.invalidateQueries({ queryKey: ["/api/agent/flow-ultra-batch"] });
      refetchTrends();
      refetchFlowBatch();
      toast({
        title: "✨ Trend Blueprint Remixed",
        description: `Updated "${data.blueprint?.trendTopicOrHook}" with ${data.blueprint?.energyVibe || selectedEnergyVibe} & ${data.blueprint?.chaosTwistMode || selectedChaosTwist}.`,
      });
    },
  });

  const generateVideoMutation = useMutation({
    mutationFn: async (payload: {
      packageId: string;
      pacingMode?: "viral_punch" | "balanced_story" | "natural_cinema" | "fast_cut";
      textStyle?: "floating_tiktok" | "clean_no_text" | "none";
      editingTrick?: string;
      beatDropSec?: string;
      cleanNoText?: boolean;
      swapSceneOrder?: boolean;
      feedbackDirective?: string;
    }) => {
      setRenderingPackageId(payload.packageId);
      const effectiveStyle = payload.textStyle ?? textStyle;
      const res = await apiRequest("POST", "/api/agent/videos/generate", {
        packageId: payload.packageId,
        pacingMode: payload.pacingMode ?? pacingMode,
        textStyle: effectiveStyle,
        editingTrick: payload.editingTrick,
        beatDropSec: payload.beatDropSec,
        cleanNoText:
          payload.cleanNoText ??
          (effectiveStyle === "none" || effectiveStyle === "clean_no_text"),
        swapSceneOrder: payload.swapSceneOrder,
        feedbackDirective: payload.feedbackDirective,
      });
      return res.json();
    },
    onSuccess: (data) => {
      setRenderingPackageId(null);
      queryClient.invalidateQueries({ queryKey: ["/api/agent/videos"] });
      refetchVideos();
      setActiveTab("video-queue");
      toast({
        title: "AI Video Director Rendered 9:16 MP4",
        description: `Added "${data.video?.title}" to the Video Approval Queue for review.`,
      });
    },
    onError: (err: any) => {
      setRenderingPackageId(null);
      toast({
        title: "Video Render Error",
        description: err?.message || "Could not render video.",
        variant: "destructive",
      });
    },
  });

  const reviewVideoMutation = useMutation({
    mutationFn: async (payload: {
      id: number;
      action: "approve" | "decline";
      declineReason?: string;
      regenerate?: boolean;
      pacingMode?: "viral_punch" | "balanced_story" | "natural_cinema" | "fast_cut";
      textStyle?: "floating_tiktok" | "clean_no_text" | "none";
      cleanNoText?: boolean;
      swapSceneOrder?: boolean;
    }) => {
      const effectiveStyle = payload.textStyle ?? textStyle;
      const res = await apiRequest("POST", `/api/agent/videos/${payload.id}/review`, {
        action: payload.action,
        declineReason: payload.declineReason,
        regenerate: payload.regenerate,
        pacingMode: payload.pacingMode ?? pacingMode,
        textStyle: effectiveStyle,
        cleanNoText:
          payload.cleanNoText ??
          (effectiveStyle === "none" || effectiveStyle === "clean_no_text"),
        swapSceneOrder: payload.swapSceneOrder,
      });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/agent/videos"] });
      refetchVideos();
      if (data.action === "approved") {
        toast({
          title: "✅ Video Approved!",
          description: "Moved to 'Approved & Ready to Post' queue.",
        });
      } else if (data.action === "regenerated") {
        toast({
          title: "🎬 AI Director Re-Cut Complete",
          description: "New 9:16 MP4 rendered with updated cut timings and safe zones.",
        });
      } else {
        toast({
          title: "Video Declined",
          description: "Marked as declined in the queue.",
        });
      }
    },
  });

  const publishVideoMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("POST", `/api/agent/videos/${id}/publish`, {});
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/agent/videos"] });
      refetchVideos();
      refetchOverview();
      toast({
        title: data.webhookDispatched
          ? "🚀 Dispatched to Social Auto-Poster!"
          : "✅ Marked as Published",
        description: data.webhookDispatched
          ? "Sent 9:16 MP4 + caption to SOCIAL_AUTOPOST_WEBHOOK_URL."
          : "Logged in interaction feed and marked as published.",
      });
    },
  });

  const simulateReplyMutation = useMutation({
    mutationFn: async () => {
      const adminCode = getStoredAdminPasscode();
      if (simChannel === "email") {
        const res = await fetch("/api/agent/inbound-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Agent-Simulator": "true",
            "X-Admin-Passcode": adminCode,
          },
          body: JSON.stringify({
            from: simSender.includes("@") && !simSender.startsWith("@")
              ? simSender
              : "prospect@company.com",
            subject: simSubject,
            text: simMessage,
          }),
        });
        return res.json();
      } else {
        const res = await fetch("/api/agent/dm-reply", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Agent-Simulator": "true",
            "X-Admin-Passcode": adminCode,
          },
          body: JSON.stringify({
            platform: simPlatform,
            handle: simSender,
            message: simMessage,
            triggerType: simChannel,
          }),
        });
        return res.json();
      }
    },
    onSuccess: (data) => {
      setLastSimResult(data);
      refetchOverview();
      toast({
        title: "Autonomous Closer Responded",
        description: `Intent detected: ${data.detectedIntent}`,
      });
    },
  });

  const processDueMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/agent/nurture/process-now", {});
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        predicate: (q) => String(q.queryKey[0]).startsWith("/api/agent/overview"),
      });
      refetchOverview();
      toast({
        title: "Nurture Queue Processed",
        description: `Processed ${data.processedCount || 0} due lead(s).`,
      });
    },
  });

  const sendTestNurtureMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/agent/nurture/send-test", {
        email: testEmailInput,
        firstName: testFirstNameInput,
        archetypeId: previewArchetype,
        wakeTime: previewWake,
        foodPreference: previewDiet,
        pastBlocker: previewBlocker,
      });
      return res.json();
    },
    onSuccess: (data) => {
      refetchOverview();
      toast({
        title: `Stage ${data.sentStage}/4 Nurture Email Dispatched`,
        description: `${data.subject} (${
          data.deliveredViaSendGrid ? "Sent via SendGrid" : "Logged in Simulation Mode"
        })`,
      });
    },
  });

  const filteredPackages = (flowBatch?.packages || []).filter((pkg) => {
    const matchArch = archetypeFilter === "all" || pkg.archetypeId === archetypeFilter;
    const matchFormat =
      viralFormatFilter === "all" || pkg.viralFormat === viralFormatFilter;
    return matchArch && matchFormat;
  });

  const allVideos = videosData?.videos || [];
  const pendingVideos = allVideos.filter((v) => v.status === "pending_review");
  const approvedVideos = allVideos.filter(
    (v) => v.status === "approved" || v.status === "published"
  );
  const declinedVideos = allVideos.filter((v) => v.status === "declined");

  const activeEmailPreview =
    overview?.emailSequencePreview?.find((e) => e.stage === selectedStage) ||
    overview?.emailSequencePreview?.[0];

  const originUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://perfectdayreset.com";

  const parseDirectorReport = (raw: string): DirectorCutReport | null => {
    try {
      return JSON.parse(raw) as DirectorCutReport;
    } catch {
      return null;
    }
  };

  const toggleReportExpand = (id: number) => {
    setExpandedReports((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Protected Admin Route
              </span>
              <h1 className="text-xl font-bold text-white">
                AI Command Center Login
              </h1>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Enter your Admin Passcode to unlock the Google Flow Ultra (Veo 3.1) Storyboard Studio, AI Video Director Approval Queue, and Autonomous Closer tools.
          </p>

          <form onSubmit={handleUnlockSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-passcode-input"
                className="block text-xs font-semibold text-slate-300 mb-1.5"
              >
                Admin Password
              </label>
              <div className="relative">
                <input
                  id="admin-passcode-input"
                  type={showPasscodeText ? "text" : "password"}
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  placeholder="Enter admin password..."
                  autoComplete="current-password"
                  className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3.5 py-2.5 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPasscodeText((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  aria-label="Toggle password visibility"
                >
                  {showPasscodeText ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {passcodeError && (
                <p className="text-xs text-rose-400 mt-2 font-medium">
                  {passcodeError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={checkingPasscode}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg transition disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              {checkingPasscode ? "Verifying..." : "Unlock AI Command Center"}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Perfect Day Reset Admin</span>
            <Link href="/">
              <a className="inline-flex items-center gap-1 text-emerald-400 hover:underline font-medium">
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Public Site
              </a>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top Command Bar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Autonomous AI Growth, Video Director &amp; Closer Command Center
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">
                3-Layer Viral Funnel (100% Entertain → Educate → Convert) • Official Veo 3.1 6-Block Syntax • AI Video Director &amp; FFmpeg Editor
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/quiz">
              <a className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Live 60s Quiz
              </a>
            </Link>
            <Link href="/checkout">
              <a className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition">
                Checkout ($19 + $12 Bump)
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </Link>
            <button
              type="button"
              onClick={handleLockAdmin}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              Lock Admin
            </button>
            <Link href="/">
              <a className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg text-slate-400 hover:text-white transition">
                <ArrowLeft className="w-3.5 h-3.5" />
                Home
              </a>
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex overflow-x-auto border-t border-slate-800/80">
          <button
            type="button"
            onClick={() => setActiveTab("flow-ultra")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition ${
              activeTab === "flow-ultra"
                ? "border-emerald-400 text-emerald-300 bg-emerald-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Clapperboard className="w-4 h-4" />
            1. Purple Cow Storyboard Studio (12 Multi-Scene Packs)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("video-queue")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition ${
              activeTab === "video-queue"
                ? "border-emerald-400 text-emerald-300 bg-emerald-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Video className="w-4 h-4" />
            2. Video Approval Queue (Approve / Decline)
            {pendingVideos.length > 0 && (
              <span className="ml-1 px-2 py-0.5 text-[11px] font-bold rounded-full bg-amber-500 text-slate-950">
                {pendingVideos.length} Review
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("simulator")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition ${
              activeTab === "simulator"
                ? "border-emerald-400 text-emerald-300 bg-emerald-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            3. Live Two-Way DM &amp; Email Closer Simulator
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("nurture")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition ${
              activeTab === "nurture"
                ? "border-emerald-400 text-emerald-300 bg-emerald-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Mail className="w-4 h-4" />
            4. Autonomous 4-Stage Email Nurture Queue
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("webhooks")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition ${
              activeTab === "webhooks"
                ? "border-emerald-400 text-emerald-300 bg-emerald-500/5"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Webhook className="w-4 h-4" />
            5. Webhook &amp; ManyChat Connection Guide
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* ============================================================
            TAB 1: GOOGLE FLOW ULTRA MULTI-SCENE STORYBOARD STUDIO
        ============================================================ */}
        {activeTab === "flow-ultra" && (
          <div className="space-y-6">
            {/* ============================================================
                4-PILLAR VIRAL TREND RADAR, NEWSJACKING ENGINE & PROMPT ARCHITECT
            ============================================================ */}
            <div className="bg-gradient-to-br from-amber-950/50 via-slate-900 to-emerald-950/40 border border-amber-500/40 rounded-2xl p-6 space-y-5 shadow-xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      <Sparkles className="w-3.5 h-3.5" />
                      4-Pillar Autonomous Trend Intelligence
                    </span>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Pillar 1: Newsjacking • Pillar 2: Editing Tricks • Pillar 3: Audio Beat Sync • Pillar 4: Niche Outliers
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    ⚡ Viral Trend Radar, Newsjacker &amp; Editing-Trick Cloner
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-4xl">
                    Don&apos;t guess prompts in a vacuum. Scrape breaking cultural/tech news (e.g. <em>Tesla Roadster flying demo</em>), high-velocity TikTok outliers, or paste any TikTok URL—Gemini Vision deconstructs the <strong>Editing Trick + Audio Beat Drop</strong> and writes a complete <strong>6-Block Veo 3.1 Storyboard</strong> automatically.
                  </p>
                </div>

                {/* Mode Switcher Pills */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {[
                    { id: "newsjack" as const, label: "🌍 1. Newsjack Breaking Topic" },
                    { id: "tiktok_keyword" as const, label: "🎵 2. Scrape TikTok Outliers & Sounds" },
                    { id: "tiktok_url" as const, label: "🔗 3. Clone Any TikTok URL" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setTrendMode(m.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                        trendMode === m.id
                          ? "bg-amber-400 text-slate-950 shadow-lg"
                          : "bg-slate-800/90 text-slate-300 hover:bg-slate-700 border border-slate-700"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Energy Vibe + Spectacle Twist Selector Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pt-3 border-t border-slate-800/80">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mr-1">
                    Energy Vibe:
                  </span>
                  {[
                    {
                      id: "high_performance_positive" as const,
                      label: "⚡ Crazy Positive High-Performance",
                    },
                    {
                      id: "dark_humor_contrast" as const,
                      label: "🎭 Dark Humor Contrast",
                    },
                    {
                      id: "uplifting_comeback_story" as const,
                      label: "🏆 Uplifting Story",
                    },
                  ].map((vb) => (
                    <button
                      key={vb.id}
                      type="button"
                      onClick={() => setSelectedEnergyVibe(vb.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${
                        selectedEnergyVibe === vb.id
                          ? "bg-emerald-500 text-slate-950 shadow"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      {vb.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 mr-1">
                    Spectacle Twist:
                  </span>
                  {[
                    {
                      id: "absurd_giraffe_twist" as const,
                      label: "🐪 Giraffe / Absurd Background Twist",
                    },
                    {
                      id: "hypercar_spectacle" as const,
                      label: "🚀 Hypercar / High-Tech Spectacle",
                    },
                    {
                      id: "kinetic_boss_exit" as const,
                      label: "🎬 Kinetic Boss Move",
                    },
                  ].map((tw) => (
                    <button
                      key={tw.id}
                      type="button"
                      onClick={() => setSelectedChaosTwist(tw.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${
                        selectedChaosTwist === tw.id
                          ? "bg-amber-400 text-slate-950 shadow"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      {tw.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Editing Trick + Target Archetype Selector Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pt-3 border-t border-slate-800/80">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 mr-1">
                    Editing Trick:
                  </span>
                  {[
                    { id: "beat_drop_match_cut" as const, label: "✂️ Beat-Drop Match Cut (2.5s)" },
                    { id: "freeze_frame_hook" as const, label: "🧊 Freeze-Frame Hook (2.1s)" },
                    { id: "zoom_punch_contrast" as const, label: "🔍 Deadpan Zoom-Punch (1.9s)" },
                    { id: "infinite_loop_cut" as const, label: "♾️ Infinite Loop Cut" },
                  ].map((tr) => (
                    <button
                      key={tr.id}
                      type="button"
                      onClick={() => setSelectedEditingTrick(tr.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                        selectedEditingTrick === tr.id
                          ? "bg-amber-400 text-slate-950"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      {tr.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mr-1">
                    Bridge to Archetype:
                  </span>
                  {[
                    { id: "metabolic_crasher", label: "2:30 PM Crash" },
                    { id: "cortisol_spiked", label: "8:45 AM / 3 AM Cortisol" },
                    { id: "dopamine_depleted", label: "Dopamine / Deep Work" },
                    { id: "systemic_burnout", label: "Founder Burnout" },
                  ].map((ar) => (
                    <button
                      key={ar.id}
                      type="button"
                      onClick={() => setSelectedTrendArchetype(ar.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                        selectedTrendArchetype === ar.id
                          ? "bg-emerald-500 text-slate-950"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      {ar.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Mode Control Box */}
              {trendMode === "newsjack" && (
                <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Quick Viral Topics:
                    </span>
                    {[
                      "How 8:45 AM Feels When Your Cortisol Curve Is Actually Dialed In",
                      "Finishing a Full Week of Deep Work by Tuesday at 11:30 AM",
                      "Tesla Roadster flying demo",
                      "Apple launch event vs my 2:30 PM brain",
                    ].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setNewsjackTopicInput(preset)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-medium border border-slate-700 transition"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <input
                      type="text"
                      value={newsjackTopicInput}
                      onChange={(e) => setNewsjackTopicInput(e.target.value)}
                      placeholder="Type any high-performance win or breaking news spectacle (e.g., Tesla Roadster flying demo)..."
                      aria-label="Newsjacking topic input"
                      className="flex-1 rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      disabled={scrapeTrendMutation.isPending}
                      onClick={() =>
                        scrapeTrendMutation.mutate({
                          mode: "newsjack",
                          customTopic: newsjackTopicInput,
                          editingTrick: selectedEditingTrick,
                          archetypeId: selectedTrendArchetype,
                          energyVibe: selectedEnergyVibe,
                          chaosTwistMode: selectedChaosTwist,
                        })
                      }
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-lg transition disabled:opacity-50"
                    >
                      {scrapeTrendMutation.isPending ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Synthesizing Veo 3.1 Storyboard...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4" />
                          Build 3-Beat Kinetic Storyboard
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      disabled={scrapeTrendMutation.isPending}
                      onClick={() =>
                        scrapeTrendMutation.mutate({
                          mode: "newsjack",
                          customTopic: "",
                          editingTrick: selectedEditingTrick,
                          archetypeId: selectedTrendArchetype,
                          energyVibe: selectedEnergyVibe,
                          chaosTwistMode: selectedChaosTwist,
                        })
                      }
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-semibold text-xs border border-emerald-500/40 transition disabled:opacity-50"
                    >
                      <Sparkles className="w-4 h-4" />
                      Scrape Live Google Trends RSS
                    </button>
                  </div>
                </div>
              )}

              {trendMode === "tiktok_keyword" && (
                <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      1-Click Outlier Niches:
                    </span>
                    {[
                      { label: "⚡ Limitless Morning Flow", q: "morning flow state productivity pov" },
                      { label: "💼 Corporate Dark Humor", q: "corporate dark humor pov" },
                      { label: "🌙 3AM Sleep Math", q: "3am cant sleep math pov" },
                      { label: "🚗 Parked Car Driveway POV", q: "sitting in parked car after work" },
                    ].map((pill) => (
                      <button
                        key={pill.q}
                        type="button"
                        onClick={() => {
                          setTiktokQueryInput(pill.q);
                          scrapeTrendMutation.mutate({
                            mode: "tiktok_keyword",
                            query: pill.q,
                            editingTrick: selectedEditingTrick,
                            archetypeId: selectedTrendArchetype,
                            energyVibe: selectedEnergyVibe,
                            chaosTwistMode: selectedChaosTwist,
                          });
                        }}
                        className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-semibold border border-slate-700 transition"
                      >
                        {pill.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <input
                      type="text"
                      value={tiktokQueryInput}
                      onChange={(e) => setTiktokQueryInput(e.target.value)}
                      placeholder="Search live TikTok viral outliers (e.g., founder flow state, corporate humor)..."
                      aria-label="TikTok keyword search input"
                      className="flex-1 rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                    />
                    <button
                      type="button"
                      disabled={scrapeTrendMutation.isPending}
                      onClick={() =>
                        scrapeTrendMutation.mutate({
                          mode: "tiktok_keyword",
                          query: tiktokQueryInput,
                          editingTrick: selectedEditingTrick,
                          archetypeId: selectedTrendArchetype,
                          energyVibe: selectedEnergyVibe,
                          chaosTwistMode: selectedChaosTwist,
                        })
                      }
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition disabled:opacity-50"
                    >
                      {scrapeTrendMutation.isPending ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Scraping TikTok Outliers &amp; Audio...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Scrape TikTok Outliers &amp; Build Veo 3.1 Prompts
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {trendMode === "tiktok_url" && (
                <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-3">
                  <p className="text-xs text-slate-300">
                    Paste any viral TikTok video URL below—Gemini Vision extracts keyframes, detects the audio beat drop &amp; editing trick, and clones its exact viral hook structure into a 6-Block Veo 3.1 storyboard.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <input
                      type="url"
                      value={tiktokUrlInput}
                      onChange={(e) => setTiktokUrlInput(e.target.value)}
                      placeholder="https://www.tiktok.com/@creator/video/742..."
                      aria-label="TikTok video URL to clone"
                      className="flex-1 rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      disabled={scrapeTrendMutation.isPending}
                      onClick={() =>
                        scrapeTrendMutation.mutate({
                          mode: "tiktok_url",
                          tiktokUrl:
                            tiktokUrlInput || "https://www.tiktok.com/@exec_pov/video/741892341",
                          editingTrick: selectedEditingTrick,
                          archetypeId: selectedTrendArchetype,
                          energyVibe: selectedEnergyVibe,
                          chaosTwistMode: selectedChaosTwist,
                        })
                      }
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-lg transition disabled:opacity-50"
                    >
                      {scrapeTrendMutation.isPending ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Deconstructing TikTok Frames &amp; Audio...
                        </>
                      ) : (
                        <>
                          <Film className="w-4 h-4" />
                          Clone TikTok Structure into Veo 3.1
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Live Deconstructed Trend Blueprints Grid */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    🔥 Deconstructed Trend Blueprints ({trendsData?.blueprints?.length || 0} Ready-to-Shoot Veo 3.1 Packs)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Includes 3-Beat Kinetic Choreography, Giraffe/Spectacle Twist &amp; 6.0s Viral Cut Execution
                  </span>
                </div>

                {loadingTrends ? (
                  <div className="text-xs text-slate-400 py-6 text-center">
                    Loading live Trend Radar blueprints...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {(trendsData?.blueprints || []).slice(0, 6).map((bp) => {
                      const pkg = bp.generatedPackage;
                      const vibeBadge =
                        pkg?.energyVibe === "high_performance_positive"
                          ? "⚡ Crazy Positive High-Performance"
                          : pkg?.energyVibe === "uplifting_comeback_story"
                          ? "🏆 Uplifting Comeback"
                          : "🎭 Dark Humor Contrast";
                      const twistBadge =
                        pkg?.chaosTwistMode === "absurd_giraffe_twist"
                          ? "🐪 Giraffe Twist"
                          : pkg?.chaosTwistMode === "hypercar_spectacle"
                          ? "🚀 Hypercar Spectacle"
                          : pkg?.chaosTwistMode === "kinetic_boss_exit"
                          ? "🎬 Kinetic Boss Move"
                          : null;

                      return (
                        <div
                          key={bp.id}
                          className="bg-slate-950/95 border border-slate-800 hover:border-amber-500/40 rounded-xl p-4 flex flex-col justify-between space-y-3.5 transition"
                        >
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                                  {vibeBadge}
                                </span>
                                {twistBadge && (
                                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                                    {twistBadge}
                                  </span>
                                )}
                                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-bold">
                                  ⚡ {bp.viralVelocityScore}/100 • {(bp.sourceViews / 1000).toFixed(0)}K Views
                                </span>
                                <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-bold">
                                  ✂️ {bp.editingTrick.replace(/_/g, " ")} @ {bp.beatDropSec}s
                                </span>
                              </div>
                            </div>

                            <h3 className="text-sm sm:text-base font-bold text-white">
                              {pkg?.angleTitle || bp.trendTopicOrHook}
                            </h3>

                            {/* Trending Sound Bar */}
                            <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-2 text-xs">
                              <div className="truncate">
                                <span className="text-amber-300 font-semibold">
                                  🎵 Sound:
                                </span>{" "}
                                <span className="text-slate-200 font-medium">
                                  {bp.trendingSoundTitle}
                                </span>{" "}
                                <span className="text-slate-400">
                                  ({bp.trendingSoundAuthor})
                                </span>
                              </div>
                              {bp.trendingSoundUrl && (
                                <a
                                  href={bp.trendingSoundUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:underline shrink-0"
                                >
                                  Open Trending Sound
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>

                            {/* Multimodal Deconstruction Summary */}
                            {bp.deconstruction && (
                              <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-2.5 space-y-1 text-[11px] text-slate-300">
                                <p>
                                  <strong className="text-amber-300">Hook Mechanic:</strong>{" "}
                                  {bp.deconstruction.visualHookMechanic}
                                </p>
                                <p>
                                  <strong className="text-sky-300">Editing Trick Rule:</strong>{" "}
                                  {bp.deconstruction.editingTrickBreakdown}
                                </p>
                                <p>
                                  <strong className="text-emerald-300">Share Trigger:</strong>{" "}
                                  {bp.deconstruction.shareTrigger}
                                </p>
                              </div>
                            )}

                            {/* Scene 1 & 2 On-Screen Text Preview */}
                            {pkg?.scenes && pkg.scenes.length > 0 && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {pkg.scenes.slice(0, 2).map((sc) => (
                                  <div
                                    key={sc.sceneNumber}
                                    className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 space-y-1.5"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-bold uppercase text-emerald-400">
                                        Scene {sc.sceneNumber} ({sc.timeRange})
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          copyToClipboard(
                                            sc.flowUltraPrompt,
                                            `trend-${bp.id}-s-${sc.sceneNumber}`,
                                            `Trend Scene ${sc.sceneNumber} Veo 3.1 Prompt`
                                          )
                                        }
                                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-semibold text-slate-200"
                                      >
                                        {copiedKey === `trend-${bp.id}-s-${sc.sceneNumber}` ? (
                                          <Check className="w-2.5 h-2.5 text-emerald-400" />
                                        ) : (
                                          <Copy className="w-2.5 h-2.5" />
                                        )}
                                        Copy Veo 3.1
                                      </button>
                                    </div>
                                    <p className="text-xs font-bold text-white leading-snug">
                                      &ldquo;{sc.onScreenText}&rdquo;
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                            <div className="flex flex-wrap items-center gap-1.5">
                              {pkg && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      copyToClipboard(
                                        (pkg.scenes || [])
                                          .map(
                                            (s) =>
                                              `SCENE ${s.sceneNumber} (${s.timeRange}):\n${s.flowUltraPrompt}\nOn-Screen Text: ${s.onScreenText}`
                                          )
                                          .join("\n\n"),
                                        `trend-both-${bp.id}`,
                                        "Scene 1 & 2 Veo 3.1 Prompts"
                                      )
                                    }
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold border border-slate-700 transition"
                                  >
                                    {copiedKey === `trend-both-${bp.id}` ? (
                                      <Check className="w-3 h-3 text-emerald-400" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                    Copy Scene 1 &amp; 2 Veo 3.1 Prompts
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      copyToClipboard(
                                        pkg.flowAgentPrompt,
                                        `trend-master-${bp.id}`,
                                        "Flow Agent Master Prompt"
                                      )
                                    }
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-bold border border-amber-500/40 transition"
                                  >
                                    {copiedKey === `trend-master-${bp.id}` ? (
                                      <Check className="w-3 h-3 text-emerald-400" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                    Copy Flow Agent Master Prompt
                                  </button>
                                </>
                              )}

                              <button
                                type="button"
                                disabled={remixTrendMutation.isPending}
                                onClick={() =>
                                  remixTrendMutation.mutate({
                                    id: bp.id,
                                    editingTrick: selectedEditingTrick,
                                    energyVibe: selectedEnergyVibe,
                                    chaosTwistMode: selectedChaosTwist,
                                    directive:
                                      "Apply 3-Beat Kinetic Choreography and selected Energy Vibe & Spectacle Twist while keeping Scene Bible continuity",
                                  })
                                }
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 text-[11px] font-semibold border border-slate-700 transition"
                              >
                                <RefreshCw className="w-3 h-3" />
                                Remix Vibe &amp; Twist
                              </button>
                            </div>

                            {pkg && (
                              <button
                                type="button"
                                disabled={
                                  generateVideoMutation.isPending &&
                                  renderingPackageId === pkg.id
                                }
                                onClick={() =>
                                  generateVideoMutation.mutate({
                                    packageId: pkg.id,
                                    pacingMode: "viral_punch",
                                    editingTrick: bp.editingTrick,
                                    beatDropSec: bp.beatDropSec,
                                  })
                                }
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-[11px] shadow transition disabled:opacity-50"
                              >
                                <Scissors className="w-3 h-3" />
                                ⚡ Render 6.0s Viral Cut in AI Director
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 space-y-5">
              {/* 3-Layer Viral Funnel Badge */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  3-Layer Viral Funnel:
                </span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800/90 text-white border border-slate-700">
                  1. Video = 100% Entertain (Zero Ads / Zero CTA on Screen)
                </span>
                <span className="text-slate-500 font-bold">→</span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800/90 text-sky-300 border border-slate-700">
                  2. Caption = Educate (BMW Story + Physiology Bridge)
                </span>
                <span className="text-slate-500 font-bold">→</span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  3. Comment RESET = Convert (ManyChat Auto-DM)
                </span>
              </div>

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                    <Film className="w-3.5 h-3.5" />
                    Google Flow Ultra (Veo 3.1) 6-Block Single-Shot Storyboard Engine
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    12 Scroll-Stopping Viral Storyboards: Dark Corporate Comedy &amp; BMW Trojan Horse Stories
                  </h2>
                  <p className="text-sm text-slate-300 mt-1 max-w-3xl">
                    Every shot uses the official <strong>6-Block Veo 3.1 Prompt Syntax</strong> front-loaded with <code>One continuous unbroken 9:16 vertical shot, no cuts.</code>, zero quotation marks <code>""</code> to prevent hallucinated text, and upper-third safe-zone headroom.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveTab("video-queue")}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition"
                  >
                    <Video className="w-4 h-4" />
                    Open Approval Queue ({pendingVideos.length} Pending)
                  </button>
                  {flowBatch?.manyChatAutomationConfig && (
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          JSON.stringify(flowBatch.manyChatAutomationConfig, null, 2),
                          "manychat-json",
                          "ManyChat Comment-to-DM Config JSON"
                        )
                      }
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-950/50 transition"
                    >
                      {copiedKey === "manychat-json" ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      Copy ManyChat JSON
                    </button>
                  )}
                </div>
              </div>

              {/* 1-Click Google Flow Built-In Agent Constitution Banner */}
              {flowBatch?.flowAgentConstitution && (
                <div className="bg-slate-950/95 border border-emerald-500/40 rounded-xl p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[11px] font-bold uppercase tracking-wider">
                          Step 0 • Paste Once into Google Flow
                        </span>
                        <h3 className="text-sm font-bold text-white">
                          Google Flow Built-In Agent Constitution (5 Veo 3.1 Single-Shot &amp; Safe-Zone Rules)
                        </h3>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Copy and paste this instruction block into Google Flow&apos;s Agent / System Instructions panel so every generated clip obeys Scene Bible continuity, single-action physics, and upper-third caption headroom.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setShowConstitution((prev) => !prev)}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
                      >
                        {showConstitution ? (
                          <>
                            <ChevronUp className="w-3.5 h-3.5" />
                            Hide Rules
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3.5 h-3.5" />
                            Preview 5 Rules
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(
                            flowBatch.flowAgentConstitution,
                            "flow-agent-constitution",
                            "Google Flow Built-In Agent Constitution"
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow transition"
                      >
                        {copiedKey === "flow-agent-constitution" ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        Copy Google Flow Agent Constitution
                      </button>
                    </div>
                  </div>
                  {showConstitution && (
                    <pre className="text-xs text-slate-200 font-mono bg-slate-900/90 border border-slate-800 rounded-lg p-3.5 whitespace-pre-wrap leading-relaxed">
                      {flowBatch.flowAgentConstitution}
                    </pre>
                  )}
                </div>
              )}

              {/* Viral Format Filter Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
                  Viral Format:
                </span>
                {[
                  { id: "all", label: "All 4 Viral Formats (12)" },
                  { id: "purple_cow_loop", label: "🐄 Purple Cow Loops (4)" },
                  { id: "trojan_horse_story", label: "🏎️ BMW Trojan Horse Stories (3)" },
                  { id: "two_timelines_experiment", label: "⚡ A/B Timeline Experiments (2)" },
                  { id: "forensic_curiosity_hook", label: "🔬 Forensic Curiosity Hooks (3)" },
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setViralFormatFilter(fmt.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                      viralFormatFilter === fmt.id
                        ? "bg-amber-400 text-slate-950"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>

              {/* Archetype Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
                  Archetype:
                </span>
                {[
                  { id: "all", label: "All Archetypes" },
                  { id: "cortisol_spiked", label: "Cortisol-Spiked (3)" },
                  { id: "dopamine_depleted", label: "Dopamine-Depleted (3)" },
                  { id: "metabolic_crasher", label: "Metabolic Crasher (3)" },
                  { id: "systemic_burnout", label: "Systemic Burnout (3)" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setArchetypeFilter(tab.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                      archetypeFilter === tab.id
                        ? "bg-emerald-500 text-slate-950"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Pacing Mode & Text Style Controls */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pt-4 border-t border-slate-800">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mr-1">
                    Pacing Mode:
                  </span>
                  {[
                    {
                      id: "viral_punch" as const,
                      label: "⚡ Viral Punch 6.0s [Default] (2.5s Hook + 3.5s Peak)",
                    },
                    {
                      id: "balanced_story" as const,
                      label: "Balanced (9.0s)",
                    },
                    {
                      id: "natural_cinema" as const,
                      label: "Natural Full Clips (Full Raw Arcs)",
                    },
                  ].map((pm) => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPacingMode(pm.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        pacingMode === pm.id
                          ? "bg-emerald-500 text-slate-950 shadow"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      {pm.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 mr-1">
                    Text Style:
                  </span>
                  {[
                    {
                      id: "floating_tiktok" as const,
                      label: "Clean Entertainment Text [No Boxes/No Ads]",
                    },
                    {
                      id: "clean_no_text" as const,
                      label: "Clean Video Master [No Text]",
                    },
                  ].map((ts) => (
                    <button
                      key={ts.id}
                      type="button"
                      onClick={() => setTextStyle(ts.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        textStyle === ts.id ||
                        (ts.id === "clean_no_text" && textStyle === "none")
                          ? "bg-sky-400 text-slate-950 shadow"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      {ts.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {loadingFlow ? (
              <div className="text-center py-12 text-slate-400">
                Loading Google Flow Ultra multi-scene storyboards...
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredPackages.map((pkg, idx) => (
                  <div
                    key={pkg.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-5 hover:border-emerald-500/40 transition"
                  >
                    {/* Storyboard Header + Render Action */}
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 border-b border-slate-800 pb-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                            Storyboard #{idx + 1} • {pkg.archetypeName}
                          </span>
                          <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30">
                            {pkg.viralFormatLabel} • {pkg.targetLengthSeconds}s ({pkg.scenes?.length || 2} Scenes)
                          </span>
                          <span className="inline-block text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300">
                            {pkg.pacingRule}
                          </span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-white">
                          {pkg.angleTitle}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          <strong className="text-slate-200">Psychological Hook Angle:</strong>{" "}
                          {pkg.psychologicalAngle}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        {pkg.flowAgentPrompt && (
                          <button
                            type="button"
                            onClick={() =>
                              copyToClipboard(
                                pkg.flowAgentPrompt,
                                `${pkg.id}-flow-agent-master`,
                                "Flow Agent Master Brief (Scene Bible + All Shot Cards)"
                              )
                            }
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/40 transition"
                          >
                            {copiedKey === `${pkg.id}-flow-agent-master` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            Copy Flow Agent Master Prompt
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(
                              (pkg.scenes || [])
                                .map(
                                  (s) =>
                                    `=== SCENE ${s.sceneNumber} (${s.timeRange} • ${s.shotType}) ===\n6-Block Veo 3.1 Prompt: ${s.flowUltraPrompt}\nWhat We Want: ${s.whatWeWant}\nWhat We Don't Want: ${s.whatWeDontWant}\nEntertainment On-Screen Text: ${s.onScreenText}\nSound Cue: ${s.soundCue}`
                                )
                                .join("\n\n"),
                              `${pkg.id}-all-scenes`,
                              "Complete Multi-Scene Cut Sheet"
                            )
                          }
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
                        >
                          {copiedKey === `${pkg.id}-all-scenes` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          Copy All {pkg.scenes?.length || 2} Scene Prompts
                        </button>

                        <button
                          type="button"
                          disabled={
                            generateVideoMutation.isPending && renderingPackageId === pkg.id
                          }
                          onClick={() =>
                            generateVideoMutation.mutate({ packageId: pkg.id })
                          }
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg transition disabled:opacity-50"
                        >
                          {generateVideoMutation.isPending &&
                          renderingPackageId === pkg.id ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              AI Director Analyzing &amp; Rendering...
                            </>
                          ) : (
                            <>
                              <Scissors className="w-3.5 h-3.5" />
                              Render Video with AI Director
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Scene Bible Continuity Strip */}
                    {pkg.sceneBible && (
                      <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-3.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                        <div>
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                            Scene Bible • Cast
                          </span>
                          <span className="text-slate-200">{pkg.sceneBible.cast}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                            Wardrobe Anchor
                          </span>
                          <span className="text-slate-200">{pkg.sceneBible.wardrobe}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                            Camera &amp; Lens Lock
                          </span>
                          <span className="text-slate-200">{pkg.sceneBible.lens}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                            Lighting &amp; Grade Lock
                          </span>
                          <span className="text-slate-200">{pkg.sceneBible.lightDirection}</span>
                        </div>
                      </div>
                    )}

                    {/* Scene-by-Scene Cut Sheet */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                          Scene-by-Scene Google Flow Ultra (Veo 3.1) 6-Block Cut Sheet ({pkg.scenes?.length || 0} Unbroken Shots)
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {pkg.cameraSpec}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {(pkg.scenes || []).map((scene) => (
                          <div
                            key={scene.sceneNumber}
                            className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3"
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[11px]">
                                    Scene {scene.sceneNumber}
                                  </span>
                                  <span className="text-xs font-semibold text-amber-300">
                                    {scene.timeRange}
                                  </span>
                                  <span className="text-xs text-slate-400 truncate">
                                    • {scene.shotType}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    copyToClipboard(
                                      scene.flowUltraPrompt,
                                      `${pkg.id}-scene-${scene.sceneNumber}`,
                                      `Scene ${scene.sceneNumber} 6-Block Veo 3.1 Prompt`
                                    )
                                  }
                                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 shrink-0"
                                >
                                  {copiedKey === `${pkg.id}-scene-${scene.sceneNumber}` ? (
                                    <Check className="w-3.5 h-3.5" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                  Copy 6-Block Prompt
                                </button>
                              </div>

                              <p className="text-xs text-slate-300 font-mono leading-relaxed">
                                {scene.flowUltraPrompt}
                              </p>
                            </div>

                            <div className="pt-2.5 border-t border-slate-800/80 space-y-1.5 text-xs">
                              <p className="text-white">
                                <span className="text-amber-400 font-semibold">
                                  🎭 Entertainment On-Screen Text (Zero Ads):
                                </span>{" "}
                                “{scene.onScreenText}”
                              </p>
                              {scene.whatWeWant && (
                                <p className="text-emerald-300/90">
                                  <span className="font-semibold text-emerald-400">
                                    ✅ What We Want (Single Continuous Shot):
                                  </span>{" "}
                                  {scene.whatWeWant}
                                </p>
                              )}
                              {scene.whatWeDontWant && (
                                <p className="text-rose-300/90">
                                  <span className="font-semibold text-rose-400">
                                    🚫 What We Don&apos;t Want (Negative Prompt):
                                  </span>{" "}
                                  {scene.whatWeDontWant}
                                </p>
                              )}
                              <p className="text-slate-400">
                                <span className="text-sky-400 font-semibold">
                                  Audio / SFX Cue:
                                </span>{" "}
                                {scene.soundCue}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 3-Layer Caption Breakdown & Auto-DM Closer */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-2 border-t border-slate-800">
                      <div className="lg:col-span-8 bg-slate-950/90 border border-slate-800 rounded-xl p-3.5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
                            Layer 2 &amp; 3: Educate &amp; Convert Caption (Ends with “Comment RESET”)
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              copyToClipboard(
                                pkg.caption,
                                `${pkg.id}-caption`,
                                "3-Layer Viral Caption"
                              )
                            }
                            className="inline-flex items-center gap-1 text-xs font-semibold text-sky-400 hover:text-sky-300"
                          >
                            {copiedKey === `${pkg.id}-caption` ? (
                              <Check className="w-3.5 h-3.5" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            Copy Full Caption
                          </button>
                        </div>

                        {pkg.captionParts ? (
                          <div className="space-y-1.5 text-xs">
                            <p className="text-slate-200">
                              <span className="font-bold text-amber-300">
                                1. Hook Continuation:
                              </span>{" "}
                              {pkg.captionParts.hookContinuation}
                            </p>
                            <p className="text-slate-300">
                              <span className="font-bold text-sky-300">
                                2. Educational Bridge (BMW Story + Physiology):
                              </span>{" "}
                              {pkg.captionParts.educationalBridge}
                            </p>
                            <p className="text-emerald-300 font-medium">
                              <span className="font-bold text-emerald-400">
                                3. Committed CTA:
                              </span>{" "}
                              {pkg.captionParts.committedCta}
                            </p>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                            {pkg.caption}
                          </p>
                        )}
                      </div>

                      <div className="lg:col-span-4 bg-slate-950/90 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                              Auto-DM Closer
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                copyToClipboard(
                                  pkg.dmOpeningMessage,
                                  `${pkg.id}-dm`,
                                  "DM Opening Message"
                                )
                              }
                              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                            >
                              {copiedKey === `${pkg.id}-dm` ? (
                                <Check className="w-3.5 h-3.5" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                              Copy DM
                            </button>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {pkg.dmOpeningMessage}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================
            TAB 2: VIDEO APPROVAL QUEUE (APPROVE / DECLINE + AI DIRECTOR)
        ============================================================ */}
        {activeTab === "video-queue" && (
          <div className="space-y-8">
            {/* Pipeline Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-emerald-950/50 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 space-y-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                    <Scissors className="w-3.5 h-3.5" />
                    Multimodal AI Video Director + Free Local FFmpeg Viral Assembler
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Human-in-the-Loop Video Approval Queue ({pendingVideos.length} Pending Review • {approvedVideos.length} Approved)
                  </h2>
                  <p className="text-sm text-slate-300 mt-1 max-w-3xl">
                    Defaults to <strong>Viral Punch 6.0s</strong> (<code>pacingMode: &quot;viral_punch&quot;</code> — <code>2.5s</code> Scene 1 Hook + <code>3.5s</code> Scene 2 Peak Action from <code>1.2s–4.7s</code>, stripping dead standing pauses), with 1.08x dynamic push-in and 100% entertainment-only floating typography.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    disabled={generateVideoMutation.isPending}
                    onClick={() =>
                      generateVideoMutation.mutate({
                        packageId: "trend-1-tesla-roadster-newsjack-drop",
                        pacingMode,
                        textStyle,
                        cleanNoText:
                          textStyle === "none" || textStyle === "clean_no_text",
                      })
                    }
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition disabled:opacity-50"
                  >
                    {generateVideoMutation.isPending ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Rendering New Cut...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Render 6.0s Viral Cut from Watch Folder
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Pacing Mode & Text Style Controls */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pt-4 border-t border-slate-800/80">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mr-1">
                    Pacing Mode:
                  </span>
                  {[
                    {
                      id: "viral_punch" as const,
                      label: "⚡ Viral Punch 6.0s [Default] (2.5s Hook + 3.5s Peak)",
                    },
                    {
                      id: "balanced_story" as const,
                      label: "Balanced (9.0s)",
                    },
                    {
                      id: "natural_cinema" as const,
                      label: "Natural Full Clips (Full Raw Arcs)",
                    },
                  ].map((pm) => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPacingMode(pm.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        pacingMode === pm.id
                          ? "bg-emerald-500 text-slate-950 shadow"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      {pm.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 mr-1">
                    Text Style:
                  </span>
                  {[
                    {
                      id: "floating_tiktok" as const,
                      label: "Clean Entertainment Text [No Boxes/No Ads]",
                    },
                    {
                      id: "clean_no_text" as const,
                      label: "Clean Video Master [No Text]",
                    },
                  ].map((ts) => (
                    <button
                      key={ts.id}
                      type="button"
                      onClick={() => setTextStyle(ts.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        textStyle === ts.id ||
                        (ts.id === "clean_no_text" && textStyle === "none")
                          ? "bg-sky-400 text-slate-950 shadow"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      {ts.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {loadingVideos ? (
              <div className="text-center py-12 text-slate-400">
                Loading AI Video Director Approval Queue...
              </div>
            ) : (
              <>
                {/* SECTION A: PENDING REVIEW VIDEOS */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                      Pending Producer Review ({pendingVideos.length})
                    </h3>
                    <span className="text-xs text-slate-400">
                      Watch folder: <code>attached_assets/flow_ultra_drop/</code>
                    </span>
                  </div>

                  {pendingVideos.length === 0 ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
                      All queued videos have been reviewed! Click{" "}
                      <strong className="text-emerald-400">
                        Render Video with AI Director
                      </strong>{" "}
                      in Tab 1 to generate a new cut.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6">
                      {pendingVideos.map((video) => {
                        const report = parseDirectorReport(video.directorReport);
                        const isExpanded = expandedReports[video.id] ?? true;

                        return (
                          <div
                            key={video.id}
                            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
                          >
                            {/* Left Column: 9:16 Vertical HTML5 Video Player */}
                            <div className="lg:col-span-4 flex flex-col items-center">
                              <div className="w-full max-w-[270px] aspect-[9/16] rounded-2xl overflow-hidden border-2 border-slate-700 bg-black shadow-2xl relative">
                                <video
                                  key={`${video.videoUrl}-${report?.analyzedAt || ""}`}
                                  src={video.videoUrl}
                                  controls
                                  playsInline
                                  loop
                                  preload="metadata"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="mt-2.5 flex items-center gap-3 text-xs text-slate-400">
                                <span>1080×1920 (9:16 H.264 + AAC)</span>
                                <span>•</span>
                                <a
                                  href={video.videoUrl}
                                  download
                                  className="text-emerald-400 hover:underline inline-flex items-center gap-1 font-semibold"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  Download .MP4
                                </a>
                              </div>
                            </div>

                            {/* Right Column: AI Director Cut Report + Approve / Decline Controls */}
                            <div className="lg:col-span-8 space-y-4">
                              <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                      Pending Review • Video #{video.id}
                                    </span>
                                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-800 text-emerald-300">
                                      {video.viralFormat.replace(/_/g, " ").toUpperCase()}
                                    </span>
                                    {report && (
                                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                                        AI Director Score: {report.overallQualityScore}/100
                                      </span>
                                    )}
                                  </div>
                                  <h4 className="text-lg font-bold text-white">
                                    {video.title}
                                  </h4>
                                  {report && (
                                    <p className="text-xs text-slate-400 mt-0.5">
                                      {report.pacingSummary} • Engine:{" "}
                                      <code className="text-emerald-300">
                                        {report.analysisEngine}
                                      </code>
                                    </p>
                                  )}
                                  {video.declineReason && (
                                    <p className="text-xs text-amber-300 mt-1">
                                      Re-cut applied directive: “{video.declineReason}”
                                    </p>
                                  )}
                                </div>

                                {/* Big 1-Click Approve, Re-Cut to 6.0s Viral Tempo & Decline Buttons */}
                                <div className="flex flex-wrap items-center gap-2.5">
                                  <button
                                    type="button"
                                    disabled={reviewVideoMutation.isPending}
                                    onClick={() =>
                                      reviewVideoMutation.mutate({
                                        id: video.id,
                                        action: "approve",
                                      })
                                    }
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition disabled:opacity-50"
                                  >
                                    <CheckCircle2 className="w-4 h-4" />
                                    ✅ Approve Video
                                  </button>

                                  <button
                                    type="button"
                                    disabled={reviewVideoMutation.isPending}
                                    onClick={() =>
                                      reviewVideoMutation.mutate({
                                        id: video.id,
                                        action: "decline",
                                        declineReason:
                                          "Re-Cut to 6.0s Viral Tempo (2.5s Hook + 3.5s Peak Action)",
                                        pacingMode: "viral_punch",
                                        textStyle,
                                        cleanNoText: textStyle === "none",
                                        regenerate: true,
                                      })
                                    }
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-lg transition disabled:opacity-50"
                                  >
                                    <Zap className="w-4 h-4" />
                                    ⚡ Re-Cut to 6.0s Viral Tempo
                                  </button>

                                  <button
                                    type="button"
                                    disabled={reviewVideoMutation.isPending}
                                    onClick={() =>
                                      reviewVideoMutation.mutate({
                                        id: video.id,
                                        action: "decline",
                                        declineReason: "Re-Cut with Selected Pacing Mode",
                                        pacingMode,
                                        textStyle,
                                        cleanNoText: textStyle === "none",
                                        regenerate: true,
                                      })
                                    }
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 font-bold text-xs transition disabled:opacity-50"
                                  >
                                    <XCircle className="w-4 h-4" />
                                    ❌ Decline &amp; Re-Cut
                                  </button>
                                </div>
                              </div>

                              {/* 1-Click AI Director Re-Cut Feedback Pills */}
                              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3.5">
                                <span className="block text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-2">
                                  1-Click AI Director Re-Cut Directives (Decline &amp; Automatically Re-Render):
                                </span>
                                <div className="flex flex-wrap gap-2">
                                  {[
                                    {
                                      label: "⚡ Re-Cut to 6.0s Viral Tempo (2.5s Hook + 3.5s Peak)",
                                      pacingMode: "viral_punch" as const,
                                      textStyle: "floating_tiktok" as const,
                                      cleanNoText: false,
                                      swapSceneOrder: false,
                                    },
                                    {
                                      label: "Balanced Story Cut (9.0s)",
                                      pacingMode: "balanced_story" as const,
                                      textStyle: "floating_tiktok" as const,
                                      cleanNoText: false,
                                      swapSceneOrder: false,
                                    },
                                    {
                                      label: "Keep Full Clip Length (Don't Cut Early)",
                                      pacingMode: "natural_cinema" as const,
                                      textStyle: "floating_tiktok" as const,
                                      cleanNoText: false,
                                      swapSceneOrder: false,
                                    },
                                    {
                                      label: "Render Clean Video (No Text)",
                                      pacingMode: "viral_punch" as const,
                                      textStyle: "none" as const,
                                      cleanNoText: true,
                                      swapSceneOrder: false,
                                    },
                                    {
                                      label: "Swap Scene Order",
                                      pacingMode: "viral_punch" as const,
                                      textStyle,
                                      cleanNoText: textStyle === "none",
                                      swapSceneOrder: true,
                                    },
                                  ].map((btn) => (
                                    <button
                                      key={btn.label}
                                      type="button"
                                      disabled={reviewVideoMutation.isPending}
                                      onClick={() =>
                                        reviewVideoMutation.mutate({
                                          id: video.id,
                                          action: "decline",
                                          declineReason: btn.label,
                                          pacingMode: btn.pacingMode,
                                          textStyle: btn.textStyle,
                                          cleanNoText: btn.cleanNoText,
                                          swapSceneOrder: btn.swapSceneOrder,
                                          regenerate: true,
                                        })
                                      }
                                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition disabled:opacity-50"
                                    >
                                      <Scissors className="w-3 h-3 text-amber-400" />
                                      {btn.label}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Expandable AI Director Cut Report */}
                              {report && (
                                <div className="bg-slate-950/90 border border-slate-800 rounded-xl overflow-hidden">
                                  <button
                                    type="button"
                                    onClick={() => toggleReportExpand(video.id)}
                                    className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-900/60 transition"
                                  >
                                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                                      <Sparkles className="w-3.5 h-3.5" />
                                      AI Director Scene-by-Scene Cut Report ({report.sceneCuts.length} Scenes Inspected)
                                    </span>
                                    {isExpanded ? (
                                      <ChevronUp className="w-4 h-4 text-slate-400" />
                                    ) : (
                                      <ChevronDown className="w-4 h-4 text-slate-400" />
                                    )}
                                  </button>

                                  {isExpanded && (
                                    <div className="px-4 pb-4 space-y-2.5 border-t border-slate-800/80 pt-3">
                                      {report.sceneCuts.map((cut) => (
                                        <div
                                          key={cut.sceneNumber}
                                          className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 text-xs space-y-1"
                                        >
                                          <div className="flex flex-wrap items-center justify-between gap-2">
                                            <span className="font-bold text-white">
                                              Scene {cut.sceneNumber} ({cut.shotType}) •{" "}
                                              <span className="text-amber-300">
                                                Trimmed {cut.trimStartSec}s–{cut.trimEndSec}s ({cut.keptDurationSec}s kept)
                                              </span>
                                            </span>
                                            <div className="flex items-center gap-2">
                                              <span className="px-2 py-0.5 rounded bg-sky-500/15 text-sky-300 font-semibold text-[11px]">
                                                Text Safe Zone: {cut.textSafeZone.toUpperCase()}
                                              </span>
                                              <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-semibold text-[11px]">
                                                PASS ({cut.qualityScore}/100)
                                              </span>
                                            </div>
                                          </div>
                                          <p className="text-slate-300">
                                            {cut.actionPeakReason}
                                          </p>
                                          <p className="text-slate-400 text-[11px]">
                                            Glitch Check: {cut.glitchNotes}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Caption Preview + Copy */}
                              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3.5">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
                                    Ready-to-Post Caption
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      copyToClipboard(
                                        video.caption,
                                        `video-${video.id}-caption`,
                                        "Video Caption"
                                      )
                                    }
                                    className="inline-flex items-center gap-1 text-xs font-semibold text-sky-400 hover:text-sky-300"
                                  >
                                    {copiedKey === `video-${video.id}-caption` ? (
                                      <Check className="w-3.5 h-3.5" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5" />
                                    )}
                                    Copy Caption
                                  </button>
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                  {video.caption}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* SECTION B: APPROVED & READY TO POST */}
                <div className="space-y-4 pt-6 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      Approved &amp; Ready to Post ({approvedVideos.length})
                    </h3>
                    <span className="text-xs text-slate-400">
                      Download <code>.MP4</code> + Copy Caption for manual posting, or click{" "}
                      <strong>Send to Auto-Poster</strong>
                    </span>
                  </div>

                  {approvedVideos.length === 0 ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-400 text-sm">
                      No approved videos yet. Click <strong>✅ Approve Video</strong> above to move a video here.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {approvedVideos.map((video) => (
                        <div
                          key={video.id}
                          className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-5 flex flex-col sm:flex-row gap-5 items-start"
                        >
                          <div className="w-full sm:w-40 aspect-[9/16] rounded-xl overflow-hidden border border-slate-700 bg-black shrink-0">
                            <video
                              src={video.videoUrl}
                              controls
                              playsInline
                              preload="metadata"
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 space-y-3">
                            <div>
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-1">
                                {video.status === "published"
                                  ? "🚀 Published"
                                  : "✅ Approved & Ready"}
                              </span>
                              <h4 className="text-base font-bold text-white">
                                {video.title}
                              </h4>
                              <p className="text-xs text-slate-400 mt-1 line-clamp-3">
                                {video.caption}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-2">
                              <a
                                href={video.videoUrl}
                                download
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
                              >
                                <Download className="w-3.5 h-3.5" />
                                Download .MP4
                              </a>

                              <button
                                type="button"
                                onClick={() =>
                                  copyToClipboard(
                                    video.caption,
                                    `approved-${video.id}-caption`,
                                    "Approved Video Caption"
                                  )
                                }
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition"
                              >
                                {copiedKey === `approved-${video.id}-caption` ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                                Copy Caption
                              </button>

                              <button
                                type="button"
                                disabled={publishVideoMutation.isPending}
                                onClick={() => publishVideoMutation.mutate(video.id)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition disabled:opacity-50"
                              >
                                <Send className="w-3.5 h-3.5" />
                                Send to Auto-Poster
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {declinedVideos.length > 0 && (
                    <p className="text-xs text-slate-500 pt-2">
                      Declined archive: {declinedVideos.length} video(s).
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* ============================================================
            TAB 3: LIVE TWO-WAY DM & EMAIL CLOSER SIMULATOR
        ============================================================ */}
        {activeTab === "simulator" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Interactive Tester */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Interactive Closer Sandbox
                </span>
                <h2 className="text-xl font-bold text-white mt-0.5">
                  Test Two-Way Comment, DM &amp; Inbound Email Replies Live
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Simulates real prospects commenting <code>RESET</code> on Reels, asking about Keto/6am schedules in Instagram DMs, or replying with schedule objections via email.
                </p>
              </div>

              {/* Quick Scenario Presets */}
              <div>
                <p className="text-xs font-semibold text-slate-300 mb-2">
                  1-Click Scenario Presets:
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSimChannel("comment");
                      setSimPlatform("tiktok");
                      setSimSender("@marcus_exec");
                      setSimMessage("RESET");
                    }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 transition"
                  >
                    TikTok Comment: “RESET”
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSimChannel("dm");
                      setSimPlatform("instagram");
                      setSimSender("@elena_founder");
                      setSimMessage("Does this work if I wake up at 6am and eat keto?");
                    }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 transition"
                  >
                    IG DM: “Wake at 6am &amp; eat keto?”
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSimChannel("email");
                      setSimSender("david.vp@enterprise.com");
                      setSimSubject("What if I fall behind schedule?");
                      setSimMessage(
                        "What if I get stuck in meetings and fall behind schedule? Every 30-day PDF I bought failed on day 2."
                      );
                    }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition"
                  >
                    Inbound Email: “Stuck in meetings / fall behind?”
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSimChannel("dm");
                      setSimPlatform("instagram");
                      setSimSender("@sarah_cfo");
                      setSimMessage(
                        "Is the $19 a monthly subscription or one-time? And what is the $12 workday add-on?"
                      );
                    }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700 transition"
                  >
                    Pricing &amp; Guarantee Question
                  </button>
                </div>
              </div>

              {/* Channel & Sender Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Trigger Channel
                  </label>
                  <select
                    value={simChannel}
                    onChange={(e) => setSimChannel(e.target.value as any)}
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-white"
                  >
                    <option value="comment">Social Comment (“RESET”)</option>
                    <option value="dm">Instagram / TikTok DM</option>
                    <option value="email">Inbound Customer Email</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Platform
                  </label>
                  <select
                    value={simPlatform}
                    onChange={(e) => setSimPlatform(e.target.value as any)}
                    disabled={simChannel === "email"}
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-white disabled:opacity-50"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Sender Handle / Email
                  </label>
                  <input
                    type="text"
                    value={simSender}
                    onChange={(e) => setSimSender(e.target.value)}
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>

              {simChannel === "email" && (
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Email Subject Line
                  </label>
                  <input
                    type="text"
                    value={simSubject}
                    onChange={(e) => setSimSubject(e.target.value)}
                    className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Inbound Prospect Message
                </label>
                <textarea
                  rows={3}
                  value={simMessage}
                  onChange={(e) => setSimMessage(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-sm text-white"
                />
              </div>

              <button
                type="button"
                onClick={() => simulateReplyMutation.mutate()}
                disabled={simulateReplyMutation.isPending}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {simulateReplyMutation.isPending
                  ? "Generating Autonomous Reply..."
                  : "Run Autonomous Closer & Log Interaction"}
              </button>

              {/* Generated Result Box */}
              {lastSimResult && (
                <div className="bg-slate-950 border border-emerald-500/40 rounded-xl p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Closer Output • Intent: {lastSimResult.detectedIntent}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {lastSimResult.aiGenerated
                        ? "Gemini 3.8 Flash + Brand Guardrails"
                        : "Deterministic High-Trust Closer Engine"}
                    </span>
                  </div>

                  {lastSimResult.publicCommentReply && simChannel === "comment" && (
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                      <p className="font-semibold text-amber-400 mb-1">
                        Public Comment Auto-Reply:
                      </p>
                      <p className="text-slate-200">{lastSimResult.publicCommentReply}</p>
                    </div>
                  )}

                  <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-xs space-y-1.5">
                    <p className="font-semibold text-emerald-300">
                      {simChannel === "email"
                        ? `Outbound Email Reply (${lastSimResult.replySubject}):`
                        : "Direct Message (DM) Closer Reply:"}
                    </p>
                    <p className="text-slate-100 whitespace-pre-wrap leading-relaxed">
                      {lastSimResult.replyText}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <span>
                      Target Funnel URL:{" "}
                      <strong className="text-emerald-400">
                        {lastSimResult.suggestedUrl}
                      </strong>
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          lastSimResult.replyText,
                          "sim-reply",
                          "Agent Reply"
                        )
                      }
                      className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Copy Reply
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Recent Agent Interactions Log */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                    Audit Log
                  </span>
                  <h3 className="text-base font-bold text-white">
                    Recent Autonomous Interactions ({overview?.interactions?.length || 0})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => refetchOverview()}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title="Refresh interactions"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 overflow-y-auto max-h-[540px] pr-1">
                {!overview?.interactions?.length ? (
                  <p className="text-xs text-slate-400 py-8 text-center">
                    No interactions logged yet. Click “Run Autonomous Closer” on the left to test!
                  </p>
                ) : (
                  overview.interactions.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded font-semibold uppercase text-[10px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          {item.channel}
                        </span>
                        <span className="text-slate-400 font-mono text-[11px]">
                          {item.senderIdentifier}
                        </span>
                      </div>
                      {item.inboundMessage && (
                        <p className="text-slate-400">
                          <strong className="text-slate-300">Inbound:</strong>{" "}
                          {item.inboundMessage}
                        </p>
                      )}
                      <p className="text-slate-200 line-clamp-3">
                        <strong className="text-emerald-400">Agent:</strong>{" "}
                        {item.agentReply}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 3: AUTONOMOUS 4-STAGE EMAIL NURTURE QUEUE
        ============================================================ */}
        {activeTab === "nurture" && (
          <div className="space-y-6">
            {/* Live Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Total Enrolled Leads</span>
                  <Users className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-2xl font-bold text-white mt-1">
                  {overview?.stats?.totalLeads ?? 0}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  From /quiz, abandoned checkout &amp; waitlist
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Active in 4-Stage Sequence</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-2xl font-bold text-amber-300 mt-1">
                  {overview?.stats?.activeInSequence ?? 0}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Checked every 5 mins by background worker
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Converted Buyers (Auto-Stopped)</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-2xl font-bold text-emerald-400 mt-1">
                  {overview?.stats?.convertedBuyers ?? 0}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Automatically exits nurture upon purchase
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Manual Queue Trigger</span>
                  <Play className="w-4 h-4 text-sky-400" />
                </div>
                <button
                  type="button"
                  onClick={() => processDueMutation.mutate()}
                  disabled={processDueMutation.isPending}
                  className="mt-2 w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition"
                >
                  {processDueMutation.isPending
                    ? "Processing..."
                    : "Process Due Emails Now"}
                </button>
              </div>
            </div>

            {/* Sequence Previewer + Test Sender */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Dynamic Personalization Controls
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    Customize &amp; Test the 4-Stage Sequence
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Overwhelm Archetype
                    </label>
                    <select
                      value={previewArchetype}
                      onChange={(e) => setPreviewArchetype(e.target.value)}
                      className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
                    >
                      <option value="cortisol_spiked">Cortisol-Spiked High Performer</option>
                      <option value="dopamine_depleted">Dopamine-Depleted Multitasker</option>
                      <option value="metabolic_crasher">Metabolic Midday Crasher</option>
                      <option value="systemic_burnout">Systemic Burnout Recovery</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Target Wake Time
                    </label>
                    <select
                      value={previewWake}
                      onChange={(e) => setPreviewWake(e.target.value)}
                      className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
                    >
                      <option value="06:00">06:00 AM Wake Anchor</option>
                      <option value="07:00">07:00 AM Wake Anchor</option>
                      <option value="08:00">08:00 AM Wake Anchor</option>
                      <option value="09:00">09:00 AM Wake Anchor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Nutrition Track
                    </label>
                    <select
                      value={previewDiet}
                      onChange={(e) => setPreviewDiet(e.target.value)}
                      className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
                    >
                      <option value="omni">Omnivore Reset Track</option>
                      <option value="veg">Vegetarian Reset Track</option>
                      <option value="keto">Keto / Low-Carb Track</option>
                      <option value="paleo">Paleo / Ancestral Track</option>
                      <option value="vegan">100% Plant-Based Vegan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Past Blocker Objection
                    </label>
                    <select
                      value={previewBlocker}
                      onChange={(e) => setPreviewBlocker(e.target.value)}
                      className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
                    >
                      <option value="ran_late">Meetings / Morning Ran Late</option>
                      <option value="too_rigid">Routine Felt Too Rigid</option>
                      <option value="quit_30_day">Quit 30-Day Challenge by Day 4</option>
                      <option value="meal_prep">Complicated Meal Prep</option>
                    </select>
                  </div>
                </div>

                {/* Stage Selector */}
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    Select Sequence Stage to Preview:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { stage: 1 as const, label: "Email 1 • Immediate Blueprint" },
                      { stage: 2 as const, label: "Email 2 • +24h BMW Story" },
                      { stage: 3 as const, label: "Email 3 • +48h Diet & 2h Triage" },
                      { stage: 4 as const, label: "Email 4 • +72h Sunday Invite" },
                    ].map((st) => (
                      <button
                        key={st.stage}
                        type="button"
                        onClick={() => setSelectedStage(st.stage)}
                        className={`p-2.5 rounded-xl text-left text-xs font-semibold border transition ${
                          selectedStage === st.stage
                            ? "bg-emerald-500/20 border-emerald-400 text-emerald-200"
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Send Test Sequence Form */}
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <p className="text-xs font-semibold text-slate-200">
                    Enroll &amp; Dispatch Next Sequence Email Now:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={testFirstNameInput}
                      onChange={(e) => setTestFirstNameInput(e.target.value)}
                      className="rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={testEmailInput}
                      onChange={(e) => setTestEmailInput(e.target.value)}
                      className="sm:col-span-2 rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => sendTestNurtureMutation.mutate()}
                    disabled={sendTestNurtureMutation.isPending}
                    className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition"
                  >
                    {sendTestNurtureMutation.isPending
                      ? "Sending Test Sequence Email..."
                      : "Send / Advance Test Sequence Email (+1 Stage)"}
                  </button>
                </div>
              </div>

              {/* Right Column: Rendered HTML Email Preview */}
              <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                {activeEmailPreview ? (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                          Stage {activeEmailPreview.stage} of 4 ({activeEmailPreview.delayLabel})
                        </span>
                        <h4 className="text-sm sm:text-base font-bold text-white mt-0.5">
                          Subject: {activeEmailPreview.subject}
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(
                            activeEmailPreview.html,
                            `email-html-${activeEmailPreview.stage}`,
                            "Email HTML"
                          )
                        }
                        className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        Copy HTML
                      </button>
                    </div>

                    <div
                      className="bg-white text-slate-900 rounded-xl overflow-hidden shadow-inner max-h-[500px] overflow-y-auto"
                      dangerouslySetInnerHTML={{ __html: activeEmailPreview.html }}
                    />
                  </>
                ) : (
                  <p className="text-xs text-slate-400 py-12 text-center">
                    Loading email preview...
                  </p>
                )}
              </div>
            </div>

            {/* Enrolled Leads Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-base font-bold text-white mb-4">
                Live Enrolled Leads in <code>agent_leads</code> ({overview?.leads?.length || 0})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-2.5 pr-4">Email</th>
                      <th className="py-2.5 pr-4">Source</th>
                      <th className="py-2.5 pr-4">Archetype</th>
                      <th className="py-2.5 pr-4">Wake / Diet</th>
                      <th className="py-2.5 pr-4">Nurture Stage</th>
                      <th className="py-2.5 pr-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!overview?.leads?.length ? (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-slate-400">
                          No leads in queue yet. Complete the 60s Quiz with an email or click “Send / Advance Test Sequence Email” above!
                        </td>
                      </tr>
                    ) : (
                      overview.leads.map((lead) => (
                        <tr key={lead.id} className="border-b border-slate-800/60">
                          <td className="py-2.5 pr-4 font-medium text-white">
                            {lead.firstName ? `${lead.firstName} (${lead.email})` : lead.email}
                          </td>
                          <td className="py-2.5 pr-4 text-slate-300">{lead.source}</td>
                          <td className="py-2.5 pr-4 text-emerald-300 font-mono">
                            {lead.archetypeId}
                          </td>
                          <td className="py-2.5 pr-4 text-slate-300">
                            {lead.wakeTime} • {lead.foodPreference.toUpperCase()}
                          </td>
                          <td className="py-2.5 pr-4">
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-semibold">
                              Stage {lead.nurtureStage} / 4
                            </span>
                          </td>
                          <td className="py-2.5 pr-4">
                            {lead.hasPurchased ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                                Purchased ($19/$31)
                              </span>
                            ) : lead.unsubscribed ? (
                              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                                Unsubscribed
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                                Active Nurture
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 4: WEBHOOK & SOCIAL AUTOMATION CONNECTION GUIDE
        ============================================================ */}
        {activeTab === "webhooks" && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Zero-Code External Wiring
                </span>
                <h2 className="text-xl font-bold text-white mt-0.5">
                  Live Production Webhook Endpoints
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Connect ManyChat (for Instagram &amp; TikTok Comment-to-DM closing) and SendGrid Inbound Parse (for two-way customer email replies) directly to your Perfect Day Reset backend.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    key: "wh-dm",
                    method: "POST",
                    title: "Social Comment & DM Closer Webhook (ManyChat / IG / TikTok)",
                    url: `${originUrl}/api/agent/dm-reply`,
                    desc: 'Accepts { "platform": "instagram", "handle": "@user", "message": "RESET", "triggerType": "comment" } and returns { replyText, publicCommentReply, dmFollowUp, suggestedUrl }.',
                  },
                  {
                    key: "wh-email",
                    method: "POST",
                    title: "Inbound Email Two-Way Closer Webhook (SendGrid / Postmark)",
                    url: `${originUrl}/api/agent/inbound-email`,
                    desc: 'Accepts { "from": "prospect@domain.com", "subject": "...", "text": "..." }, generates an objection-handling reply, and sends it via SendGrid.',
                  },
                  {
                    key: "wh-flow",
                    method: "GET",
                    title: "Google Flow Ultra 9:16 Video Batch JSON Feed",
                    url: `${originUrl}/api/agent/flow-ultra-batch`,
                    desc: "Returns all 12 archetype 35mm documentary video prompts, timed hooks, captions, and ManyChat automation config.",
                  },
                  {
                    key: "wh-brief",
                    method: "GET",
                    title: "AI Marketing Agent Brand & Offer Knowledge Feed",
                    url: `${originUrl}/api/marketing/agent-brief`,
                    desc: "Structured JSON source of truth for external AI agents ($19 core offer, +$12 order bump, 4 archetypes, founder credentials).",
                  },
                ].map((ep) => (
                  <div
                    key={ep.key}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {ep.method}
                        </span>
                        <h3 className="text-sm font-bold text-white">{ep.title}</h3>
                      </div>
                      <p className="text-xs text-slate-400">{ep.desc}</p>
                    </div>

                    <div className="flex items-center justify-between gap-2 bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
                      <code className="text-xs text-emerald-300 truncate">{ep.url}</code>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(ep.url, ep.key, ep.title)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-200 hover:text-emerald-300 shrink-0"
                      >
                        {copiedKey === ep.key ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        Copy URL
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-slate-300 space-y-1.5">
                <p className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Optional Security Header &amp; Gemini Enhancement
                </p>
                <p>
                  • Set <code>GEMINI_API_KEY</code> in your environment variables to enable live Gemini 3.8 Flash synthesis on top of our deterministic closer engine.
                </p>
                <p>
                  • Set <code>AGENT_WEBHOOK_SECRET</code> in your environment variables if you want external webhooks to require an <code>X-Agent-Secret</code> header.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
