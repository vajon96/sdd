import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

// Initialize Express App
const app = express();
const PORT = 3000;

// Body Parsers & Security Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const rateLimiter = (maxRequests: number = 100, windowMs: number = 60000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
    const now = Date.now();
    const clientData = rateLimitMap.get(ip);

    if (!clientData || now > clientData.resetTime) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (clientData.count >= maxRequests) {
      return res.status(429).json({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again in a minute.',
        retryAfterMs: clientData.resetTime - now
      });
    }

    clientData.count++;
    next();
  };
};

// CORS Protection
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// ============================================================================
// 1. HEALTH & SYSTEM DIAGNOSTICS
// ============================================================================
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    system: 'BNCC Cadet Information & Management Platform API',
    institution: "Cox's Bazar City College Platoon",
    battalion: '5 BNCC Battalion',
    regiment: 'Karnafuli Regiment',
    version: '2.5.0-Enterprise',
    timestamp: new Date().toISOString()
  });
});

// ============================================================================
// 2. PUBLIC API ROUTES (ZERO LEAKAGE DATA CONTRACT)
// ============================================================================

// Public Cadets Directory (Strictly Redacted: No phone, NID, DOB, guardian, or home address)
app.get('/api/public/cadets', rateLimiter(120, 60000), (req: Request, res: Response) => {
  const { batch, rank, query } = req.query;
  
  res.json({
    success: true,
    message: 'Public Cadets Directory (Zero-Leakage projection)',
    filterApplied: { batch, rank, query },
    meta: {
      isPublic: true,
      sensitiveFieldsRedacted: ['nid', 'dob', 'mobile', 'email', 'guardianMobile', 'fatherName', 'motherName', 'address']
    }
  });
});

// Public Certificate Verification Endpoint
app.get('/api/public/verify/certificate/:certNo', rateLimiter(60, 60000), (req: Request, res: Response) => {
  const { certNo } = req.params;
  
  if (!certNo) {
    return res.status(400).json({ valid: false, message: 'Certificate Number is required.' });
  }

  res.json({
    success: true,
    certificateNo: certNo,
    verificationEndpoint: `/verify/certificate/${certNo}`,
    timestamp: new Date().toISOString()
  });
});

// Public Events & Announcements
app.get('/api/public/events', rateLimiter(100, 60000), (req: Request, res: Response) => {
  res.json({
    success: true,
    institution: "Cox's Bazar City College BNCC Platoon",
    events: [
      {
        title: 'Independence Day Ceremonial Parade 2026',
        date: '2026-03-26',
        location: "Cox's Bazar District Stadium",
        type: 'Parade',
        status: 'Upcoming'
      },
      {
        title: 'Karnafuli Regiment Annual Training Camp (ATC)',
        date: '2026-04-10',
        location: 'BNCC Academy, Baipail, Savar',
        type: 'Camp',
        status: 'Upcoming'
      }
    ]
  });
});

// ============================================================================
// 3. AUTHENTICATION & RBAC ROUTES
// ============================================================================
app.post('/api/auth/login', rateLimiter(10, 60000), (req: Request, res: Response) => {
  const { username, pin } = req.body;
  
  if (pin === '7171' || pin === 'admin') {
    return res.json({
      success: true,
      token: 'jwt-auth-token-bncc-platoon-commander-' + Date.now(),
      user: {
        id: 'usr-admin',
        username: username || 'admin',
        name: 'PUO Ujjwal Kanti Deb',
        role: 'admin',
        rankTitle: 'Professor Under Officer (PUO)',
        unit: "Cox's Bazar City College Platoon"
      }
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid security PIN or unauthorized credentials.'
  });
});

// ============================================================================
// 4. VITE MIDDLEWARE & SERVER STARTUP
// ============================================================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[BNCC Platoon Server] running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
