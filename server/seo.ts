import { SEO_GUIDES, getGuideBySlug, type SEOGuideArticle } from "@shared/seo-guides";

interface RouteSEOConfig {
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  noindex?: boolean;
  includeProductSchema?: boolean;
  includeFaqSchema?: boolean;
  extraJsonLd?: Record<string, any>[];
  semanticHtml: string;
}

const SITE_URL = "https://perfectdayreset.com";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

const SHARED_NAV_HTML = `
  <header>
    <nav aria-label="Primary Navigation">
      <a href="/">Perfect Day Reset</a>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/quiz">Free 60s Diagnostic</a></li>
        <li><a href="/guides">Reset Guides</a></li>
        <li><a href="/what-you-get">What You Get</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
        <li><a href="/checkout">Start My 24-Hour Reset — $19</a></li>
        <li><a href="/login">Member Login</a></li>
      </ul>
    </nav>
  </header>
`;

const SHARED_FOOTER_HTML = `
  <footer>
    <p><strong>Perfect Day Reset</strong> — Science-backed 24-hour wellness protocol to reclaim your energy, focus, and mood.</p>
    <nav aria-label="Footer Navigation">
      <ul>
        <li><a href="/quiz">Free 60-Second Reset Diagnostic</a></li>
        <li><a href="/guides">24-Hour Burnout &amp; Cortisol Reset Guides</a></li>
        <li><a href="/guides/24-hour-burnout-reset-protocol">The 24-Hour Burnout Reset Protocol</a></li>
        <li><a href="/guides/morning-cortisol-hydration-reset">Morning Cortisol &amp; Hydration Reset</a></li>
        <li><a href="/guides/stop-afternoon-energy-crash-work">How to Stop the 3 PM Energy Crash</a></li>
        <li><a href="/guides/tired-but-wired-evening-nervous-system-reset">Tired But Wired Evening Nervous System Reset</a></li>
        <li><a href="/guides/2-hour-workday-reset-overwhelmed-executives">The 2-Hour Emergency Workday Reset</a></li>
        <li><a href="/what-you-get">What You Get</a></li>
        <li><a href="/about">About the Founder</a></li>
        <li><a href="/contact">Contact &amp; Support</a></li>
        <li><a href="/privacy-policy">Privacy Policy</a></li>
        <li><a href="/terms-of-service">Terms of Service</a></li>
        <li><a href="/refund-policy">Refund Policy</a></li>
        <li><a href="/cookie-policy">Cookie Policy</a></li>
      </ul>
    </nav>
    <p>Contact: <a href="mailto:support@perfectdayreset.com">support@perfectdayreset.com</a></p>
  </footer>
`;

