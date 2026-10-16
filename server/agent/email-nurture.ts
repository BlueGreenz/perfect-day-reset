import { storage } from "../storage";
import { sendEmail } from "../utils/sendgrid";
import type { AgentLead } from "@shared/schema";

export interface NurtureEmailTemplate {
  stage: 1 | 2 | 3 | 4;
  delayLabel: string;
  subject: string;
  preheader: string;
  html: string;
  text: string;
}

interface ArchetypeMeta {
  id: string;
  name: string;
  bottleneckTitle: string;
  mechanism: string;
  morningFix: string;
  eveningFix: string;
}

const ARCHETYPE_MAP: Record<string, ArchetypeMeta> = {
  cortisol_spiked: {
    id: "cortisol_spiked",
    name: "Cortisol-Spiked High Performer",
    bottleneckTitle: "Inverted Cortisol-Melatonin Curve",
    mechanism:
      "Late-day cognitive problem-solving and screen exposure keep your sympathetic nervous system elevated past 9:00 PM—suppressing deep slow-wave recovery and leaving you groggy at wake-up.",
    morningFix:
      "500ml mineral electrolyte hydration + 10 minutes of natural outdoor light before touching any screen.",
    eveningFix:
      "Structured Digital Sunset 90 minutes before sleep + the 5-Prompt Cognitive Unload Journal.",
  },
  dopamine_depleted: {
    id: "dopamine_depleted",
    name: "Dopamine-Depleted Multitasker",
    bottleneckTitle: "Prefrontal Dopamine Receptor Fatigue",
    mechanism:
      "Checking notifications within 5 minutes of waking hijacks your prefrontal cortex and traps your brain in reactive context-switching, draining baseline focus by early afternoon.",
    morningFix:
      "45-minute phone-free morning boundary + tyrosine-rich breakfast + 3-minute #1 Priority Lock.",
    eveningFix:
      " Evening notification batching + parasympathetic nasal breath decompression.",
  },
  metabolic_crasher: {
    id: "metabolic_crasher",
    name: "Metabolic Midday Crasher",
    bottleneckTitle: "Post-Prandial Glucose & Electrolyte Dip",
    mechanism:
      "Drinking caffeine on an empty, dehydrated stomach and eating a rushed lunch triggers a steep insulin spike followed by reactive hypoglycemia right around 2:00 PM.",
    morningFix:
      "Cellular mineral hydration before coffee + slow-release protein & healthy-fat breakfast.",
    eveningFix:
      "45-minute midday cortisol-flushing walk + thermal contrast shower to keep afternoon ATP steady.",
  },
  systemic_burnout: {
    id: "systemic_burnout",
    name: "Systemic Burnout Recovery",
    bottleneckTitle: "HPA-Axis & Autonomic Exhaustion",
    mechanism:
      "Months of overriding fatigue signals with sheer willpower and caffeine have locked your nervous system into low-grade fight-or-flight overdrive.",
    morningFix:
      "Gentle joint mobility, nasal breath primer, and zero-guilt pacing calibrated to your wake time.",
    eveningFix:
      "Full nervous system down-regulation walk, nourishing anti-inflammatory dinner, and deep sleep lock.",
  },
};

interface DietMeta {
  code: string;
  label: string;
  breakfast: string;
  lunch: string;
  dinner: string;
}

const DIET_MAP: Record<string, DietMeta> = {
  omni: {
    code: "omni",
    label: "Omnivore Reset Track",
    breakfast: "Omega Brain Bowl (2 pasture-raised eggs, ½ avocado, sautéed spinach, chia & olive oil)",
    lunch: "Grilled Wild Salmon Power Salad with pumpkin seeds, cucumber & lemon-olive oil dressing",
    dinner: "Lean Turkey & Quinoa Recovery Bowl with roasted zucchini, carrot & garlic",
  },
  veg: {
    code: "veg",
    label: "Vegetarian Reset Track",
    breakfast: "Unsweetened Greek Yogurt, Wild Berry, Flaxseed & Walnut Cortisol-Steady Bowl",
    lunch: "Warm Lentil, Halloumi, Baby Spinach & Olive Oil Metabolic Salad",
    dinner: "Soft-Herbed Frittata with Steamed Asparagus & Quinoa",
  },
  keto: {
    code: "keto",
    label: "Keto / Low-Carb Track",
    breakfast: "Baked Avocado Egg Cups with extra-virgin olive oil, sea salt & chili flakes",
    lunch: "Herb-Grilled Chicken Caesar over crisp romaine with parmesan & olive oil-lemon dressing",
    dinner: "Pan-Seared Wild Salmon over velvety garlic-ghee cauliflower mash with fresh dill",
  },
  paleo: {
    code: "paleo",
    label: "Paleo / Ancestral Track",
    breakfast: "Pasture-Raised Egg & Sweet Potato Hash with avocado and wilted greens",
    lunch: "Herb-Grilled Chicken & Avocado Salad with cucumber, olive oil, and toasted walnuts",
    dinner: "Garlic-Seared Shrimp or Grass-Fed Beef over spiralized zucchini noodles & bell peppers",
  },
  vegan: {
    code: "vegan",
    label: "100% Plant-Based Vegan Track",
    breakfast: "Warm Chia, Hemp Seed & Almond Butter Protein Pudding with low-glycemic berries",
    lunch: "Crispy Chickpea, Quinoa, Tahini & Massaged Kale Power Bowl",
    dinner: "Tamari-Ginger Tofu & Zucchini Noodle Stir-Fry with toasted sesame oil",
  },
};

