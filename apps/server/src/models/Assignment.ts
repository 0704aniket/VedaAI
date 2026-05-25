import mongoose, { Schema, Document } from "mongoose";

export interface IQuestionTypeConfig {
  type: string;
  count: number;
  marks: number;
}

export interface IAssignment extends Document {
  title: string;
  subject?: string;
  className?: string;
  schoolName?: string;
  fileUrl?: string;
  dueDate: Date;
  questionTypes: IQuestionTypeConfig[];
  totalQuestions: number;
  totalMarks: number;
  additionalInfo?: string;
  status: "draft" | "generating" | "completed" | "failed";
  generatedPaper?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionTypeConfigSchema = new Schema<IQuestionTypeConfig>(
  {
    type: { type: String, required: true },
    count: { type: Number, required: true, min: 1 },
    marks: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const AssignmentSchema = new Schema<IAssignment>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      trim: true,
      default: "General",
    },
    className: {
      type: String,
      trim: true,
      default: "5th",
    },
    schoolName: {
      type: String,
      trim: true,
      default: "Delhi Public School",
    },
    fileUrl: {
      type: String,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    questionTypes: {
      type: [QuestionTypeConfigSchema],
      required: true,
      validate: {
        validator: (v: IQuestionTypeConfig[]) => v.length > 0,
        message: "At least one question type is required",
      },
    },
    totalQuestions: {
      type: Number,
      required: true,
      min: 1,
    },
    totalMarks: {
      type: Number,
      required: true,
      min: 1,
    },
    additionalInfo: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["draft", "generating", "completed", "failed"],
      default: "draft",
    },
    generatedPaper: {
      type: Schema.Types.ObjectId,
      ref: "GeneratedPaper",
    },
  },
  {
    timestamps: true,
  }
);

export const Assignment = mongoose.model<IAssignment>(
  "Assignment",
  AssignmentSchema
);
