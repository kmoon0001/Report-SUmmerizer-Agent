import "./src/polyfills";
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cron from "node-cron";
import db, { dbService } from "./src/server/db/database";
import libraryRoutes from "./src/server/routes/library";
import newsRoutes from "./src/server/routes/news";
import patientsRoutes from "./src/server/routes/patients";
import { syncExternalData } from "./src/server/services/syncService";
import { errorHandler } from "./src/server/middleware/errorMiddleware";
import { rateLimiter } from "./src/utils/security-utils";
import { secureLogger } from "./src/utils/secure-logger";
import { generateCsrfToken, validateCsrfToken, csrfTokenEndpoint } from "./src/server/middleware/csrfMiddleware";
import { manageSession, requireSession, destroySessionEndpoint } from "./src/server/middleware/sessionMiddleware";
import { monitorSuspiciousActivity, monitorDataAccess, securityHealthCheck } from "./src/server/middleware/securityMonitoring";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  // Security Hardening: NIST/ONC/FDA Guidelines + Microsoft Learn Best Practices
  // https://learn.microsoft.com/en-us/aspnet/core/security/
  if (process.env.NODE_ENV === "production") {
    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Required for Vite
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:", "blob:"],
          connectSrc: [
            "'self'", 
            "https://generativelanguage.googleapis.com",
            "https://api.openai.com",
            "wss://localhost:*",
            "ws://localhost:*"
          ],
          fontSrc: ["'self'", "data:"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
          frameAncestors: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
      crossOriginEmbedderPolicy: false, // Required for some AI models
      crossOriginResourcePolicy: { policy: "cross-origin" },
      dnsPrefetchControl: { allow: false },
      frameguard: { action: 'deny' },
      hidePoweredBy: true,
      hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
      },
      ieNoOpen: true,
      noSniff: true,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      xssFilter: true,
    }));
    
    // Additional security headers
    app.use((req, res, next) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      next();
    });
  }

  // Rate Limiting: Prevent DoS and brute force
  if (process.env.NODE_ENV === "production") {
    // General API rate limiting
    const generalLimiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: "Too many requests, please try again later." },
      handler: (req, res) => {
        secureLogger.warn('Rate limit exceeded', { 
          ip: req.ip, 
          path: req.path 
        });
        res.status(429).json({ error: "Too many requests, please try again later." });
      }
    });
    app.use("/api/", generalLimiter);
    
    // Stricter rate limiting for sensitive endpoints
    const strictLimiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 20, // limit to 20 requests per windowMs
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req, res) => {
        secureLogger.warn('Strict rate limit exceeded', { 
          ip: req.ip, 
          path: req.path 
        });
        res.status(429).json({ error: "Too many requests to sensitive endpoint." });
      }
    });
    app.use("/api/patients", strictLimiter);
  }
  
  // Custom rate limiting middleware using our security utilities
  app.use((req, res, next) => {
    const clientId = req.ip || 'unknown';
    const allowed = rateLimiter.isAllowed(clientId, {
      maxRequests: 200,
      windowMs: 60000, // 1 minute
      blockDurationMs: 300000, // 5 minutes
    });
    
    if (!allowed) {
      secureLogger.warn('Custom rate limit exceeded', { 
        ip: req.ip, 
        path: req.path 
      });
      return res.status(429).json({ error: "Rate limit exceeded. Please try again later." });
    }
    
    next();
  });

  const httpServer = http.createServer(app);
  const wss = new WebSocketServer({ server: httpServer });

  // Parse JSON bodies
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Session Management (before other middleware)
  app.use(manageSession);
  
  // CSRF Token Generation (for all requests)
  app.use(generateCsrfToken);
  
  // Security Monitoring
  app.use(monitorSuspiciousActivity);
  app.use(monitorDataAccess);

  // API Routes
  app.get("/api/health", (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    const wsStatus = wss.clients.size >= 0 ? "active" : "inactive";
    
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      services: {
        gemini: apiKey ? "configured" : "missing_key",
        webSocket: wsStatus
      }
    });
  });
  
  // Security endpoints
  app.get("/api/security/health", securityHealthCheck);
  app.get("/api/csrf-token", csrfTokenEndpoint);
  app.post("/api/session/destroy", destroySessionEndpoint);

  app.get("/api/networking-events", (req, res) => {
    res.json(dbService.getNetworkingEvents());
  });

  app.get("/api/whatsapp-messages", (req, res) => {
    res.json(dbService.getWhatsAppMessages());
  });

  // Protected routes with CSRF validation
  app.use("/api/library", validateCsrfToken, libraryRoutes);
  app.use("/api/news", newsRoutes);
  app.use("/api/patients", validateCsrfToken, requireSession, patientsRoutes);

  // Cron job for weekly updates (Mondays at midnight)
  cron.schedule('0 0 * * 1', () => {
    syncExternalData();
  });

  // Cron job for daily WhatsApp cleanup
  cron.schedule('0 0 * * *', () => {
    console.log('Running daily WhatsApp cleanup...');
    dbService.deleteOldWhatsAppMessages(1);
  });

  // Initial sync on startup
  setTimeout(syncExternalData, 5000);

  // Error handling middleware
  app.use(errorHandler);

  wss.on("connection", (ws) => {
    console.log("[WS] New connection established");

    ws.on("message", (data) => {
      try {
        const message = JSON.parse(data.toString());
        console.log("[WS] Received message:", message);

        // Broadcast to all connected clients
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
          }
        });
      } catch (err) {
        console.error("[WS] Failed to parse message:", err);
      }
    });

    ws.on("close", () => {
      console.log("[WS] Connection closed");
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