const BLOCKER_COPY: Record<string, { label: string; solution: string }> = {
  ran_late: {
    label: "schedules getting derailed when a meeting or morning runs late",
    solution:
      "Inside the Perfect Day Reset web companion, we built the live 1-Tap Delay Rescheduler. Running 15, 30, or 45 minutes behind? Tap one button and your entire remaining 24-hour schedule recalculates automatically—zero guilt, zero math.",
  },
  too_rigid: {
    label: "rigid 5:00 AM biohacker routines that feel unrealistic for real life",
    solution:
      "Your Reset calibrates dynamically around your actual wake time and lets you choose between a brisk outdoor walk, gentle home mobility, or strength movement—so the protocol fits your life, not the other way around.",
  },
  quit_30_day: {
    label: "losing momentum on exhausting 30-day wellness challenges by Day 4",
    solution:
      "85% of people quit 30-day challenges because a month of restriction feels like a second full-time job when you're already tired. Anyone can commit to 24 intentional hours—and repeat it whenever you need a reboot.",
  },
  meal_prep: {
    label: "complicated 20-ingredient meal prep and confusing food rules",
    solution:
      "Your portal pre-loads 15-minute whole-food meals for your exact nutrition track along with a 1-click printable grocery list so you spend zero mental energy wondering what to eat.",
  },
};

function addMinutesToTime(wakeTime: string, offsetMinutes: number): string {
  const [hStr, mStr] = (wakeTime || "07:00").split(":");
  const base = (parseInt(hStr, 10) || 7) * 60 + (parseInt(mStr, 10) || 0);
  const total = ((base + offsetMinutes) % 1440 + 1440) % 1440;
  const hh = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const mm = (total % 60).toString().padStart(2, "0");
  return `${hh}:${mm}`;
}

