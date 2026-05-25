"use client";

import { Mic, Info } from "lucide-react";
import { useState } from "react";

interface AdditionalInfoProps {
  value: string;
  onChange: (val: string) => void;
}

export default function AdditionalInfo({ value, onChange }: AdditionalInfoProps) {
  const [isRecording, setIsRecording] = useState(false);

  const toggleVoiceRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Mock voice input
      setTimeout(() => {
        onChange(
          (value ? value + " " : "") +
            "Focus on photosynthesis, light reactions, and carbon fixation. Keep the questions focused on applications."
        );
        setIsRecording(false);
      }, 2500);
    }
  };

  return (
    <div className="w-full">
      <label htmlFor="additionalInfo" className="block text-sm font-bold text-brand-black mb-2 flex items-center justify-between">
        <span>Additional Instructions</span>
        {isRecording && (
          <span className="text-xs font-semibold text-brand-orange animate-pulse flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-orange animate-ping" />
            Listening to voice...
          </span>
        )}
      </label>
      <div className="relative">
        <textarea
          id="additionalInfo"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. Focus on Chapter 4. Ensure difficulty levels are balanced. Mention carbon cycle questions..."
          rows={4}
          className="w-full rounded-2xl border border-border-gray bg-white p-4 pb-12 text-sm outline-none placeholder:text-gray-400 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition-all resize-none"
        />
        
        {/* Voice Input Buttons */}
        <button
          type="button"
          onClick={toggleVoiceRecording}
          className={`absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-xl transition-all shadow-sm ${
            isRecording
              ? "bg-brand-orange text-white animate-bounce shadow-brand-orange/20"
              : "bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-brand-black"
          }`}
          title="Voice Instructions (Mocked)"
        >
          <Mic className="h-4.5 w-4.5" />
        </button>
      </div>

      <div className="flex items-start gap-2 mt-3 text-xs text-gray-500 leading-normal">
        <Info className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
        <p>
          You can specify detailed instructions like paper guidelines, focus chapters, difficulty targets, or even record details by voice.
        </p>
      </div>
    </div>
  );
}
