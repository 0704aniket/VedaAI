"use client";

import { useState } from "react";
import { Download, RefreshCcw, ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface ActionBarProps {
  assignmentId: string;
  isRegenerating: boolean;
  onRegenerate: () => void;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function ActionBar({
  assignmentId,
  isRegenerating,
  onRegenerate,
}: ActionBarProps) {
  const router = useRouter();
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await fetch(`${API_URL}/assignments/${assignmentId}/pdf`);
      if (!res.ok) throw new Error("PDF generation failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `assignment_${assignmentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to download PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="sticky top-0 z-20 -mx-6 mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-border-gray bg-white/90 px-6 py-3 backdrop-blur print:hidden">
      <button
        onClick={() => router.push("/assignments")}
        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 hover:text-brand-black"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={onRegenerate}
          disabled={isRegenerating}
          className="inline-flex items-center gap-2 rounded-xl border border-border-gray bg-white px-3.5 py-2 text-sm font-semibold text-brand-black hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isRegenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
          Regenerate
        </button>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-orange px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-orange/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {downloading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Download PDF
        </button>
      </div>
    </div>
  );
}
