import { Link, useRoute } from "wouter";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { SEO_GUIDES, getGuideBySlug } from "@shared/seo-guides";
import { Button } from "@/components/ui/button";
import {
  Clock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  BookOpen,
  ShieldCheck,
  HelpCircle,
  Zap,
  Award,
} from "lucide-react";

export default function GuideArticle() {
  const [, params] = useRoute("/guides/:slug");
  const slug = params?.slug || "";
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
        <NavBar />
        <main className="flex-grow pt-32 pb-20 container px-4 max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Protocol Guide Not Found</h1>
          <p className="text-slate-600 mb-8">
            The reset guide you are looking for may have moved. Explore our complete library of 24-hour burnout and nervous system protocols below.
          </p>
          <Link href="/guides">
            <Button className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-full px-6 py-3">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Browse All 5 Reset Guides
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const canonicalUrl = `https://perfectdayreset.com/guides/${guide.slug}`;
  const relatedGuides = guide.relatedSlugs
    .map((s) => getGuideBySlug(s))
    .filter((g): g is NonNullable<typeof g> => Boolean(g));

  const articleSchemas = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: guide.title,
      description: guide.metaDescription,
      image: ["https://perfectdayreset.com/og-image.png"],
      datePublished: guide.publishedDate,
      dateModified: guide.updatedDate,
      author: {
        "@type": "Person",
        name: "Reiko Kevvai",
        jobTitle: "Founder of Perfect Day Reset, Ex Head of Sales for Inchcape Motors BMW",
        url: "https://perfectdayreset.com/about",
      },
      publisher: {
        "@type": "Organization",
        name: "Perfect Day Reset",
        logo: {
          "@type": "ImageObject",
          url: "https://perfectdayreset.com/logo.png",
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": canonicalUrl,
      },
      keywords: guide.targetKeywords.join(", "),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: guide.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
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
        {
          "@type": "ListItem",
          position: 3,
          name: guide.title,
          item: canonicalUrl,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <SEOHead
        title={guide.metaTitle}
        description={guide.metaDescription}
        canonical={canonicalUrl}
        ogTitle={guide.metaTitle}
        ogDescription={guide.metaDescription}
        ogImage="https://perfectdayreset.com/og-image.png"
        twitterTitle={guide.metaTitle}
        twitterDescription={guide.metaDescription}
        customSchemas={articleSchemas}
      />

      <NavBar />

      <main className="flex-grow pt-24 pb-20">
        {/* Article Header */}
        <header className="bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 text-white py-14 md:py-18">
          <div className="container px-4 md:px-6 max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="text-xs text-emerald-200/80 mb-5 flex flex-wrap items-center gap-2">
              <Link href="/" className="hover:text-white underline-offset-2 hover:underline">
                Home
              </Link>
              <span>/</span>
              <Link href="/guides" className="hover:text-white underline-offset-2 hover:underline">
                Reset Guides
              </Link>
              <span>/</span>
              <span className="text-white font-medium truncate max-w-xs sm:max-w-md">
                {guide.categoryBadge}
              </span>
            </nav>

            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 border border-emerald-400/30 text-emerald-200">
                {guide.categoryBadge}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/20 border border-orange-400/30 text-orange-200">
                Archetype: {guide.archetypeLabel}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-emerald-200/80 font-medium">
                <Clock className="h-3.5 w-3.5" />
                {guide.readTimeMinutes} min read
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight mb-5">
              {guide.title}
            </h1>

            <p className="text-lg md:text-xl text-emerald-100/90 leading-relaxed mb-8">
              {guide.heroSummary}
            </p>

            {/* Author Byline Card */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-full bg-emerald-600/40 border border-emerald-400/40 flex items-center justify-center font-extrabold text-lg text-white shrink-0">
                  RK
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm md:text-base">
                      By Reiko Kevvai
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-500/30 text-emerald-100 px-2 py-0.5 rounded-full font-semibold">
                      <Award className="h-3 w-3" /> Verified Protocol Author
                    </span>
                  </div>
                  <p className="text-xs text-emerald-100/80 mt-0.5">
                    Ex Head of Sales for Inchcape Motors BMW · Founder of Perfect Day Reset
                  </p>
                </div>
              </div>
              <div className="text-xs text-emerald-200/80 sm:text-right">
                <div>Last Updated: {guide.updatedDate}</div>
                <div className="text-emerald-300 font-medium">Evidence-Based Protocol</div>
              </div>
            </div>
          </div>
        </header>

        {/* Article Body */}
        <article className="container px-4 md:px-6 max-w-4xl mx-auto py-12">
          {/* Quick Protocol Summary Box (Optimized for Featured Snippets & AI Overviews) */}
          <section
            aria-label="Quick Protocol Summary"
            className="bg-white rounded-2xl border-2 border-emerald-600/20 shadow-sm p-6 md:p-8 mb-10"
          >
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm uppercase tracking-wider mb-2">
              <Zap className="h-4 w-4 text-emerald-600" />
              Executive Protocol Summary (At-a-Glance Schedule)
            </div>
            <p className="text-sm text-slate-600 mb-5">
              Need the immediate biological sequence? Follow this exact chronological protocol to reset your{" "}
              <strong className="text-slate-900">{guide.archetypeLabel}</strong> pattern today:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                    <th className="py-3 px-4 font-bold">Timing Window</th>
                    <th className="py-3 px-4 font-bold">Core Protocol Action</th>
                    <th className="py-3 px-4 font-bold">Neuro-Biological Mechanism</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/80">
                  {guide.quickProtocolSummary.map((row, idx) => (
                    <tr key={idx} className="hover:bg-emerald-50/40">
                      <td className="py-3 px-4 font-bold text-emerald-800 whitespace-nowrap">
                        {row.timeWindow}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {row.action}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{row.mechanism}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Table of Contents */}
          <nav
            aria-label="Table of Contents"
            className="bg-slate-100/80 rounded-2xl p-5 md:p-6 border border-slate-200/80 mb-10"
          >
            <div className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-emerald-700" />
              In This Protocol Guide:
            </div>
            <ol className="space-y-2 text-sm text-slate-700 list-decimal list-inside">
              {guide.sections.map((sec) => (
                <li key={sec.id}>
                  <a
                    href={`#${sec.id}`}
                    className="hover:text-emerald-700 font-medium underline-offset-2 hover:underline"
                  >
                    {sec.heading}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#frequently-asked-questions"
                  className="hover:text-emerald-700 font-medium underline-offset-2 hover:underline"
                >
                  Frequently Asked Questions ({guide.faqs.length} Answers)
                </a>
              </li>
            </ol>
          </nav>

          {/* Main H2 / H3 Sections */}
          <div className="space-y-12">
            {guide.sections.map((section, idx) => (
              <div key={section.id}>
                <section id={section.id} className="scroll-mt-28">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-4 leading-snug">
                    {section.heading}
                  </h2>

                  <div className="space-y-4 text-slate-700 text-base md:text-lg leading-relaxed">
                    {section.paragraphs.map((p, pIdx) => (
                      <p key={pIdx}>{p}</p>
                    ))}
                  </div>

                  {section.subSections && section.subSections.length > 0 && (
                    <div className="mt-6 space-y-6 pl-4 md:pl-6 border-l-2 border-emerald-500/40">
                      {section.subSections.map((sub, sIdx) => (
                        <div key={sIdx}>
                          <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">
                            {sub.subHeading}
                          </h3>
                          <div className="space-y-3 text-slate-700 text-base leading-relaxed">
                            <p>{sub.body}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.actionChecklist && section.actionChecklist.length > 0 && (
                    <div className="mt-6 bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 md:p-6">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900 mb-3 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        Actionable Implementation Checklist
                      </h3>
                      <ul className="space-y-2.5">
                        {section.actionChecklist.map((item, cIdx) => (
                          <li
                            key={cIdx}
                            className="flex items-start gap-2.5 text-sm md:text-base text-slate-800"
                          >
                            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {section.keyTakeaway && (
                    <div className="mt-6 bg-amber-50/90 border-l-4 border-amber-500 p-4 md:p-5 rounded-r-xl">
                      <p className="text-sm md:text-base text-slate-800 font-medium">
                        <strong className="text-amber-900 font-bold">Key Takeaway: </strong>
                        {section.keyTakeaway}
                      </p>
                    </div>
                  )}
                </section>

                {/* Embedded Mid-Article CTA Card after Section 2 */}
                {idx === 1 && (
                  <aside
                    aria-label="Mid-Article Diagnostic & Reset CTA"
                    className="my-12 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-lg border border-emerald-500/30"
                  >
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div className="max-w-xl">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-300 bg-orange-500/20 border border-orange-400/30 px-3 py-1 rounded-full mb-3">
                          <Sparkles className="h-3.5 w-3.5" />
                          Personalized 24-Hour Execution
                        </span>
                        <h3 className="text-xl md:text-2xl font-extrabold text-white mb-2">
                          Want This Protocol Calibrated to Your Exact Wake Time &amp; Diet?
                        </h3>
                        <p className="text-sm md:text-base text-emerald-100/90 leading-relaxed">
                          Take our free 60-second diagnostic to discover your primary Overwhelm Archetype, or unlock the full interactive 24-Hour Reset Web Companion (with our 1-Tap Delay Rescheduler and 5 nutrition tracks) for just $19.
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0 w-full md:w-auto">
                        <Link href="/quiz">
                          <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-full shadow-md">
                            Take the Free 60-Second Diagnostic
                            <ArrowRight className="h-4 w-4 ml-1.5" />
                          </Button>
                        </Link>
                        <Link href="/checkout">
                          <Button
                            variant="outline"
                            className="w-full border-white/30 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-full"
                          >
                            Start the Full 24-Hour Reset — $19
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </aside>
                )}
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <section
            id="frequently-asked-questions"
            className="mt-16 pt-10 border-t border-slate-200 scroll-mt-28"
          >
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm uppercase tracking-wider mb-2">
              <HelpCircle className="h-4 w-4" />
              Evidence-Based Answers
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {guide.faqs.map((faq, fIdx) => (
                <div
                  key={fIdx}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 md:p-6 shadow-sm"
                >
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-slate-700 text-base leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Bottom Conversion CTA Card */}
          <section className="mt-14 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-7 md:p-10 text-white shadow-xl">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-white/15 text-emerald-100 text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full mb-4">
                <ShieldCheck className="h-4 w-4 text-orange-400" />
                14-Day 100% Money-Back Guarantee · Instant Access
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
                Ready to Reclaim Your Energy, Focus &amp; Calm in the Next 24 Hours?
              </h2>
              <p className="text-emerald-100 text-base md:text-lg leading-relaxed mb-6">
                Don&apos;t leave your recovery to willpower. Get the interactive Perfect Day Reset Web Companion + Printable Blueprint — complete with our 1-Tap Delay Rescheduler (+15m/+30m/+60m), 5 whole-food meal tracks, guided breathwork timers, and evening cognitive unload journal.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link href="/checkout">
                  <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold px-7 py-3.5 rounded-full text-base shadow-lg">
                    Start the Full 24-Hour Reset — $19
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/quiz">
                  <Button
                    variant="outline"
                    className="border-white/30 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-full text-base"
                  >
                    Take the Free 60-Second Diagnostic
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Related Protocol Guides (Internal Linking Cluster) */}
          <section className="mt-16 pt-10 border-t border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
                  Related Biological Reset Protocols
                </h2>
                <p className="text-sm text-slate-600">
                  Continue exploring the 24-hour circadian and nervous system reset series
                </p>
              </div>
              <Link
                href="/guides"
                className="text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                All 5 Guides <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedGuides.map((rel) => (
                <Link key={rel.slug} href={`/guides/${rel.slug}`}>
                  <div className="h-full bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md hover:border-emerald-500/40 transition-all cursor-pointer flex flex-col justify-between">
                    <div>
                      <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mb-2.5">
                        {rel.categoryBadge}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base mb-2 leading-snug hover:text-emerald-700">
                        {rel.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-3">
                        {rel.metaDescription}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
                      <span>{rel.readTimeMinutes} min read</span>
                      <span className="inline-flex items-center gap-1">
                        Read Guide <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
