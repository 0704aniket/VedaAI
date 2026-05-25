"use client";

import { useState } from "react";
import { AnswerKeyItem } from "@vedaai/shared";
import { ChevronDown, KeyRound } from "lucide-react";

interface AnswerKeyProps {
  items: AnswerKeyItem[];
}

export default function AnswerKey({ items }: AnswerKeyProps) {
  const [open, setOpen] = useState(false);

  if (!items || items.length === 0) return null;

  return (
    <section className="mt-10 rounded-2xl border border-border-gray bg-white shadow-sm print:break-before-page">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between p-4 sm:p-5 print:hidden"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
            <KeyRound className="h-4.5 w-4.5" />
          </div>
          <div className="text-left">
            <h4 className="text-sm font-extrabold text-brand-black">
              Answer Key
            </h4>
            <p className="text-xs text-gray-500">
              {items.length} answers — teacher reference only
            </p>
          </div>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-gray-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Always render for print, toggle for screen */}
      <div
        className={`${
          open ? "block" : "hidden"
        } border-t border-gray-100 print:block print:border-0`}
      >
        <div className="hidden p-5 print:block">
          <h4 className="mb-3 text-base font-extrabold text-brand-black">
            Answer Key
          </h4>
        </div>
        <ol className="space-y-2 p-4 sm:p-5">
          {items.map((a) => (
            <li
              key={a.questionNumber}
              className="flex gap-3 rounded-lg bg-gray-50 p-3 text-sm"
            >
              <span className="shrink-0 font-bold text-brand-orange">
                Q{a.questionNumber}.
              </span>
              <span className="text-gray-700">{a.answer}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
