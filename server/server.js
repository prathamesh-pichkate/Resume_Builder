// server/server.js
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRoute from "./routes/aiRoutes.js";
import serverless from "serverless-http";

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB (do not block listen if it retries - keep it async)
connectDB();

// Middleware
const corsOptions = {
  origin: process.env.CLIENT_URL || "*", // in production set CLIENT_URL to your front-end origin
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};
app.use(cors(corsOptions));
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

// Export the app for serverless platforms (Vercel) and for testing
export default app;
export const handler = serverless(app);

// Start listening if a port is provided (Render, Heroku, plain Node)
if (process.env.PORT) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}
// Also allow starting locally even if PORT not set
else if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server (dev) listening on port ${PORT}`);
  });
}
