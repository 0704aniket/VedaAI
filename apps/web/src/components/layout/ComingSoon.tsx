"use client";

import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description?: string;
}

export default function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-border-gray bg-white p-8 text-center shadow-sm sm:p-12">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
        <Sparkles className="h-8 w-8" />
      </div>
      <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-brand-black">
        {title}
      </h1>
      <p className="mb-6 text-sm text-gray-500">
        {description || "This feature is coming soon."}
      </p>
      <Link
        href="/assignments"
        className="inline-flex items-center gap-1.5 rounded-xl bg-brand-black px-4 py-2 text-sm font-semibold text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Assignments
      </Link>
    </div>
  );
}
