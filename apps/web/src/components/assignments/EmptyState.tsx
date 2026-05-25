"use client";

import Link from "next/link";
import { Sparkles, FileText, Plus } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 md:p-16 rounded-2xl bg-white border border-border-gray shadow-sm max-w-lg mx-auto my-12">
      {/* Decorative Icon */}
      <div className="relative mb-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-orange/10 text-brand-orange shadow-inner">
          <FileText className="h-10 w-10" />
        </div>
        <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-brand-black text-white shadow-md">
          <Sparkles className="h-4 w-4 text-brand-orange fill-brand-orange/20" />
        </div>
      </div>

      {/* Heading & Text */}
      <h3 className="text-xl font-extrabold text-brand-black tracking-tight mb-2">
        No Assignments Yet
      </h3>
      <p className="text-sm text-gray-500 max-w-sm mb-8 leading-relaxed">
        Get started by generating your first AI-powered assessment. Simply configure your questions and watch the AI write the exam.
      </p>

      {/* Button */}
      <Link
        href="/create-assignment"
        className="inline-flex items-center gap-2 rounded-xl bg-brand-black px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-black/95 transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        <Plus className="h-4.5 w-4.5" />
        Create Your First Assignment
      </Link>
    </div>
  );
}
