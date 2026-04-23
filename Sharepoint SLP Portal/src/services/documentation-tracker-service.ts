import { persistenceService, ClinicalNote, Patient, NoteType } from './persistence-service';
import { aiService } from './ai-service';
import { logger } from '../utils/logger';
import { parseAIResponse } from '../utils/json-parser';

export interface TrackerStatus {
  patientId: string;
  totalDailyNotes: number;
  dailyNotesSinceLastProgress: number;
  daysSinceStartOfCare: number;
  isProgressNoteDue: boolean;
  isRecertificationDue: boolean;
}

class DocumentationTrackerService {
  /**
   * Analyzes the patient's history to determine if progress or recert notes are due.
   */
  getTrackerStatus(patientId: string): TrackerStatus | null {
    const patient = persistenceService.getPatientById(patientId);
    if (!patient) return null;

    const notes = persistenceService.getClinicalNotes(patientId);
    
    // Sort notes oldest to newest for chronological processing
    const sortedNotes = [...notes].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    let dailyNotesSinceLastProgress = 0;
    let lastProgressDate: Date | null = null;
    let lastRecertDate: Date | null = null;

    for (const note of sortedNotes) {
      if (note.type === 'Daily') {
        dailyNotesSinceLastProgress++;
      } else if (note.type === 'Progress') {
        dailyNotesSinceLastProgress = 0;
        lastProgressDate = new Date(note.date);
      } else if (note.type === 'Recertification') {
        dailyNotesSinceLastProgress = 0;
        lastRecertDate = new Date(note.date);
        lastProgressDate = new Date(note.date); // Recert resets progress count too
      }
    }

    const startOfCare = new Date(patient.startOfCare);
    const now = new Date();
    const daysSinceStartOfCare = Math.floor((now.getTime() - startOfCare.getTime()) / (1000 * 60 * 60 * 24));
    
    // Recertification is typically due every 30 days
    const referenceDateForRecert = lastRecertDate || startOfCare;
    const daysSinceLastRecert = Math.floor((now.getTime() - referenceDateForRecert.getTime()) / (1000 * 60 * 60 * 24));

    return {
      patientId,
      totalDailyNotes: notes.filter(n => n.type === 'Daily').length,
      dailyNotesSinceLastProgress,
      daysSinceStartOfCare,
      isProgressNoteDue: dailyNotesSinceLastProgress >= 7, // 7-10 notes
      isRecertificationDue: daysSinceLastRecert >= 30
    };
  }

  /**
   * Generates a Progress Note based on recent daily notes.
   */
  async generateProgressNote(patientId: string): Promise<ClinicalNote | null> {
    const patient = persistenceService.getPatientById(patientId);
    if (!patient) throw new Error("Patient not found");

    const notes = persistenceService.getClinicalNotes(patientId);
    // Get notes since last progress/recert
    const recentNotes = this.getNotesSinceLastMajorReport(notes);

    if (recentNotes.length === 0) {
      throw new Error("No recent daily notes to generate a progress report from.");
    }

    const prompt = `
      You are an expert Speech-Language Pathologist.
      Generate a comprehensive Progress Note for the following patient based on their recent daily notes.
      
      Patient Name: ${patient.name}
      Diagnosis: ${patient.diagnosis}
      Goals: ${patient.goals.join(', ')}
      
      Recent Daily Notes:
      ${JSON.stringify(recentNotes.map(n => n.content), null, 2)}
      
      The progress note should summarize the patient's performance, average any metrics, note trends (improvement, decline, plateau), and provide an updated assessment and plan.
      Format the output as a JSON object with the following keys: subjective, objective, assessment, plan, summary.
    `;

    try {
      const responseText = await aiService.generateContent(prompt, { responseMimeType: "application/json" });
      const content: any = parseAIResponse(responseText, {});

      const progressNote: ClinicalNote = {
        id: crypto.randomUUID(),
        patientId,
        date: new Date().toISOString(),
        type: 'Progress',
        content
      };

      persistenceService.saveClinicalNote(progressNote);
      return progressNote;
    } catch (error) {
      logger.error("Failed to generate progress note", error);
      throw error;
    }
  }

