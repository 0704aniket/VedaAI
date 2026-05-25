import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HTTPServer } from "http";
import { env } from "../config/env.js";

let io: SocketIOServer;

export function initializeWebSocket(httpServer: HTTPServer): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: env.WS_CORS_ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket: Socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Join assignment-specific room
    socket.on("join:assignment", (assignmentId: string) => {
      socket.join(`assignment:${assignmentId}`);
      console.log(
        `Socket ${socket.id} joined room: assignment:${assignmentId}`
      );
    });

    // Leave assignment room
    socket.on("leave:assignment", (assignmentId: string) => {
      socket.leave(`assignment:${assignmentId}`);
    });

    socket.on("disconnect", () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  console.log("✅ WebSocket server initialized");
  return io;
}

export function getIO(): SocketIOServer {
  if (!io) {
    throw new Error("WebSocket not initialized");
  }
  return io;
}

// Emit helpers
export function emitGenerationStarted(assignmentId: string): void {
  getIO()
    .to(`assignment:${assignmentId}`)
    .emit("generation:started", {
      assignmentId,
      status: "generating",
    });
  // Also broadcast globally for the assignments list
  getIO().emit("assignment:updated", { assignmentId, status: "generating" });
}

export function emitGenerationProgress(
  assignmentId: string,
  progress: number,
  message: string
): void {
  getIO()
    .to(`assignment:${assignmentId}`)
    .emit("generation:progress", {
      assignmentId,
      progress,
      message,
    });
}

export function emitGenerationCompleted(
  assignmentId: string,
  paper: unknown
): void {
  getIO()
    .to(`assignment:${assignmentId}`)
    .emit("generation:completed", {
      assignmentId,
      paper,
    });
  getIO().emit("assignment:updated", { assignmentId, status: "completed" });
}

export function emitGenerationError(
  assignmentId: string,
  error: string
): void {
  getIO()
    .to(`assignment:${assignmentId}`)
    .emit("generation:error", {
      assignmentId,
      error,
    });
  getIO().emit("assignment:updated", { assignmentId, status: "failed" });
}
