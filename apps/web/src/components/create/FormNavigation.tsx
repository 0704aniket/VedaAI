"use client";

import { ArrowLeft, ArrowRight, Loader2, Sparkles } from "lucide-react";

interface FormNavigationProps {
  onBack: () => void;
  onNext: () => void;
  showBack: boolean;
  nextText: string;
  isSubmitting?: boolean;
}

export default function FormNavigation({
  onBack,
  onNext,
  showBack,
  nextText,
  isSubmitting = false,
}: FormNavigationProps) {
  return (
    <div className="flex items-center justify-between w-full mt-8 pt-6 border-t border-gray-150">
      {/* Back button */}
      <div>
        {showBack ? (
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-xl border border-border-gray bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 hover:text-brand-black active:scale-[0.98] disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </button>
        ) : (
          <div /> // spacer
        )}
      </div>

      {/* Next/Submit button */}
      <button
        type="button"
        onClick={onNext}
        disabled={isSubmitting}
        className="flex items-center gap-2 rounded-xl bg-brand-black px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-black/95 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4.5 w-4.5 animate-spin" />
            Generating Paper...
          </>
        ) : (
          <>
            {nextText}
            {nextText === "Generate AI Paper" ? (
              <Sparkles className="h-4 w-4 text-brand-orange fill-brand-orange/20" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
          </>
        )}
      </button>
    </div>
  );
}
