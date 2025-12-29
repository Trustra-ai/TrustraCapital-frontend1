// ======================
// server.js (Main Entry)
// ======================
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = process.env.PORT || 8080;

// Security Middleware
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// CORS Configuration for Frontend
app.use(cors({
  origin: 'https://trustracapitalfx.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
  credentials: true
}));

// Rate Limiting (Prevent DDoS)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later'
});
app.use(limiter);

// ======================
// Database Simulation
// ======================
const usersDB = [
  {
    id: 'user_ng_01',
    email: 'user@trustracapital.com',
    password: '$2a$10$EXAMPLEHASHEDPASSWORD', // bcrypt hash of "password123"
    accounts: [
      { id: 'acct_ngn_01', currency: 'NGN', balance: 1500000.75 },
      { id: 'acct_usd_01', currency: 'USD', balance: 8500.50 }
    ]
  }
];

// ======================
// Authentication Middleware
// ======================
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: "Authentication required",
      solution: "Include valid Bearer token in Authorization header"
    });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = usersDB.find(u => u.id === decoded.userId);
    next();
  } catch (error) {
    res.status(401).json({ 
      error: "Invalid token",
      detail: error.message 
    });
  }
};

// ======================
// API Routes
// ======================

// Login Endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // In production: Use bcrypt.compareSync(password, user.password)
  const user = usersDB.find(u => u.email === email);
  
  if (!user || password !== "password123") { // Demo only - replace with real auth
    return res.status(401).json({ 
      error: "Invalid credentials",
      solution: "Check email/password combination"
    });
  }

  // Generate JWT
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({
    message: "Login successful",
    token,
    user: {
      id: user.id,
      email: user.email,
      accounts: user.accounts.map(acct => ({
        id: acct.id,
        currency: acct.currency,
        balance: acct.balance
      }))
    }
  });
});

// Protected Account Data
app.get('/api/accounts', authenticate, (req, res) => {
  res.json({
    status: "success",
    timestamp: new Date().toISOString(),
    timezone: "Africa/Lagos",
    accounts: req.user.accounts
  });
});

// Transaction Simulation
app.post('/api/transactions', authenticate, (req, res) => {
  const { fromAccount, toAccount, amount, currency } = req.body;
  
  // Validate transaction
  if (!fromAccount || !toAccount || !amount || !currency) {
    return res.status(400).json({ 
      error: "Missing transaction parameters" 
    });
  }

  // In production: Add actual transaction logic
  res.json({
    status: "completed",
    transactionId: `txn_${Date.now()}`,
    fromAccount,
    toAccount,
    amount,
    currency,
    fee: amount * 0.01, // 1% transaction fee
    timestamp: new Date().toISOString()
  });
});

// ======================
// Error Handling
// ======================

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    error: `Cannot ${req.method} ${req.url}`,
    availableEndpoints: [
      'POST /api/auth/login',
      'GET /api/accounts (authenticated)',
      'POST /api/transactions (authenticated)'
    ]
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ERROR: ${err.stack}`);
  
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === 'production' 
      ? 'Contact support@trustracapital.com' 
      : err.message,
    referenceId: `ERR-${Date.now()}`
  });
});

// ======================
// Server Initialization
// ======================
const startServer = () => {
  const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
  
  app.listen(PORT, HOST, () => {
    console.log(`
    TrustraCapital Backend Online
    ------------------------------
    Time: ${new Date().toLocaleString('en-NG', { 
      timeZone: 'Africa/Lagos',
      hour12: true 
    })}
    Environment: ${process.env.NODE_ENV || 'development'}
    Frontend: https://trustracapitalfx.onrender.com
    API Base: http://${HOST}:${PORT}/api
    `);
  });
};

// Database initialization simulation
const initializeDB = () => {
  console.log("Database initialized with sample accounts");
  startServer();
};

initializeDB();
