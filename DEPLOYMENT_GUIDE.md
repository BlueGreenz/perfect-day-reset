# Perfect Day Reset - Production Deployment Guide

## Pre-Deployment Checklist

✅ **Security Audit Complete**
- Secure password hashing with scrypt + salt
- Session security with HTTP-only cookies
- Rate limiting on authentication endpoints
- Helmet security headers configured
- Demo endpoints removed

✅ **Environment Variables Required**

Copy `.env.example` to `.env` and configure:

### Database
```
DATABASE_URL=postgresql://username:password@host:port/database
```

### Authentication
```
SESSION_SECRET=minimum_32_character_random_string
```

### Stripe (Live Keys)
```
STRIPE_SECRET_KEY=sk_live_...
VITE_STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Email (SendGrid)
```
SENDGRID_API_KEY=SG....
SMTP_FROM=support@perfectdayreset.com
```

## Replit Deployment Steps

1. **Environment Setup**
   - Add all environment variables in Replit Secrets
   - Ensure NODE_ENV=production
   - Verify database connection

2. **Stripe Configuration**
   - Set webhook endpoint: `https://your-domain.replit.app/api/stripe-webhook`
   - Events to subscribe: `payment_intent.succeeded`
   - Copy webhook secret to STRIPE_WEBHOOK_SECRET

3. **SendGrid Setup**
   - Verify sender identity for support@perfectdayreset.com
   - Generate API key with mail send permissions

4. **Domain Configuration**
   - Configure custom domain in Replit deployment settings
   - Update CORS settings if needed
   - Test all payment flows

## Security Considerations

- All sensitive data properly encrypted
- Rate limiting prevents abuse
- Input validation on all endpoints
- Secure session management
- HTTPS enforced in production

## Monitoring

- Check email delivery rates
- Monitor payment success rates
- Review error logs regularly
- Track user registration flow

## Support

For deployment issues:
- Check environment variables
- Verify Stripe webhook configuration
- Test email delivery
- Review database connections