import mongoose, { Schema, Document } from "mongoose";

export interface IGeneratedQuestion {
  number: number;
  text: string;
  difficulty: "Easy" | "Moderate" | "Challenging";
  marks: number;
  options?: string[];
}

export interface IPaperSection {
  title: string;
  instruction: string;
  marksPerQuestion: number;
  questions: IGeneratedQuestion[];
}

export interface IAnswerKeyItem {
  questionNumber: number;
  answer: string;
}

export interface IGeneratedPaper extends Document {
  assignmentId: mongoose.Types.ObjectId;
  schoolName: string;
  subject: string;
  className: string;
  timeAllowed: string;
  maxMarks: number;
  sections: IPaperSection[];
  answerKey?: IAnswerKeyItem[];
  createdAt: Date;
}

const GeneratedQuestionSchema = new Schema<IGeneratedQuestion>(
  {
    number: { type: Number, required: true },
    text: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["Easy", "Moderate", "Challenging"],
      required: true,
    },
    marks: { type: Number, required: true },
    options: [{ type: String }],
  },
  { _id: false }
);

const PaperSectionSchema = new Schema<IPaperSection>(
  {
    title: { type: String, required: true },
    instruction: { type: String, required: true },
    marksPerQuestion: { type: Number, required: true },
    questions: {
      type: [GeneratedQuestionSchema],
      required: true,
    },
  },
  { _id: false }
);

const AnswerKeyItemSchema = new Schema<IAnswerKeyItem>(
  {
    questionNumber: { type: Number, required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
);

const GeneratedPaperSchema = new Schema<IGeneratedPaper>(
  {
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    schoolName: { type: String, required: true },
    subject: { type: String, required: true },
    className: { type: String, required: true },
    timeAllowed: { type: String, required: true },
    maxMarks: { type: Number, required: true },
    sections: {
      type: [PaperSectionSchema],
      required: true,
    },
    answerKey: [AnswerKeyItemSchema],
  },
  {
    timestamps: true,
  }
);

export const GeneratedPaper = mongoose.model<IGeneratedPaper>(
  "GeneratedPaper",
  GeneratedPaperSchema
);
