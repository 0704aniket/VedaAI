"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Assignment } from "@vedaai/shared";
import { Calendar, FileQuestion, GraduationCap, MoreVertical, Award, ArrowUpRight } from "lucide-react";
import ContextMenu from "./ContextMenu";

interface AssignmentCardProps {
  assignment: Assignment;
  onDelete: (id: string) => void;
  onGenerate: (id: string) => void;
}

export default function AssignmentCard({ assignment, onDelete, onGenerate }: AssignmentCardProps) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  const {
    _id,
    title,
    subject = "General",
    className = "5th",
    dueDate,
    totalQuestions,
    totalMarks,
    status,
    createdAt,
  } = assignment;

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const getStatusDetails = () => {
    switch (status) {
      case "completed":
        return {
          text: "Ready",
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
          dot: "bg-emerald-500",
        };
      case "generating":
        return {
          text: "Generating",
          bg: "bg-amber-50 text-amber-700 border-amber-200 animate-pulse",
          dot: "bg-amber-500 animate-ping",
        };
      case "failed":
        return {
          text: "Failed",
          bg: "bg-rose-50 text-rose-700 border-rose-200",
          dot: "bg-rose-500",
        };
      default:
        return {
          text: "Draft",
          bg: "bg-gray-50 text-gray-600 border-gray-200",
          dot: "bg-gray-400",
        };
    }
  };

  const statusInfo = getStatusDetails();

  const handleCardClick = () => {
    if (status === "completed") {
      router.push(`/assignments/${_id}`);
    } else if (status === "draft") {
      onGenerate(_id);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative flex flex-col justify-between rounded-2xl border border-border-gray bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
        status === "completed" || status === "draft" ? "cursor-pointer" : "cursor-default"
      }`}
    >
      {/* Top Header Row */}
      <div className="flex items-start justify-between">
        {/* Status Badge */}
        <div className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusInfo.bg}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dot}`} />
          {statusInfo.text}
        </div>

        {/* 3-Dot Options Menu */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-150 hover:text-brand-black transition-colors"
          >
            <MoreVertical className="h-4.5 w-4.5" />
          </button>
          {showMenu && (
            <ContextMenu
              onView={() => router.push(`/assignments/${_id}`)}
              onDelete={() => onDelete(_id)}
              onClose={() => setShowMenu(false)}
            />
          )}
        </div>
      </div>

      {/* Title */}
      <div className="mt-4">
        <h4 className="text-base font-extrabold text-brand-black leading-snug group-hover:text-brand-orange transition-colors flex items-center gap-1">
          {title}
          {status === "completed" && (
            <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </h4>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <GraduationCap className="h-3.5 w-3.5" />
            Class {className}
          </span>
          <span className="text-gray-300">•</span>
          <span>{subject}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="my-4 border-t border-gray-100" />

      {/* Counts / Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 rounded-xl p-2">
          <FileQuestion className="h-4 w-4 text-brand-orange" />
          <div>
            <p className="font-bold leading-none">{totalQuestions}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Questions</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 rounded-xl p-2">
          <Award className="h-4 w-4 text-brand-orange" />
          <div>
            <p className="font-bold leading-none">{totalMarks}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Total Marks</p>
          </div>
        </div>
      </div>

      {/* Footer Info (Dates) */}
      <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-[11px] text-gray-400">
        <div>
          <span>Created: {formatDate(createdAt)}</span>
        </div>
        <div className="flex items-center gap-1 font-semibold text-gray-500">
          <Calendar className="h-3 w-3" />
          <span>Due: {formatDate(dueDate)}</span>
        </div>
      </div>
    </div>
  );
}
