// server/server.js
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRoute from "./routes/aiRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB (run in background so server can start)
connectDB()
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// === CORS: allow multiple origins
// Set CLIENT_URL env var to a comma-separated list, e.g:
// CLIENT_URL=http://localhost:5173,https://your-frontend.onrender.app,https://your-frontend.vercel.app
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((u) => u.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (incomingOrigin, callback) => {
    // incomingOrigin is undefined for curl/postman (server-to-server). Allow those.
    if (!incomingOrigin) return callback(null, true);

    if (allowedOrigins.includes(incomingOrigin)) {
      return callback(null, true);
    }
    // Not allowed
    return callback(
      new Error(`CORS policy: Origin ${incomingOrigin} not allowed`),
      false
    );
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // enable preflight for all routes
app.use(express.json());

// Basic health route
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.get("/health", (req, res) =>
  res.json({ status: "ok", time: new Date().toISOString() })
);

// API routes
app.use("/api/user", userRouter);
app.use("/api/resume", resumeRouter);
app.use("/api/ai", aiRoute);

// Start server (Render provides PORT env)
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log("Allowed CORS origins:", allowedOrigins);
});
