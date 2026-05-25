"use client";

import { Calendar } from "lucide-react";

interface DueDatePickerProps {
  value: string;
  onChange: (val: string) => void;
}

export default function DueDatePicker({ value, onChange }: DueDatePickerProps) {
  // Get tomorrow's date string as minimum date for validation
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  return (
    <div className="w-full">
      <label htmlFor="dueDate" className="block text-sm font-bold text-brand-black mb-2">
        Due Date
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
          <Calendar className="h-4.5 w-4.5" />
        </span>
        <input
          id="dueDate"
          type="date"
          min={getMinDate()}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-border-gray bg-white py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-gray-400 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all cursor-pointer"
        />
      </div>
    </div>
  );
}
