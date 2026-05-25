import { Request, Response } from "express";
import { Assignment } from "../models/Assignment.js";
import { GeneratedPaper } from "../models/GeneratedPaper.js";
import { getCache, setCache, deleteCache } from "../config/redis.js";

// GET /api/assignments
export async function getAssignments(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { search, status, page = "1", limit = "20" } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    // Build filter
    const filter: Record<string, unknown> = {};
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }
    if (status) {
      filter.status = status;
    }

    const [assignments, total] = await Promise.all([
      Assignment.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      Assignment.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: assignments,
      total,
      page: pageNum,
      limit: limitNum,
    });
  } catch (error) {
    console.error("Error fetching assignments:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch assignments",
    });
  }
}

// GET /api/assignments/:id
export async function getAssignment(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;

    // Check cache first
    const cached = await getCache(`assignment:${id}`);
    if (cached) {
      res.json({ success: true, data: cached });
      return;
    }

    const assignment = await Assignment.findById(id)
      .populate("generatedPaper")
      .lean();

    if (!assignment) {
      res.status(404).json({
        success: false,
        error: "Assignment not found",
      });
      return;
    }

    // Cache for future requests
    await setCache(`assignment:${id}`, assignment, 1800);

    res.json({ success: true, data: assignment });
  } catch (error) {
    console.error("Error fetching assignment:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch assignment",
    });
  }
}

// POST /api/assignments
export async function createAssignment(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const {
      title,
      subject,
      className,
      schoolName,
      dueDate,
      questionTypes,
      totalQuestions,
      totalMarks,
      additionalInfo,
    } = req.body;

    // Validate required fields
    if (!title || !dueDate || !questionTypes || questionTypes.length === 0) {
      res.status(400).json({
        success: false,
        error:
          "Missing required fields: title, dueDate, questionTypes",
      });
      return;
    }

    // Validate no negative values
    for (const qt of questionTypes) {
      if (qt.count <= 0 || qt.marks <= 0) {
        res.status(400).json({
          success: false,
          error:
            "Question count and marks must be positive numbers",
        });
        return;
      }
    }

    const assignment = await Assignment.create({
      title,
      subject: subject || "General",
      className: className || "5th",
      schoolName: schoolName || "Delhi Public School",
      dueDate: new Date(dueDate),
      questionTypes,
      totalQuestions: totalQuestions || questionTypes.reduce((sum: number, qt: { count: number }) => sum + qt.count, 0),
      totalMarks: totalMarks || questionTypes.reduce((sum: number, qt: { count: number; marks: number }) => sum + qt.count * qt.marks, 0),
      additionalInfo,
      status: "draft",
    });

    res.status(201).json({
      success: true,
      data: assignment,
      message: "Assignment created successfully",
    });
  } catch (error) {
    console.error("Error creating assignment:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create assignment",
    });
  }
}

// DELETE /api/assignments/:id
export async function deleteAssignment(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findById(id);
    if (!assignment) {
      res.status(404).json({
        success: false,
        error: "Assignment not found",
      });
      return;
    }

    // Delete associated paper
    if (assignment.generatedPaper) {
      await GeneratedPaper.findByIdAndDelete(assignment.generatedPaper);
    }

    await Assignment.findByIdAndDelete(id);

    // Clear cache
    await deleteCache(`assignment:${id}`);
    await deleteCache(`paper:${id}`);

    res.json({
      success: true,
      message: "Assignment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting assignment:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete assignment",
    });
  }
}
