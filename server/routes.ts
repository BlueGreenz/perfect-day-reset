import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSubscriberSchema, users } from "@shared/schema";
import { setupAuth, hashPassword } from "./auth";
import { z, ZodError } from "zod";
import { sendWelcomeEmail, sendPurchaseWelcomeEmail } from "./utils/sendgrid";
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

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-03-31.basil",
});

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
const paymentCredentials = new Map<string, { username: string; password: string; timestamp: number }>();

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

  // Test email endpoint
  app.post("/api/test-email", async (req, res) => {
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
      const { email, receipt_email } = req.body;
      const amount = 19; // Fixed price: $19
      const climateContribution = Math.round(amount * 0.005 * 100); // 0.5% for CO₂ removal
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents ($19 = 1900 cents)
        currency: "usd",
        receipt_email: email || receipt_email,
        metadata: {
          product: "perfect_day_reset",
          customer_email: email || receipt_email || "",
          climate_contribution: `$${(climateContribution / 100).toFixed(2)}`,
          climate_percentage: "0.5%"
        }
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ 
        message: "Error creating payment intent: " + error.message 
      });
    }
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
      event = stripe.webhooks.constructEvent(req.body, sig!, process.env.STRIPE_WEBHOOK_SECRET);
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
        // Check if user already exists for this payment intent
        const existingUser = await storage.getUserByStripeSessionId(paymentIntent.id);
        if (existingUser) {
          if (process.env.NODE_ENV !== 'production') {
            console.log('User already exists for payment:', paymentIntent.id);
          }
          return res.json({ received: true });
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

        if (process.env.NODE_ENV !== 'production') {
          console.log(`Creating user: ${username} for payment: ${paymentIntent.id}`);
        }

        // Create user account
        const user = await storage.createUser({
          username,
          password: hashedPassword,
          stripeSessionId: paymentIntent.id
        });

        if (process.env.NODE_ENV !== 'production') {
          console.log(`Successfully created user: ${user.username} with ID: ${user.id}`);
        }

        // Store credentials temporarily for success page access
        paymentCredentials.set(paymentIntent.id, {
          username,
          password: plainPassword,
          timestamp: Date.now()
        });

        if (process.env.NODE_ENV !== 'production') {
          console.log(`Stored credentials for payment: ${paymentIntent.id}`);
        }

        // Send welcome email with login credentials
        const customerEmail = paymentIntent.receipt_email || paymentIntent.metadata?.customer_email;
        if (customerEmail) {
          try {
            await sendPurchaseWelcomeEmail(customerEmail, username, plainPassword);
            
            if (process.env.NODE_ENV !== 'production') {
              console.log(`Purchase welcome email sent to: ${customerEmail} with credentials`);
            }
          } catch (emailError) {
            if (process.env.NODE_ENV !== 'production') {
              console.error(`Error sending purchase welcome email to ${customerEmail}:`, emailError);
            }
          }
        } else {
          if (process.env.NODE_ENV !== 'production') {
            console.log('No email found in payment intent for user:', username);
          }
        }

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
    const { email } = req.body;
    
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
        stripeSessionId: paymentIntentId
      });

      console.log(`Test webhook: Successfully created user: ${user.username} with ID: ${user.id}`);

      // Store credentials temporarily for success page access
      paymentCredentials.set(paymentIntentId, {
        username,
        password: plainPassword,
        timestamp: Date.now()
      });

      console.log(`Test webhook: Stored credentials for payment: ${paymentIntentId}`);

      // Send welcome email if email provided
      if (email) {
        try {
          await sendPurchaseWelcomeEmail(email, username, plainPassword);
          console.log(`Test webhook: Purchase welcome email sent to: ${email}`);
        } catch (emailError) {
          console.error(`Test webhook: Error sending email to ${email}:`, emailError);
        }
      }

      res.json({ received: true, username, password: plainPassword });
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
            timestamp: Date.now()
          });

          // Send email with new credentials
          await sendPurchaseWelcomeEmail(email, existingUser.username, newPassword);
          
          return res.json({ 
            success: true, 
            username: existingUser.username, 
            password: newPassword,
            message: "Existing user updated with new password and email sent"
          });
        }
        
        return res.json({ 
          success: true, 
          username: existingUser.username,
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
        stripeSessionId: paymentIntentId
      });

      // Store credentials
      paymentCredentials.set(paymentIntentId, {
        username,
        password: plainPassword,
        timestamp: Date.now()
      });

      // Send welcome email
      await sendPurchaseWelcomeEmail(email, username, plainPassword);

      console.log(`Manual processing complete: ${username} for payment: ${paymentIntentId}`);

      res.json({ 
        success: true, 
        username, 
        password: plainPassword,
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
      
      // Check if we have stored credentials for this payment
      const storedCredentials = paymentCredentials.get(paymentIntentId);
      if (storedCredentials) {
        if (process.env.NODE_ENV !== 'production') {
          console.log(`Found stored credentials for ${paymentIntentId}`);
        }
        return res.json({
          username: storedCredentials.username,
          password: storedCredentials.password,
          message: "Account created successfully!"
        });
      }

      // Fallback: check if user exists (for webhook-processed payments)
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

      // Return username only since password is hashed
      res.json({ 
        username: user.username,
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

  // Test email endpoint for demonstration
  app.post("/api/test-welcome-email", async (req, res) => {
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

  const httpServer = createServer(app);
  return httpServer;
}
