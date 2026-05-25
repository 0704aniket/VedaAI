// ==========================================
// VedaAI Shared Types
// ==========================================

// ---- Question Types ----
export const QUESTION_TYPES = [
  "Multiple Choice Questions",
  "Short Questions",
  "Long Questions",
  "Diagram/Graph-Based Questions",
  "Numerical Problems",
  "True/False",
  "Fill in the Blanks",
  "Match the Following",
] as const;

export type QuestionTypeName = (typeof QUESTION_TYPES)[number];

// ---- Difficulty Levels ----
export const DIFFICULTY_LEVELS = ["Easy", "Moderate", "Challenging"] as const;
export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number];

// ---- Assignment Status ----
export const ASSIGNMENT_STATUSES = [
  "draft",
  "generating",
  "completed",
  "failed",
] as const;
export type AssignmentStatus = (typeof ASSIGNMENT_STATUSES)[number];

// ---- Question Type Config (in form) ----
export interface QuestionTypeConfig {
  id: string;
  type: QuestionTypeName;
  count: number;
  marks: number;
}

// ---- Assignment ----
export interface Assignment {
  _id: string;
  title: string;
  subject?: string;
  className?: string;
  schoolName?: string;
  fileUrl?: string;
  dueDate: string;
  questionTypes: QuestionTypeConfig[];
  totalQuestions: number;
  totalMarks: number;
  additionalInfo?: string;
  status: AssignmentStatus;
  generatedPaper?: GeneratedPaper | string;
  createdAt: string;
  updatedAt: string;
}

// ---- Generated Paper ----
export interface GeneratedQuestion {
  number: number;
  text: string;
  difficulty: DifficultyLevel;
  marks: number;
  options?: string[];
}

export interface PaperSection {
  title: string;
  instruction: string;
  marksPerQuestion: number;
  questions: GeneratedQuestion[];
}

export interface AnswerKeyItem {
  questionNumber: number;
  answer: string;
}

export interface GeneratedPaper {
  _id: string;
  assignmentId: string;
  schoolName: string;
  subject: string;
  className: string;
  timeAllowed: string;
  maxMarks: number;
  sections: PaperSection[];
  answerKey?: AnswerKeyItem[];
  createdAt: string;
}

// ---- API Responses ----
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
}

// ---- WebSocket Events ----
export interface GenerationStartedPayload {
  assignmentId: string;
  status: "generating";
}

export interface GenerationProgressPayload {
  assignmentId: string;
  progress: number;
  message: string;
}

export interface GenerationCompletedPayload {
  assignmentId: string;
  paper: GeneratedPaper;
}

export interface GenerationErrorPayload {
  assignmentId: string;
  error: string;
}

// ---- Create Assignment DTO ----
export interface CreateAssignmentDto {
  title: string;
  subject?: string;
  className?: string;
  schoolName?: string;
  dueDate: string;
  questionTypes: Omit<QuestionTypeConfig, "id">[];
  totalQuestions: number;
  totalMarks: number;
  additionalInfo?: string;
}
