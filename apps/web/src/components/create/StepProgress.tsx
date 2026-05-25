"use client";

import { Check } from "lucide-react";

interface StepProgressProps {
  currentStep: number;
}

const steps = [
  { number: 1, name: "Configure Assessment" },
  { number: 2, name: "AI Generation" },
  { number: 3, name: "Ready" },
];

export default function StepProgress({ currentStep }: StepProgressProps) {
  return (
    <div className="w-full mb-8">
      {/* Visual Stepper */}
      <div className="flex items-center justify-between max-w-xl mx-auto">
        {steps.map((step, idx) => {
          const isCompleted = currentStep > step.number;
          const isActive = currentStep === step.number;

          return (
            <div key={step.number} className="flex items-center flex-1 last:flex-initial">
              {/* Step circle */}
              <div className="flex flex-col items-center relative">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300 ${
                    isCompleted
                      ? "bg-brand-orange border-brand-orange text-white shadow-md shadow-brand-orange/20"
                      : isActive
                      ? "border-brand-orange text-brand-orange bg-white ring-4 ring-brand-orange/10"
                      : "border-gray-200 text-gray-400 bg-white"
                  }`}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : step.number}
                </div>
                <span
                  className={`absolute top-12 whitespace-nowrap text-xs font-semibold ${
                    isActive ? "text-brand-black" : "text-gray-400"
                  }`}
                >
                  {step.name}
                </span>
              </div>

              {/* Connecting line */}
              {idx < steps.length - 1 && (
                <div className="flex-1 mx-4 h-0.5 bg-gray-100 relative">
                  <div
                    className="absolute inset-0 bg-brand-orange transition-all duration-300"
                    style={{ width: isCompleted ? "100%" : "0%" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Spacer to balance absolute labels */}
      <div className="h-8" />
    </div>
  );
}
