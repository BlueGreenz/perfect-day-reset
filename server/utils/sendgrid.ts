import { MailService } from '@sendgrid/mail';

const sendGridApiKey = process.env.SENDGRID_API_KEY_PERFECTDAYRESET || process.env.SENDGRID_API_KEY;

const mailService = new MailService();
if (sendGridApiKey) {
  mailService.setApiKey(sendGridApiKey);
} else {
  console.warn("Warning: Neither SENDGRID_API_KEY_PERFECTDAYRESET nor SENDGRID_API_KEY is set. SendGrid email delivery is disabled.");
}

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
}

/**
 * Send an email using SendGrid API
 */
export async function sendEmail(params: EmailParams): Promise<boolean> {
  if (!sendGridApiKey) {
    console.warn(`SendGrid API key not configured; skipping email to ${params.to}`);
    return false;
  }
  try {
    await mailService.send({
      to: params.to,
      from: params.from, // This should be a verified sender in your SendGrid account
      subject: params.subject,
      text: params.text || params.html?.replace(/<[^>]*>?/gm, '') || '', // Fallback to stripped HTML or empty string
      html: params.html,
    });
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

export interface PurchaseReceiptOptions {
  amountCents?: number;
  includeOrderBump?: boolean;
}

/**
 * Send a welcome email with login credentials and dynamic receipt ($19.00 or $31.00) to paying customers
 */
export async function sendPurchaseWelcomeEmail(
  email: string,
  username: string,
  password: string,
  options?: PurchaseReceiptOptions
): Promise<boolean> {
  const fromEmail = process.env.SMTP_FROM || 'perfectdayreset@gmail.com';
  const isBundle = options?.includeOrderBump === true || options?.amountCents === 3100;
  const formattedAmount = isBundle ? '$31.00' : '$19.00';
  const climateDonation = isBundle ? '$0.16' : '$0.10';
  const productSummary = isBundle
    ? 'The Perfect Day Reset (24-Hour Protocol) + 7-Day Momentum & Emergency 2-Hour Workday Reset Kit'
    : 'The Perfect Day Reset (24-Hour Protocol)';

  const htmlContent = `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #4A8B2C; margin-bottom: 10px;">Welcome to Perfect Day Reset!</h1>
        <p style="font-size: 18px; color: #666;">Your account is ready - let's transform your day!</p>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #4A8B2C; margin-bottom: 15px;">🎉 Your Purchase is Complete!</h2>
        <p>Thank you for choosing Perfect Day Reset. Your account has been created and you now have instant access to the complete 24-hour transformation protocol.</p>
        <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e5e7eb; font-size: 14px;">
          <p style="margin: 4px 0;"><strong>Order Summary:</strong> ${productSummary}</p>
          <p style="margin: 4px 0;"><strong>Total Paid:</strong> ${formattedAmount} USD</p>
        </div>
      </div>
      
      <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #2d5a2d; margin-bottom: 15px;">🔑 Your Login Credentials</h3>
        <p><strong>Website:</strong> <a href="https://perfectdayreset.com/login" style="color: #4A8B2C;">perfectdayreset.com/login</a></p>
        <p><strong>Username:</strong> <span style="background: #fff; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${username}</span></p>
        <p><strong>Password:</strong> <span style="background: #fff; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${password}</span></p>
        <p style="margin-top: 15px; font-size: 14px; color: #666;"><em>💡 Save these credentials in a secure place. You can log in immediately on any phone or laptop.</em></p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h3 style="color: #4A8B2C;">What's Included in Your Portal:</h3>
        <ul style="padding-left: 20px;">
          <li><strong>Morning Protocol:</strong> Energizing routines to anchor your circadian rhythm</li>
          <li><strong>Midday Reset &amp; 1-Tap Delay Rescheduler:</strong> Dynamic schedule adjustments + 5 nutrition modes</li>
          <li><strong>Evening Wind-down:</strong> Digital detox &amp; 5-prompt reflection journal for deep sleep</li>
          <li><strong>7-Day Momentum &amp; Emergency 2-Hour Workday Toolkit:</strong> Interactive 120-minute workday triage &amp; Executive Dining-Out Cheat Sheet</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://perfectdayreset.com/login" style="background-color: #4A8B2C; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
          Access Your Perfect Day Reset Now →
        </a>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h3 style="color: #4A8B2C;">🌍 Your Positive Impact</h3>
        <p>By purchasing Perfect Day Reset, you've also contributed to:</p>
        <ul style="padding-left: 20px;">
          <li><strong>Climate Action:</strong> ${climateDonation} (0.5%) donated to remove CO₂ from the atmosphere via Stripe Climate</li>
          <li><strong>Children's Support:</strong> $1.00 donated to children's programs worldwide</li>
        </ul>
        <p style="font-style: italic; color: #666;">Thank you for making a difference!</p>
      </div>
      
      <div style="border-top: 1px solid #eee; padding-top: 20px; font-size: 14px; color: #666; text-align: center;">
        <p>Questions? Reply to this email or visit our support page.</p>
        <p>&copy; ${new Date().getFullYear()} Perfect Day Reset. All rights reserved.</p>
      </div>
    </div>
  `;
  
  const textContent = `
Welcome to Perfect Day Reset!

Your account is ready - let's transform your day!

Your Purchase is Complete!
Order Summary: ${productSummary}
Total Paid: ${formattedAmount} USD

Your Login Credentials:
Website: https://perfectdayreset.com/login
Username: ${username}
Password: ${password}

Save these credentials in a secure place.

What's Included:
- Morning Protocol: Energizing routines to anchor your circadian rhythm
- Midday Reset & 1-Tap Delay Rescheduler: Dynamic schedule adjustments + 5 nutrition modes
- Evening Wind-down: Digital detox & 5-prompt reflection journal for deep sleep
- 7-Day Momentum & Emergency 2-Hour Workday Toolkit: Interactive 120-minute workday triage & Executive Dining-Out Cheat Sheet

Your Positive Impact:
- Climate Action: ${climateDonation} (0.5%) donated to remove CO₂ from the atmosphere
- Children's Support: $1.00 donated to children's programs worldwide

Access your program now at: https://perfectdayreset.com/login

Questions? Reply to this email or visit our support page.
© ${new Date().getFullYear()} Perfect Day Reset. All rights reserved.
  `;
  
  return sendEmail({
    to: email,
    from: fromEmail,
    subject: `🎉 Welcome to Perfect Day Reset - Your Account & Receipt (${formattedAmount})`,
    text: textContent,
    html: htmlContent
  });
}

export const sendWelcomeEmailWithCredentials = sendPurchaseWelcomeEmail;

export async function sendWelcomeEmail(email: string): Promise<boolean> {
  const fromEmail = 'perfectdayreset@gmail.com';
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #4A8B2C; margin-bottom: 10px;">Welcome to Perfect Day Reset</h1>
        <p style="font-size: 18px; color: #333;">Thank you for joining our community!</p>
      </div>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #4A8B2C; margin-top: 0;">What's Next?</h2>
        <p>You're now on the path to optimizing your daily routine and maximizing your energy, focus, and productivity.</p>
        <p>Here's what you can expect from us:</p>
        <ul style="padding-left: 20px;">
          <li>Weekly tips for maintaining energy and focus</li>
          <li>Early access to new protocols and resources</li>
          <li>Exclusive community insights and success stories</li>
          <li>Special offers on future Perfect Day Reset products</li>
        </ul>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h2 style="color: #4A8B2C;">Ready to transform your day right now?</h2>
        <p>Don't wait to start your transformation journey!</p>
        <div style="text-align: center; margin-top: 20px;">
          <a href="https://perfectdayreset.com/checkout" style="background-color: #4A8B2C; color: white; padding: 12px 24px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
            Get the Perfect Day Reset – $19
          </a>
        </div>
      </div>
      
      <div style="border-top: 1px solid #eee; padding-top: 20px; font-size: 14px; color: #666; text-align: center;">
        <p>You're receiving this email because you signed up for the Perfect Day Reset newsletter.</p>
        <p>If you no longer wish to receive these emails, you can <a href="#" style="color: #4A8B2C;">unsubscribe</a> at any time.</p>
        <p>&copy; ${new Date().getFullYear()} Perfect Day Reset. All rights reserved.</p>
      </div>
    </div>
  `;
  
  // Create plain text version by removing HTML tags
  const textContent = htmlContent.replace(/<[^>]*>?/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  return sendEmail({
    to: email,
    from: fromEmail,
    subject: 'Welcome to Perfect Day Reset!',
    text: textContent,
    html: htmlContent
  });
}