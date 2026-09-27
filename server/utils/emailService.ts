import nodemailer from 'nodemailer';
import { storage } from '../storage';

interface WelcomeEmailData {
  email: string;
  firstName?: string;
  username: string;
  password: string;
  userId: number;
}

interface MarketingOptInData {
  email: string;
  firstName?: string;
}

// Email templates
const createWelcomeEmailTemplate = (data: WelcomeEmailData) => {
  const greeting = data.firstName ? `Hi ${data.firstName}` : 'Hello';
  
  return {
    subject: 'Welcome to Your Perfect Day Reset Journey! 🌟',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Perfect Day Reset</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #f97316 0%, #ec4899 100%); color: white; padding: 40px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
          .content { padding: 40px 30px; }
          .credentials { background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #10b981; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #f97316 0%, #ec4899 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 50px; font-weight: bold; margin: 20px 0; text-align: center; }
          .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; }
          .highlight { color: #10b981; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to Your New Beginning!</h1>
            <p>Your Perfect Day Reset journey starts now</p>
          </div>
          
          <div class="content">
            <h2>${greeting}!</h2>
            
            <p>Thank you for joining the Perfect Day Reset community! You've just taken the most important step towards a healthier, more energized, and focused version of yourself.</p>
            
            <p>🌟 <strong>Your transformation begins today</strong> - this isn't just a purchase, it's your commitment to becoming the person you've always wanted to be.</p>
            
            <div class="credentials">
              <h3>🔑 Your Login Credentials</h3>
              <p><strong>Username:</strong> <span class="highlight">${data.username}</span></p>
              <p><strong>Password:</strong> <span class="highlight">${data.password}</span></p>
              <p><em>Please save these credentials safely - you'll need them to access your program.</em></p>
            </div>
            
            <div style="text-align: center;">
              <a href="${process.env.VITE_APP_URL || 'http://localhost:5000'}/login" class="cta-button">
                Log In to Begin Your Perfect Day Reset ✨
              </a>
            </div>
            
            <h3>What happens next?</h3>
            <ul>
              <li>✅ <strong>Today:</strong> Log in and explore your personalized dashboard</li>
              <li>🌅 <strong>Tomorrow:</strong> Start your 24-hour transformation protocol</li>
              <li>🚀 <strong>Forever:</strong> Build lasting habits that will serve you for life</li>
            </ul>
            
            <p><strong>💖 Impact Note:</strong> Your purchase has donated $1 to children's programs - thank you for making a difference!</p>
            
            <p>Ready to transform your life? Your journey to better energy, clarity, and focus starts now!</p>
            
            <p>With excitement for your transformation,<br>
            <strong>The Perfect Day Reset Team</strong></p>
          </div>
          
          <div class="footer">
            <p>Need help? Reply to this email or contact us at support@perfectdayreset.com</p>
            <p>Perfect Day Reset - Transform Your Energy, Clarity & Focus</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      ${greeting}!
      
      Welcome to Perfect Day Reset! 🎉
      
      Your login credentials:
      Username: ${data.username}
      Password: ${data.password}
      
      Log in here: ${process.env.VITE_APP_URL || 'http://localhost:5000'}/login
      
      Your transformation begins today. This 24-hour protocol will help you reset your energy, boost clarity, and get back on track.
      
      Thank you for your purchase - $1 has been donated to children's programs!
      
      Need help? Contact support@perfectdayreset.com
      
      The Perfect Day Reset Team
    `
  };
};

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configure transporter - will use environment variables for SMTP settings
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // Use TLS
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendWelcomeEmail(data: WelcomeEmailData): Promise<boolean> {
    try {
      const template = createWelcomeEmailTemplate(data);
      
      const mailOptions = {
        from: `"Perfect Day Reset" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: data.email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      // Log successful email
      await storage.logEmail({
        email: data.email,
        emailType: 'welcome',
        subject: template.subject,
        status: 'sent',
        userId: data.userId,
      });

      console.log(`Welcome email sent successfully to ${data.email}`);
      return true;
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      
      // Log failed email
      await storage.logEmail({
        email: data.email,
        emailType: 'welcome',
        subject: 'Welcome to Your Perfect Day Reset Journey!',
        status: 'failed',
        userId: data.userId,
      });

      return false;
    }
  }

  async addToMarketingList(data: MarketingOptInData): Promise<boolean> {
    try {
      await storage.addMarketingEmail(data);
      console.log(`Added ${data.email} to marketing list`);
      return true;
    } catch (error) {
      console.error('Failed to add to marketing list:', error);
      return false;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('Email service connection verified');
      return true;
    } catch (error) {
      console.error('Email service connection failed:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();