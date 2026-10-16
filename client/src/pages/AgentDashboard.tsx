import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
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
} from "lucide-react";

interface FlowUltraPackage {
  id: string;
  archetypeId: string;
  archetypeName: string;
  angleTitle: string;
  durationSeconds: number;
  aspectRatio: string;
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

interface FlowUltraBatchResponse {
  totalPackages: number;
  productionSpecs: {
    model: string;
    aspectRatio: string;
    cameraAesthetic: string;
    conversionFlow: string;
  };
  manyChatAutomationConfig: Record<string, unknown>;
  packages: FlowUltraPackage[];
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
  const [activeTab, setActiveTab] = useState<
    "flow-ultra" | "simulator" | "nurture" | "webhooks"
  >("flow-ultra");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Tab 1 state
  const [archetypeFilter, setArchetypeFilter] = useState<string>("all");

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

  const { data: flowBatch, isLoading: loadingFlow } = useQuery<FlowUltraBatchResponse>({
    queryKey: ["/api/agent/flow-ultra-batch"],
  });

  const {
    data: overview,
    isLoading: loadingOverview,
    refetch: refetchOverview,
  } = useQuery<AgentOverviewResponse>({
    queryKey: [
      `/api/agent/overview?archetype=${previewArchetype}&wake=${previewWake}&diet=${previewDiet}&blocker=${previewBlocker}`,
    ],
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

  const simulateReplyMutation = useMutation({
    mutationFn: async () => {
      if (simChannel === "email") {
        const res = await fetch("/api/agent/inbound-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Agent-Simulator": "true",
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

  const filteredPackages = (flowBatch?.packages || []).filter(
    (pkg) => archetypeFilter === "all" || pkg.archetypeId === archetypeFilter
  );

  const activeEmailPreview =
    overview?.emailSequencePreview?.find((e) => e.stage === selectedStage) ||
    overview?.emailSequencePreview?.[0];

  const originUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://perfectdayreset.com";

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
                  Autonomous AI Growth &amp; Closer Command Center
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Google Flow Ultra 9:16 Studio • Two-Way DM &amp; Email Closer • 4-Stage Archetype Email Nurture
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
            <Video className="w-4 h-4" />
            1. Google Flow Ultra Content Studio (12 Reels)
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
            2. Live Two-Way DM &amp; Email Closer Simulator
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
            3. Autonomous 4-Stage Email Nurture Queue
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
            4. Webhook &amp; ManyChat Connection Guide
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* ============================================================
            TAB 1: GOOGLE FLOW ULTRA CONTENT STUDIO
        ============================================================ */}
        {activeTab === "flow-ultra" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                    <Film className="w-3.5 h-3.5" />
                    Google Flow Ultra 9:16 Vertical Production Pack
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    12 Ready-to-Generate Documentary Reels (3 Per Overwhelm Archetype)
                  </h2>
                  <p className="text-sm text-slate-300 mt-1 max-w-3xl">
                    Every prompt is engineered for <strong>organic 35mm handheld documentary cinematography</strong>, natural morning or golden-hour window lighting, subtle film grain, shallow depth of field, and tactile real-world textures (linen, ceramic, condensation on glass, warm wood) with zero plastic/CGI look.
                  </p>
                </div>

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
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shrink-0 shadow-lg shadow-emerald-950/50 transition"
                  >
                    {copiedKey === "manychat-json" ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    Copy ManyChat Automation JSON
                  </button>
                )}
              </div>

              {/* Archetype Filter Pills */}
              <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-slate-800">
                {[
                  { id: "all", label: "All 12 Video Packages" },
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
            </div>

            {loadingFlow ? (
              <div className="text-center py-12 text-slate-400">
                Loading Google Flow Ultra packages...
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredPackages.map((pkg, idx) => (
                  <div
                    key={pkg.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 mb-1.5">
                            Reel #{idx + 1} • {pkg.archetypeName}
                          </span>
                          <h3 className="text-base font-bold text-white">
                            {pkg.angleTitle}
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {pkg.aspectRatio} Vertical ({pkg.durationSeconds}s) • {pkg.cameraSpec}
                          </p>
                        </div>
                      </div>

                      {/* Flow Ultra Cinematography Prompt */}
                      <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3.5">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                            1. Google Flow Ultra Video Prompt
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              copyToClipboard(
                                pkg.flowUltraPrompt,
                                `${pkg.id}-prompt`,
                                "Flow Ultra Prompt"
                              )
                            }
                            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                          >
                            {copiedKey === `${pkg.id}-prompt` ? (
                              <Check className="w-3.5 h-3.5" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            Copy Prompt
                          </button>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed font-mono">
                          {pkg.flowUltraPrompt}
                        </p>
                      </div>

                      {/* Timed On-Screen Text Hooks */}
                      <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3.5">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                            2. Timed On-Screen Text Overlay
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              copyToClipboard(
                                `[0-3s Hook]: ${pkg.onScreenTextHook.hook0to3s}\n[3-8s Payoff]: ${pkg.onScreenTextHook.payoff3to8s}\n[End Card]: ${pkg.onScreenTextHook.ctaEndCard}`,
                                `${pkg.id}-hook`,
                                "On-Screen Text Hook"
                              )
                            }
                            className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300"
                          >
                            {copiedKey === `${pkg.id}-hook` ? (
                              <Check className="w-3.5 h-3.5" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            Copy Hooks
                          </button>
                        </div>
                        <div className="space-y-1 text-xs">
                          <p className="text-white">
                            <span className="text-amber-400 font-semibold">0–3s Hook:</span>{" "}
                            “{pkg.onScreenTextHook.hook0to3s}”
                          </p>
                          <p className="text-slate-300">
                            <span className="text-emerald-400 font-semibold">3–8s Payoff:</span>{" "}
                            “{pkg.onScreenTextHook.payoff3to8s}”
                          </p>
                          <p className="text-slate-400">
                            <span className="text-sky-400 font-semibold">CTA Overlay:</span>{" "}
                            {pkg.onScreenTextHook.ctaEndCard}
                          </p>
                        </div>
                      </div>

                      {/* Founder Caption */}
                      <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3.5">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
                            3. Founder-Voice Caption (Ends with “Comment RESET”)
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              copyToClipboard(
                                pkg.caption,
                                `${pkg.id}-caption`,
                                "Caption"
                              )
                            }
                            className="inline-flex items-center gap-1 text-xs font-semibold text-sky-400 hover:text-sky-300"
                          >
                            {copiedKey === `${pkg.id}-caption` ? (
                              <Check className="w-3.5 h-3.5" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            Copy Caption
                          </button>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {pkg.caption}
                        </p>
                      </div>
                    </div>

                    {/* Comment Auto-Reply + DM Opener */}
                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-slate-400 truncate">
                        DM Closer: “{pkg.dmOpeningMessage.slice(0, 68)}...”
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
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 shrink-0"
                      >
                        {copiedKey === `${pkg.id}-dm` ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        Copy DM Closer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================
            TAB 2: LIVE TWO-WAY DM & EMAIL CLOSER SIMULATOR
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
