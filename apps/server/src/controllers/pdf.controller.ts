import { Request, Response } from "express";
import puppeteer from "puppeteer";
import { GeneratedPaper } from "../models/GeneratedPaper.js";

function buildPaperHtml(paper: any) {
  const styles = `
    <style>
      body { font-family: Arial, sans-serif; color: #111; }
      .header { text-align: center; margin-bottom: 18px }
      .meta { display:flex; justify-content:space-between; margin-bottom:12px }
      .student-info { margin: 12px 0; }
      .section { margin-top:18px }
      .question { margin:8px 0 }
      .badge { display:inline-block; padding:2px 6px; border-radius:6px; font-size:11px; margin-left:8px }
      .easy { background:#dff7dc; color:#2b7a2b }
      .moderate { background:#fff1c9; color:#936b00 }
      .challenging { background:#ffdede; color:#8b0000 }
    </style>
  `;

  const header = `
    <div class="header">
      <h1>${paper.schoolName || "School"}</h1>
      <h2>${paper.subject || "Subject"} - ${paper.className || "Class"}</h2>
      <div class="meta"><div>Time Allowed: ${paper.timeAllowed || ""}</div><div>Max Marks: ${paper.maxMarks || ""}</div></div>
    </div>
  `;

  const studentInfo = `
    <div class="student-info">
      <div>Student Name: ________________________________________</div>
      <div>Roll Number: _________________________________________</div>
      <div>Section: _____________________________________________</div>
    </div>
  `;

  let sectionsHtml = "";
  (paper.sections || []).forEach((sec: any, sIdx: number) => {
    sectionsHtml += `<div class="section"><h3>Section ${String.fromCharCode(65 + sIdx)} - ${sec.title}</h3>`;
    if (sec.instruction) sectionsHtml += `<div><em>${sec.instruction}</em></div>`;
    sec.questions.forEach((q: any) => {
      const diffClass = q.difficulty?.toLowerCase?.() === "easy" ? "easy" : q.difficulty?.toLowerCase?.() === "moderate" || q.difficulty?.toLowerCase?.() === "moderate" ? "moderate" : "challenging";
      sectionsHtml += `<div class="question"><strong>${q.number}.</strong> ${q.text} <span class="badge ${diffClass}">${q.difficulty}</span> <span style="float:right">(${q.marks} marks)</span></div>`;
      if (q.options && q.options.length) {
        sectionsHtml += `<ol type="a">`;
        q.options.forEach((opt: string) => { sectionsHtml += `<li>${opt}</li>`; });
        sectionsHtml += `</ol>`;
      }
    });
    sectionsHtml += `</div>`;
  });

  return `<!doctype html><html><head><meta charset="utf-8"/>${styles}</head><body>${header}${studentInfo}${sectionsHtml}</body></html>`;
}

export async function generatePdf(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const paper = await GeneratedPaper.findOne({ assignmentId: id }).lean();
    if (!paper) {
      res.status(404).json({ success: false, error: "Generated paper not found" });
      return;
    }

    const html = buildPaperHtml(paper);

    const browser = await puppeteer.launch({ args: ["--no-sandbox", "--disable-setuid-sandbox"] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });
    const pdfData = await page.pdf({ format: "A4", printBackground: true, margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" } });
    await browser.close();

    // Puppeteer v24 returns Uint8Array; Express needs a real Buffer to send binary.
    const pdfBuffer = Buffer.isBuffer(pdfData) ? pdfData : Buffer.from(pdfData);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Length", pdfBuffer.length.toString());
    res.setHeader("Content-Disposition", `inline; filename="assignment_${id}.pdf"`);
    res.end(pdfBuffer);
  } catch (error) {
    console.error("PDF generation error:", error);
    res.status(500).json({ success: false, error: "Failed to generate PDF" });
  }
}