export const HOME_SEMANTIC_HTML = `
<div class="ssr-seo-shell">
  ${SHARED_NAV_HTML}
  <main>
    <section aria-labelledby="hero-heading">
      <p>Interactive Web Companion + Printable PDF Guide • Built on 35+ Years in Competitive Sports &amp; High-Performance Recovery</p>
      <h1 id="hero-heading">Perfect Day Reset – Transform Your Energy, Clarity &amp; Focus in Just 24 Hours</h1>
      <p>Reset your body and mind in a single day with an adaptive 24-hour web companion and printable PDF protocol combining 5 customizable meal tracks, intentional movement, hydration, and evening cognitive unload journaling—plus $1 donated to children's programs with every purchase.</p>
      <p><a href="/checkout">Start My 24-Hour Reset — $19</a> | <a href="/what-you-get">See Full Program Breakdown</a> | <a href="/quiz">Take the Free 60-Second Burnout &amp; Reset Diagnostic</a></p>
    </section>

    <section aria-labelledby="timeline-heading">
      <h2 id="timeline-heading">Inside Your 24 Hours: Complete 4-Phase Reset Timeline</h2>
      <article>
        <h3>Prep (Evening Before, 15 mins)</h3>
        <p>Choose your wake time, pick 1 of 5 meal tracks (Omnivore, Vegetarian, Keto, Paleo, or Vegan) with a 1-click grocery list, and set your phone detox boundary so you wake up with zero decision fatigue.</p>
      </article>
      <article>
        <h3>Phase 1 — Morning Activation (07:00–10:00)</h3>
        <p>Hydration &amp; natural light anchor, mindful mobility, anti-crash breakfast tailored to your chosen dietary track, and priority intention setting for calm, jitter-free morning focus.</p>
      </article>
      <article>
        <h3>Phase 2 — Midday Recharge (10:30–15:15)</h3>
        <p>Deep focus block, blood-sugar-stabilizing metabolic lunch, guided outdoor movement, and a contrast &amp; breath energy reset that eliminates the 2 PM crash.</p>
      </article>
      <article>
        <h3>Phase 3 — Evening Decompression &amp; Reflection (15:30–21:30)</h3>
        <p>Nervous system down-regulation, nourishing recovery dinner, digital sunset, and a 5-prompt cognitive unload journal saved directly in your portal for deep restorative sleep.</p>
      </article>
    </section>

    <section aria-labelledby="comparison-heading">
      <h2 id="comparison-heading">Why 24 Hours Beats Typical 30-Day Wellness Challenges</h2>
      <p>85% of people quit rigid 30-day challenges by Day 4 because a single late meeting derails a static PDF schedule. The Perfect Day Reset ($19) focuses on 24 intentional hours powered by an adaptive schedule engine that recalculates your day with one tap if you run late.</p>
    </section>

    <section aria-labelledby="founder-heading">
      <h2 id="founder-heading">Created by Reiko Kevvai — Ex Head of Sales for Inchcape Motors BMW</h2>
      <p>Designed by Reiko Kevvai, Ex Head of Sales for Inchcape Motors BMW, drawing on over 35 years of experience in competitive sports, physical conditioning, and corporate burnout recovery. After experiencing high-performance corporate burnout firsthand, Reiko engineered a realistic 1-day protocol that restores energy, focus, and nervous system balance without extreme fads.</p>
      <p><a href="/about">Read the full origin story</a></p>
    </section>

    <section aria-labelledby="companion-heading">
      <h2 id="companion-heading">Works Instantly on Any Phone or Laptop + Printable PDF — $19</h2>
      <ul>
        <li><strong>Dynamic 24-Hour Schedule &amp; 1-Tap Delay Rescheduler:</strong> Running 15 minutes late? The engine recalculates your day automatically—no guilt.</li>
        <li><strong>5 Customizable Nutrition Modes:</strong> Switch between Omnivore, Vegetarian, Keto, Paleo, and Vegan tracks with 1-click grocery lists.</li>
        <li><strong>Interactive Hydration Calculator, Digital Detox Checklist &amp; Saved Evening Reflections:</strong> Track your daily water target, digital boundaries, and journal entries in the web portal or on paper with the Printable PDF Guide &amp; 7-Day Daily Reset Tracker.</li>
        <li><strong>Lifetime Access + 14-Day 100% Money-Back Guarantee:</strong> Repeat your 24-Hour Reset unlimited times for a one-time $19 payment.</li>
      </ul>
      <p><a href="/checkout">Start My 24-Hour Reset — $19</a> | <a href="/what-you-get">See Full Program Breakdown</a></p>
    </section>

    <section aria-labelledby="faq-heading">
      <h2 id="faq-heading">Frequently Asked Questions</h2>
      <dl>
        <dt>What format is the program?</dt>
        <dd>You receive both the Live Interactive Web Companion Portal (accessible instantly on any phone, tablet, or laptop with dynamic schedule rescheduling, 5 diet tracks, hydration calculator, and saved reflection journal) and the Printable PDF &amp; Offline Kit (24-Hour Reset PDF blueprint, 7-Day Daily Reset Tracker, 1-click grocery lists, and Certificate of Completion).</dd>
        <dt>Do I need special equipment or supplements?</dt>
        <dd>No. Everything in the Perfect Day Reset uses whole foods from any grocery store, bodyweight movement or outdoor walking, and simple mindfulness practices.</dd>
        <dt>Can I repeat the 24-Hour Reset whenever I want?</dt>
        <dd>Yes. Your one-time $19 purchase gives you lifetime access to start a fresh Reset Run any weekend, post-travel recovery day, or stressful week.</dd>
        <dt>Is there a refund policy?</dt>
        <dd>Yes, every purchase is backed by a 14-day 100% money-back satisfaction guarantee.</dd>
      </dl>
    </section>
  </main>
  ${SHARED_FOOTER_HTML}
</div>
`;