export function buildArchetypeNurtureEmail(
  lead: Pick<
    AgentLead,
    "email" | "firstName" | "archetypeId" | "wakeTime" | "foodPreference" | "pastBlocker"
  >,
  stage: 1 | 2 | 3 | 4
): NurtureEmailTemplate {
  const firstName = lead.firstName?.trim() || "Friend";
  const archetype = ARCHETYPE_MAP[lead.archetypeId] || ARCHETYPE_MAP.cortisol_spiked;
  const diet = DIET_MAP[lead.foodPreference] || DIET_MAP.omni;
  const blocker = BLOCKER_COPY[lead.pastBlocker] || BLOCKER_COPY.ran_late;
  const wake = lead.wakeTime || "07:00";

  const tHydrate = `${wake} – ${addMinutesToTime(wake, 30)}`;
  const tMove = `${addMinutesToTime(wake, 30)} – ${addMinutesToTime(wake, 75)}`;
  const tBreakfast = `${addMinutesToTime(wake, 75)} – ${addMinutesToTime(wake, 135)}`;
  const tMidday = `${addMinutesToTime(wake, 330)} – ${addMinutesToTime(wake, 450)}`;
  const tSunset = `${addMinutesToTime(wake, 750)} – ${addMinutesToTime(wake, 870)}`;

  const baseUrl = process.env.PUBLIC_APP_URL || "https://perfectdayreset.com";
  const checkoutUrl = `${baseUrl}/checkout?from=agent_nurture_${stage}&archetype=${encodeURIComponent(
    archetype.id
  )}&wake=${encodeURIComponent(wake)}&diet=${encodeURIComponent(diet.code)}`;
  const unsubscribeUrl = `${baseUrl}/api/agent/unsubscribe?email=${encodeURIComponent(lead.email)}`;

  const footerHtml = `
    <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center;">
      <p style="margin: 4px 0;">Sent by Reiko Kevvai &amp; The Perfect Day Reset Team • Reply directly to this email with any questions.</p>
      <p style="margin: 4px 0;">
        <a href="${unsubscribeUrl}" style="color: #4A8B2C; text-decoration: underline;">Unsubscribe with 1 click</a>
        &nbsp;•&nbsp;
        <a href="${baseUrl}/quiz" style="color: #4A8B2C; text-decoration: underline;">Retake 60-Second Diagnostic</a>
      </p>
    </div>
  `;

  if (stage === 1) {
    const subject = `Your 24-Hour Reset Blueprint (${archetype.name} • ${wake} Wake Schedule)`;
    const preheader = `Here is your shifted ${wake} schedule and #1 bottleneck fix for ${archetype.bottleneckTitle}.`;
    const html = `
      <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; color: #1f2937; padding: 20px;">
        <p style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #4A8B2C; margin-bottom: 6px;">
          60-Second Reset Diagnostic • Stage 1 of 4
        </p>
        <h1 style="font-size: 22px; color: #111827; margin-top: 0; margin-bottom: 12px;">
          Hi ${firstName}, here is your ${archetype.name} Blueprint
        </h1>
        <p style="margin-bottom: 16px;">
          Based on your diagnostic profile, your #1 energy bottleneck isn't a lack of willpower—it's <strong>${archetype.bottleneckTitle}</strong>.
        </p>
        <div style="background-color: #f0fdf4; border-left: 4px solid #4A8B2C; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0 0 8px 0; font-weight: 700; color: #14532d;">Why You Feel Drained:</p>
          <p style="margin: 0; font-size: 14px; color: #166534;">${archetype.mechanism}</p>
        </div>

        <h3 style="font-size: 16px; color: #111827; margin-bottom: 10px;">
          Your Shifted ${wake} Wake Schedule Preview (${diet.label}):
        </h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px 0; font-weight: 700; color: #4A8B2C; width: 130px;">${tHydrate}</td>
            <td style="padding: 8px 0;"><strong>Circadian Anchor:</strong> ${archetype.morningFix}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px 0; font-weight: 700; color: #4A8B2C;">${tMove}</td>
            <td style="padding: 8px 0;"><strong>Morning Mobility &amp; Breath:</strong> 20-min joint awakening &amp; nasal breath primer</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px 0; font-weight: 700; color: #4A8B2C;">${tBreakfast}</td>
            <td style="padding: 8px 0;"><strong>Anti-Crash Breakfast:</strong> ${diet.breakfast}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 8px 0; font-weight: 700; color: #4A8B2C;">${tMidday}</td>
            <td style="padding: 8px 0;"><strong>Midday Recharge:</strong> ${diet.lunch} + 45-min cortisol-flushing walk</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 700; color: #4A8B2C;">${tSunset}</td>
            <td style="padding: 8px 0;"><strong>Evening Lock:</strong> ${archetype.eveningFix}</td>
          </tr>
        </table>

        <div style="text-align: center; margin: 28px 0;">
          <a href="${checkoutUrl}" style="background-color: #4A8B2C; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 9999px; font-weight: 700; display: inline-block;">
            Unlock Your Interactive 24-Hour Reset Portal ($19) →
          </a>
          <p style="font-size: 12px; color: #6b7280; margin-top: 8px;">
            Instant 1-click access • Live 1-Tap Delay Rescheduler • 14-Day Money-Back Guarantee
          </p>
        </div>
        ${footerHtml}
      </div>
    `;
    const text = `Hi ${firstName},\n\nHere is your ${archetype.name} Blueprint (${wake} Wake Schedule).\n\n#1 Bottleneck: ${archetype.bottleneckTitle}\n${archetype.mechanism}\n\nYour Shifted ${wake} Schedule (${diet.label}):\n- ${tHydrate}: ${archetype.morningFix}\n- ${tMove}: 20-min joint awakening & nasal breath primer\n- ${tBreakfast}: ${diet.breakfast}\n- ${tMidday}: ${diet.lunch} + 45-min outdoor walk\n- ${tSunset}: ${archetype.eveningFix}\n\nUnlock your interactive 24-Hour Reset Portal ($19 one-time): ${checkoutUrl}\n\nUnsubscribe: ${unsubscribeUrl}`;
    return { stage: 1, delayLabel: "Immediate (0m)", subject, preheader, html, text };
  }

  if (stage === 2) {
    const subject = `Why I hit rock bottom as Head of Sales at BMW (and why 30-day challenges fail)`;
    const preheader = `How we solved "${blocker.label}" with the 1-Tap Delay Rescheduler.`;
    const html = `
      <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; color: #1f2937; padding: 20px;">
        <p style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #4A8B2C; margin-bottom: 6px;">
          Founder Note • Stage 2 of 4 (+24 Hours)
        </p>
        <h1 style="font-size: 21px; color: #111827; margin-top: 0; margin-bottom: 12px;">
          ${firstName}, willpower isn't why past routines failed you.
        </h1>
        <p>
          When I was serving as Head of Sales for Inchcape Motors BMW, my calendar looked like a wall of back-to-back crises. Even with 35+ years in competitive sports, I hit a wall of afternoon brain fog and wired, restless nights.
        </p>
        <p>
          Every wellness program told me to commit to a rigid 30-day challenge. And every time a morning meeting ran 20 minutes late, the static PDF timetable broke—and I abandoned the whole thing.
        </p>
        <div style="background-color: #fffbeb; border-left: 4px solid #d97706; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 6px 0; font-weight: 700; color: #92400e;">
            How We Solved Your #1 Past Blocker (${blocker.label}):
          </p>
          <p style="margin: 0; font-size: 14px; color: #78350f;">
            ${blocker.solution}
          </p>
        </div>
        <p>
          You don't need 30 days of perfection. You need <strong>one adaptive 24-hour protocol</strong> calibrated to your ${wake} wake time and ${archetype.name} profile.
        </p>
        <div style="text-align: center; margin: 28px 0;">
          <a href="${checkoutUrl}" style="background-color: #4A8B2C; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 9999px; font-weight: 700; display: inline-block;">
            Start Your 24-Hour Reset With 1-Tap Delay Protection ($19) →
          </a>
        </div>
        <p style="font-size: 14px; color: #4b5563;">
          — Reiko Kevvai<br/>
          Founder, Perfect Day Reset (Ex Head of Sales, Inchcape Motors BMW)
        </p>
        ${footerHtml}
      </div>
    `;
    const text = `Hi ${firstName},\n\nWhen I was Head of Sales for Inchcape Motors BMW, rigid 30-day wellness plans always broke the moment a meeting ran 20 minutes late.\n\nHow we solved your past blocker (${blocker.label}):\n${blocker.solution}\n\nStart your 24-Hour Reset ($19 one-time): ${checkoutUrl}\n\n— Reiko Kevvai\nUnsubscribe: ${unsubscribeUrl}`;
    return { stage: 2, delayLabel: "+24 Hours", subject, preheader, html, text };
  }

  if (stage === 3) {
    const subject = `Inside your ${diet.label} Reset Menu + The 2-Hour Workday Triage`;
    const preheader = `See the exact 3 meals in your ${diet.label} + how to reset on chaotic Tuesdays.`;
    const html = `
      <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; color: #1f2937; padding: 20px;">
        <p style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #4A8B2C; margin-bottom: 6px;">
          Nutrition &amp; Workday Triage • Stage 3 of 4 (+48 Hours)
        </p>
        <h1 style="font-size: 21px; color: #111827; margin-top: 0; margin-bottom: 12px;">
          Inside your ${diet.label} Menu (Zero Blood-Sugar Crashes)
        </h1>
        <p>
          Hi ${firstName}, food is either stabilizing your neurotransmitters or quietly triggering your afternoon crash. Here are the exact 15-minute whole-food meals pre-loaded into your <strong>${diet.label}</strong> inside the portal:
        </p>
        <ul style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px 20px 16px 34px; margin-bottom: 20px; font-size: 14px;">
          <li style="margin-bottom: 8px;"><strong>Breakfast (${tBreakfast}):</strong> ${diet.breakfast}</li>
          <li style="margin-bottom: 8px;"><strong>Metabolic Lunch:</strong> ${diet.lunch}</li>
          <li><strong>Parasympathetic Dinner:</strong> ${diet.dinner}</li>
        </ul>
        <h3 style="font-size: 16px; color: #111827; margin-bottom: 8px;">
          What about chaotic Tuesday/Wednesday workdays?
        </h3>
        <p style="font-size: 14px; color: #374151;">
          On checkout, you can also add our <strong>Emergency 2-Hour Workday Reset &amp; 7-Day Momentum Toolkit (+$12 — Save 60%)</strong>. It gives you a 4-step, 120-minute workday triage protocol, an interactive 7-day habit tracker, and our Executive Dining-Out &amp; Travel Cheat Sheet.
        </p>
        <div style="text-align: center; margin: 28px 0;">
          <a href="${checkoutUrl}" style="background-color: #4A8B2C; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 9999px; font-weight: 700; display: inline-block;">
            Get Your ${diet.label} Plan &amp; Interactive Portal →
          </a>
        </div>
        ${footerHtml}
      </div>
    `;
    const text = `Hi ${firstName},\n\nHere are the 3 meals pre-loaded in your ${diet.label}:\n- Breakfast: ${diet.breakfast}\n- Lunch: ${diet.lunch}\n- Dinner: ${diet.dinner}\n\nPlus, at checkout you can add the Emergency 2-Hour Workday Reset & 7-Day Momentum Toolkit (+$12) for chaotic mid-week workdays.\n\nGet instant access here: ${checkoutUrl}\n\nUnsubscribe: ${unsubscribeUrl}`;
    return { stage: 3, delayLabel: "+48 Hours", subject, preheader, html, text };
  }

  // Stage 4 (+72 Hours)
  const subject = `Got 24 hours this Sunday? Let's reset your nervous system`;
  const preheader = `Final note on your ${archetype.name} plan + our 14-day money-back guarantee.`;
  const html = `
    <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; color: #1f2937; padding: 20px;">
      <p style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #4A8B2C; margin-bottom: 6px;">
        Weekend Invitation • Stage 4 of 4 (+72 Hours)
      </p>
      <h1 style="font-size: 21px; color: #111827; margin-top: 0; margin-bottom: 12px;">
        ${firstName}, imagine waking up at ${wake} Monday morning with a clear head.
      </h1>
      <p>
        This is the last automated note in your diagnostic sequence. If you're still feeling the weight of <strong>${archetype.bottleneckTitle}</strong>, consider giving yourself the next 24 hours to reset.
      </p>
      <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 16px; margin: 20px 0; font-size: 14px;">
        <p style="margin: 0 0 8px 0; font-weight: 700; color: #14532d;">Everything You Get Instantly For $19 (One-Time):</p>
        <ul style="margin: 0; padding-left: 20px; color: #166534;">
          <li><strong>1-Click Instant Portal Login:</strong> Pre-loaded with your ${wake} schedule &amp; ${diet.label}</li>
          <li><strong>Live 1-Tap Delay Rescheduler:</strong> Shift your timeline by +15/+30/+45m anytime</li>
          <li><strong>5-Prompt Evening Reflection Journal:</strong> Unload mental loops before sleep</li>
          <li><strong>14-Day 100% Satisfaction Guarantee:</strong> Feel the shift in 24 hours or get a full refund</li>
        </ul>
      </div>
      <div style="text-align: center; margin: 28px 0;">
        <a href="${checkoutUrl}" style="background-color: #4A8B2C; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 9999px; font-weight: 700; display: inline-block;">
          Claim Your 24-Hour Reset Now ($19) →
        </a>
      </div>
      <p style="font-size: 14px; color: #4b5563;">
        Have a question about whether this fits your schedule? Just hit <strong>Reply</strong> to this email—our team reads and responds to every message.
      </p>
      ${footerHtml}
    </div>
  `;
  const text = `Hi ${firstName},\n\nImagine waking up at ${wake} tomorrow with a clear head and steady energy.\n\nFor a one-time $19 payment (backed by our 14-day money-back satisfaction guarantee), you get instant 1-click access to the interactive Perfect Day Reset portal calibrated to your ${archetype.name} profile and ${diet.label}.\n\nClaim your 24-Hour Reset here: ${checkoutUrl}\n\nHave a question? Just reply to this email.\n\nUnsubscribe: ${unsubscribeUrl}`;
  return { stage: 4, delayLabel: "+72 Hours", subject, preheader, html, text };
}

