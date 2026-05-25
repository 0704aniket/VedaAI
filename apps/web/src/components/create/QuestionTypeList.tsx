"use client";

import { Plus, FileQuestion, Award } from "lucide-react";
import { QuestionTypeConfig, QUESTION_TYPES, QuestionTypeName } from "@vedaai/shared";
import QuestionTypeRow from "./QuestionTypeRow";

interface QuestionTypeListProps {
  configs: QuestionTypeConfig[];
  onAdd: (type?: QuestionTypeName) => void;
  onUpdate: (id: string, updates: Partial<Omit<QuestionTypeConfig, "id">>) => void;
  onRemove: (id: string) => void;
}

export default function QuestionTypeList({
  configs,
  onAdd,
  onUpdate,
  onRemove,
}: QuestionTypeListProps) {
  // Track which types are already configured
  const configuredTypes = configs.map((c) => c.type);

  // Find types that haven't been added yet
  const unconfiguredTypes = QUESTION_TYPES.filter(
    (t) => !configuredTypes.includes(t)
  );

  const handleAddClick = () => {
    if (unconfiguredTypes.length > 0) {
      onAdd(unconfiguredTypes[0]);
    }
  };

  // Calculate totals
  const totalQuestions = configs.reduce((sum, c) => sum + c.count, 0);
  const totalMarks = configs.reduce((sum, c) => sum + c.count * c.marks, 0);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-bold text-brand-black">
          Question Setup
        </label>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border-gray bg-white px-6 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-150 text-xs font-bold uppercase tracking-wider text-gray-400">
              <th className="py-4 pr-4 font-bold">Question Type</th>
              <th className="py-4 px-4 font-bold text-center">No. of Questions</th>
              <th className="py-4 px-4 font-bold text-center">Marks Per Question</th>
              <th className="py-4 pl-4 font-bold text-right"></th>
            </tr>
          </thead>
          <tbody>
            {configs.map((config) => (
              <QuestionTypeRow
                key={config.id}
                config={config}
                availableTypes={configuredTypes}
                onUpdate={(updates) => onUpdate(config.id, updates)}
                onRemove={() => onRemove(config.id)}
                showRemove={configs.length > 1}
              />
            ))}
          </tbody>
        </table>

        {/* Add Row Button */}
        {unconfiguredTypes.length > 0 && (
          <div className="py-4 flex justify-start border-t border-gray-100">
            <button
              type="button"
              onClick={handleAddClick}
              className="flex items-center gap-1.5 text-sm font-bold text-brand-orange hover:text-brand-orange/85 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Question Type
            </button>
          </div>
        )}
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="flex items-center gap-3.5 rounded-2xl border border-border-gray bg-white p-4.5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
            <FileQuestion className="h-5.5 w-5.5" />
          </div>
          <div>
            <p className="text-xl font-black text-brand-black leading-none">{totalQuestions}</p>
            <p className="text-xs font-semibold text-gray-400 mt-1">Total Questions</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-2xl border border-border-gray bg-white p-4.5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
            <Award className="h-5.5 w-5.5" />
          </div>
          <div>
            <p className="text-xl font-black text-brand-black leading-none">{totalMarks}</p>
            <p className="text-xs font-semibold text-gray-400 mt-1">Total Marks</p>
          </div>
        </div>
      </div>
    </div>
  );
}
