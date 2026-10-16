import { storage } from "../storage";

export type ReplyChannel =
  | "email_inbound"
  | "ig_dm"
  | "tiktok_dm"
  | "comment_reply";

export interface AutonomousReplyInput {
  channel: ReplyChannel;
  senderIdentifier: string;
  message: string;
  subject?: string;
  archetypeId?: string;
  platform?: "instagram" | "tiktok" | "youtube" | "email";
  triggerType?: "comment" | "dm" | "email";
}

export interface AutonomousReplyOutput {
  detectedIntent:
    | "keyword_reset"
    | "schedule_delay_objection"
    | "diet_nutrition_question"
    | "pricing_guarantee_question"
    | "workday_busy_objection"
    | "login_access_help"
    | "general_inquiry";
  replyText: string;
  replySubject: string;
  replyHtml: string;
  publicCommentReply: string;
  dmFollowUp: string;
  suggestedUrl: string;
  aiGenerated: boolean;
}

function detectMessageIntent(
  message: string,
  triggerType?: string
): AutonomousReplyOutput["detectedIntent"] {
  const m = (message || "").trim().toLowerCase();

  if (
    triggerType === "comment" ||
    m === "reset" ||
    /\bcomment\s*reset\b/i.test(m) ||
    /^reset[!.\s]*$/i.test(m) ||
    m.includes("send me the link") ||
    m.includes("diagnostic") ||
    m.includes("quiz")
  ) {
    return "keyword_reset";
  }

  if (
    m.includes("late") ||
    m.includes("meeting") ||
    m.includes("behind schedule") ||
    m.includes("delay") ||
    m.includes("rigid") ||
    m.includes("miss a block")
  ) {
    return "schedule_delay_objection";
  }

  if (
    m.includes("keto") ||
    m.includes("vegan") ||
    m.includes("vegetarian") ||
    m.includes("paleo") ||
    m.includes("diet") ||
    m.includes("food") ||
    m.includes("eat") ||
    m.includes("meal") ||
    m.includes("6am") ||
    m.includes("wake")
  ) {
    return "diet_nutrition_question";
  }

  if (
    m.includes("price") ||
    m.includes("cost") ||
    m.includes("subscription") ||
    m.includes("refund") ||
    m.includes("guarantee") ||
    m.includes("$19") ||
    m.includes("$31") ||
    m.includes("worth it")
  ) {
    return "pricing_guarantee_question";
  }

  if (
    m.includes("tuesday") ||
    m.includes("wednesday") ||
    m.includes("workday") ||
    m.includes("24 hours") ||
    m.includes("busy") ||
    m.includes("30-day") ||
    m.includes("no time")
  ) {
    return "workday_busy_objection";
  }

  if (
    m.includes("login") ||
    m.includes("password") ||
    m.includes("access") ||
    m.includes("bought") ||
    m.includes("receipt")
  ) {
    return "login_access_help";
  }

  return "general_inquiry";
}

