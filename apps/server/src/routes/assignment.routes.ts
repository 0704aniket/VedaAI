import { Router } from "express";
import {
  getAssignments,
  getAssignment,
  createAssignment,
  deleteAssignment,
} from "../controllers/assignment.controller.js";

const router = Router();

router.get("/", getAssignments);
router.get("/:id", getAssignment);
router.post("/", createAssignment);
router.delete("/:id", deleteAssignment);

export default router;