  /**
   * Generates a Recertification Note based on the last 30 days of notes.
   */
  async generateRecertificationNote(patientId: string): Promise<ClinicalNote | null> {
    const patient = persistenceService.getPatientById(patientId);
    if (!patient) throw new Error("Patient not found");

    const notes = persistenceService.getClinicalNotes(patientId);
    // Get notes from the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentNotes = notes.filter(n => new Date(n.date) >= thirtyDaysAgo);

    if (recentNotes.length === 0) {
      throw new Error("No notes found in the last 30 days to generate a recertification.");
    }

    const prompt = `
      You are an expert Speech-Language Pathologist.
      Generate a comprehensive Recertification Note (30-day reassessment) for the following patient based on their last month of therapy.
      
      Patient Name: ${patient.name}
      Diagnosis: ${patient.diagnosis}
      Start of Care: ${patient.startOfCare}
      Goals: ${patient.goals.join(', ')}
      
      Last 30 Days of Notes:
      ${JSON.stringify(recentNotes.map(n => ({ date: n.date, type: n.type, content: n.content })), null, 2)}
      
      The recertification note must justify continued skilled intervention, summarize progress over the month, average metrics, and establish updated goals for the next certification period.
      Format the output as a JSON object with the following keys: subjective, objective, assessment, plan, summary, updatedGoals (array of strings).
    `;

    try {
      const responseText = await aiService.generateContent(prompt, { responseMimeType: "application/json" });
      const content: any = parseAIResponse(responseText, {});

      const recertNote: ClinicalNote = {
        id: crypto.randomUUID(),
        patientId,
        date: new Date().toISOString(),
        type: 'Recertification',
        content
      };

      persistenceService.saveClinicalNote(recertNote);
      
      // Update patient goals if provided
      if (content.updatedGoals && Array.isArray(content.updatedGoals)) {
        patient.goals = content.updatedGoals;
        persistenceService.savePatient(patient);
      }

      return recertNote;
    } catch (error) {
      logger.error("Failed to generate recertification note", error);
      throw error;
    }
  }

  /**
   * Generates a Discharge Note based on the entire episode of care.
   */
  async generateDischargeNote(patientId: string): Promise<ClinicalNote | null> {
    const patient = persistenceService.getPatientById(patientId);
    if (!patient) throw new Error("Patient not found");

    const notes = persistenceService.getClinicalNotes(patientId);

    if (notes.length === 0) {
      throw new Error("No notes found to generate a discharge summary.");
    }

    const prompt = `
      You are an expert Speech-Language Pathologist.
      Generate a comprehensive Discharge Summary for the following patient based on their entire episode of care.
      
      Patient Name: ${patient.name}
      Diagnosis: ${patient.diagnosis}
      Start of Care: ${patient.startOfCare}
      Discharge Date: ${new Date().toISOString()}
      Goals: ${patient.goals.join(', ')}
      
      All Clinical Notes (Chronological):
      ${JSON.stringify([...notes].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(n => ({ date: n.date, type: n.type, content: n.content })), null, 2)}
      
      The discharge note must summarize the entire course of treatment, compare initial status to discharge status, note goal mastery, and provide discharge recommendations.
      Format the output as a JSON object with the following keys: subjective, objective, assessment, plan, summary, recommendations.
    `;

    try {
      const responseText = await aiService.generateContent(prompt, { responseMimeType: "application/json" });
      const content: any = parseAIResponse(responseText, {});

      const dischargeNote: ClinicalNote = {
        id: crypto.randomUUID(),
        patientId,
        date: new Date().toISOString(),
        type: 'Discharge',
        content
      };

      persistenceService.saveClinicalNote(dischargeNote);
      
      // Update patient status
      patient.status = 'Discharged';
      persistenceService.savePatient(patient);

      return dischargeNote;
    } catch (error) {
      logger.error("Failed to generate discharge note", error);
      throw error;
    }
  }

  private getNotesSinceLastMajorReport(notes: ClinicalNote[]): ClinicalNote[] {
    const sortedDesc = [...notes].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const recentDailyNotes: ClinicalNote[] = [];
    
    for (const note of sortedDesc) {
      if (note.type === 'Progress' || note.type === 'Recertification' || note.type === 'Discharge') {
        break; // Stop when we hit a major report
      }
      if (note.type === 'Daily') {
        recentDailyNotes.push(note);
      }
    }
    
    return recentDailyNotes.reverse(); // Return in chronological order
  }
}

export const documentationTrackerService = new DocumentationTrackerService();