const ROUTE_SEO_MAP: Record<string, RouteSEOConfig> = {
  "/": {
    title: "Perfect Day Reset – Reclaim Your Energy, Focus & Mood in 24 Hours",
    description:
      "Transform your mind and body with the Perfect Day Reset – an interactive 24-hour web companion and printable PDF protocol with 5 nutrition modes, 1-tap schedule rescheduling, and guided journaling for $19.",
    canonical: "https://perfectdayreset.com/",
    ogTitle: "Perfect Day Reset – Reclaim Your Energy, Focus & Mood in 24 Hours",
    ogDescription:
      "Our 24-hour lifestyle reboot blends clean food, focused movement, and powerful mindset tools. Start your reset today for $19.",
    ogImage: DEFAULT_OG_IMAGE,
    twitterTitle: "Perfect Day Reset – Reclaim Your Energy in 24 Hours",
    twitterDescription:
      "One day can change everything. Join the 24-hour reset that restores your energy, focus, and mood.",
    includeProductSchema: true,
    includeFaqSchema: true,
    semanticHtml: HOME_SEMANTIC_HTML,
  },
  "/guides": {
    title: "24-Hour Burnout, Cortisol & Energy Reset Guides | Perfect Day Reset",
    description:
      "Actionable, science-backed guides by Reiko Kevvai on 24-hour burnout recovery, morning cortisol hydration reset, stopping 3 PM afternoon crashes, and evening nervous system decompression.",
    canonical: "https://perfectdayreset.com/guides",
    ogTitle: "24-Hour Burnout, Cortisol & Energy Reset Guides | Perfect Day Reset",
    ogDescription:
      "Step-by-step neuro-biological protocols for high performers: fix morning fatigue, 3 PM brain fog, tired-but-wired nights, and chaotic workdays.",
    ogImage: DEFAULT_OG_IMAGE,
    twitterTitle: "24-Hour Burnout, Cortisol & Energy Reset Guides",
    twitterDescription:
      "Science-backed protocols by Reiko Kevvai for 24-hour burnout recovery, morning cortisol reset, and afternoon energy stabilization.",
    extraJsonLd: [
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
    ],
    semanticHtml: `
<div class="ssr-seo-shell">
  ${SHARED_NAV_HTML}
  <main>
    <h1>The 24-Hour Burnout, Cortisol &amp; Nervous System Reset Library</h1>
    <p>Authored by Reiko Kevvai (Ex Head of Sales for Inchcape Motors BMW &amp; Founder of Perfect Day Reset). Explore our 5 comprehensive, science-backed protocols for high-performing professionals.</p>
    <p><a href="/quiz">Take the Free 60-Second Diagnostic</a> | <a href="/checkout">Start the Full 24-Hour Reset — $19</a></p>
    <section aria-label="Pillar Protocol Guides">
      <h2>5 Complete Biological Reset Protocols</h2>
      ${SEO_GUIDES.map(
        (g) => `
      <article>
        <h3><a href="/guides/${g.slug}">${g.title}</a></h3>
        <p><strong>Target Archetype:</strong> ${g.archetypeLabel} · <strong>Read Time:</strong> ${g.readTimeMinutes} minutes</p>
        <p>${g.heroSummary}</p>
        <p><a href="/guides/${g.slug}">Read Complete Protocol: ${g.title}</a></p>
      </article>`
      ).join("\n")}
    </section>
  </main>
  ${SHARED_FOOTER_HTML}
</div>`,
  },
  "/quiz": {
    title: "Free 60-Second Burnout & Reset Diagnostic Quiz | Perfect Day Reset",
    description:
      "Take our free 60-second diagnostic quiz to identify your Overwhelm Archetype, #1 physiological energy bottleneck, and preview a custom 24-Hour Reset timeline shifted to your wake time and nutrition track.",
    canonical: "https://perfectdayreset.com/quiz",
    ogTitle: "Free 60-Second Burnout & Reset Diagnostic Quiz – Perfect Day Reset",
    ogDescription:
      "Discover your Overwhelm Archetype, Severity Score, and preview your custom 24-hour reset timeline in 60 seconds.",
    ogImage: DEFAULT_OG_IMAGE,
    twitterTitle: "60-Second Burnout & Reset Diagnostic Quiz",
    twitterDescription:
      "Find out why your energy crashes and preview your custom 24-hour protocol.",
    semanticHtml: `
<div class="ssr-seo-shell">
  ${SHARED_NAV_HTML}
  <main>
    <h1>Free 60-Second Burnout &amp; 24-Hour Reset Diagnostic Quiz</h1>
    <p>Answer 5 quick questions about your energy bottleneck, target wake time (06:00, 07:00, 08:00, or 09:00), digital screen habits, dietary preference (Omnivore, Vegetarian, Keto, Paleo, or Vegan), and past routine blockers to generate your personalized 24-Hour Reset blueprint.</p>
    <section>
      <h2>What Your Diagnostic Reveals</h2>
      <ul>
        <li><strong>Your Overwhelm Archetype &amp; Severity Score:</strong> Identify whether you are a Cortisol-Spiked High Performer, Dopamine-Depleted Multitasker, Metabolic Midday Crasher, or in Systemic Burnout Recovery.</li>
        <li><strong>Your #1 Physiological Bottleneck:</strong> Understand the exact circadian, glycemic, or autonomic mechanism draining your focus.</li>
        <li><strong>Your Custom Hour-by-Hour 24-Hour Reset Preview:</strong> See all 4 phases dynamically shifted to your wake time and chosen nutrition track.</li>
      </ul>
      <p><a href="/checkout">Unlock Your Personalized 24-Hour Reset — $19</a> | <a href="/what-you-get">See Full Program Breakdown</a></p>
    </section>
  </main>
  ${SHARED_FOOTER_HTML}
</div>`,
  },
  "/what-you-get": {
    title: "What You Get – Complete 24-Hour Transformation Package | Perfect Day Reset",
    description:
      "Explore everything included in the Perfect Day Reset ($19): live interactive web companion with 1-tap delay rescheduler, 5 customizable meal tracks (Omnivore, Vegetarian, Keto, Paleo, Vegan), hydration calculator, evening reflection journal, and printable PDF guide.",
    canonical: "https://perfectdayreset.com/what-you-get",
    ogTitle: "What You Get – Complete 24-Hour Transformation Package ($19)",
    ogDescription:
      "Discover the complete 24-hour wellness transformation guide: interactive web companion, 5 nutrition modes, 1-tap schedule rescheduler, and printable PDF blueprint.",
    ogImage: DEFAULT_OG_IMAGE,
    twitterTitle: "What You Get – Perfect Day Reset ($19)",
    twitterDescription:
      "Complete 24-hour wellness transformation package with interactive web companion, 5 diet plans, and printable PDF guide.",
    includeProductSchema: true,
    includeFaqSchema: true,
    semanticHtml: `
<div class="ssr-seo-shell">
  ${SHARED_NAV_HTML}
  <main>
    <h1>What You Get Inside the Perfect Day Reset ($19)</h1>
    <p>Everything you need for a complete 24-hour mind and body transformation—accessible instantly via our Live Interactive Web Companion Portal on any phone or laptop, plus a complete Printable PDF Guide for a one-time payment of $19.</p>
    <section>
      <h2>Interactive Web Companion + Printable PDF Features</h2>
      <ul>
        <li><strong>Dynamic 24-Hour Schedule &amp; 1-Tap Delay Rescheduler:</strong> Follow your timeline from Prep (Evening Before, 15 mins) through Phase 1 Morning Activation (07:00–10:00), Phase 2 Midday Recharge (10:30–15:15), and Phase 3 Evening Decompression &amp; Reflection (15:30–21:30). Running late? Tap once to recalculate your day automatically.</li>
        <li><strong>5 Customizable Nutrition Modes + 1-Click Grocery Lists:</strong> Switch seamlessly between Omnivore, Vegetarian, Keto, Paleo, and Vegan meal plans with full recipes and shopping lists.</li>
        <li><strong>Interactive Hydration Calculator &amp; Digital Detox Checklist:</strong> Personalized daily water and electrolyte targets plus structured screen-free boundaries.</li>
        <li><strong>5-Prompt Cognitive Unload Journal:</strong> Save your evening reflections privately in your member portal or write them on paper.</li>
        <li><strong>Printable 24-Hour Reset PDF Blueprint, 7-Day Daily Reset Tracker &amp; Certificate of Completion:</strong> Go 100% offline whenever you prefer and repeat your reset unlimited times.</li>
      </ul>
      <p>Created by Reiko Kevvai (Ex Head of Sales for Inchcape Motors BMW), combining 35+ years in competitive sports with corporate burnout recovery.</p>
      <p><a href="/checkout">Start My 24-Hour Reset — $19</a></p>
    </section>
  </main>
  ${SHARED_FOOTER_HTML}
</div>`,
  },
  "/about": {
    title: "About Perfect Day Reset – Reiko Kevvai | 35+ Years in Sports & Wellness",
    description:
      "Meet Reiko Kevvai, Ex Head of Sales for Inchcape Motors BMW and founder of Perfect Day Reset. Learn how corporate burnout and 35+ years in competitive sports inspired our 24-hour reset protocol.",
    canonical: "https://perfectdayreset.com/about",
    ogTitle: "About Perfect Day Reset – Reiko Kevvai's Founder Story",
    ogDescription:
      "Built by Reiko Kevvai (Ex Head of Sales for Inchcape Motors BMW) on 35+ years of real-world experience in sports, movement, and corporate burnout recovery.",
    ogImage: DEFAULT_OG_IMAGE,
    twitterTitle: "About Perfect Day Reset – Reiko Kevvai",
    twitterDescription:
      "Built on 35+ years of experience in competitive sports and corporate burnout recovery. Meet Reiko Kevvai, creator of the Perfect Day Reset.",
    semanticHtml: `
<div class="ssr-seo-shell">
  ${SHARED_NAV_HTML}
  <main>
    <h1>About Perfect Day Reset &amp; Founder Reiko Kevvai</h1>
    <p>Perfect Day Reset was created by Reiko Kevvai—Ex Head of Sales for Inchcape Motors BMW and lifelong athlete with 35+ years in competitive sports—to give busy professionals a realistic, science-backed way to reclaim their energy, mental clarity, and emotional balance in just 24 hours.</p>
    <section>
      <h2>From High-Performance Corporate Burnout to the 24-Hour Reset Protocol</h2>
      <p>After years of leading high-pressure automotive sales teams while training competitively, corporate burnout hit full force. Reiko realized that exhausted professionals don't need another overwhelming 30-day challenge—they need one engineered 24-hour day that aligns circadian light, clean nutrition (across Omnivore, Vegetarian, Keto, Paleo, and Vegan tracks), purposeful movement, breath regulation, and cognitive unload journaling.</p>
    </section>
    <section>
      <h2>Our Core Pillars</h2>
      <ul>
        <li><strong>Nourish:</strong> Stabilize blood sugar and reduce inflammation with 5 customizable whole-food meal tracks.</li>
        <li><strong>Move:</strong> Activate circulation and endorphins with guided morning mobility and midday outdoor movement.</li>
        <li><strong>Breathe &amp; Disconnect:</strong> Step away from screens and down-regulate the autonomic nervous system.</li>
        <li><strong>Reflect:</strong> Empty mental clutter with our 5-prompt evening cognitive unload journal.</li>
      </ul>
      <p><a href="/what-you-get">See Full Program Breakdown</a> | <a href="/checkout">Start My 24-Hour Reset — $19</a></p>
    </section>
  </main>
  ${SHARED_FOOTER_HTML}
</div>`,
  },
  "/contact": {
    title: "Contact & Support – Perfect Day Reset",
    description:
      "Have questions about your Perfect Day Reset journey? Contact our support team at support@perfectdayreset.com and we'll get back to you within 24 hours.",
    canonical: "https://perfectdayreset.com/contact",
    ogTitle: "Contact & Support – Perfect Day Reset",
    ogDescription:
      "Get in touch with the Perfect Day Reset team for questions, technical support, or feedback.",
    ogImage: DEFAULT_OG_IMAGE,
    twitterTitle: "Contact Perfect Day Reset",
    twitterDescription:
      "We're here to help you succeed on your 24-hour reset journey.",
    semanticHtml: `
<div class="ssr-seo-shell">
  ${SHARED_NAV_HTML}
  <main>
    <h1>Contact &amp; Support</h1>
    <p>Have questions about the Perfect Day Reset program, your account, or billing? Our team responds within 24 hours.</p>
    <p>Email us directly: <a href="mailto:support@perfectdayreset.com">support@perfectdayreset.com</a></p>
  </main>
  ${SHARED_FOOTER_HTML}
</div>`,
  },
  "/refund-policy": {
    title: "Refund Policy – 14-Day Money-Back Guarantee | Perfect Day Reset",
    description:
      "Read the Perfect Day Reset 14-day 100% money-back satisfaction guarantee and refund policy.",
    canonical: "https://perfectdayreset.com/refund-policy",
    ogTitle: "Refund Policy – 14-Day Satisfaction Guarantee | Perfect Day Reset",
    ogDescription:
      "Your purchase of the Perfect Day Reset is protected by our 14-day money-back satisfaction guarantee.",
    ogImage: DEFAULT_OG_IMAGE,
    twitterTitle: "Refund Policy – Perfect Day Reset",
    twitterDescription: "14-day money-back satisfaction guarantee on the Perfect Day Reset.",
    semanticHtml: `
<div class="ssr-seo-shell">
  ${SHARED_NAV_HTML}
  <main>
    <h1>Refund Policy — 14-Day Money-Back Satisfaction Guarantee</h1>
    <p>We stand behind the Perfect Day Reset 100%. If you complete the 24-Hour Reset (or try the protocol within 14 days of purchase) and do not feel noticeably more energized, focused, and clear-headed, contact <a href="mailto:support@perfectdayreset.com">support@perfectdayreset.com</a> within 14 days for a full, friendly refund.</p>
  </main>
  ${SHARED_FOOTER_HTML}
</div>`,
  },
  "/privacy-policy": {
    title: "Privacy Policy – Perfect Day Reset",
    description:
      "Learn how Perfect Day Reset collects, uses, and safeguards your personal data and privacy.",
    canonical: "https://perfectdayreset.com/privacy-policy",
    ogTitle: "Privacy Policy – Perfect Day Reset",
    ogDescription: "How Perfect Day Reset protects your personal data and privacy.",
    ogImage: DEFAULT_OG_IMAGE,
    twitterTitle: "Privacy Policy – Perfect Day Reset",
    twitterDescription: "How Perfect Day Reset protects your personal data and privacy.",
    semanticHtml: `
<div class="ssr-seo-shell">
  ${SHARED_NAV_HTML}
  <main>
    <h1>Privacy Policy</h1>
    <p>Perfect Day Reset respects your privacy. We collect only the information necessary to deliver your digital reset program, process payments securely via Stripe, and save your personal reset progress.</p>
  </main>
  ${SHARED_FOOTER_HTML}
</div>`,
  },
  "/terms-of-service": {
    title: "Terms of Service – Perfect Day Reset",
    description:
      "Read the Terms of Service, usage license, and wellness disclaimer for Perfect Day Reset.",
    canonical: "https://perfectdayreset.com/terms-of-service",
    ogTitle: "Terms of Service – Perfect Day Reset",
    ogDescription: "Terms of Service and conditions of use for Perfect Day Reset.",
    ogImage: DEFAULT_OG_IMAGE,
    twitterTitle: "Terms of Service – Perfect Day Reset",
    twitterDescription: "Terms of Service and conditions of use for Perfect Day Reset.",
    semanticHtml: `
<div class="ssr-seo-shell">
  ${SHARED_NAV_HTML}
  <main>
    <h1>Terms of Service</h1>
    <p>By accessing Perfect Day Reset, you agree to our Terms of Service. All content is provided for educational and general wellness purposes and is not a substitute for professional medical advice.</p>
  </main>
  ${SHARED_FOOTER_HTML}
</div>`,
  },
  "/cookie-policy": {
    title: "Cookie Policy – Perfect Day Reset",
    description:
      "Understand how Perfect Day Reset uses essential session and preference cookies to power your interactive reset portal.",
    canonical: "https://perfectdayreset.com/cookie-policy",
    ogTitle: "Cookie Policy – Perfect Day Reset",
    ogDescription: "How Perfect Day Reset uses cookies for authentication and preferences.",
    ogImage: DEFAULT_OG_IMAGE,
    twitterTitle: "Cookie Policy – Perfect Day Reset",
    twitterDescription: "How Perfect Day Reset uses cookies for authentication and preferences.",
    semanticHtml: `
<div class="ssr-seo-shell">
  ${SHARED_NAV_HTML}
  <main>
    <h1>Cookie Policy</h1>
    <p>Perfect Day Reset uses essential session cookies to keep you securely signed into your member portal and remember your dietary and schedule preferences.</p>
  </main>
  ${SHARED_FOOTER_HTML}
</div>`,
  },
};

