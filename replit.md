# Perfect Day Reset - Architecture Summary

## Overview

Perfect Day Reset is a full-stack web application that provides a 24-hour wellness transformation program. The application combines a React frontend with an Express.js backend, offering both public marketing pages and protected user content. Users can purchase access to a comprehensive daily reset program, complete with meal plans, schedules, and reflection tools.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **Build Tool**: Vite with hot module replacement

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Authentication**: Passport.js with local strategy using scrypt password hashing
- **Session Management**: Express-session with in-memory store
- **Security**: Helmet for security headers, rate limiting for API protection

### Database & ORM
- **Database**: PostgreSQL (via Neon serverless)
- **ORM**: Drizzle ORM with code-first schema approach
- **Schema Location**: `shared/schema.ts` for type sharing between frontend/backend
- **Migrations**: Drizzle Kit for schema management

## Key Components

### Authentication System
- Session-based authentication with HTTP-only cookies
- Secure password hashing using Node.js crypto.scrypt with salt
- Rate limiting on authentication endpoints (5 attempts per 15 minutes)
- Protected routes requiring authentication for premium content

### Payment Integration
- Stripe payment processing for $67 product purchase (USD)
- Webhook handling for payment completion events
- Automatic user account creation upon successful payment
- Generated credentials sent via email after purchase

### Email Service
- SendGrid integration for transactional emails
- Welcome email automation with login credentials
- Email logging for audit trail
- Marketing email opt-in functionality

### Content Management
- Multi-page wellness program with protected routes
- PDF generation for downloadable guides and trackers
- Certificate generation system for program completion
- Static asset serving for images and documents

### SEO & Social Features
- Comprehensive meta tags and Open Graph support
- Structured data (JSON-LD) for search engines
- Social sharing optimization
- Sitemap and robots.txt configuration

## Data Flow

1. **User Journey**: Homepage → What You Get → Checkout → Payment → Account Creation → Program Access
2. **Authentication Flow**: Stripe payment → Account auto-creation → Email with credentials → User login → Protected content access
3. **Content Delivery**: Progressive disclosure through 5 main program pages (Welcome, Morning, Midday, Afternoon, Reflection)
4. **Data Persistence**: User accounts, email logs, and subscriber information stored in PostgreSQL

## External Dependencies

### Payment Processing
- **Stripe**: Payment processing, webhooks, and customer management
- **Environment Variables**: `STRIPE_SECRET_KEY`, `VITE_STRIPE_PUBLIC_KEY`, `STRIPE_WEBHOOK_SECRET`

### Email Service
- **SendGrid**: Transactional email delivery
- **Environment Variables**: `SENDGRID_API_KEY_PERFECTDAYRESET`, `SMTP_FROM`

### Database
- **Neon PostgreSQL**: Serverless PostgreSQL hosting
- **Environment Variables**: `DATABASE_URL`

### Security
- **Session Management**: `SESSION_SECRET` for secure session encryption

## Deployment Strategy

### Replit Deployment
- Optimized for Replit hosting environment
- Environment variables managed through Replit Secrets
- Automatic static asset serving in production
- Development tools excluded from production builds

### Build Process
- Frontend: Vite builds React app to `dist/public`
- Backend: esbuild bundles server code to `dist/index.js`
- Deployment script: `npm run build && npm start`

### Security Considerations
- Helmet security headers in production
- Rate limiting on all endpoints
- HTTPS-only cookies in production
- CSP headers configured for Stripe integration

### Database Management
- Drizzle migrations with `npm run db:push`
- Connection pooling via Neon serverless
- Schema versioning through migration files

The application is designed to scale from individual users to thousands of customers while maintaining security and performance standards suitable for a commercial wellness platform.