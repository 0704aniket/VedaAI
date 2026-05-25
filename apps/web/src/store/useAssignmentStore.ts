"use client";

import { create } from "zustand";
import { Assignment, CreateAssignmentDto, ApiResponse, PaginatedResponse } from "@vedaai/shared";

interface AssignmentState {
  assignments: Assignment[];
  currentAssignment: Assignment | null;
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  search: string;
  statusFilter: string;

  // Actions
  fetchAssignments: (page?: number, limit?: number) => Promise<void>;
  fetchAssignmentById: (id: string) => Promise<Assignment | null>;
  createAssignment: (dto: CreateAssignmentDto) => Promise<Assignment | null>;
  deleteAssignment: (id: string) => Promise<boolean>;
  triggerGeneration: (id: string) => Promise<boolean>;
  setSearch: (search: string) => void;
  setStatusFilter: (status: string) => void;
  updateLocalAssignmentStatus: (id: string, status: Assignment["status"], generatedPaper?: any) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const useAssignmentStore = create<AssignmentState>((set, get) => ({
  assignments: [],
  currentAssignment: null,
  isLoading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 20,
  search: "",
  statusFilter: "",

  setSearch: (search) => {
    set({ search });
    get().fetchAssignments(1);
  },

  setStatusFilter: (statusFilter) => {
    set({ statusFilter });
    get().fetchAssignments(1);
  },

  fetchAssignments: async (pageArg?, limitArg?) => {
    set({ isLoading: true, error: null });
    try {
      const page = pageArg ?? get().page;
      const limit = limitArg ?? get().limit;
      const search = get().search;
      const status = get().statusFilter;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) queryParams.append("search", search);
      if (status) queryParams.append("status", status);

      const res = await fetch(`${API_URL}/assignments?${queryParams.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch assignments");

      const json: PaginatedResponse<Assignment> = await res.json();
      if (json.success && json.data) {
        set({
          assignments: json.data,
          total: json.total || 0,
          page,
          limit,
        });
      } else {
        throw new Error(json.error || "Failed to fetch assignments");
      }
    } catch (err: any) {
      set({ error: err.message || "Failed to load assignments" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAssignmentById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/assignments/${id}`);
      if (!res.ok) throw new Error("Failed to fetch assignment details");

      const json: ApiResponse<Assignment> = await res.json();
      if (json.success && json.data) {
        set({ currentAssignment: json.data });
        return json.data;
      } else {
        throw new Error(json.error || "Failed to fetch assignment details");
      }
    } catch (err: any) {
      set({ error: err.message || "Failed to load assignment details" });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  createAssignment: async (dto) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/assignments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
      });

      const json: ApiResponse<Assignment> = await res.json();
      if (json.success && json.data) {
        // Refresh assignments list
        await get().fetchAssignments(1);
        return json.data;
      } else {
        throw new Error(json.error || "Failed to create assignment");
      }
    } catch (err: any) {
      set({ error: err.message || "Failed to create assignment" });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteAssignment: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${API_URL}/assignments/${id}`, {
        method: "DELETE",
      });

      const json: ApiResponse<void> = await res.json();
      if (json.success) {
        set((state) => ({
          assignments: state.assignments.filter((a) => a._id !== id),
          total: state.total - 1,
        }));
        if (get().currentAssignment?._id === id) {
          set({ currentAssignment: null });
        }
        return true;
      } else {
        throw new Error(json.error || "Failed to delete assignment");
      }
    } catch (err: any) {
      set({ error: err.message || "Failed to delete assignment" });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  triggerGeneration: async (id) => {
    try {
      // Optimistically update status to generating
      get().updateLocalAssignmentStatus(id, "generating");

      const res = await fetch(`${API_URL}/assignments/${id}/generate`, {
        method: "POST",
      });

      const json: ApiResponse<{ jobId: string; assignmentId: string }> = await res.json();
      if (json.success) {
        return true;
      } else {
        // Revert status if error
        get().updateLocalAssignmentStatus(id, "draft");
        throw new Error(json.error || "Failed to start generation");
      }
    } catch (err: any) {
      set({ error: err.message || "Failed to trigger AI generation" });
      return false;
    }
  },

  updateLocalAssignmentStatus: (id, status, generatedPaper) => {
    set((state) => {
      const updatedAssignments = state.assignments.map((a) => {
        if (a._id === id) {
          return {
            ...a,
            status,
            ...(generatedPaper ? { generatedPaper } : {}),
          };
        }
        return a;
      });

      const updatedCurrent = state.currentAssignment?._id === id
        ? {
            ...state.currentAssignment,
            status,
            ...(generatedPaper ? { generatedPaper } : {}),
          }
        : state.currentAssignment;

      return {
        assignments: updatedAssignments,
        currentAssignment: updatedCurrent,
      };
    });
  },
}));