export function previewAllArchetypeNurtureEmails(params: {
  email?: string;
  firstName?: string;
  archetypeId?: string;
  wakeTime?: string;
  foodPreference?: string;
  pastBlocker?: string;
}): NurtureEmailTemplate[] {
  const lead = {
    email: params.email || "alex@example.com",
    firstName: params.firstName || "Alex",
    archetypeId: params.archetypeId || "cortisol_spiked",
    wakeTime: params.wakeTime || "07:00",
    foodPreference: params.foodPreference || "omni",
    pastBlocker: params.pastBlocker || "ran_late",
  };
  return ([1, 2, 3, 4] as const).map((stage) => buildArchetypeNurtureEmail(lead, stage));
}

export async function sendNextNurtureEmailForLead(lead: AgentLead): Promise<{
  sentStage: number;
  subject: string;
  deliveredViaSendGrid: boolean;
}> {
  const nextStage = Math.min(4, Math.max(1, (lead.nurtureStage || 0) + 1)) as 1 | 2 | 3 | 4;
  const template = buildArchetypeNurtureEmail(lead, nextStage);
  const fromEmail = process.env.SMTP_FROM || "perfectdayreset@gmail.com";

  const delivered = await sendEmail({
    to: lead.email,
    from: fromEmail,
    subject: template.subject,
    text: template.text,
    html: template.html,
  });

  const nextEmailAt =
    nextStage < 4 ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null;

  await storage.updateAgentLeadStage(lead.email, nextStage, nextEmailAt);

  await storage.logEmail({
    email: lead.email,
    emailType: `agent_nurture_stage_${nextStage}`,
    subject: template.subject,
    status: delivered ? "sent" : "simulated",
    userId: 1,
  });

  await storage.createAgentInteraction({
    channel: "email_outbound",
    senderIdentifier: lead.email,
    inboundMessage: `Autonomous Nurture Trigger (Stage ${nextStage}/4 • ${lead.archetypeId})`,
    agentReply: template.subject,
    metadata: JSON.stringify({
      stage: nextStage,
      archetypeId: lead.archetypeId,
      wakeTime: lead.wakeTime,
      foodPreference: lead.foodPreference,
      deliveredViaSendGrid: delivered,
      nextEmailAt: nextEmailAt ? nextEmailAt.toISOString() : null,
    }),
  });

  return {
    sentStage: nextStage,
    subject: template.subject,
    deliveredViaSendGrid: delivered,
  };
}

