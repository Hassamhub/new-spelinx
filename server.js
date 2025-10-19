// backend/server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import cors from "cors";
import mongoose from "mongoose";

// Import routes
import rewardsRoutes from "./routes/rewards.js";
import walletRoutes from "./routes/wallet.js";
import paymentRoutes from "./routes/payment.js";
import authRoutes from "./routes/auth.js";
import gamesRoutes from "./routes/games.js";
import leaderboardRoutes from "./routes/leaderboard.js";
import achievementsRoutes from "./routes/achievements.js";
import dailyRoutes from "./routes/daily.js";
import referralRoutes from "./routes/referral.js";
import subscriptionRoutes from "./routes/subscriptions.js";
import weeklyRewardsRoutes from "./routes/weeklyRewards.js";
import storeRoutes from "./routes/store.js";
import adminRoutes from "./routes/admin.js";
import premiumRoutes from "./routes/premium.js";

// Import store admin routes
import storeAdminRoutes from "./routes/storeAdmin.js";

// Import models for socket
import Leaderboard from "./models/Leaderboard.js";
import { UserAchievement } from "./models/Achievement.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // frontend dev server
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// --- Middleware ---
app.use(express.json());
app.use(cors());

// --- MongoDB connection ---
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/rewards", rewardsRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/games", gamesRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/achievements", achievementsRoutes);
app.use("/api/daily", dailyRoutes);
app.use("/api/referral", referralRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/weekly-rewards", weeklyRewardsRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/store-admin", storeAdminRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/premium", premiumRoutes);

// --- Health check route ---
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// --- SOCKET.IO SETUP ---
io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  // Join user room for personalized updates
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  // Real-time leaderboard updates
  socket.on("request-leaderboard", async (game) => {
    try {
      let leaderboard;
      if (game === 'global') {
        leaderboard = await Leaderboard.find({})
          .sort({ totalXP: -1 })
          .limit(10)
          .select("username totalXP totalINX level");
      } else {
        leaderboard = await Leaderboard.find({})
          .sort({ [`gameHighscores.${game}`]: -1 })
          .limit(10)
          .select(`username gameHighscores.${game}`);
      }
      socket.emit("leaderboard-update", { game, leaderboard });
    } catch (error) {
      console.error("Socket leaderboard error:", error);
    }
  });

  // Real-time achievement updates
  socket.on("check-achievements", async (userId) => {
    try {
      // Simplified achievement check
      const achievements = await UserAchievement.find({ userId })
        .populate("achievementId")
        .sort({ completedAt: -1 });

      socket.emit("achievements-update", achievements);
    } catch (error) {
      console.error("Socket achievements error:", error);
    }
  });

  // Real-time referral updates
  socket.on("request-referral-stats", async (userId) => {
    try {
      // Fetch referral stats for real-time updates
      const referrals = await Referral.find({ referrerId: userId });
      const completed = referrals.filter(r => r.status === "completed");
      const stats = {
        totalReferrals: referrals.length,
        completedReferrals: completed.length,
        totalEarned: (completed.length * 100) + (completed.length * 50), // 100 INX per referral + 50 INX bonus
      };
      socket.emit("referral-stats-update", stats);
    } catch (error) {
      console.error("Socket referral stats error:", error);
    }
  });

  // Real-time store inventory updates
  socket.on("request-store-inventory", async () => {
    try {
      // Import store model dynamically
      const { Store } = await import("./models/Store.js");
      const items = await Store.find({}).sort({ createdAt: -1 }).limit(10);
      socket.emit("store-inventory-update", { items });
    } catch (error) {
      console.error("Socket store inventory error:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// --- Serve Next.js frontend ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve Next.js built files (if available)
const nextBuildPath = path.join(__dirname, "./spelinx-frontend/.next");
if (fs.existsSync(nextBuildPath)) {
  app.use('/_next', express.static(nextBuildPath));
  app.use('/_next/static', express.static(path.join(nextBuildPath, 'static')));
}

// Serve built Next.js static export if exists
app.get('/', (req, res) => {
  const staticExportPath = path.join(__dirname, "./spelinx-frontend/out/index.html");
  if (fs.existsSync(staticExportPath)) {
    res.sendFile(staticExportPath);
  } else {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>SPELINX - Gaming Platform</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
          .container { max-width: 600px; margin: 0 auto; }
          h1 { font-size: 3em; margin-bottom: 20px; }
          p { font-size: 1.2em; margin-bottom: 30px; }
          .status { background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin: 20px 0; }
          button { background: #4CAF50; color: white; padding: 15px 30px; border: none; border-radius: 5px; cursor: pointer; font-size: 1em; }
          button:hover { background: #45a049; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🎮 SPELINX</h1>
          <p>Premium Gaming Platform</p>
          <div class="status">
            <h2>Backend Status: ✅ Running</h2>
            <p>Server is running on port 3000</p>
            <p>MongoDB: Connected to Atlas</p>
            <p>Frontend: Next.js build required</p>
          </div>
          <button onclick="location.reload()">Refresh Status</button>
        </div>
      </body>
      </html>
    `);
  }
});

// Handle Next.js routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    res.status(404).json({ error: 'API endpoint not found' });
  } else {
    // Serve Next.js static export or fallback
    const staticExportPath = path.join(__dirname, "./spelinx-frontend/out/index.html");
    if (fs.existsSync(staticExportPath)) {
      res.sendFile(staticExportPath);
    } else {
      res.redirect('/');
    }
  }
});

// --- Start server ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
