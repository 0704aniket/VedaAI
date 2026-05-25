"use client";

import Link from "next/link";
import { Search, Plus, Sparkles } from "lucide-react";

interface FilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
}

export default function FilterBar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full mb-6">
      {/* Left side: Search & Filter Inputs */}
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:max-w-xl">
        {/* Search Input */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
            <Search className="h-4.5 w-4.5" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search assignments..."
            className="w-full rounded-xl border border-border-gray bg-white py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-gray-400 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all"
          />
        </div>

        {/* Status Dropdown */}
        <div className="w-full sm:w-44">
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="w-full rounded-xl border border-border-gray bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
              backgroundPosition: "right 0.5rem center",
              backgroundSize: "1.25rem",
              backgroundRepeat: "no-repeat",
              paddingRight: "2rem",
            }}
          >
            <option value="">All Statuses</option>
            <option value="completed">Ready</option>
            <option value="generating">Generating</option>
            <option value="draft">Draft</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Right side: Create Button (Hidden on Mobile, sidebar CTA will be used) */}
      <div className="hidden sm:block">
        <Link
          href="/create-assignment"
          className="flex items-center justify-center gap-2 rounded-xl bg-brand-black px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-black/95 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Create New
          <Sparkles className="h-3.5 w-3.5 text-brand-orange fill-brand-orange/20" />
        </Link>
      </div>
    </div>
  );
}
