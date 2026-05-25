import { Router } from "express";
import {
  triggerGeneration,
  getGeneratedPaper,
} from "../controllers/generate.controller.js";

const router = Router();

router.post("/:id/generate", triggerGeneration);
router.get("/:id/paper", getGeneratedPaper);

export default router;
