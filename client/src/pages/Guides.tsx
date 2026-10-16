import { Link } from "wouter";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { SEO_GUIDES } from "@shared/seo-guides";
import { Button } from "@/components/ui/button";
import {
  Clock,
  ArrowRight,
  Sparkles,
  BookOpen,
  ShieldCheck,
  CheckCircle2,
  Zap,
} from "lucide-react";

export default function Guides() {
  const collectionSchemas = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "24-Hour Burnout, Cortisol & Nervous System Reset Guides | Perfect Day Reset",
      description:
        "Science-backed, hour-by-hour protocols for reversing executive burnout, morning cortisol spikes, 3 PM afternoon brain fog, and tired-but-wired evening insomnia.",
      url: "https://perfectdayreset.com/guides",
      mainEntity: {
        "@type": "ItemList",
        itemListElement: SEO_GUIDES.map((g, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          url: `https://perfectdayreset.com/guides/${g.slug}`,
          name: g.title,
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://perfectdayreset.com/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Reset Guides",
          item: "https://perfectdayreset.com/guides",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <SEOHead
        title="24-Hour Burnout, Cortisol & Energy Reset Guides | Perfect Day Reset"
        description="Actionable, science-backed guides by Reiko Kevvai on 24-hour burnout recovery, morning cortisol hydration reset, stopping 3 PM afternoon crashes, and evening nervous system decompression."
        canonical="https://perfectdayreset.com/guides"
        ogTitle="24-Hour Burnout, Cortisol & Energy Reset Guides | Perfect Day Reset"
        ogDescription="Step-by-step neuro-biological protocols for high performers: fix morning fatigue, 3 PM brain fog, tired-but-wired nights, and chaotic workdays."
        ogImage="https://perfectdayreset.com/og-image.png"
        customSchemas={collectionSchemas}
      />

      <NavBar />

      <main className="flex-grow pt-24 pb-20">
        {/* Hero Header */}
        <section className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-900 text-white py-16 md:py-20">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
              <BookOpen className="h-3.5 w-3.5" />
              Science-Backed Executive Protocols
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight mb-5">
              The 24-Hour Burnout, Cortisol &amp; Nervous System Reset Library
            </h1>
            <p className="text-lg md:text-xl text-emerald-100/90 max-w-3xl leading-relaxed mb-8">
              Written for high-responsibility executives, founders, and professionals who cannot afford a 30-day retreat. Explore our 5 pillar protocols covering morning cortisol-hydration sequencing, midday glycemic focus, evening vagal decompression, and the 2-hour emergency workday rescue.
            </p>

            {/* Author & Quick Diagnostic Banner */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-wider text-emerald-300 font-semibold mb-1">
                  Not sure which protocol fits your current bottleneck?
                </p>
                <p className="text-base md:text-lg font-bold text-white">
                  Take the Free 60-Second Overwhelm Archetype Diagnostic
                </p>
                <p className="text-sm text-emerald-100/80 mt-0.5">
                  Identify whether you are Cortisol-Spiked, a Metabolic Crasher, Dopamine-Depleted, or in Systemic Burnout.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Link href="/quiz">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-full shadow-lg">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Take 60s Diagnostic Quiz
                  </Button>
                </Link>
                <Link href="/checkout">
                  <Button
                    variant="outline"
                    className="border-white/30 bg-white/5 hover:bg-white/15 text-white font-semibold px-5 py-2.5 rounded-full"
                  >
                    Full 24-Hour Reset — $19
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Pillar Guides Grid */}
        <section className="container px-4 md:px-6 max-w-5xl mx-auto py-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                5 Complete Biological Reset Protocols
              </h2>
              <p className="text-slate-600 mt-1">
                Authored by Reiko Kevvai (Ex Head of Sales for Inchcape Motors BMW &amp; Founder of Perfect Day Reset)
              </p>
            </div>
            <div className="text-sm text-emerald-700 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" />
              Peer-reviewed circadian &amp; metabolic principles
            </div>
          </div>

          <div className="space-y-8">
            {SEO_GUIDES.map((guide, index) => (
              <article
                key={guide.slug}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                <div className="p-6 md:p-8">
                  <div className="flex flex-wrap items-center gap-2.5 mb-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      Protocol 0{index + 1} · {guide.categoryBadge}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                      Target: {guide.archetypeLabel}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium ml-auto">
                      <Clock className="h-3.5 w-3.5" />
                      {guide.readTimeMinutes} min read
                    </span>
                  </div>

                  <Link href={`/guides/${guide.slug}`}>
                    <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 hover:text-emerald-700 transition-colors cursor-pointer mb-2.5 leading-snug">
                      {guide.title}
                    </h3>
                  </Link>

                  <p className="text-slate-600 text-base leading-relaxed mb-5">
                    {guide.heroSummary}
                  </p>

                  {/* Mini Protocol Preview Table */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-6">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
                      <Zap className="h-3.5 w-3.5 text-emerald-600" />
                      Key Protocol Checkpoints Inside This Guide:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {guide.quickProtocolSummary.slice(0, 4).map((step, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200/70"
                        >
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-slate-900">{step.timeWindow}: </span>
                            <span>{step.action}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
                    <div className="flex flex-wrap gap-1.5">
                      {guide.targetKeywords.slice(0, 3).map((kw, i) => (
                        <span
                          key={i}
                          className="text-[11px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md font-medium"
                        >
                          #{kw}
                        </span>
                      ))}
                    </div>

                    <Link href={`/guides/${guide.slug}`}>
                      <Button className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-full px-5 py-2 text-sm">
                        Read Complete Protocol
                        <ArrowRight className="h-4 w-4 ml-1.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Bottom Conversion Card */}
          <div className="mt-14 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-8 md:p-10 text-white shadow-xl">
            <div className="max-w-3xl">
              <span className="inline-block bg-orange-500 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
                Interactive Web Companion + Printable Blueprint
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
                Stop Reading Static Checklists. Run the Live 24-Hour Protocol Today.
              </h2>
              <p className="text-emerald-100 text-base md:text-lg leading-relaxed mb-6">
                Get instant access to the interactive Perfect Day Reset Web Companion with our 1-Tap Delay Rescheduler (+15m/+30m/+60m), 5 customizable nutrition tracks (Omnivore, Vegetarian, Keto, Paleo, Vegan), guided breathwork timers, and cognitive offload journal for a one-time $19 payment.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link href="/checkout">
                  <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold px-7 py-3 rounded-full text-base shadow-lg">
                    Start the Full 24-Hour Reset — $19
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/quiz">
                  <Button
                    variant="outline"
                    className="border-white/30 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-full text-base"
                  >
                    Take the Free 60-Second Diagnostic
                  </Button>
                </Link>
              </div>
              <p className="text-xs text-emerald-200/80 mt-4">
                Backed by our 14-Day 100% Money-Back Guarantee · Instant Digital Access · No Subscription
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
