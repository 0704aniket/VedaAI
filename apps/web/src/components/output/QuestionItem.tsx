"use client";

import { GeneratedQuestion } from "@vedaai/shared";
import DifficultyBadge from "./DifficultyBadge";

interface QuestionItemProps {
  question: GeneratedQuestion;
}

export default function QuestionItem({ question }: QuestionItemProps) {
  const { number, text, difficulty, marks, options } = question;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 transition-shadow hover:shadow-sm sm:p-5">
      {/* Header row: number + marks + badge */}
      <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="shrink-0 rounded-lg bg-brand-orange/10 px-2.5 py-1 text-sm font-bold text-brand-orange">
            Q{number}
          </span>
          <p className="text-sm leading-relaxed text-brand-black sm:text-[15px]">
            {text}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <DifficultyBadge difficulty={difficulty} />
          <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-bold text-gray-700">
            {marks} {marks === 1 ? "mark" : "marks"}
          </span>
        </div>
      </div>

      {/* MCQ options */}
      {options && options.length > 0 && (
        <ol className="mt-3 grid gap-1.5 pl-12 sm:grid-cols-2">
          {options.map((opt, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 text-sm text-gray-700"
            >
              <span className="font-semibold text-gray-500">
                {String.fromCharCode(65 + idx)}.
              </span>
              <span>{opt}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
