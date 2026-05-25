"use client";

import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { useAssignmentStore } from "./useAssignmentStore";
import {
  GenerationStartedPayload,
  GenerationProgressPayload,
  GenerationCompletedPayload,
  GenerationErrorPayload,
} from "@vedaai/shared";

interface SocketState {
  socket: Socket | null;
  isConnected: boolean;
  progress: Record<string, { progress: number; message: string }>;

  // Actions
  initializeSocket: () => void;
  disconnectSocket: () => void;
  joinAssignmentRoom: (assignmentId: string) => void;
  leaveAssignmentRoom: (assignmentId: string) => void;
  clearProgress: (assignmentId: string) => void;
}

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:5000";

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  isConnected: false,
  progress: {},

  initializeSocket: () => {
    if (get().socket) return; // Already initialized

    const socket = io(WS_URL, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      set({ isConnected: true });
      console.log("🔌 Connected to WebSocket Server");
    });

    socket.on("disconnect", () => {
      set({ isConnected: false });
      console.log("🔌 Disconnected from WebSocket Server");
    });

    // Handle Generation Progress Events
    socket.on("generation:started", (data: GenerationStartedPayload) => {
      console.log("🚀 Generation started via WS:", data);
      useAssignmentStore.getState().updateLocalAssignmentStatus(data.assignmentId, "generating");
      set((state) => ({
        progress: {
          ...state.progress,
          [data.assignmentId]: { progress: 0, message: "Initializing AI paper generation..." },
        },
      }));
    });

    socket.on("generation:progress", (data: GenerationProgressPayload) => {
      console.log("📈 Generation progress via WS:", data);
      set((state) => ({
        progress: {
          ...state.progress,
          [data.assignmentId]: { progress: data.progress, message: data.message },
        },
      }));
    });

    socket.on("generation:completed", (data: GenerationCompletedPayload) => {
      console.log("✅ Generation completed via WS:", data);
      useAssignmentStore.getState().updateLocalAssignmentStatus(data.assignmentId, "completed", data.paper);
      // Clean up progress entry after brief delay
      setTimeout(() => {
        get().clearProgress(data.assignmentId);
      }, 5000);
    });

    socket.on("generation:error", (payload: unknown) => {
      const data =
        payload && typeof payload === "object"
          ? (payload as GenerationErrorPayload)
          : null;
      const assignmentId = data?.assignmentId;
      const errorMessage = data?.error || "Unknown generation error";

      if (!assignmentId) {
        console.warn("generation:error event missing assignmentId or invalid payload:", payload);
        return;
      }

      console.error("❌ Generation error via WS:", { assignmentId, errorMessage });
      useAssignmentStore.getState().updateLocalAssignmentStatus(assignmentId, "failed");
      set((state) => ({
        progress: {
          ...state.progress,
          [assignmentId]: { progress: 100, message: `Error: ${errorMessage}` },
        },
      }));
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  joinAssignmentRoom: (assignmentId) => {
    const socket = get().socket;
    if (socket) {
      socket.emit("join:assignment", assignmentId);
      console.log(`🔌 Joined room: assignment:${assignmentId}`);
    }
  },

  leaveAssignmentRoom: (assignmentId) => {
    const socket = get().socket;
    if (socket) {
      socket.emit("leave:assignment", assignmentId);
      console.log(`🔌 Left room: assignment:${assignmentId}`);
    }
  },

  clearProgress: (assignmentId) => {
    set((state) => {
      const updated = { ...state.progress };
      delete updated[assignmentId];
      return { progress: updated };
    });
  },
}));