const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Perfect Day Reset",
  description:
    "Science-backed wellness transformation platform providing personalized 24-hour protocols for holistic well-being.",
  url: "https://perfectdayreset.com",
  logo: "https://perfectdayreset.com/og-image.png",
  founder: {
    "@type": "Person",
    name: "Reiko Kevvai",
    jobTitle: "Founder (Ex Head of Sales for Inchcape Motors BMW)",
  },
  sameAs: [
    "https://facebook.com/perfectdayreset",
    "https://instagram.com/perfectdayreset",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: "support@perfectdayreset.com",
  },
};

const PRODUCT_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Perfect Day Reset Program",
  description:
    "Complete 24-hour transformation protocol and interactive web companion including morning activation, midday recharge, 5 customizable meal tracks, 1-tap delay rescheduler, and evening reflection.",
  image: [
    "https://perfectdayreset.com/og-image.png",
    "https://perfectdayreset.com/logo.png",
  ],
  sku: "PDR-24H-CORE",
  brand: {
    "@type": "Brand",
    name: "Perfect Day Reset",
  },
  offers: {
    "@type": "Offer",
    url: "https://perfectdayreset.com/what-you-get",
    price: "19.00",
    priceCurrency: "USD",
    priceValidUntil: "2027-12-31",
    availability: "https://schema.org/InStock",
    hasMerchantReturnPolicy: {
      "@type": "MerchantReturnPolicy",
      applicableCountry: ["US", "GB", "CA", "AU", "EE", "DE", "FI", "SE"],
      returnPolicyCategory:
        "https://schema.org/MerchantReturnFiniteReturnWindow",
      merchantReturnDays: 14,
      returnMethod: "https://schema.org/ReturnByMail",
      returnFees: "https://schema.org/FreeReturn",
      merchantReturnLink: "https://perfectdayreset.com/refund-policy",
    },
    shippingDetails: {
      "@type": "OfferShippingDetails",
      shippingRate: {
        "@type": "MonetaryAmount",
        value: "0.00",
        currency: "USD",
      },
      shippingDestination: {
        "@type": "DefinedRegion",
        addressCountry: ["US", "GB", "CA", "AU", "EE", "DE", "FI", "SE"],
      },
      deliveryTime: {
        "@type": "ShippingDeliveryTime",
        handlingTime: {
          "@type": "QuantitativeValue",
          minValue: 0,
          maxValue: 0,
          unitCode: "DAY",
        },
        transitTime: {
          "@type": "QuantitativeValue",
          minValue: 0,
          maxValue: 0,
          unitCode: "DAY",
        },
      },
    },
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "127",
  },
};

