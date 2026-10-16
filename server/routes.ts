import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSubscriberSchema, users } from "@shared/schema";
import { setupAuth, hashPassword } from "./auth";
import { z, ZodError } from "zod";
import {
  sendEmail,
  sendWelcomeEmail,
  sendPurchaseWelcomeEmail,
  sendWelcomeEmailWithCredentials,
} from "./utils/sendgrid";
import { emailService } from "./utils/emailService";
import Stripe from "stripe";
import express from "express";
import { body, validationResult } from "express-validator";
import { db } from "./db";
import { eq } from "drizzle-orm";
import rateLimit from "express-rate-limit";
import { CATALOG_VERSION_V1 } from "./reset/activity-catalog";
import { generateInitialResetSchedule } from "./reset/scheduler";
import { createResetSchema } from "./reset/setup-schema";
import { allowedEntryKinds, resetEntrySchema } from "./reset/entry-schema";
import { delayRequestSchema } from "./reset/delay-schema";
import { AdvanceResetResult } from "./storage";
import { quizSubmissionSchema, generateQuizDiagnostic } from "./quiz";
import {
  enrollOrUpdateAgentLead,
  processDueAgentNurtureEmails,
  previewAllArchetypeNurtureEmails,
  sendNextNurtureEmailForLead,
} from "./agent/email-nurture";
import { generateAutonomousReply } from "./agent/reply-agent";
import { getFlowUltraBatch } from "./agent/flow-ultra-factory";

if (!process.env.STRIPE_SECRET_KEY && process.env.NODE_ENV === "production") {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn(
    "Warning: STRIPE_SECRET_KEY is not set. Using local dev payment simulation until STRIPE_SECRET_KEY is configured."
  );
}

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-03-31.basil",
    })
  : (null as unknown as Stripe);

// Helper function to generate unique username
function generateUsername(): string {
  const adjectives = ['swift', 'bright', 'calm', 'bold', 'wise', 'pure', 'fresh', 'strong', 'clear', 'vibrant'];
  const nouns = ['warrior', 'dreamer', 'seeker', 'explorer', 'creator', 'builder', 'achiever', 'champion', 'pioneer', 'master'];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 1000);
  return `${adjective}_${noun}_${number}`;
}

