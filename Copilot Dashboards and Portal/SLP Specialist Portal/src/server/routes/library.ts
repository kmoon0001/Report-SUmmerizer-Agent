import express from "express";
import multer from "multer";
import { z } from "zod";
import db from "../db/database";
import { createRequire } from "module";
import { logger } from "../../utils/logger";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

const router = express.Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

const SearchQuerySchema = z.object({
  q: z.string().min(1).max(500),
});

router.post("/upload", upload.single("pdf"), async (req, res, next) => {
  logger.info(`[AUDIT] Upload attempt by ${req.ip}`);
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    if (req.file.mimetype !== 'application/pdf') return res.status(400).json({ error: "Only PDF files are allowed" });

    const data = await pdf(req.file.buffer);
    const text = data.text;

    if (!text || text.trim().length < 10) {
      return res.status(400).json({ error: "PDF content is too short or unreadable" });
    }

    const stmt = db.prepare("INSERT INTO documents (name, content) VALUES (?, ?)");
    const info = stmt.run(req.file.originalname, text);
    const docId = info.lastInsertRowid;

    // Simple chunking (by paragraph)
    const chunks = text.split(/\n\s*\n/).filter((c: string) => c.trim().length > 50);
    const chunkStmt = db.prepare("INSERT INTO chunks (doc_id, content) VALUES (?, ?)");
    
    const insertMany = db.transaction((chunks: string[]) => {
      for (const chunk of chunks) chunkStmt.run(docId, chunk);
    });
    insertMany(chunks);

    logger.info(`[AUDIT] Upload successful: ${req.file.originalname} (ID: ${docId})`);
    res.json({ success: true, docId, chunksCount: chunks.length });
  } catch (error) {
    next(error);
  }
});

router.get("/search", (req, res, next) => {
  logger.info(`[AUDIT] Search attempt: ${req.query.q} by ${req.ip}`);
  try {
    const { q: query } = SearchQuerySchema.parse(req.query);

    // NIST/ONC: Use parameterized queries to prevent SQL injection (already doing this with better-sqlite3)
    const stmt = db.prepare("SELECT content FROM chunks WHERE content LIKE ? LIMIT 5");
    const results = stmt.all(`%${query}%`);
    logger.info(`[AUDIT] Search successful: ${query} (${results.length} results)`);
    res.json(results);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid search query" });
    }
    next(error);
  }
});

router.get("/documents", (req, res, next) => {
  try {
    const docs = db.prepare("SELECT id, name, uploaded_at FROM documents").all();
    res.json(docs);
  } catch (error) {
    next(error);
  }
});

router.get("/documents/:id", (req, res, next) => {
  try {
    const { id } = req.params;
    const doc = db.prepare("SELECT id, name, content, uploaded_at FROM documents WHERE id = ?").get(id);
    if (!doc) return res.status(404).json({ error: "Document not found" });
    res.json(doc);
  } catch (error) {
    next(error);
  }
});

export default router;
