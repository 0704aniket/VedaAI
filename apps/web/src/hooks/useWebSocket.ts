"use client";

import { useEffect } from "react";
import { useSocketStore } from "../store/useSocketStore";

export function useWebSocket(assignmentId?: string) {
  const {
    isConnected,
    progress,
    initializeSocket,
    disconnectSocket,
    joinAssignmentRoom,
    leaveAssignmentRoom,
  } = useSocketStore();

  useEffect(() => {
    // Connect to websocket when hook mounts
    initializeSocket();

    // If an assignment ID is provided, join its specific room
    if (assignmentId) {
      joinAssignmentRoom(assignmentId);
    }

    return () => {
      // Leave room if unmounting
      if (assignmentId) {
        leaveAssignmentRoom(assignmentId);
      }
    };
  }, [assignmentId, initializeSocket, joinAssignmentRoom, leaveAssignmentRoom]);

  // Return connections state and progress for this specific assignment
  return {
    isConnected,
    assignmentProgress: assignmentId ? progress[assignmentId] : null,
  };
}
