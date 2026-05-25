"use client";

import { PaperSection as PaperSectionType } from "@vedaai/shared";
import QuestionItem from "./QuestionItem";

interface PaperSectionProps {
  section: PaperSectionType;
  index: number;
}

export default function PaperSection({ section, index }: PaperSectionProps) {
  const sectionLetter = String.fromCharCode(65 + index); // A, B, C ...

  return (
    <section className="mb-8 break-inside-avoid">
      {/* Section header banner */}
      <div className="mb-4 rounded-xl border border-brand-black/10 bg-brand-black px-4 py-3 text-white sm:px-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-base font-extrabold tracking-tight sm:text-lg">
            Section {sectionLetter}
            {section.title && section.title.toLowerCase() !== `section ${sectionLetter.toLowerCase()}` && (
              <span className="ml-2 font-medium text-white/70">— {section.title}</span>
            )}
          </h3>
          <span className="text-xs font-semibold text-brand-orange">
            {section.questions.length}{" "}
            {section.questions.length === 1 ? "question" : "questions"}
          </span>
        </div>
        {section.instruction && (
          <p className="mt-1 text-xs italic text-white/80 sm:text-sm">
            {section.instruction}
          </p>
        )}
      </div>

      {/* Questions list */}
      <div className="space-y-3">
        {section.questions.map((q) => (
          <QuestionItem key={q.number} question={q} />
        ))}
      </div>
    </section>
  );
}
