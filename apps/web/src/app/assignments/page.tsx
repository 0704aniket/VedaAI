"use client";

import { useEffect } from "react";
import { useAssignmentStore } from "@/store/useAssignmentStore";
import { useWebSocket } from "@/hooks/useWebSocket";
import FilterBar from "@/components/assignments/FilterBar";
import AssignmentGrid from "@/components/assignments/AssignmentGrid";
import EmptyState from "@/components/assignments/EmptyState";
import { Loader2 } from "lucide-react";

export default function AssignmentsPage() {
  // Connect to websocket for live updates (no specific assignment ID)
  useWebSocket();

  const {
    assignments,
    isLoading,
    search,
    statusFilter,
    setSearch,
    setStatusFilter,
    fetchAssignments,
    deleteAssignment,
    triggerGeneration,
  } = useAssignmentStore();

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this assignment?")) {
      await deleteAssignment(id);
    }
  };

  const handleGenerate = async (id: string) => {
    await triggerGeneration(id);
  };

  const hasFilters = search.trim() !== "" || statusFilter !== "";
  const showEmptyState = !isLoading && assignments.length === 0 && !hasFilters;
  const showNoResults = !isLoading && assignments.length === 0 && hasFilters;

  return (
    <div className="flex flex-col w-full">
      {/* Page Title Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-brand-black tracking-tight">
            Assessments
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage your assignments and monitor AI paper generation status.
          </p>
        </div>
      </div>

      {/* Filters */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* Loading Spinner */}
      {isLoading && assignments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 w-full text-gray-400">
          <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
          <p className="text-sm mt-3 font-medium">Loading assignments...</p>
        </div>
      )}

      {/* Page Contents */}
      {showEmptyState && <EmptyState />}

      {showNoResults && (
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl bg-white border border-border-gray p-8 w-full shadow-sm">
          <p className="text-base font-semibold text-brand-black">No results found</p>
          <p className="text-sm text-gray-500 mt-1 max-w-sm">
            Try adjusting your search query or status filter to find the assignment you are looking for.
          </p>
        </div>
      )}

      {!showEmptyState && !showNoResults && assignments.length > 0 && (
        <AssignmentGrid
          assignments={assignments}
          onDelete={handleDelete}
          onGenerate={handleGenerate}
        />
      )}
    </div>
  );
}