const CORE_FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does a 24-hour burnout reset work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Perfect Day Reset is a structured, hour-by-hour 24-hour neuro-biological protocol that synchronizes four biological anchors in a single day: morning cortisol-hydration sequencing, a 90-minute adenosine-caffeine delay, metabolic glycemic stabilization at lunch with an optic-flow walk, and a 90-minute evening digital sunset with cognitive offload journaling.",
      },
    },
    {
      "@type": "Question",
      name: "What happens if I run late or get interrupted during my reset day?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Unlike rigid PDF schedules that fail the moment a meeting runs over or a family need arises, the interactive Perfect Day Reset Web Companion includes a 1-Tap Delay Rescheduler (+15m, +30m, +60m) that dynamically recalculates your remaining meal, movement, and wind-down timestamps without guilt.",
      },
    },
    {
      "@type": "Question",
      name: "How do the 5 customizable nutrition tracks work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Inside the interactive portal, you can switch with one click between 5 whole-food metabolic tracks: Omnivore, Vegetarian, Ketogenic, Paleo, and Vegan. Each track provides exact breakfast, lunch, afternoon stabilizer, and dinner combinations calibrated to prevent post-meal glucose crashes without calorie counting.",
      },
    },
    {
      "@type": "Question",
      name: "What is the 14-day money-back guarantee?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Your $19 one-time purchase is backed by a 14-day 100% money-back guarantee. If you complete the 24-Hour Reset Protocol and do not feel a measurable improvement in morning alertness, afternoon focus, and evening calm, simply email support@perfectdayreset.com within 14 days for a full refund.",
      },
    },
  ],
};

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildGuideRouteSEO(guide: SEOGuideArticle): RouteSEOConfig {
  const canonicalUrl = `${SITE_URL}/guides/${guide.slug}`;
  const relatedGuides = guide.relatedSlugs
    .map((s) => getGuideBySlug(s))
    .filter((g): g is SEOGuideArticle => Boolean(g));

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.metaDescription,
    image: [DEFAULT_OG_IMAGE],
    datePublished: guide.publishedDate,
    dateModified: guide.updatedDate,
    author: {
      "@type": "Person",
      name: "Reiko Kevvai",
      jobTitle:
        "Founder of Perfect Day Reset, Ex Head of Sales for Inchcape Motors BMW",
      url: `${SITE_URL}/about`,
    },
    publisher: {
      "@type": "Organization",
      name: "Perfect Day Reset",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    keywords: guide.targetKeywords.join(", "),
  };

  const faqSchema = {
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
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Reset Guides",
        item: `${SITE_URL}/guides`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: guide.title,
        item: canonicalUrl,
      },
    ],
  };

  const summaryRowsHtml = guide.quickProtocolSummary
    .map(
      (row) => `
          <tr>
            <td><strong>${escapeHtml(row.timeWindow)}</strong></td>
            <td>${escapeHtml(row.action)}</td>
            <td>${escapeHtml(row.mechanism)}</td>
          </tr>`
    )
    .join("");

  const sectionsHtml = guide.sections
    .map((sec, idx) => {
      const paragraphsHtml = sec.paragraphs
        .map((p) => `<p>${escapeHtml(p)}</p>`)
        .join("\n        ");

      const subSectionsHtml =
        sec.subSections && sec.subSections.length > 0
          ? sec.subSections
              .map(
                (sub) => `
        <h3>${escapeHtml(sub.subHeading)}</h3>
        <p>${escapeHtml(sub.body)}</p>`
              )
              .join("\n")
          : "";

      const checklistHtml =
        sec.actionChecklist && sec.actionChecklist.length > 0
          ? `
        <h3>Actionable Implementation Checklist</h3>
        <ul>
          ${sec.actionChecklist.map((item) => `<li>${escapeHtml(item)}</li>`).join("\n          ")}
        </ul>`
          : "";

      const takeawayHtml = sec.keyTakeaway
        ? `<p><strong>Key Takeaway:</strong> ${escapeHtml(sec.keyTakeaway)}</p>`
        : "";

      const midArticleCtaHtml =
        idx === 1
          ? `
      <aside aria-label="Mid-Article Diagnostic CTA">
        <h3>Want This Protocol Calibrated to Your Exact Wake Time &amp; Diet?</h3>
        <p>Take our free 60-second diagnostic to identify your primary Overwhelm Archetype, or start the full interactive 24-Hour Reset Web Companion for $19.</p>
        <p><a href="/quiz">Take the Free 60-Second Diagnostic</a> | <a href="/checkout">Start the Full 24-Hour Reset — $19</a></p>
      </aside>`
          : "";

      return `
      <section id="${escapeAttr(sec.id)}">
        <h2>${escapeHtml(sec.heading)}</h2>
        ${paragraphsHtml}
        ${subSectionsHtml}
        ${checklistHtml}
        ${takeawayHtml}
      </section>${midArticleCtaHtml}`;
    })
    .join("\n");

  const faqsHtml = guide.faqs
    .map(
      (f) => `
        <dt><h3>${escapeHtml(f.question)}</h3></dt>
        <dd><p>${escapeHtml(f.answer)}</p></dd>`
    )
    .join("\n");

  const relatedHtml = relatedGuides
    .map(
      (r) =>
        `<li><a href="/guides/${r.slug}">${escapeHtml(r.title)}</a> — ${escapeHtml(r.metaDescription)}</li>`
    )
    .join("\n          ");

  const semanticHtml = `
<div class="ssr-seo-shell">
  ${SHARED_NAV_HTML}
  <main>
    <article>
      <header>
        <nav aria-label="Breadcrumb">
          <a href="/">Home</a> / <a href="/guides">Reset Guides</a> / <span>${escapeHtml(guide.categoryBadge)}</span>
        </nav>
        <p>${escapeHtml(guide.categoryBadge)} · Target Archetype: ${escapeHtml(guide.archetypeLabel)} · ${guide.readTimeMinutes} min read</p>
        <h1>${escapeHtml(guide.title)}</h1>
        <p>${escapeHtml(guide.heroSummary)}</p>
        <p>By <strong>Reiko Kevvai</strong> (Ex Head of Sales for Inchcape Motors BMW &amp; Founder of Perfect Day Reset) · Updated <time datetime="${guide.updatedDate}">${guide.updatedDate}</time></p>
      </header>

      <section aria-label="Quick Protocol Summary">
        <h2>Executive Protocol Summary (At-a-Glance Schedule)</h2>
        <table>
          <thead>
            <tr>
              <th>Timing Window</th>
              <th>Core Protocol Action</th>
              <th>Neuro-Biological Mechanism</th>
            </tr>
          </thead>
          <tbody>${summaryRowsHtml}
          </tbody>
        </table>
      </section>

      ${sectionsHtml}

      <section id="frequently-asked-questions" aria-label="Frequently Asked Questions">
        <h2>Frequently Asked Questions</h2>
        <dl>${faqsHtml}
        </dl>
      </section>

      <section aria-label="Start Your 24-Hour Reset">
        <h2>Ready to Reclaim Your Energy, Focus &amp; Calm in the Next 24 Hours?</h2>
        <p>Get instant access to the interactive Perfect Day Reset Web Companion + Printable Blueprint (including the 1-Tap Delay Rescheduler and 5 nutrition tracks) backed by our 14-day 100% money-back guarantee.</p>
        <p><a href="/checkout">Start the Full 24-Hour Reset — $19</a> | <a href="/quiz">Take the Free 60-Second Diagnostic</a></p>
      </section>

      <nav aria-label="Related Biological Reset Protocols">
        <h2>Related Biological Reset Protocols</h2>
        <ul>
          ${relatedHtml}
        </ul>
      </nav>
    </article>
  </main>
  ${SHARED_FOOTER_HTML}
</div>`;

  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
    canonical: canonicalUrl,
    ogTitle: guide.metaTitle,
    ogDescription: guide.metaDescription,
    ogImage: DEFAULT_OG_IMAGE,
    twitterTitle: guide.metaTitle,
    twitterDescription: guide.metaDescription,
    extraJsonLd: [articleSchema, faqSchema, breadcrumbSchema],
    semanticHtml,
  };
}

