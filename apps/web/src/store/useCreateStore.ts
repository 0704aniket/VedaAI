"use client";

import { create } from "zustand";
import { QuestionTypeConfig, CreateAssignmentDto, QuestionTypeName } from "@vedaai/shared";

interface CreateState {
  step: number;
  title: string;
  subject: string;
  className: string;
  schoolName: string;
  dueDate: string;
  questionTypes: QuestionTypeConfig[];
  additionalInfo: string;
  file: File | null;
  fileBase64: string | null;
  fileName: string | null;

  // Actions
  setStep: (step: number) => void;
  nextStep: () => boolean;
  prevStep: () => void;
  updateForm: (fields: Partial<Omit<CreateState, "questionTypes">>) => void;
  addQuestionType: (type?: QuestionTypeName) => void;
  updateQuestionType: (id: string, updates: Partial<Omit<QuestionTypeConfig, "id">>) => void;
  removeQuestionType: (id: string) => void;
  setFile: (file: File | null) => void;
  resetForm: () => void;
  validateStep: (step: number) => { valid: boolean; error: string | null };
  getDto: () => CreateAssignmentDto;
}

const defaultQuestionTypes: QuestionTypeConfig[] = [
  { id: "1", type: "Multiple Choice Questions", count: 5, marks: 1 },
  { id: "2", type: "Short Questions", count: 3, marks: 3 },
  { id: "3", type: "Long Questions", count: 2, marks: 5 },
];

export const useCreateStore = create<CreateState>((set, get) => ({
  step: 1,
  title: "",
  subject: "General Science",
  className: "5th",
  schoolName: "Delhi Public School",
  dueDate: "",
  questionTypes: defaultQuestionTypes,
  additionalInfo: "",
  file: null,
  fileBase64: null,
  fileName: null,

  setStep: (step) => set({ step }),

  nextStep: () => {
    const currentStep = get().step;
    const validation = get().validateStep(currentStep);
    if (validation.valid) {
      set({ step: currentStep + 1 });
      return true;
    }
    return false;
  },

  prevStep: () => {
    const currentStep = get().step;
    if (currentStep > 1) {
      set({ step: currentStep - 1 });
    }
  },

  updateForm: (fields) => set((state) => ({ ...state, ...fields })),

  addQuestionType: (type = "Multiple Choice Questions") => {
    const newQt: QuestionTypeConfig = {
      id: crypto.randomUUID(),
      type,
      count: 5,
      marks: 1,
    };
    set((state) => ({
      questionTypes: [...state.questionTypes, newQt],
    }));
  },

  updateQuestionType: (id, updates) => {
    set((state) => ({
      questionTypes: state.questionTypes.map((qt) =>
        qt.id === id ? { ...qt, ...updates } : qt
      ),
    }));
  },

  removeQuestionType: (id) => {
    set((state) => ({
      questionTypes: state.questionTypes.filter((qt) => qt.id !== id),
    }));
  },

  setFile: (file) => {
    if (!file) {
      set({ file: null, fileBase64: null, fileName: null });
      return;
    }

    set({ file, fileName: file.name });

    // Read file as Base64 for ease of upload (since assignment accepts optionally)
    const reader = new FileReader();
    reader.onloadend = () => {
      set({ fileBase64: reader.result as string });
    };
    reader.readAsDataURL(file);
  },

  resetForm: () =>
    set({
      step: 1,
      title: "",
      subject: "General Science",
      className: "5th",
      schoolName: "Delhi Public School",
      dueDate: "",
      questionTypes: defaultQuestionTypes,
      additionalInfo: "",
      file: null,
      fileBase64: null,
      fileName: null,
    }),

  validateStep: (stepNum) => {
    if (stepNum === 1) {
      const { title, dueDate, questionTypes } = get();
      if (!title.trim()) {
        return { valid: false, error: "Please enter an assignment title" };
      }
      if (!dueDate) {
        return { valid: false, error: "Please select a due date" };
      }
      const date = new Date(dueDate);
      if (isNaN(date.getTime())) {
        return { valid: false, error: "Please enter a valid due date" };
      }
      if (questionTypes.length === 0) {
        return { valid: false, error: "Please add at least one question type" };
      }
      for (const qt of questionTypes) {
        if (qt.count <= 0) {
          return { valid: false, error: `Count for "${qt.type}" must be a positive number` };
        }
        if (qt.marks <= 0) {
          return { valid: false, error: `Marks for "${qt.type}" must be a positive number` };
        }
      }
    }
    return { valid: true, error: null };
  },

  getDto: () => {
    const { title, subject, className, schoolName, dueDate, questionTypes, additionalInfo } = get();

    // Map question types to remove IDs before sending to server
    const cleanedQt = questionTypes.map(({ type, count, marks }) => ({
      type,
      count,
      marks,
    }));

    const totalQuestions = questionTypes.reduce((sum, qt) => sum + qt.count, 0);
    const totalMarks = questionTypes.reduce((sum, qt) => sum + qt.count * qt.marks, 0);

    return {
      title,
      subject,
      className,
      schoolName,
      dueDate,
      questionTypes: cleanedQt,
      totalQuestions,
      totalMarks,
      additionalInfo,
    };
  },
}));
