import { Router } from "express";
import { generatePdf } from "../controllers/pdf.controller.js";

const router = Router();

// GET /api/assignments/:id/pdf
router.get("/:id/pdf", generatePdf);

export default router;
