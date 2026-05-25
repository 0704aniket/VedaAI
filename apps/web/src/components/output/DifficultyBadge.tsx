"use client";

import { DifficultyLevel } from "@vedaai/shared";

interface DifficultyBadgeProps {
  difficulty: DifficultyLevel;
  size?: "sm" | "md";
}

const STYLES: Record<DifficultyLevel, string> = {
  Easy: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Moderate: "bg-amber-50 text-amber-700 border-amber-200",
  Challenging: "bg-rose-50 text-rose-700 border-rose-200",
};

const DOT_STYLES: Record<DifficultyLevel, string> = {
  Easy: "bg-emerald-500",
  Moderate: "bg-amber-500",
  Challenging: "bg-rose-500",
};

export default function DifficultyBadge({
  difficulty,
  size = "sm",
}: DifficultyBadgeProps) {
  const cls = STYLES[difficulty] ?? STYLES.Moderate;
  const dot = DOT_STYLES[difficulty] ?? DOT_STYLES.Moderate;
  const sizeCls =
    size === "md" ? "px-2.5 py-1 text-xs" : "px-2 py-0.5 text-[10px]";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-semibold uppercase tracking-wide ${cls} ${sizeCls}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {difficulty}
    </span>
  );
}
