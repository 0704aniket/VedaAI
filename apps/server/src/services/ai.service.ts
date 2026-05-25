import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../config/env.js";
import { IAssignment } from "../models/Assignment.js";

interface ParsedPaper {
  schoolName: string;
  subject: string;
  className: string;
  timeAllowed: string;
  maxMarks: number;
  sections: {
    title: string;
    instruction: string;
    marksPerQuestion: number;
    questions: {
      number: number;
      text: string;
      difficulty: "Easy" | "Moderate" | "Challenging";
      marks: number;
      options?: string[];
    }[];
  }[];
  answerKey: {
    questionNumber: number;
    answer: string;
  }[];
}

function buildPrompt(assignment: IAssignment): string {
  const questionTypesDesc = assignment.questionTypes
    .map(
      (qt) =>
        `- ${qt.type}: ${qt.count} questions, ${qt.marks} marks each`
    )
    .join("\n");

  return `You are an expert teacher creating a question paper for students.

Generate a structured question paper with the following specifications:

School: ${assignment.schoolName || "Delhi Public School"}
Subject: ${assignment.subject || "General Science"}
Class: ${assignment.className || "5th"}
Total Questions: ${assignment.totalQuestions}
Total Marks: ${assignment.totalMarks}

Question Types Required:
${questionTypesDesc}

${assignment.additionalInfo ? `Additional Instructions: ${assignment.additionalInfo}` : ""}

IMPORTANT: You MUST respond ONLY with valid JSON. No markdown, no code blocks, no extra text.

The JSON must follow this exact structure:
{
  "schoolName": "${assignment.schoolName || "Delhi Public School"}",
  "subject": "${assignment.subject || "General Science"}",
  "className": "${assignment.className || "5th"}",
  "timeAllowed": "45 minutes",
  "maxMarks": ${assignment.totalMarks},
  "sections": [
    {
      "title": "Section A",
      "instruction": "Attempt all questions. Each question carries X marks.",
      "marksPerQuestion": 2,
      "questions": [
        {
          "number": 1,
          "text": "Question text here",
          "difficulty": "Easy",
          "marks": 2,
          "options": ["Option A", "Option B", "Option C", "Option D"]
        }
      ]
    }
  ],
  "answerKey": [
    {
      "questionNumber": 1,
      "answer": "Detailed answer here"
    }
  ]
}

Rules:
1. Group questions into sections by question type
2. Each question must have a difficulty: "Easy", "Moderate", or "Challenging"
3. Distribute difficulty levels: ~40% Easy, ~40% Moderate, ~20% Challenging
4. Only include "options" array for Multiple Choice Questions
5. The answer key must include answers for ALL questions
6. Make questions relevant to the subject and appropriate for the class level
7. Ensure question numbers are sequential across all sections
8. Return ONLY valid JSON, no other text`;
}

function cleanJsonResponse(text: string): string {
  // Remove markdown code blocks if present
  let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.slice(0, -3);
  }
  return cleaned.trim();
}

export async function generateQuestionPaper(
  assignment: IAssignment
): Promise<ParsedPaper> {
  const prompt = buildPrompt(assignment);

  if (env.LLM_PROVIDER === "gemini") {
    return generateWithGemini(prompt);
  }

  // Default to Gemini
  return generateWithGemini(prompt);
}

async function generateWithGemini(prompt: string): Promise<ParsedPaper> {
  if (!env.GOOGLE_GEMINI_API_KEY) {
    throw new Error("GOOGLE_GEMINI_API_KEY is not configured");
  }

  const genAI = new GoogleGenerativeAI(env.GOOGLE_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: env.GOOGLE_GEMINI_MODEL,
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
    },
  });

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  const cleaned = cleanJsonResponse(text);

  try {
    const parsed: ParsedPaper = JSON.parse(cleaned);
    validatePaper(parsed);
    return parsed;
  } catch (error) {
    console.error("Failed to parse AI response:", cleaned.substring(0, 500));
    throw new Error(
      `Failed to parse AI response: ${error instanceof Error ? error.message : "Invalid JSON"}`
    );
  }
}

function validatePaper(paper: ParsedPaper): void {
  if (!paper.sections || !Array.isArray(paper.sections)) {
    throw new Error("Paper must have sections array");
  }
  if (paper.sections.length === 0) {
    throw new Error("Paper must have at least one section");
  }

  let questionNumber = 0;
  for (const section of paper.sections) {
    if (!section.title || !section.questions) {
      throw new Error("Each section must have a title and questions");
    }
    for (const q of section.questions) {
      questionNumber++;
      if (!q.text || !q.difficulty || !q.marks) {
        throw new Error(
          `Question ${questionNumber} is missing required fields`
        );
      }
      if (!["Easy", "Moderate", "Challenging"].includes(q.difficulty)) {
        q.difficulty = "Moderate"; // Default fallback
      }
    }
  }

  if (!paper.answerKey) {
    paper.answerKey = [];
  }
}
