import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  if (!process.env.SESSION_SECRET && process.env.NODE_ENV === 'production') {
    throw new Error('SESSION_SECRET environment variable must be set for production');
  }

  const sessionSecret =
    process.env.SESSION_SECRET || 'pdr-local-dev-session-secret-only';

  const sessionSettings: session.SessionOptions = {
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'strict'
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Rate limiting for authentication attempts
  const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
  
  const isRateLimited = (username: string): boolean => {
    const now = Date.now();
    const attempts = loginAttempts.get(username);
    
    if (!attempts) return false;
    
    // Reset counter after 15 minutes
    if (now - attempts.lastAttempt > 15 * 60 * 1000) {
      loginAttempts.delete(username);
      return false;
    }
    
    return attempts.count >= 5; // Max 5 attempts per 15 minutes
  };
  
  const recordFailedAttempt = (username: string): void => {
    const now = Date.now();
    const attempts = loginAttempts.get(username) || { count: 0, lastAttempt: now };
    attempts.count++;
    attempts.lastAttempt = now;
    loginAttempts.set(username, attempts);
  };
  
  const clearFailedAttempts = (username: string): void => {
    loginAttempts.delete(username);
  };

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      // Check rate limiting
      if (isRateLimited(username)) {
        return done(null, false, { message: 'Too many login attempts. Please try again later.' });
      }
      
      const user = await storage.getUserByUsername(username);
      if (!user || !(await comparePasswords(password, user.password))) {
        recordFailedAttempt(username);
        return done(null, false, { message: 'Invalid username or password.' });
      } else {
        clearFailedAttempts(username);
        return done(null, user);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    const user = await storage.getUser(id);
    done(null, user);
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ 
          message: info?.message || "Authentication failed" 
        });
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        // Don't return sensitive user data
        const safeUser = {
          id: user.id,
          username: user.username,
          createdAt: user.createdAt
        };
        return res.status(200).json(safeUser);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}

export { hashPassword };