function buildDeterministicReply(
  input: AutonomousReplyInput,
  intent: AutonomousReplyOutput["detectedIntent"]
): Omit<AutonomousReplyOutput, "aiGenerated"> {
  const handleClean = input.senderIdentifier.replace(/^@/, "").split("@")[0] || "there";
  const quizUrl = "https://perfectdayreset.com/quiz";
  const checkoutUrl = "https://perfectdayreset.com/checkout";
  const loginUrl = "https://perfectdayreset.com/login";

  switch (intent) {
    case "keyword_reset": {
      const publicCommentReply = `Just sent your 60-Second Burnout & Cortisol Diagnostic to your DMs, @${handleClean}! Check your message requests ⚡`;
      const dmFollowUp = `Hey ${handleClean}! Reiko's team here 👋 Thanks for commenting RESET.\n\nTake our free 60-Second Cortisol & Energy Diagnostic here → ${quizUrl}\n\nIt maps your #1 energy bottleneck (Cortisol-Spiked, Dopamine-Depleted, Metabolic Crasher, or Systemic Burnout) and builds a custom 24-hour schedule around your exact wake time (06:00–09:00) & nutrition track (Omni, Veg, Keto, Paleo, or Vegan).`;
      return {
        detectedIntent: intent,
        replyText: dmFollowUp,
        replySubject: "Your 60-Second Burnout & Cortisol Diagnostic Link",
        replyHtml: formatEmailHtml(handleClean, dmFollowUp, quizUrl, "Take the 60-Second Diagnostic →"),
        publicCommentReply,
        dmFollowUp,
        suggestedUrl: quizUrl,
      };
    }

    case "schedule_delay_objection": {
      const text = `Great question—that's the #1 reason static PDF routines fail. Inside the Perfect Day Reset web companion, we built a live **1-Tap Delay Rescheduler**.\n\nIf a meeting runs late or your morning slips by +15, +30, or +45 minutes, you tap one button and the engine automatically recalculates your entire remaining 24-hour timeline up to your target bedtime—zero guilt and zero math.\n\nYou can unlock the full interactive portal for a one-time $19 payment (backed by our 14-day money-back guarantee) right here: ${checkoutUrl}`;
      return {
        detectedIntent: intent,
        replyText: text,
        replySubject: "Re: What if I get stuck in meetings or fall behind schedule?",
        replyHtml: formatEmailHtml(handleClean, text, checkoutUrl, "Unlock the 24-Hour Reset Portal ($19) →"),
        publicCommentReply: `@${handleClean} We built a live 1-Tap Delay Rescheduler (+15/+30/+45m) inside the web companion for that exact reason! Sent you the details in DMs ⚡`,
        dmFollowUp: text,
        suggestedUrl: checkoutUrl,
      };
    }

    case "diet_nutrition_question": {
      const text = `Yes—100%! During your 60-second setup, the Perfect Day Reset portal calibrates around your exact wake time (whether you wake at 06:00, 07:00, 08:00, or 09:00) AND lets you switch instantly between **5 whole-food nutrition tracks**:\n\n1. Omnivore\n2. Vegetarian\n3. Keto / Low-Carb\n4. Paleo / Gluten-Free\n5. 100% Plant-Based Vegan\n\nEvery track includes 15-minute anti-crash meals and a 1-click printable grocery list.\n\nPreview your custom wake schedule & meal track in 60 seconds here → ${quizUrl} (or grab instant portal access for $19 one-time at ${checkoutUrl}).`;
      return {
        detectedIntent: intent,
        replyText: text,
        replySubject: "Re: Wake-Time & Nutrition Track Customization (Omni / Veg / Keto / Paleo / Vegan)",
        replyHtml: formatEmailHtml(handleClean, text, quizUrl, "Preview Your Custom Wake & Meal Schedule →"),
        publicCommentReply: `@${handleClean} Yes! It calibrates to your exact wake time (6am–9am) and has 5 nutrition tracks including Keto, Vegan, Paleo, Veg & Omni. Sent you the preview link!`,
        dmFollowUp: text,
        suggestedUrl: quizUrl,
      };
    }

    case "pricing_guarantee_question": {
      const text = `There is **zero subscription**—The Perfect Day Reset is a one-time payment of **$19** for lifetime access to the interactive 24-Hour Web Companion + Printable PDF Guide.\n\nAt checkout, you also have the option to add our **7-Day Momentum & Emergency 2-Hour Workday Reset Kit for +$12 ($31 total)**, which adds our 120-minute mid-week workday triage protocol and Executive Dining-Out Cheat Sheet.\n\nEverything is backed by a **14-Day 100% Money-Back Guarantee**—if you don't feel a measurable shift in energy and sleep in 24 hours, just reply to your receipt for a full refund.\n\nGet instant access here → ${checkoutUrl}`;
      return {
        detectedIntent: intent,
        replyText: text,
        replySubject: "Re: Pricing, One-Time Access & 14-Day Guarantee",
        replyHtml: formatEmailHtml(handleClean, text, checkoutUrl, "Get Instant Access ($19 One-Time) →"),
        publicCommentReply: `@${handleClean} It's a one-time $19 payment (no subscription!) with a 14-day money-back guarantee. Sent you the direct link in DMs!`,
        dmFollowUp: text,
        suggestedUrl: checkoutUrl,
      };
    }

    case "workday_busy_objection": {
      const text = `We built Perfect Day Reset specifically for overloaded executives and founders who don't have time for a 30-day challenge.\n\nYou can run the full 24-Hour Reset on a Sunday to reboot your nervous system for the week—AND if you're getting crushed on a chaotic Tuesday or Wednesday, our **Emergency 2-Hour Workday Reset (+$12 order bump at checkout)** gives you a 4-step, 120-minute workday triage protocol (Hydration + 4-7-8 Breath, Low-Glycemic Fuel, 20-Min Cortisol Walk, and 90-Min Single-Task Lock) without clearing your calendar.\n\nStart with the 60-Second Diagnostic here → ${quizUrl} or go straight to checkout: ${checkoutUrl}`;
      return {
        detectedIntent: intent,
        replyText: text,
        replySubject: "Re: How to Reset When Your Workweek Is Packed",
        replyHtml: formatEmailHtml(handleClean, text, checkoutUrl, "Start Your 24-Hour + 2-Hour Workday Reset →"),
        publicCommentReply: `@${handleClean} You don't need 30 days—just 24 hours on a weekend, or our 2-Hour Emergency Workday Reset on chaotic Tuesdays! Check your DMs ⚡`,
        dmFollowUp: text,
        suggestedUrl: checkoutUrl,
      };
    }

    case "login_access_help": {
      const text = `We've got you covered! You can sign in to your interactive Reset Portal anytime using the **Email Address** you used at checkout right here: ${loginUrl}\n\n(Just enter your email in the first box on the login page along with the password from your welcome receipt, or use the 1-click Instant Portal button on your payment confirmation screen).`;
      return {
        detectedIntent: intent,
        replyText: text,
        replySubject: "Re: Accessing Your Perfect Day Reset Portal",
        replyHtml: formatEmailHtml(handleClean, text, loginUrl, "Log In to Your Reset Portal →"),
        publicCommentReply: `@${handleClean} Just sent your direct portal login instructions to your DMs!`,
        dmFollowUp: text,
        suggestedUrl: loginUrl,
      };
    }

    default: {
      const text = `Thanks for reaching out! The Perfect Day Reset (created by Reiko Kevvai, Ex Head of Sales at BMW & 35-year athlete) is a science-backed 24-hour circadian and nervous system reset.\n\nInstead of a rigid 30-day PDF, you get an interactive web companion that calibrates to your wake time, includes 5 nutrition tracks (Omni, Veg, Keto, Paleo, Vegan), features a live **1-Tap Delay Rescheduler** (+15/+30/+45m), and is a one-time $19 payment backed by a 14-day guarantee.\n\nTake the free 60-Second Diagnostic to see your custom schedule → ${quizUrl}\nOr unlock instant access right now → ${checkoutUrl}`;
      return {
        detectedIntent: intent,
        replyText: text,
        replySubject: "Re: Your Perfect Day Reset Question",
        replyHtml: formatEmailHtml(handleClean, text, quizUrl, "Take the 60-Second Reset Diagnostic →"),
        publicCommentReply: `@${handleClean} Thanks for asking! Sent you our 60-Second Reset Diagnostic and full breakdown in your DMs ⚡`,
        dmFollowUp: text,
        suggestedUrl: quizUrl,
      };
    }
  }
}

