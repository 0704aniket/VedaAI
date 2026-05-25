import express from "express";
import cors from "cors";
import { createServer } from "http";
import { env, validateEnv } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { initializeWebSocket } from "./websocket/socket.js";
import { startWorker } from "./jobs/worker.js";
import assignmentRoutes from "./routes/assignment.routes.js";
import generateRoutes from "./routes/generate.routes.js";
import pdfRoutes from "./routes/pdf.routes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

async function main(): Promise<void> {
  // Validate environment
  validateEnv();

  // Connect to MongoDB
  await connectDB();

  // Create Express app
  const app = express();
  const httpServer = createServer(app);

  // Middleware
  app.use(
    cors({
      origin: env.WS_CORS_ORIGIN,
      credentials: true,
    })
  );
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Routes
  app.use("/api/assignments", assignmentRoutes);
  app.use("/api/assignments", generateRoutes);
  app.use("/api/assignments", pdfRoutes);

  // Error handling
  app.use(notFound);
  app.use(errorHandler);

  // Initialize WebSocket
  initializeWebSocket(httpServer);

  // Start BullMQ Worker
  startWorker();

  // Start server
  httpServer.listen(env.PORT, () => {
    console.log(`
╔══════════════════════════════════════════╗
║        VedaAI Server Started             ║
║──────────────────────────────────────────║
║  🚀 API:       http://localhost:${env.PORT}     ║
║  🔌 WebSocket: http://localhost:${env.PORT}     ║
║  📝 Env:       ${env.NODE_ENV.padEnd(24)}║
╚══════════════════════════════════════════╝
    `);
  });
}

main().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