export async function enrollOrUpdateAgentLead(params: {
  email: string;
  firstName?: string | null;
  source: "quiz" | "checkout_abandoned" | "waitlist" | "ig_dm";
  archetypeId?: string;
  wakeTime?: string;
  foodPreference?: string;
  pastBlocker?: string;
  sendStage1Immediately?: boolean;
}): Promise<AgentLead> {
  const normalizedEmail = params.email.trim().toLowerCase();
  const existing = await storage.getAgentLeadByEmail(normalizedEmail);
  const now = new Date();

  const defaultNextEmailAt =
    params.source === "checkout_abandoned"
      ? new Date(now.getTime() + 15 * 60 * 1000) // +15 minutes on abandoned checkout
      : now;

  const lead = await storage.upsertAgentLead({
    email: normalizedEmail,
    firstName: params.firstName ?? existing?.firstName ?? null,
    source: existing?.source === "quiz" ? "quiz" : params.source,
    archetypeId: params.archetypeId ?? existing?.archetypeId ?? "cortisol_spiked",
    wakeTime: params.wakeTime ?? existing?.wakeTime ?? "07:00",
    foodPreference: params.foodPreference ?? existing?.foodPreference ?? "omni",
    pastBlocker: params.pastBlocker ?? existing?.pastBlocker ?? "ran_late",
    nextEmailAt:
      existing && existing.nurtureStage > 0
        ? existing.nextEmailAt
        : defaultNextEmailAt,
  });

  if (
    params.sendStage1Immediately &&
    !lead.hasPurchased &&
    !lead.unsubscribed &&
    lead.nurtureStage === 0
  ) {
    await sendNextNurtureEmailForLead(lead);
    return (await storage.getAgentLeadByEmail(normalizedEmail)) || lead;
  }

  return lead;
}

export async function processDueAgentNurtureEmails(): Promise<{
  processedCount: number;
  results: Array<{ email: string; sentStage: number; subject: string }>;
}> {
  const dueLeads = await storage.getDueAgentLeads(new Date());
  const results: Array<{ email: string; sentStage: number; subject: string }> = [];

  for (const lead of dueLeads) {
    if (lead.hasPurchased || lead.unsubscribed || lead.nurtureStage >= 4) {
      continue;
    }
    try {
      const res = await sendNextNurtureEmailForLead(lead);
      results.push({
        email: lead.email,
        sentStage: res.sentStage,
        subject: res.subject,
      });
    } catch (err) {
      console.warn(`Failed to process nurture email for ${lead.email}:`, err);
    }
  }

  return {
    processedCount: results.length,
    results,
  };
}
