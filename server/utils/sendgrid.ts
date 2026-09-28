import { MailService } from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY_PERFECTDAYRESET) {
  throw new Error("SENDGRID_API_KEY_PERFECTDAYRESET environment variable must be set");
}

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY_PERFECTDAYRESET);

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

/**
 * Send a welcome email to new newsletter subscribers
 */
export async function sendPurchaseWelcomeEmail(email: string, username: string, password: string): Promise<boolean> {
  const fromEmail = process.env.SMTP_FROM || 'support@perfectdayreset.com';
  
  const htmlContent = `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #4A8B2C; margin-bottom: 10px;">Welcome to Perfect Day Reset!</h1>
        <p style="font-size: 18px; color: #666;">Your account is ready - let's transform your day!</p>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #4A8B2C; margin-bottom: 15px;">🎉 Your Purchase is Complete!</h2>
        <p>Thank you for choosing Perfect Day Reset. Your account has been created and you now have instant access to the complete 24-hour transformation protocol.</p>
      </div>
      
      <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #2d5a2d; margin-bottom: 15px;">🔑 Your Login Credentials</h3>
        <p><strong>Website:</strong> <a href="https://perfectdayreset.com" style="color: #4A8B2C;">perfectdayreset.com</a></p>
        <p><strong>Username:</strong> <span style="background: #fff; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${username}</span></p>
        <p><strong>Password:</strong> <span style="background: #fff; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${password}</span></p>
        <p style="margin-top: 15px; font-size: 14px; color: #666;"><em>💡 Save these credentials in a secure place. You can change your password after logging in.</em></p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h3 style="color: #4A8B2C;">What's Included in Your Perfect Day Reset:</h3>
        <ul style="padding-left: 20px;">
          <li><strong>Morning Protocol:</strong> Energizing routines to start your day right</li>
          <li><strong>Midday Reset:</strong> Focus-enhancing techniques for sustained energy</li>
          <li><strong>Evening Wind-down:</strong> Restorative practices for quality sleep</li>
          <li><strong>Science-backed guidance:</strong> Research-supported wellness strategies</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://perfectdayreset.com" style="background-color: #4A8B2C; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
          Access Your Perfect Day Reset Now →
        </a>
      </div>
      
      <div style="margin-bottom: 20px;">
        <h3 style="color: #4A8B2C;">🌍 Your Positive Impact</h3>
        <p>By purchasing Perfect Day Reset, you've also contributed to:</p>
        <ul style="padding-left: 20px;">
          <li><strong>Climate Action:</strong> €0.05 donated to remove CO₂ from the atmosphere</li>
          <li><strong>Children's Support:</strong> $1 donated to children's programs worldwide</li>
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
Thank you for choosing Perfect Day Reset. Your account has been created and you now have instant access to the complete 24-hour transformation protocol.

Your Login Credentials:
Website: perfectdayreset.com
Username: ${username}
Password: ${password}

Save these credentials in a secure place. You can change your password after logging in.

What's Included:
- Morning Protocol: Energizing routines to start your day right
- Midday Reset: Focus-enhancing techniques for sustained energy  
- Evening Wind-down: Restorative practices for quality sleep
- Science-backed guidance: Research-supported wellness strategies

Your Positive Impact:
- Climate Action: €0.05 donated to remove CO₂ from the atmosphere
- Children's Support: $1 donated to children's programs worldwide

Access your program now at: https://perfectdayreset.com

Questions? Reply to this email or visit our support page.
© ${new Date().getFullYear()} Perfect Day Reset. All rights reserved.
  `;
  
  return sendEmail({
    to: email,
    from: fromEmail,
    subject: '🎉 Welcome to Perfect Day Reset - Your Account is Ready!',
    text: textContent,
    html: htmlContent
  });
}

export async function sendWelcomeEmail(email: string): Promise<boolean> {
  const fromEmail = 'support@perfectdayreset.com';
  
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