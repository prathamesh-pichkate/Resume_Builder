// server/server.js
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import connectDB from './config/db.js';
import userRouter from './routes/userRoute.js';
import resumeRouter from './routes/resumeRoutes.js';
import aiRoute from './routes/aiRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB (run in background so server can start)
connectDB()
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// === CORS: allow multiple origins (comma-separated in CLIENT_URL)
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((u) => u.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (incomingOrigin, callback) => {
    // allow non-browser tools (curl, server-to-server) where incomingOrigin is undefined
    if (!incomingOrigin) return callback(null, true);

    if (allowedOrigins.includes(incomingOrigin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS policy: Origin ${incomingOrigin} not allowed`), false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 204, // success status for preflight
};

// apply CORS for all routes
app.use(cors(corsOptions));

// Simple generic preflight handler (avoids using app.options('*', ...))
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    // The cors middleware already sets appropriate Access-Control-* headers,
    // but we must send a quick response for preflight.
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());

//test_ci
let name = 'Server';

// Basic health route
app.get('/', (req, res) => {
  res.send('API is running...');
});
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// API routes
app.use('/api/user', userRouter);
app.use('/api/resume', resumeRouter);
app.use('/api/ai', aiRoute);

// Start server (Render provides PORT env)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
  console.log('Allowed CORS origins:', allowedOrigins);
});
