import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import healthRoutes from "./routes/healthRoutes.js";
import opportunityRoutes from "./routes/opportunityRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

// ── Allowed CORS Origins ────────────────────────────────────
const clientOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim().replace(/\/$/, ""));

// ── Middleware ──────────────────────────────────────────────
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isAllowed =
        clientOrigins.includes(origin) ||
        clientOrigins.includes("*") ||
        process.env.NODE_ENV !== "production";
      if (isAllowed) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// Request logging in development
if (process.env.NODE_ENV !== "production") {
  app.use((req, _res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
  });
}

// ── Routes ─────────────────────────────────────────────────
app.use("/api/health", healthRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/auth", authRoutes);

// ── Error handling ─────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
