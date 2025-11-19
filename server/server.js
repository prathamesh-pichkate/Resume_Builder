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

// Connect to MongoDB
connectDB();

// Middleware
const corsOptions = {
  origin: process.env.CLIENT_URL || "*", // set CLIENT_URL in Vercel for production
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Basic health route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// API routes
app.use("/api/user", userRouter);
app.use("/api/resume", resumeRouter);
app.use("/api/ai", aiRoute);

// Export the app for testing and the serverless handler for Vercel
export default app;
export const handler = serverless(app);

// Start listening when running in "local" or non-production mode
// (this keeps "node server.js" working for local dev)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
