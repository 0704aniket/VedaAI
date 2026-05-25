import { Assignment } from "../models/Assignment.js";
import { GeneratedPaper } from "../models/GeneratedPaper.js";
import { generateQuestionPaper } from "../services/ai.service.js";
import { setCache } from "../config/redis.js";
import {
  emitGenerationStarted,
  emitGenerationProgress,
  emitGenerationCompleted,
  emitGenerationError,
} from "../websocket/socket.js";

export async function processGenerationJob(
  assignmentId: string
): Promise<{ success: true; paperId: string }> {
  console.log(`🔄 Processing generation for assignment: ${assignmentId}`);

  try {
    await Assignment.findByIdAndUpdate(assignmentId, {
      status: "generating",
    });
    emitGenerationStarted(assignmentId);
    emitGenerationProgress(
      assignmentId,
      10,
      "Starting question generation..."
    );

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      throw new Error(`Assignment not found: ${assignmentId}`);
    }

    emitGenerationProgress(assignmentId, 20, "Preparing AI prompt...");
    emitGenerationProgress(
      assignmentId,
      30,
      "Generating questions with AI..."
    );

    const paperData = await generateQuestionPaper(assignment);

    emitGenerationProgress(
      assignmentId,
      70,
      "Parsing and validating response..."
    );

    const generatedPaper = await GeneratedPaper.create({
      assignmentId,
      ...paperData,
    });

    emitGenerationProgress(assignmentId, 85, "Saving results...");

    await Assignment.findByIdAndUpdate(assignmentId, {
      status: "completed",
      generatedPaper: generatedPaper._id,
    });

    await setCache(`paper:${assignmentId}`, generatedPaper.toJSON(), 3600);

    emitGenerationProgress(assignmentId, 100, "Generation complete!");
    emitGenerationCompleted(assignmentId, generatedPaper.toJSON());

    console.log(`✅ Generation completed for assignment: ${assignmentId}`);
    return { success: true, paperId: String(generatedPaper._id) };
  } catch (error) {
    console.error(`❌ Generation failed for ${assignmentId}:`, error);

    await Assignment.findByIdAndUpdate(assignmentId, {
      status: "failed",
    });

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    emitGenerationError(assignmentId, errorMessage);
    throw error;
  }
}
