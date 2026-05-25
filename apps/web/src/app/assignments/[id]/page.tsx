"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { GeneratedPaper as PaperType } from "@vedaai/shared";
import { useAssignmentStore } from "@/store/useAssignmentStore";
import { useSocketStore } from "@/store/useSocketStore";
import { useWebSocket } from "@/hooks/useWebSocket";
import PaperHeader from "@/components/output/PaperHeader";
import StudentInfo from "@/components/output/StudentInfo";
import PaperSection from "@/components/output/PaperSection";
import AnswerKey from "@/components/output/AnswerKey";
import ActionBar from "@/components/output/ActionBar";
import { Loader2, AlertTriangle, Sparkles } from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function AssignmentDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();

  const { triggerGeneration } = useAssignmentStore();
  const { assignmentProgress } = useWebSocket(id);
  const socketProgress = useSocketStore((s) =>
    id ? s.progress[id] : undefined
  );

  const [paper, setPaper] = useState<PaperType | null>(null);
  const [status, setStatus] = useState<
    "draft" | "generating" | "completed" | "failed"
  >("draft");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);

  // Load the assignment + paper
  const loadAll = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      // Fetch assignment first to know status
      const aRes = await fetch(`${API_URL}/assignments/${id}`);
      const aJson = await aRes.json();
      if (!aRes.ok || !aJson.success) {
        throw new Error(aJson.error || "Assignment not found");
      }
      const assignment = aJson.data;
      setStatus(assignment.status);

      // If completed (paper exists), fetch it
      if (assignment.status === "completed") {
        // Paper may already be populated on assignment
        if (
          assignment.generatedPaper &&
          typeof assignment.generatedPaper === "object"
        ) {
          setPaper(assignment.generatedPaper as PaperType);
        } else {
          const pRes = await fetch(`${API_URL}/assignments/${id}/paper`);
          const pJson = await pRes.json();
          if (pRes.ok && pJson.success) {
            setPaper(pJson.data);
          }
        }
      }
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to load assignment";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Listen for WS completion → reload paper
  useEffect(() => {
    if (!id) return;
    const unsubscribe = useSocketStore.subscribe((state) => {
      const p = state.progress[id];
      if (p && p.progress === 100 && p.message === "Generation complete!") {
        // Generation completed — refetch paper
        loadAll();
      }
    });
    return () => unsubscribe();
  }, [id, loadAll]);

  const handleRegenerate = async () => {
    if (!id) return;
    setRegenerating(true);
    setPaper(null);
    setStatus("generating");
    await triggerGeneration(id);
  };

  // Once status flips back to completed (via WS), clear regenerating flag
  useEffect(() => {
    if (status === "completed" && regenerating) {
      setRegenerating(false);
    }
  }, [status, regenerating]);

  // ---- Render states ----

  if (!id) {
    return (
      <div className="py-20 text-center text-sm text-gray-500">
        Invalid assignment ID.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
        <p className="mt-3 text-sm font-medium">Loading paper...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <AlertTriangle className="mx-auto mb-3 h-8 w-8 text-red-500" />
        <p className="font-semibold text-red-700">{error}</p>
        <button
          onClick={() => router.push("/assignments")}
          className="mt-4 rounded-xl bg-brand-black px-4 py-2 text-sm font-semibold text-white"
        >
          Back to Assignments
        </button>
      </div>
    );
  }

  // In-progress generation view (regenerate flow or direct nav while generating)
  if (status === "generating" || regenerating) {
    const progressPct =
      assignmentProgress?.progress ?? socketProgress?.progress ?? 30;
    const progressMsg =
      assignmentProgress?.message ??
      socketProgress?.message ??
      "Generating questions with AI...";

    return (
      <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-border-gray bg-white p-8 text-center shadow-sm sm:p-12">
        <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
          <Loader2 className="h-10 w-10 animate-spin" />
          <Sparkles className="absolute h-5 w-5 animate-pulse" />
        </div>
        <h4 className="mb-1 text-lg font-extrabold text-brand-black">
          Generating your paper
        </h4>
        <p className="text-sm text-gray-500">{progressMsg}</p>
        <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full bg-brand-orange transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="mt-2 text-xs font-semibold text-gray-400">
          {progressPct}%
        </p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <AlertTriangle className="mx-auto mb-3 h-8 w-8 text-red-500" />
        <p className="font-semibold text-red-700">
          AI generation failed for this assignment.
        </p>
        <button
          onClick={handleRegenerate}
          className="mt-4 rounded-xl bg-brand-orange px-4 py-2 text-sm font-semibold text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="py-20 text-center text-sm text-gray-500">
        Paper not available yet.
      </div>
    );
  }

  // ---- Completed state: render full paper ----

  return (
    <div className="w-full">
      <ActionBar
        assignmentId={id}
        isRegenerating={regenerating}
        onRegenerate={handleRegenerate}
      />

      {/* Paper sheet */}
      <article className="mx-auto max-w-4xl rounded-2xl border border-border-gray bg-white p-5 shadow-sm sm:p-8 md:p-10 print:rounded-none print:border-0 print:p-0 print:shadow-none">
        <PaperHeader
          schoolName={paper.schoolName}
          subject={paper.subject}
          className={paper.className}
          timeAllowed={paper.timeAllowed}
          maxMarks={paper.maxMarks}
        />

        <StudentInfo />

        <div>
          {paper.sections.map((section, idx) => (
            <PaperSection key={idx} section={section} index={idx} />
          ))}
        </div>

        {paper.answerKey && paper.answerKey.length > 0 && (
          <AnswerKey items={paper.answerKey} />
        )}

        {/* Footer */}
        <div className="mt-10 border-t border-gray-100 pt-4 text-center text-[11px] text-gray-400">
          — End of Question Paper — Generated by VedaAI
        </div>
      </article>
    </div>
  );
}
