import express from "express";
import { z } from "zod";
import db from "../db/database.js";

const router = express.Router();

// Schema for validation
const PatientSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  age: z.number().min(0),
  diagnosis: z.string().min(1),
  goals: z.array(z.string()),
  lastSession: z.string(),
  status: z.enum(['active', 'discharged', 'pending']),
});

// Get all patients
router.get("/", (req, res, next) => {
  try {
    const stmt = db.prepare("SELECT * FROM patients ORDER BY created_at DESC");
    const patients = stmt.all().map((p: any) => {
      let goals = [];
      try {
        goals = JSON.parse(p.goals);
      } catch (e) {
        console.error(`Failed to parse goals for patient ${p.id}:`, e);
      }
      return {
        ...p,
        goals
      };
    });
    res.json(patients);
  } catch (error) {
    next(error);
  }
});

// Create a new patient
router.post("/", (req, res, next) => {
  try {
    const patient = PatientSchema.parse(req.body);
    const stmt = db.prepare(`
      INSERT INTO patients (id, name, age, diagnosis, goals, lastSession, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      patient.id,
      patient.name,
      patient.age,
      patient.diagnosis,
      JSON.stringify(patient.goals),
      patient.lastSession,
      patient.status
    );
    res.status(201).json(patient);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid patient data", details: (error as any).errors });
    }
    next(error);
  }
});

// Update a patient
router.put("/:id", (req, res, next) => {
  try {
    const patient = PatientSchema.parse(req.body);
    const stmt = db.prepare(`
      UPDATE patients 
      SET name = ?, age = ?, diagnosis = ?, goals = ?, lastSession = ?, status = ?
      WHERE id = ?
    `);
    const result = stmt.run(
      patient.name,
      patient.age,
      patient.diagnosis,
      JSON.stringify(patient.goals),
      patient.lastSession,
      patient.status,
      req.params.id
    );
    
    if (result.changes === 0) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res.json(patient);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid patient data", details: (error as any).errors });
    }
    next(error);
  }
});

// Delete a patient
router.delete("/:id", (req, res, next) => {
  try {
    const stmt = db.prepare("DELETE FROM patients WHERE id = ?");
    const result = stmt.run(req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// Get progress notes for a patient
router.get("/:id/notes", (req, res, next) => {
  try {
    const stmt = db.prepare("SELECT * FROM progress_notes WHERE patient_id = ? ORDER BY date DESC");
    const notes = stmt.all(req.params.id);
    res.json(notes);
  } catch (error) {
    next(error);
  }
});

// Add a progress note
router.post("/:id/notes", (req, res, next) => {
  try {
    const { id, date, type, content } = req.body;
    const stmt = db.prepare(`
      INSERT INTO progress_notes (id, patient_id, date, type, content)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(id, req.params.id, date, type, content);
    res.status(201).json({ id, patient_id: req.params.id, date, type, content });
  } catch (error) {
    next(error);
  }
});

// Get therapy sets for a patient
router.get("/:id/therapy-sets", (req, res, next) => {
  try {
    const stmt = db.prepare("SELECT * FROM therapy_sets WHERE patient_id = ? ORDER BY created_at DESC");
    const sets = stmt.all(req.params.id).map((s: any) => {
      let config = {};
      try {
        config = JSON.parse(s.config);
      } catch (e) {
        console.error(`Failed to parse config for therapy set ${s.id}:`, e);
      }
      return {
        ...s,
        config
      };
    });
    res.json(sets);
  } catch (error) {
    next(error);
  }
});

// Add a therapy set
router.post("/:id/therapy-sets", (req, res, next) => {
  try {
    const { id, config } = req.body;
    const stmt = db.prepare(`
      INSERT INTO therapy_sets (id, patient_id, config)
      VALUES (?, ?, ?)
    `);
    stmt.run(id, req.params.id, JSON.stringify(config));
    res.status(201).json({ id, patient_id: req.params.id, config });
  } catch (error) {
    next(error);
  }
});

// Get session results for a patient
router.get("/:id/session-results", (req, res, next) => {
  try {
    const stmt = db.prepare("SELECT * FROM session_results WHERE patient_id = ? ORDER BY date DESC");
    const results = stmt.all(req.params.id);
    res.json(results);
  } catch (error) {
    next(error);
  }
});

// Add a session result
router.post("/:id/session-results", (req, res, next) => {
  try {
    const { id, therapy_set_id, date, duration, accuracy, cues_given, notes } = req.body;
    const stmt = db.prepare(`
      INSERT INTO session_results (id, patient_id, therapy_set_id, date, duration, accuracy, cues_given, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, req.params.id, therapy_set_id || null, date, duration, accuracy, cues_given, notes || null);
    res.status(201).json({ id, patient_id: req.params.id, therapy_set_id, date, duration, accuracy, cues_given, notes });
  } catch (error) {
    next(error);
  }
});

export default router;
