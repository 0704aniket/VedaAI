"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { QuestionTypeConfig, QUESTION_TYPES, QuestionTypeName } from "@vedaai/shared";

interface QuestionTypeRowProps {
  config: QuestionTypeConfig;
  availableTypes: QuestionTypeName[];
  onUpdate: (updates: Partial<Omit<QuestionTypeConfig, "id">>) => void;
  onRemove: () => void;
  showRemove: boolean;
}

export default function QuestionTypeRow({
  config,
  availableTypes,
  onUpdate,
  onRemove,
  showRemove,
}: QuestionTypeRowProps) {
  // Safe adjustment helper
  const adjustCount = (amount: number) => {
    const nextVal = config.count + amount;
    if (nextVal > 0) {
      onUpdate({ count: nextVal });
    }
  };

  const adjustMarks = (amount: number) => {
    const nextVal = config.marks + amount;
    if (nextVal > 0) {
      onUpdate({ marks: nextVal });
    }
  };

  return (
    <tr className="border-b border-gray-100 last:border-none group/row transition-all hover:bg-gray-50/50">
      {/* Question Type Selection */}
      <td className="py-4.5 pr-4 align-middle">
        <select
          value={config.type}
          onChange={(e) => onUpdate({ type: e.target.value as QuestionTypeName })}
          className="w-full rounded-xl border border-border-gray bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all cursor-pointer"
        >
          {QUESTION_TYPES.map((t) => {
            // Allow currently selected type OR types not already configured in other rows
            const isDisabled = availableTypes.includes(t) && t !== config.type;
            return (
              <option key={t} value={t} disabled={isDisabled}>
                {t}
              </option>
            );
          })}
        </select>
      </td>

      {/* Number of Questions Counter */}
      <td className="py-4.5 px-4 align-middle">
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center gap-2.5 rounded-xl border border-border-gray bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => adjustCount(-1)}
              disabled={config.count <= 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-150 hover:text-brand-black disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-bold text-brand-black">
              {config.count}
            </span>
            <button
              type="button"
              onClick={() => adjustCount(1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-150 hover:text-brand-black transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </td>

      {/* Marks Per Question Counter */}
      <td className="py-4.5 px-4 align-middle">
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center gap-2.5 rounded-xl border border-border-gray bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => adjustMarks(-1)}
              disabled={config.marks <= 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-150 hover:text-brand-black disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-bold text-brand-black">
              {config.marks}
            </span>
            <button
              type="button"
              onClick={() => adjustMarks(1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-150 hover:text-brand-black transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </td>

      {/* Delete / Remove Action */}
      <td className="py-4.5 pl-4 align-middle text-right">
        {showRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-red-500 transition-colors opacity-0 group-hover/row:opacity-100 focus:opacity-100"
          >
            <Trash2 className="h-4.5 w-4.5" />
          </button>
        )}
      </td>
    </tr>
  );
}