export function injectRouteSEO(html: string, rawUrl: string): string {
  const pathname = (rawUrl.split("?")[0] || "/").replace(/\/+$/, "") || "/";
  let seo: RouteSEOConfig | undefined = ROUTE_SEO_MAP[pathname];

  if (!seo && pathname.startsWith("/guides/")) {
    const slug = pathname.slice("/guides/".length);
    const guide = getGuideBySlug(slug);
    if (guide) {
      seo = buildGuideRouteSEO(guide);
    }
  }

  if (!seo) {
    return html;
  }

  let updated = html;

  updated = updated.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${seo.title}</title>`
  );

  updated = updated.replace(
    /<meta\s+name="title"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="title" content="${escapeAttr(seo.title)}" />`
  );

  updated = updated.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${escapeAttr(seo.description)}" />`
  );

  updated = updated.replace(
    /<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="robots" content="${seo.noindex ? "noindex, nofollow" : "index, follow"}" />`
  );

  updated = updated.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${escapeAttr(seo.canonical)}" />`
  );

  updated = updated.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:url" content="${escapeAttr(seo.canonical)}" />`
  );

  updated = updated.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:title" content="${escapeAttr(seo.ogTitle)}" />`
  );

  updated = updated.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:description" content="${escapeAttr(seo.ogDescription)}" />`
  );

  updated = updated.replace(
    /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:image" content="${escapeAttr(seo.ogImage)}" />`
  );

  updated = updated.replace(
    /<meta\s+property="twitter:url"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="twitter:url" content="${escapeAttr(seo.canonical)}" />`
  );

  updated = updated.replace(
    /<meta\s+property="twitter:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="twitter:title" content="${escapeAttr(seo.twitterTitle)}" />`
  );

  updated = updated.replace(
    /<meta\s+property="twitter:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="twitter:description" content="${escapeAttr(seo.twitterDescription)}" />`
  );

  updated = updated.replace(
    /<meta\s+property="twitter:image"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="twitter:image" content="${escapeAttr(seo.ogImage)}" />`
  );

  // Remove any pre-existing organization-schema, product-schema, faq-schema, or route-schema script tags before injecting route-specific schemas
  updated = updated.replace(
    /\s*<script[^>]*data-type="(?:organization-schema|product-schema|faq-schema|route-schema)"[^>]*>[\s\S]*?<\/script>/gi,
    ""
  );

  const extraSchemas = [
    `<script type="application/ld+json" data-type="organization-schema">${JSON.stringify(ORGANIZATION_SCHEMA)}</script>`,
    ...(seo.includeProductSchema
      ? [
          `<script type="application/ld+json" data-type="product-schema">${JSON.stringify(PRODUCT_SCHEMA)}</script>`,
        ]
      : []),
    ...(seo.includeFaqSchema
      ? [
          `<script type="application/ld+json" data-type="faq-schema">${JSON.stringify(CORE_FAQ_SCHEMA)}</script>`,
        ]
      : []),
    ...(seo.extraJsonLd
      ? seo.extraJsonLd.map(
          (schemaObj) =>
            `<script type="application/ld+json" data-type="route-schema">${JSON.stringify(schemaObj)}</script>`
        )
      : []),
  ].join("\n    ");

  updated = updated.replace(/<\/head>/i, `    ${extraSchemas}\n  </head>`);

  if (updated.includes("<!--SSR_ROOT_START-->")) {
    updated = updated.replace(
      /<!--SSR_ROOT_START-->[\s\S]*?<!--SSR_ROOT_END-->/i,
      `<!--SSR_ROOT_START-->${seo.semanticHtml}<!--SSR_ROOT_END-->`
    );
  } else {
    updated = updated.replace(
      /<div id="root">\s*<\/div>/i,
      `<div id="root">${seo.semanticHtml}</div>`
    );
  }

  return updated;
}
