import { Request, Response } from "express";
import { Assignment } from "../models/Assignment.js";
import { GeneratedPaper } from "../models/GeneratedPaper.js";
import { addGenerationJob } from "../jobs/queue.js";
import { getCache } from "../config/redis.js";

// POST /api/assignments/:id/generate
export async function triggerGeneration(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = req.params.id as string;
    if (!id) {
      res.status(400).json({ success: false, error: "Missing assignment id" });
      return;
    }

    const assignment = await Assignment.findById(id);
    if (!assignment) {
      res.status(404).json({
        success: false,
        error: "Assignment not found",
      });
      return;
    }

    if (assignment.status === "generating") {
      res.status(409).json({
        success: false,
        error: "Generation already in progress",
      });
      return;
    }

    // If regenerating, delete old paper
    if (assignment.generatedPaper) {
      await GeneratedPaper.findByIdAndDelete(assignment.generatedPaper);
      assignment.generatedPaper = undefined;
    }

    // Add to queue
    const jobId = await addGenerationJob(id);

    res.status(202).json({
      success: true,
      message: "Generation started",
      data: { jobId, assignmentId: id },
    });
  } catch (error) {
    console.error("Error triggering generation:", error);
    res.status(500).json({
      success: false,
      error: "Failed to start generation",
    });
  }
}

// GET /api/assignments/:id/paper
export async function getGeneratedPaper(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;

    // Check cache first
    const cached = await getCache(`paper:${id}`);
    if (cached) {
      res.json({ success: true, data: cached });
      return;
    }

    const paper = await GeneratedPaper.findOne({
      assignmentId: id,
    }).lean();

    if (!paper) {
      res.status(404).json({
        success: false,
        error: "Generated paper not found",
      });
      return;
    }

    res.json({ success: true, data: paper });
  } catch (error) {
    console.error("Error fetching paper:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch generated paper",
    });
  }
}