function formatEmailHtml(
  recipientName: string,
  bodyText: string,
  ctaUrl: string,
  ctaLabel: string
): string {
  const paragraphs = bodyText
    .split("\n\n")
    .map(
      (p) =>
        `<p style="margin: 0 0 14px 0;">${p
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/\n/g, "<br/>")}</p>`
    )
    .join("");

  return `
    <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; color: #1f2937; padding: 20px;">
      <p style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #4A8B2C; margin-bottom: 8px;">
        Perfect Day Reset • Concierge Support
      </p>
      <p style="margin: 0 0 14px 0;">Hi ${recipientName},</p>
      ${paragraphs}
      <div style="margin: 24px 0;">
        <a href="${ctaUrl}" style="background-color: #4A8B2C; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 9999px; font-weight: 700; display: inline-block;">
          ${ctaLabel}
        </a>
      </div>
      <p style="font-size: 13px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 16px; margin-top: 24px;">
        Warm regards,<br/>
        <strong>Reiko Kevvai's Team</strong> • Perfect Day Reset<br/>
        <a href="https://perfectdayreset.com" style="color: #4A8B2C;">perfectdayreset.com</a>
      </p>
    </div>
  `;
}

export async function generateAutonomousReply(
  input: AutonomousReplyInput
): Promise<AutonomousReplyOutput> {
  const intent = detectMessageIntent(input.message, input.triggerType);
  const deterministic = buildDeterministicReply(input, intent);

  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    return {
      ...deterministic,
      aiGenerated: false,
    };
  }

  try {
    const systemPrompt = `You are the Autonomous Concierge & Closer for "The Perfect Day Reset" (founded by Reiko Kevvai, Ex Head of Sales for Inchcape Motors BMW, 35+ years in competitive sports).
Facts you must strictly adhere to:
- Core Product: $19 one-time payment (never a subscription) for the interactive 24-Hour Web Companion + Printable PDF Guide.
- Optional Checkout Order Bump: +$12 ($31 total) for the "7-Day Momentum & Emergency 2-Hour Workday Reset Kit" (120-minute workday triage protocol + 7-day habit tracker + Executive Dining-Out Cheat Sheet).
- Interactive Features: Dynamic wake-time calibration (06:00–09:00), live 1-Tap Delay Rescheduler (+15m/+30m/+45m when meetings run late), 5 nutrition tracks (Omnivore, Vegetarian, Keto, Paleo, Vegan) with 1-click grocery list, and 5-Prompt Evening Reflection Journal.
- Guarantee: 14-day 100% money-back satisfaction guarantee.
- Links: Free 60-Second Diagnostic at https://perfectdayreset.com/quiz and instant checkout at https://perfectdayreset.com/checkout

Channel: ${input.channel} (${input.triggerType || "direct"})
Sender: ${input.senderIdentifier}
Archetype Context: ${input.archetypeId || "unknown"}
Detected Intent: ${intent}
Inbound Message: "${input.message}"

Write a warm, concise, authoritative reply (max 110 words) that directly answers their question/objection and includes the relevant link (${deterministic.suggestedUrl}).`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${encodeURIComponent(
        geminiKey
      )}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
          generationConfig: {
            maxOutputTokens: 220,
            temperature: 0.5,
          },
        }),
        signal: AbortSignal.timeout(4000),
      }
    );

    if (response.ok) {
      const data: any = await response.json();
      const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (aiText && aiText.length > 25) {
        const handleClean =
          input.senderIdentifier.replace(/^@/, "").split("@")[0] || "there";
        return {
          ...deterministic,
          replyText: aiText,
          dmFollowUp: aiText,
          replyHtml: formatEmailHtml(
            handleClean,
            aiText,
            deterministic.suggestedUrl,
            intent === "keyword_reset"
              ? "Take the 60-Second Diagnostic →"
              : "Unlock Your 24-Hour Reset ($19) →"
          ),
          aiGenerated: true,
        };
      }
    }
  } catch {
    // Gracefully fall back to deterministic closer on timeout or network error
  }

  return {
    ...deterministic,
    aiGenerated: false,
  };
}