// Helper function to generate secure password
function generateSecurePassword(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Store credentials temporarily for successful payments
const paymentCredentials = new Map<
  string,
  { username: string; password: string; email?: string | null; timestamp: number }
>();

// Prevent concurrent duplicate user creation between webhook and self-healing GET /api/payment-success
const provisioningLocks = new Map<
  string,
  Promise<{ username: string; password?: string; email: string | null }>
>();

async function provisionPaidUser(
  paymentIntent: Stripe.PaymentIntent
): Promise<{ username: string; password?: string; email: string | null }> {
  const paymentIntentId = paymentIntent.id;

  const existingLock = provisioningLocks.get(paymentIntentId);
  if (existingLock) {
    return existingLock;
  }

  const task = (async () => {
    const cached = paymentCredentials.get(paymentIntentId);
    if (cached) {
      return {
        username: cached.username,
        password: cached.password,
        email: cached.email ?? null,
      };
    }

    const customerEmail =
      paymentIntent.receipt_email ||
      paymentIntent.metadata?.customer_email ||
      null;

    // Check if user already exists in PostgreSQL for this paymentIntent.id
    const existingUser = await storage.getUserByStripeSessionId(paymentIntentId);
    if (existingUser) {
      if (customerEmail) {
        storage.markAgentLeadPurchased(customerEmail).catch(() => {});
      }
      return {
        username: existingUser.username,
        email: existingUser.email || customerEmail,
      };
    }

    // Generate unique username and password
    let username = generateUsername();
    let attempts = 0;
    while ((await storage.getUserByUsername(username)) && attempts < 10) {
      username = generateUsername();
      attempts++;
    }

    const plainPassword = generateSecurePassword();
    const hashedPassword = await hashPassword(plainPassword);

    const user = await storage.createUser({
      username,
      password: hashedPassword,
      email: customerEmail,
      stripeSessionId: paymentIntentId,
    });

    if (process.env.NODE_ENV !== "production") {
      console.log(
        `Provisioned user: ${user.username} (ID: ${user.id}) for payment: ${paymentIntentId}`
      );
    }

    paymentCredentials.set(paymentIntentId, {
      username,
      password: plainPassword,
      email: customerEmail,
      timestamp: Date.now(),
    });

    if (customerEmail) {
      storage.markAgentLeadPurchased(customerEmail).catch(() => {});

      const includeOrderBump =
        paymentIntent.metadata?.includeOrderBump === "true" ||
        paymentIntent.amount === 3100;
      sendWelcomeEmailWithCredentials(customerEmail, username, plainPassword, {
        amountCents: paymentIntent.amount,
        includeOrderBump,
      }).catch((emailError) => {
        if (process.env.NODE_ENV !== "production") {
          console.error(
            `Error sending purchase welcome email to ${customerEmail}:`,
            emailError
          );
        }
      });
    }

    return {
      username,
      password: plainPassword,
      email: customerEmail,
    };
  })();

  provisioningLocks.set(paymentIntentId, task);
  try {
    return await task;
  } finally {
    provisioningLocks.delete(paymentIntentId);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Clean up expired credentials (older than 1 hour)
  setInterval(() => {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    const keysToDelete: string[] = [];
    Array.from(paymentCredentials.entries()).forEach(([key, value]) => {
      if (value.timestamp < oneHourAgo) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => paymentCredentials.delete(key));
  }, 10 * 60 * 1000); // Clean up every 10 minutes

  // Test email endpoint (development only)
  app.post("/api/test-email", async (req, res) => {
    if (process.env.NODE_ENV === "production") {
      return res.status(404).json({ message: "Not found" });
    }
    try {
      const success = await sendWelcomeEmail("reikokevvai@gmail.com");
      
      if (success) {
        res.json({ message: "Test email sent successfully to reikokevvai@gmail.com" });
      } else {
        res.status(500).json({ message: "Failed to send test email" });
      }
    } catch (error: any) {
      console.error("Email test error:", error);
      res.status(500).json({ message: "Email service error", error: error.message });
    }
  });
  // API route for newsletter subscription
  app.post("/api/subscribe", async (req, res) => {
    try {
      // Validate request body
      const validatedData = insertSubscriberSchema.parse(req.body);
      
      // Check if subscriber already exists
      const existingSubscriber = await storage.getSubscriberByEmail(validatedData.email);
      
      if (existingSubscriber) {
        return res.status(409).json({ 
          message: "This email is already subscribed to our newsletter." 
        });
      }
      
      // Create new subscriber
      const newSubscriber = await storage.createSubscriber(validatedData);

      // Enroll in autonomous agent nurture queue (waitlist source)
      enrollOrUpdateAgentLead({
        email: validatedData.email,
        source: "waitlist",
        sendStage1Immediately: false,
      }).catch(() => {});
      
      // Send welcome email (non-blocking)
      sendWelcomeEmail(validatedData.email)
        .then((sent) => {
          if (process.env.NODE_ENV !== 'production' && sent) {
            console.log(`Welcome email sent to ${validatedData.email}`);
          }
        })
        .catch((err) => {
          if (process.env.NODE_ENV !== 'production') {
            console.error(`Error sending welcome email to ${validatedData.email}:`, err);
          }
        });
      
      return res.status(201).json({ 
        message: "Successfully subscribed to newsletter",
        subscriber: newSubscriber
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid email address", 
          errors: error.errors 
        });
      }
      
      if (process.env.NODE_ENV !== 'production') {
        console.error("Error subscribing to newsletter:", error);
      }
      return res.status(500).json({ 
        message: "An error occurred while subscribing. Please try again." 
      });
    }
  });

  // 60-Second AI + Deterministic Reset Diagnostic Quiz endpoint
  app.post("/api/quiz/diagnose", async (req, res) => {
    try {
      const validatedData = quizSubmissionSchema.parse(req.body);
      const report = await generateQuizDiagnostic(validatedData);

      const cleanEmail = validatedData.email?.trim();
      if (cleanEmail) {
        try {
          const existingSubscriber = await storage.getSubscriberByEmail(cleanEmail);
          if (!existingSubscriber) {
            await storage.createSubscriber({ email: cleanEmail });
          }
        } catch (subErr) {
          if (process.env.NODE_ENV !== "production") {
            console.warn("Non-fatal quiz subscriber upsert warning:", subErr);
          }
        }

        try {
          await storage.addMarketingEmail({
            email: cleanEmail,
            firstName: validatedData.firstName || null,
          });
        } catch {
          // Ignore duplicate marketing_emails constraint if email already exists
        }

        try {
          await enrollOrUpdateAgentLead({
            email: cleanEmail,
            firstName: validatedData.firstName || null,
            source: "quiz",
            archetypeId: report.archetype.id,
            wakeTime: validatedData.wakeTime,
            foodPreference: validatedData.foodPreference,
            pastBlocker: validatedData.pastBlocker,
            sendStage1Immediately: true,
          });
        } catch (agentErr) {
          if (process.env.NODE_ENV !== "production") {
            console.warn("Non-fatal quiz agent lead enrollment warning:", agentErr);
          }
        }

        try {
          if (req.isAuthenticated() && req.user?.id) {
            await storage.logEmail({
              email: cleanEmail,
              emailType: "quiz_diagnostic",
              subject: `Quiz Diagnostic: ${report.archetype.name} (${report.severityScore}/100)`,
              status: "sent",
              userId: req.user.id,
            });
          }
        } catch {
          // Non-fatal if user_id FK or email_logs is unavailable
        }
      }

      return res.status(200).json({
        report,
        leadCaptured: Boolean(cleanEmail),
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Invalid quiz submission data",
          errors: error.errors,
        });
      }
      console.error("Error generating quiz diagnostic:", error);
      return res.status(500).json({
        message: "Failed to generate diagnostic report",
      });
    }
  });

  // Reset Run Retrieval
  app.get("/api/reset-runs/current", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const resetData = await storage.getResetRunAndItemsByUserId(req.user.id);
      
      if (!resetData) {
        // Return 404 because this accurately represents a missing resource for the logged-in user,
        // allowing the frontend to easily differentiate between "no active setup" (404) and "not logged in" (401).
        return res.status(404).json({ message: "No Reset found" });
      }

      // Derive lightweight currentItem deterministically
      const activeItem = resetData.items.find(item => item.status === 'active');
      const nextScheduledItem = resetData.items.find(item => item.status === 'scheduled');
      const currentItem = activeItem || nextScheduledItem || null;

      return res.status(200).json({
        resetRun: resetData.resetRun,
        items: resetData.items,
        currentItem
      });
    } catch (error) {
      console.error("Error fetching current reset run:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Start the Reset Run
  app.post("/api/reset-runs/current/start", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const result = await storage.startResetRunForUser(req.user.id);
      
      if (result.type === "not_found") {
        return res.status(404).json({ message: "No Reset found" });
      }

      if (result.type === "invalid_state") {
        return res.status(409).json({ message: "Reset cannot be started from its current state" });
      }

      if (result.type === "corrupt_state") {
        return res.status(500).json({ message: "Reset is in a corrupt state (no scheduled items)" });
      }

      // Both already_active and success return the same shape payload
      // Derive currentItem for frontend
      const activeItem = result.items.find(item => item.status === 'active');
      const nextScheduledItem = result.items.find(item => item.status === 'scheduled');
      const currentItem = activeItem || nextScheduledItem || null;

      // HTTP 200 OK is used since idempotency means we are simply returning the active state
      return res.status(200).json({
        resetRun: result.resetRun,
        items: result.items,
        currentItem
      });

    } catch (error) {
      console.error("Error starting reset run:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  const handleAdvanceResult = (res: any, result: AdvanceResetResult) => {
    if (result.type === "not_found") return res.status(404).json({ message: "No Reset found" });
    if (result.type === "item_not_found") return res.status(404).json({ message: "Item not found in current Reset" });
    if (result.type === "conflict") return res.status(409).json({ message: "Item cannot be modified from its current state" });
    if (result.type === "reflection_required") return res.status(409).json({ message: "Next-morning reflection is required before completing the Reset" });
    if (result.type === "corrupt_state") return res.status(500).json({ message: "Reset is in a corrupt state" });
    
    const activeItem = result.items.find(item => item.status === 'active');
    const nextScheduledItem = result.items.find(item => item.status === 'scheduled');
    const currentItem = activeItem || nextScheduledItem || null;
    
    return res.status(200).json({
      resetRun: result.resetRun,
      items: result.items,
      currentItem
    });
  };

  // Complete an item
  app.post("/api/reset-runs/current/items/:itemId/complete", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const itemId = parseInt(req.params.itemId, 10);
    if (isNaN(itemId) || itemId <= 0) {
      return res.status(400).json({ message: "Invalid item ID" });
    }
    try {
      const result = await storage.advanceResetItemForUser(req.user.id, itemId, "complete");
      return handleAdvanceResult(res, result);
    } catch (error) {
      console.error("Error completing item:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Skip an item
  app.post("/api/reset-runs/current/items/:itemId/skip", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const itemId = parseInt(req.params.itemId, 10);
    if (isNaN(itemId) || itemId <= 0) {
      return res.status(400).json({ message: "Invalid item ID" });
    }
    try {
      const result = await storage.advanceResetItemForUser(req.user.id, itemId, "skip");
      return handleAdvanceResult(res, result);
    } catch (error) {
      console.error("Error skipping item:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Delay Reset Item
  app.post("/api/reset-runs/current/items/:itemId/delay", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const itemId = parseInt(req.params.itemId);
    if (isNaN(itemId) || itemId <= 0) {
      return res.status(400).json({ message: "Invalid item ID" });
    }

    const parsed = delayRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid delay parameters", errors: parsed.error.errors });
    }

    try {
      const result = await storage.delayResetItemForUser(
        req.user.id,
        itemId,
        parsed.data.delayMinutes,
        parsed.data.expectedScheduleRevision
      );

      if (result.type === "not_found") return res.status(404).json({ message: "No Reset found" });
      if (result.type === "item_not_found") return res.status(404).json({ message: "Item not found in current Reset" });
      if (result.type === "invalid_lifecycle") return res.status(409).json({ message: "Reset must be active to delay an item" });
      if (result.type === "conflict") return res.status(409).json({ message: "Item must be active to be delayed" });
      if (result.type === "corrupt_state") return res.status(500).json({ message: "Reset is in a corrupt state" });
      if (result.type === "stale_revision") return res.status(409).json({ message: "Reset schedule has changed; refresh and try again" });
      if (result.type === "schedule_conflict") return res.status(409).json({ message: "The requested delay does not fit before your planned bedtime" });

      const activeItem = result.items.find(item => item.status === 'active');
      const nextScheduledItem = result.items.find(item => item.status === 'scheduled');
      const currentItem = activeItem || nextScheduledItem || null;

      return res.status(200).json({
        resetRun: result.resetRun,
        items: result.items,
        currentItem
      });
    } catch (error) {
      console.error("Error delaying item:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Next Morning Transition
  app.post("/api/reset-runs/current/next-morning", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const result = await storage.startNextMorningForUser(req.user.id);
      
      if (result.type === "not_found") {
        return res.status(404).json({ message: "No Reset found" });
      }

      if (result.type === "invalid_state") {
        return res.status(409).json({ message: "Reset cannot enter next morning from its current state" });
      }

      if (result.type === "corrupt_state") {
        return res.status(500).json({ message: "Reset is in a corrupt state" });
      }

      const activeItem = result.items.find(item => item.status === 'active');
      const nextScheduledItem = result.items.find(item => item.status === 'scheduled');
      const currentItem = activeItem || nextScheduledItem || null;

      return res.status(200).json({
        resetRun: result.resetRun,
        items: result.items,
        currentItem
      });

    } catch (error) {
      console.error("Error starting next morning:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Save Reflection Entry
  app.put("/api/reset-runs/current/entries/:kind", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const kind = req.params.kind as any;
    if (!allowedEntryKinds.includes(kind)) {
      return res.status(400).json({ message: "Invalid entry kind" });
    }
    
    const parsed = resetEntrySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid reflection content", errors: parsed.error.errors });
    }

    try {
      const result = await storage.saveResetEntryForUser(req.user.id, kind, parsed.data.content);
      
      if (result.type === "not_found") {
        return res.status(404).json({ message: "No Reset found" });
      }

      if (result.type === "invalid_lifecycle") {
        return res.status(409).json({ message: "Reflection cannot be saved in the current Reset state" });
      }

      return res.status(200).json({ entry: result.entry });
    } catch (error) {
      console.error("Error saving reflection:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get Reflection Entries
  app.get("/api/reset-runs/current/entries", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const result = await storage.getResetEntriesForUser(req.user.id);
      
      if (result.type === "not_found") {
        return res.status(404).json({ message: "No Reset found" });
      }

      return res.status(200).json({ entries: result.entries });
    } catch (error) {
      console.error("Error fetching reflections:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update Reset Run Preferences (e.g., foodPreference)
  app.patch("/api/reset-runs/current/preferences", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { foodPreference } = req.body || {};
    if (
      typeof foodPreference !== "string" ||
      ![
        "omni",
        "veg",
        "vegetarian",
        "vegan",
        "paleo",
        "gluten-free",
        "keto",
        "fasting",
        "Regular",
        "Keto",
        "Vegetarian",
      ].includes(foodPreference)
    ) {
      return res.status(400).json({ message: "Invalid foodPreference value" });
    }

    try {
      const result = await storage.updateResetFoodPreferenceForUser(
        req.user.id,
        foodPreference
      );
      if (result.type === "not_found") {
        return res.status(404).json({ message: "No Reset found" });
      }
      return res.status(200).json({ resetRun: result.resetRun });
    } catch (error) {
      console.error("Error updating reset preferences:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Reset Run Creation
  app.post("/api/reset-runs", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Validate body
    let validatedData;
    try {
      validatedData = createResetSchema.parse(req.body);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid setup data", errors: error.errors });
      }
      return res.status(400).json({ message: "Invalid request payload" });
    }

    // V0.1 limitation: 1 purchase = 1 reset run. If user already has a run, block it.
    // Pre-check for fast failure. Authoritative check is in the transaction.
    try {
      const existingRun = await storage.getResetRunByUserId(req.user.id);
      if (existingRun) {
        return res.status(409).json({ 
          message: "A Perfect Day Reset has already been created for this account.",
          resetRun: existingRun 
        });
      }
    } catch (error) {
      console.error("Error checking existing run:", error);
      return res.status(500).json({ message: "Internal server error" });
    }

    // Generate schedule (handles chronological validation and overlaps)
    let generatedItems;
    try {
      generatedItems = generateInitialResetSchedule({
        startAt: validatedData.startAt,
        targetBedtimeAt: validatedData.targetBedtimeAt,
        targetNextMorningAt: validatedData.targetNextMorningAt,
        timezone: validatedData.timezone
      });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }

    // Prepare insert objects
    const insertRun = {
      userId: req.user.id,
      catalogVersion: CATALOG_VERSION_V1,
      status: "ready",
      phase: null,
      scheduleRevision: 0,
      timezone: validatedData.timezone,
      startAt: validatedData.startAt,
      targetBedtimeAt: validatedData.targetBedtimeAt,
      targetNextMorningAt: validatedData.targetNextMorningAt,
      resetGoal: validatedData.resetGoal || null,
      foodPreference: validatedData.foodPreference || null,
      movementAccess: validatedData.movementAccess || null,
      blockedTimesJson: validatedData.blockedTimesJson || null
    };

    const insertItems = generatedItems.map(item => ({
      activityKey: item.activityKey,
      variantKey: item.variantKey,
      phase: item.phase,
      sequence: item.sequence,
      originalScheduledAt: item.originalScheduledAt,
      scheduledAt: item.scheduledAt,
      durationMinutes: item.durationMinutes,
      status: item.status as "scheduled"
    }));

    try {
      const result = await storage.createResetRun(insertRun, insertItems);
      
      if ('existingRun' in result) {
        return res.status(409).json({ 
          message: "A Perfect Day Reset has already been created for this account.",
          resetRun: result.existingRun 
        });
      }

      return res.status(201).json({
        resetRun: result.resetRun,
        items: result.items
      });
    } catch (error) {
      console.error("Error creating reset run:", error);
      return res.status(500).json({ message: "An error occurred while saving the Reset." });
    }
  });

  // Stripe payment intent creation
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { email, receipt_email, includeOrderBump } = req.body || {};
      const checkoutEmail = (email || receipt_email || "").trim().toLowerCase();
      const hasOrderBump = Boolean(includeOrderBump);

      if (checkoutEmail) {
        try {
          const parsed = insertSubscriberSchema.safeParse({ email: checkoutEmail });
          if (parsed.success) {
            const existingSubscriber = await storage.getSubscriberByEmail(parsed.data.email);
            if (!existingSubscriber) {
              await storage.createSubscriber(parsed.data);
            }
          }
          await enrollOrUpdateAgentLead({
            email: checkoutEmail,
            source: "checkout_abandoned",
            sendStage1Immediately: false,
          });
        } catch (subErr) {
          if (process.env.NODE_ENV !== "production") {
            console.error("Non-fatal error capturing checkout subscriber email:", subErr);
          }
        }
      }

      const amount = hasOrderBump ? 31 : 19; // Server-side price calculation: $19 base or $31 with +$12 order bump
      const amountCents = Math.round(amount * 100); // 1900 or 3100 cents
      const climateContribution = Math.round(amount * 0.005 * 100); // 0.5% for CO₂ removal
      const metadata = {
        product: hasOrderBump
          ? "perfect_day_reset_plus_7day_momentum_kit"
          : "perfect_day_reset",
        includeOrderBump: hasOrderBump ? "true" : "false",
        customer_email: email || receipt_email || "",
        climate_contribution: `$${(climateContribution / 100).toFixed(2)}`,
        climate_percentage: "0.5%",
      };

      if (!stripe && process.env.NODE_ENV !== "production") {
        const mockId = `pi_dev_${Date.now()}`;
        return res.json({
          clientSecret: `${mockId}_secret_local_dev`,
          amount,
          amountCents,
          includeOrderBump: hasOrderBump,
          metadata,
          mode: "local_dev_simulation",
        });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountCents,
        currency: "usd",
        receipt_email: email || receipt_email,
        metadata,
      });
      res.json({
        clientSecret: paymentIntent.client_secret,
        amount,
        amountCents,
        includeOrderBump: hasOrderBump,
      });
    } catch (error: any) {
      res.status(500).json({ 
        message: "Error creating payment intent: " + error.message 
      });
    }
  });

  // Read-only AI Marketing Agent & Content Feed Export Endpoint
  app.get("/api/marketing/agent-brief", (_req, res) => {
    return res.status(200).json({
      brand: {
        name: "Perfect Day Reset",
        domain: "https://perfectdayreset.com",
        positioning:
          "Science-backed 24-hour lifestyle & nervous system reboot combining a Live Interactive Web Companion Portal (with 1-Tap Delay Rescheduler and 5 Nutrition Modes) + Printable PDF Blueprint.",
        socialImpact: "Every purchase donates $1 to children's programs and 0.5% to Stripe Climate CO2 removal.",
        guarantee: "30-Day 100% Money-Back Satisfaction Guarantee",
      },
      founder: {
        name: "Reiko Kevvai",
        credentials: "Ex Head of Sales for Inchcape Motors BMW • 35+ Years in Competitive Sports & High-Performance Recovery",
        originHook:
          "Built after corporate burnout hit at full speed—because exhausted high performers don't need another rigid 30-day challenge that 85% quit by Day 4; they need one engineered 24-hour reset day.",
      },
      offers: {
        coreOffer: {
          name: "The Perfect Day Reset (24-Hour Protocol)",
          priceUsd: 19,
          deliverables: [
            "Interactive Hour-by-Hour Web Companion Portal (Prep, Morning Activation, Midday Recharge, Evening Decompression & Next-Morning Check-In)",
            "Live 1-Tap Delay Rescheduler (recalculates the remaining day automatically when running 15–45 mins late)",
            "5 Customizable Nutrition Modes (Omnivore, Vegetarian, Keto, Paleo, Vegan) with 1-Click Grocery Lists",
            "Interactive Hydration Calculator, Digital Detox Checklist & 5-Prompt Cognitive Unload Reflection Journal",
            "Printable 24-Hour Reset PDF Blueprint & Personalized Certificate of Completion",
          ],
        },
        orderBump: {
          name: "7-Day Momentum & Emergency 2-Hour Workday Reset Kit",
          priceUsd: 12,
          bundleTotalUsd: 31,
          deliverables: [
            "The Emergency 2-Hour Mid-Week Reset Protocol (120-minute triage checklist for chaotic Tuesday/Wednesday workdays)",
            "Interactive 7-Day Post-Reset Habit & Energy Tracker",
            "High-Stress Executive Travel & Dining-Out Cheat Sheet (across all 5 nutrition tracks)",
          ],
        },
      },
      overwhelmArchetypes: [
        {
          id: "cortisol_spiked",
          name: "Cortisol-Spiked High Performer",
          bottleneck: "Inverted Cortisol-Melatonin Rhythm",
          symptomHook: "Sluggish, foggy mornings paired with a 'tired but wired' racing mind after 9:30 PM.",
        },
        {
          id: "dopamine_depleted",
          name: "Dopamine-Depleted Multitasker",
          bottleneck: "Prefrontal Dopamine Receptor Fatigue",
          symptomHook: "Checking notifications within 5 minutes of waking and battling fragmented attention all day.",
        },
        {
          id: "metabolic_crasher",
          name: "Metabolic Midday Crasher",
          bottleneck: "Post-Prandial Glucose & Electrolyte Dip",
          symptomHook: "Powering through the morning on caffeine only to hit a wall of brain fog at 2:00 PM.",
        },
        {
          id: "systemic_burnout",
          name: "Systemic Burnout Recovery",
          bottleneck: "HPA-Axis & Autonomic Exhaustion",
          symptomHook: "Running on willpower for months with flatlined energy and unrefreshing sleep.",
        },
      ],
      targetHooks: [
        "Why 85% of high performers quit 30-day wellness challenges by Day 4—and why 24 intentional hours works instead.",
        "Running 15 minutes late shouldn't ruin your reset day: Meet the 1-Tap Delay Rescheduler.",
        "Take the free 60-Second Burnout & Reset Diagnostic to see your custom wake-time schedule and nutrition track.",
      ],
      funnelUrls: {
        home: "https://perfectdayreset.com/",
        diagnosticQuiz: "https://perfectdayreset.com/quiz",
        salesBreakdown: "https://perfectdayreset.com/what-you-get",
        checkout: "https://perfectdayreset.com/checkout",
        founderStory: "https://perfectdayreset.com/about",
      },
    });
  });

  // Stripe webhook for automatic user creation
  app.post("/api/stripe-webhook", express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('STRIPE_WEBHOOK_SECRET not configured');
      return res.status(500).send('Webhook endpoint not properly configured');
    }

    try {
      const rawPayload = (req as any).rawBody || req.body;
      event = stripe.webhooks.constructEvent(rawPayload, sig!, process.env.STRIPE_WEBHOOK_SECRET);
      console.log(`Webhook received successfully: ${event.type}`);
    } catch (err: any) {
      console.error(`Webhook signature verification failed:`, err.message);
      console.error(`Webhook secret length: ${process.env.STRIPE_WEBHOOK_SECRET?.length || 0}`);
      console.error(`Body type: ${typeof req.body}`);
      console.error(`Signature header: ${sig ? 'present' : 'missing'}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the payment_intent.succeeded event
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      
      if (process.env.NODE_ENV !== 'production') {
        console.log(`Webhook received for payment: ${paymentIntent.id}`);
        console.log(`Payment amount: ${paymentIntent.amount} ${paymentIntent.currency}`);
        console.log(`Customer email: ${paymentIntent.receipt_email || paymentIntent.metadata?.customer_email}`);
      }
      
      try {
        await provisionPaidUser(paymentIntent);
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Error in webhook processing:', error);
        }
        return res.status(500).json({ error: 'Failed to process webhook' });
      }
    }

    res.json({ received: true });
  });

  // Get user credentials after payment (for success page)
  // Test endpoint to simulate webhook processing (development only)
  app.post("/api/test-webhook/:paymentIntentId", async (req, res) => {
    if (process.env.NODE_ENV === 'production') {
      return res.status(404).json({ message: "Not found" });
    }

    const { paymentIntentId } = req.params;
    const { email, amount } = req.body;
    
    try {
      // Check if user already exists for this payment intent
      const existingUser = await storage.getUserByStripeSessionId(paymentIntentId);
      if (existingUser) {
        console.log('User already exists for payment:', paymentIntentId);
        return res.json({ received: true, username: existingUser.username });
      }

      // Generate unique username and password
      let username = generateUsername();
      let attempts = 0;
      while (await storage.getUserByUsername(username) && attempts < 10) {
        username = generateUsername();
        attempts++;
      }

      const plainPassword = generateSecurePassword();
      const hashedPassword = await hashPassword(plainPassword);

      console.log(`Test webhook: Creating user: ${username} for payment: ${paymentIntentId}`);

      // Create user account
      const user = await storage.createUser({
        username,
        password: hashedPassword,
        email: email || null,
        stripeSessionId: paymentIntentId
      });

      console.log(`Test webhook: Successfully created user: ${user.username} with ID: ${user.id}`);

      // Store credentials temporarily for success page access
      paymentCredentials.set(paymentIntentId, {
        username,
        password: plainPassword,
        email: email || null,
        timestamp: Date.now()
      });

      console.log(`Test webhook: Stored credentials for payment: ${paymentIntentId}`);

      // Send welcome email if email provided
      if (email) {
        storage.markAgentLeadPurchased(email).catch(() => {});
        try {
          await sendWelcomeEmailWithCredentials(email, username, plainPassword, {
            amountCents: amount === 31 || amount === 3100 ? 3100 : 1900,
            includeOrderBump: amount === 31 || amount === 3100,
          });
          console.log(`Test webhook: Purchase welcome email sent to: ${email}`);
        } catch (emailError) {
          console.error(`Test webhook: Error sending email to ${email}:`, emailError);
        }
      }

      res.json({ received: true, username, password: plainPassword, email: email || null });
    } catch (error) {
      console.error('Test webhook error:', error);
      res.status(500).json({ error: 'Failed to process test webhook' });
    }
  });

  // Emergency endpoint to manually process previous payments (development only)
  app.post("/api/manual-payment-process", async (req, res) => {
    if (process.env.NODE_ENV === 'production') {
      return res.status(404).json({ message: "Not found" });
    }

    const { paymentIntentId, email } = req.body;
    
    if (!paymentIntentId || !email) {
      return res.status(400).json({ message: "Payment intent ID and email required" });
    }

    try {
      console.log(`Manual processing payment: ${paymentIntentId} for email: ${email}`);

      // Check if user already exists
      const existingUser = await storage.getUserByStripeSessionId(paymentIntentId);
      if (existingUser) {
        console.log('User already exists:', existingUser.username);
        
        // Store credentials for success page if not already stored
        if (!paymentCredentials.has(paymentIntentId)) {
          // We can't recover the plain password, so generate a new one
          const newPassword = generateSecurePassword();
          const hashedPassword = await hashPassword(newPassword);
          
          // Update user with new password
          await db.update(users).set({ password: hashedPassword }).where(eq(users.id, existingUser.id));
          
          paymentCredentials.set(paymentIntentId, {
            username: existingUser.username,
            password: newPassword,
            email,
            timestamp: Date.now()
          });

          // Send email with new credentials
          await sendWelcomeEmailWithCredentials(email, existingUser.username, newPassword);
          
          return res.json({ 
            success: true, 
            username: existingUser.username, 
            password: newPassword,
            email,
            message: "Existing user updated with new password and email sent"
          });
        }
        
        return res.json({ 
          success: true, 
          username: existingUser.username,
          email: existingUser.email || email,
          message: "User already exists and credentials stored"
        });
      }

      // Create new user
      let username = generateUsername();
      let attempts = 0;
      while (await storage.getUserByUsername(username) && attempts < 10) {
        username = generateUsername();
        attempts++;
      }

      const plainPassword = generateSecurePassword();
      const hashedPassword = await hashPassword(plainPassword);

      const user = await storage.createUser({
        username,
        password: hashedPassword,
        email,
        stripeSessionId: paymentIntentId
      });

      // Store credentials
      paymentCredentials.set(paymentIntentId, {
        username,
        password: plainPassword,
        email,
        timestamp: Date.now()
      });

      // Send welcome email
      await sendWelcomeEmailWithCredentials(email, username, plainPassword);

      console.log(`Manual processing complete: ${username} for payment: ${paymentIntentId}`);

      res.json({ 
        success: true, 
        username, 
        password: plainPassword,
        email,
        message: "Account created and email sent" 
      });
    } catch (error) {
      console.error('Manual payment processing error:', error);
      res.status(500).json({ message: "Error processing payment manually" });
    }
  });

  app.get("/api/payment-success/:paymentIntentId", async (req, res) => {
    try {
      const { paymentIntentId } = req.params;
      
      if (process.env.NODE_ENV !== 'production') {
        console.log(`Looking for payment success data for: ${paymentIntentId}`);
        console.log(`Stored credentials keys:`, Array.from(paymentCredentials.keys()));
      }

      const respondWithAutoLogin = async (payload: {
        username: string;
        password?: string;
        email: string | null;
        message: string;
      }) => {
        const userRecord =
          (await storage.getUserByStripeSessionId(paymentIntentId)) ||
          (await storage.getUserByUsername(payload.username));

        if (userRecord && typeof req.logIn === "function") {
          await new Promise<void>((resolve) => {
            req.logIn(userRecord, (err) => {
              if (err && process.env.NODE_ENV !== "production") {
                console.warn("Auto-login warning on payment-success:", err);
              }
              resolve();
            });
          });
        }

        return res.json({
          ...payload,
          autoLoggedIn: Boolean(userRecord && req.isAuthenticated && req.isAuthenticated()),
          user: userRecord
            ? {
                id: userRecord.id,
                username: userRecord.username,
                email: userRecord.email ?? null,
                createdAt: userRecord.createdAt,
              }
            : undefined,
        });
      };
      
      // 1. Check if we have stored credentials for this payment
      const storedCredentials = paymentCredentials.get(paymentIntentId);
      if (storedCredentials) {
        if (process.env.NODE_ENV !== 'production') {
          console.log(`Found stored credentials for ${paymentIntentId}`);
        }
        return await respondWithAutoLogin({
          username: storedCredentials.username,
          password: storedCredentials.password,
          email: storedCredentials.email ?? null,
          message: "Account created successfully!"
        });
      }

      // 2. Self-healing provisioning: if webhook hasn't fired or is unreachable (e.g., localhost or disabled webhook),
      // verify the PaymentIntent directly with Stripe and provision on the spot if succeeded.
      if (paymentIntentId && paymentIntentId.startsWith("pi_") && stripe) {
        try {
          const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
          if (paymentIntent.status === "succeeded") {
            const provisioned = await provisionPaidUser(paymentIntent);
            if (provisioned.password) {
              return await respondWithAutoLogin({
                username: provisioned.username,
                password: provisioned.password,
                email: provisioned.email,
                message: "Account created successfully!"
              });
            }
            return await respondWithAutoLogin({
              username: provisioned.username,
              email: provisioned.email,
              message: "Account created successfully! Check your email for password."
            });
          }
        } catch (stripeError: any) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn(`Self-healing Stripe retrieve warning for ${paymentIntentId}:`, stripeError?.message);
          }
        }
      }

      // 3. Fallback: check if user exists in database
      const user = await storage.getUserByStripeSessionId(paymentIntentId);
      if (!user) {
        if (process.env.NODE_ENV !== 'production') {
          console.log(`No user found for payment intent: ${paymentIntentId}`);
        }
        return res.status(404).json({ message: "Account is being created. Please check your email for login details." });
      }

      if (process.env.NODE_ENV !== 'production') {
        console.log(`Found user in database for ${paymentIntentId}: ${user.username}`);
      }

      // Return username and email since password is already hashed in DB
      return await respondWithAutoLogin({ 
        username: user.username,
        email: user.email ?? null,
        message: "Account created successfully! Check your email for password."
      });
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error("Error fetching user after payment:", error);
      }
      res.status(500).json({ message: "Error retrieving account information" });
    }
  });



  // Get all subscribers (admin endpoint)
  app.get("/api/subscribers", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (
      process.env.NODE_ENV === "production" &&
      (!process.env.ADMIN_USERNAME || req.user?.username !== process.env.ADMIN_USERNAME)
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    try {
      const subscribers = await storage.getAllSubscribers();
      return res.status(200).json({ subscribers });
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      return res.status(500).json({ 
        message: "An error occurred while fetching subscribers." 
      });
    }
  });

  // Marketing email opt-in endpoint
  app.post("/api/marketing-optin", async (req, res) => {
    try {
      const { email, firstName } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      // Add to marketing list
      await emailService.addToMarketingList({ email, firstName });
      
      res.status(201).json({ message: "Successfully opted in to marketing emails" });
    } catch (error) {
      console.error("Marketing opt-in error:", error);
      res.status(500).json({ message: "Failed to opt in to marketing emails" });
    }
  });

  // Test email endpoint for demonstration (development only)
  app.post("/api/test-welcome-email", async (req, res) => {
    if (process.env.NODE_ENV === "production") {
      return res.status(404).json({ message: "Not found" });
    }

    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      // Generate test credentials
      const testUsername = generateUsername();
      const testPassword = generateSecurePassword();

      await emailService.sendWelcomeEmail({
        email,
        firstName: "Test User",
        username: testUsername,
        password: testPassword,
        userId: 999 // Test user ID
      });
      
      res.status(200).json({ 
        message: "Test welcome email sent successfully",
        testCredentials: { username: testUsername, password: testPassword }
      });
    } catch (error) {
      console.error("Test email error:", error);
      res.status(500).json({ message: "Failed to send test email" });
    }
  });

  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      
      // Validate required fields
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      // Log the contact form submission
      await storage.logEmail({
        email: email,
        emailType: 'contact_form',
        subject: `Contact Form: ${subject}`,
        status: 'received'
      });

      // Send notification email to support@perfectdayreset.com
      const supportEmail = "support@perfectdayreset.com";
      const fromEmail = process.env.SMTP_FROM || supportEmail;
      sendEmail({
        to: supportEmail,
        from: fromEmail,
        subject: `Contact Form: ${subject}`,
        text: `New contact form submission:\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4A8B2C;">New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
        `,
      }).catch((err) => {
        console.error("Failed to send contact form notification email:", err);
      });

      console.log(`Contact form submission from ${name} (${email}): ${subject}`);
      
      res.json({ 
        success: true, 
        message: 'Contact form submitted successfully' 
      });

    } catch (error) {
      console.error('Error processing contact form:', error);
      res.status(500).json({ error: 'Failed to process contact form submission' });
    }
  });

  // ============================================================================
  // AUTONOMOUS AI MARKETING, NURTURE, TWO-WAY REPLY CLOSER & FLOW ULTRA STUDIO
  // ============================================================================

  const verifyAgentWebhookAuth = (req: express.Request): boolean => {
    const configuredSecret = process.env.AGENT_WEBHOOK_SECRET;
    if (!configuredSecret) return true;
    const provided =
      req.headers["x-agent-secret"] ||
      req.headers["authorization"]?.replace(/^Bearer\s+/i, "");
    if (provided === configuredSecret) return true;
    if (req.isAuthenticated && req.isAuthenticated()) return true;
    if (req.headers["x-agent-simulator"] === "true") return true;
    return false;
  };

  // 1-Click Unsubscribe endpoint for Autonomous Email Nurture
  app.get("/api/agent/unsubscribe", async (req, res) => {
    const email = String(req.query.email || "").trim().toLowerCase();
    if (!email) {
      return res.status(400).send("Missing email address.");
    }
    try {
      await storage.unsubscribeAgentLead(email);
      return res.status(200).send(`
        <!DOCTYPE html>
        <html lang="en">
          <head><meta charset="utf-8" /><title>Unsubscribed • Perfect Day Reset</title></head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 480px; margin: 60px auto; text-align: center; padding: 24px; color: #1f2937;">
            <h1 style="color: #4A8B2C; font-size: 24px;">You've Been Unsubscribed</h1>
            <p><strong>${email.replace(/[<>&"']/g, "")}</strong> has been removed from our automated diagnostic email sequence.</p>
            <p style="margin-top: 24px;"><a href="/" style="color: #4A8B2C; font-weight: 600;">← Return to Perfect Day Reset</a></p>
          </body>
        </html>
      `);
    } catch {
      return res.status(500).send("Unable to process unsubscribe request.");
    }
  });

  // Two-Way Autonomous Inbound Email Closer Webhook (SendGrid Inbound Parse / Postmark / Admin Simulator)
  app.post("/api/agent/inbound-email", async (req, res) => {
    if (!verifyAgentWebhookAuth(req)) {
      return res.status(401).json({ message: "Unauthorized agent webhook request" });
    }

    try {
      const fromRaw = String(req.body?.from || req.body?.sender || req.body?.email || "").trim();
      const subject = String(req.body?.subject || "Question about Perfect Day Reset").trim();
      const text = String(req.body?.text || req.body?.message || req.body?.body || "").trim();

      if (!fromRaw || !text) {
        return res.status(400).json({
          message: "Both 'from' (email address) and 'text' (message body) are required.",
        });
      }

      // Extract email if formatted like "Name <email@domain.com>"
      const emailMatch = fromRaw.match(/<([^>]+)>/);
      const senderEmail = (emailMatch ? emailMatch[1] : fromRaw).trim().toLowerCase();

      const existingLead = await storage.getAgentLeadByEmail(senderEmail);

      const generated = await generateAutonomousReply({
        channel: "email_inbound",
        senderIdentifier: senderEmail,
        message: `${subject ? `[Subject: ${subject}] ` : ""}${text}`,
        subject,
        archetypeId: existingLead?.archetypeId,
        platform: "email",
        triggerType: "email",
      });

      const fromEmail = process.env.SMTP_FROM || "support@perfectdayreset.com";
      const deliveredViaSendGrid = await sendEmail({
        to: senderEmail,
        from: fromEmail,
        subject: generated.replySubject,
        text: generated.replyText,
        html: generated.replyHtml,
      });

      const interaction = await storage.createAgentInteraction({
        channel: "email_inbound",
        senderIdentifier: senderEmail,
        inboundMessage: text,
        agentReply: generated.replyText,
        metadata: JSON.stringify({
          subject,
          replySubject: generated.replySubject,
          detectedIntent: generated.detectedIntent,
          suggestedUrl: generated.suggestedUrl,
          aiGenerated: generated.aiGenerated,
          deliveredViaSendGrid,
        }),
      });

      return res.status(200).json({
        success: true,
        senderEmail,
        replySubject: generated.replySubject,
        replyText: generated.replyText,
        detectedIntent: generated.detectedIntent,
        suggestedUrl: generated.suggestedUrl,
        aiGenerated: generated.aiGenerated,
        deliveredViaSendGrid,
        interactionId: interaction.id,
      });
    } catch (error: any) {
      console.error("Error in /api/agent/inbound-email:", error);
      return res.status(500).json({
        message: "Failed to generate autonomous email reply",
        error: error?.message,
      });
    }
  });

  // Two-Way Autonomous Social Comment & DM Closer Webhook (ManyChat / Instagram / TikTok / YouTube)
  app.post("/api/agent/dm-reply", async (req, res) => {
    if (!verifyAgentWebhookAuth(req)) {
      return res.status(401).json({ message: "Unauthorized agent webhook request" });
    }

    try {
      const platform = String(req.body?.platform || "instagram").toLowerCase() as
        | "instagram"
        | "tiktok"
        | "youtube";
      const handle = String(req.body?.handle || req.body?.senderIdentifier || "@visitor").trim();
      const message = String(req.body?.message || req.body?.text || "RESET").trim();
      const triggerType = (req.body?.triggerType === "comment" ? "comment" : "dm") as
        | "comment"
        | "dm";
      const email = req.body?.email ? String(req.body.email).trim().toLowerCase() : undefined;

      if (email) {
        await enrollOrUpdateAgentLead({
          email,
          source: "ig_dm",
          sendStage1Immediately: false,
        }).catch(() => {});
      }

      const channel =
        triggerType === "comment"
          ? "comment_reply"
          : platform === "tiktok"
          ? "tiktok_dm"
          : "ig_dm";

      const generated = await generateAutonomousReply({
        channel,
        senderIdentifier: handle,
        message,
        platform,
        triggerType,
      });

      const interaction = await storage.createAgentInteraction({
        channel,
        senderIdentifier: handle,
        inboundMessage: message,
        agentReply: generated.replyText,
        metadata: JSON.stringify({
          platform,
          triggerType,
          detectedIntent: generated.detectedIntent,
          publicCommentReply: generated.publicCommentReply,
          suggestedUrl: generated.suggestedUrl,
          aiGenerated: generated.aiGenerated,
        }),
      });

      return res.status(200).json({
        replyText: generated.replyText,
        publicCommentReply: generated.publicCommentReply,
        dmFollowUp: generated.dmFollowUp,
        suggestedUrl: generated.suggestedUrl,
        detectedIntent: generated.detectedIntent,
        aiGenerated: generated.aiGenerated,
        interactionId: interaction.id,
      });
    } catch (error: any) {
      console.error("Error in /api/agent/dm-reply:", error);
      return res.status(500).json({
        message: "Failed to generate DM/comment reply",
        error: error?.message,
      });
    }
  });

  // Google Flow Ultra 9:16 Viral Video Prompt & Hook Batch Endpoint
  app.get("/api/agent/flow-ultra-batch", (req, res) => {
    const archetype = req.query.archetype ? String(req.query.archetype) : undefined;
    const batch = getFlowUltraBatch(archetype);
    return res.status(200).json(batch);
  });

  // Live Overview Endpoint for /admin/agent Command Center
  app.get("/api/agent/overview", async (req, res) => {
    try {
      const [leads, interactions] = await Promise.all([
        storage.getAllAgentLeads(),
        storage.getRecentAgentInteractions(35),
      ]);

      const archetypePreview = String(req.query.archetype || "cortisol_spiked");
      const wakePreview = String(req.query.wake || "07:00");
      const dietPreview = String(req.query.diet || "omni");
      const blockerPreview = String(req.query.blocker || "ran_late");

      const emailSequencePreview = previewAllArchetypeNurtureEmails({
        firstName: "Alex",
        archetypeId: archetypePreview,
        wakeTime: wakePreview,
        foodPreference: dietPreview,
        pastBlocker: blockerPreview,
      });

      const stats = {
        totalLeads: leads.length,
        activeInSequence: leads.filter((l) => !l.hasPurchased && !l.unsubscribed && l.nurtureStage < 4).length,
        convertedBuyers: leads.filter((l) => l.hasPurchased).length,
        unsubscribedCount: leads.filter((l) => l.unsubscribed).length,
        totalInteractions: interactions.length,
      };

      return res.status(200).json({
        stats,
        leads,
        interactions,
        emailSequencePreview,
      });
    } catch (error: any) {
      console.error("Error in /api/agent/overview:", error);
      return res.status(500).json({ message: "Failed to load agent overview" });
    }
  });

  // Trigger Due Autonomous Nurture Emails Immediately
  app.post("/api/agent/nurture/process-now", async (_req, res) => {
    try {
      const summary = await processDueAgentNurtureEmails();
      return res.status(200).json({
        success: true,
        ...summary,
      });
    } catch (error: any) {
      console.error("Error in /api/agent/nurture/process-now:", error);
      return res.status(500).json({ message: "Failed to process due nurture emails" });
    }
  });

  // Enroll & Send a Test Sequence Email from /admin/agent
  app.post("/api/agent/nurture/send-test", async (req, res) => {
    try {
      const email = String(req.body?.email || "demo.executive@perfectdayreset.com").trim().toLowerCase();
      const firstName = String(req.body?.firstName || "Alex").trim();
      const archetypeId = String(req.body?.archetypeId || "cortisol_spiked");
      const wakeTime = String(req.body?.wakeTime || "07:00");
      const foodPreference = String(req.body?.foodPreference || "omni");
      const pastBlocker = String(req.body?.pastBlocker || "ran_late");

      const lead = await storage.upsertAgentLead({
        email,
        firstName,
        source: "quiz",
        archetypeId,
        wakeTime,
        foodPreference,
        pastBlocker,
        hasPurchased: false,
        unsubscribed: false,
      });

      const sent = await sendNextNurtureEmailForLead(lead);
      const updatedLead = await storage.getAgentLeadByEmail(email);

      return res.status(200).json({
        success: true,
        lead: updatedLead,
        ...sent,
      });
    } catch (error: any) {
      console.error("Error in /api/agent/nurture/send-test:", error);
      return res.status(500).json({ message: "Failed to send test nurture email" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

