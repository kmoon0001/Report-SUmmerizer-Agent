
import { logger } from '../utils/logger';
import { sanitizeChatContent } from '../utils/sanitizer';

const STORAGE_KEYS = {
  HANDOUTS: 'slp_nexus_handouts',
  SETTINGS: 'slp_nexus_settings',
  CLINICAL_NOTES: 'slp_nexus_clinical_notes',
  PATIENTS: 'slp_nexus_patients',
  DASHBOARD_ORDER: 'slp_nexus_dashboard_order',
  QUICK_ACCESS_ORDER: 'slp_nexus_quick_access_order',
  TRISMUS_LOGS: 'slp_nexus_trismus_logs',
  PEDIATRIC_MILESTONES: 'slp_nexus_pediatric_milestones',
  PDF_LIBRARY: 'slp_nexus_pdf_library',
  PHRASE_BANK: 'slp_nexus_phrase_bank',
  CHAT_HISTORY: 'slp_nexus_chat_history',
  SYNC_QUEUE: 'slp_nexus_sync_queue'
};

export type NoteType = 'Daily' | 'Progress' | 'Recertification' | 'Discharge';

export interface ClinicalNote {
  id: string;
  patientId: string;
  date: string;
  type: NoteType;
  content: any;
  metrics?: any;
  sessionNumber?: number;
  providerId?: string;
  text?: string;
}

export interface Patient {
  id: string;
  name: string;
  dob: string;
  startOfCare: string;
  diagnosis: string;
  goals: string[];
  status: 'Active' | 'Discharged';
}

export interface SavedHandout {
  id: string;
  title: string;
  content: string;
  image?: string;
  date: string;
  docId: string;
  type: string;
  subspecialty: string;
}

export interface SavedPhrase {
  id: string;
  label: string;
  text: string;
  category: string;
}

export interface SavedPDF {
  id: string;
  name: string;
  category: string;
  data: string; // Base64 data URL
  date: string;
  size: number;
}

export interface TrismusLog {
  id: string;
  date: string;
  measurement: number; // mm
  notes?: string;
}

export interface MilestoneProgress {
  childName: string;
  dob: string;
  checkedMilestones: string[]; // IDs of checked milestones
}

export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  docId: string;
  messages: ChatMessage[];
  lastUpdated: string;
}

class PersistenceService {
  // --- Chat History ---
  saveChatSession(session: ChatSession): void {
    try {
      const sanitizedMessages = session.messages.map(msg => ({
        ...msg,
        content: sanitizeChatContent(msg.content)
      }));
      const sanitizedSession = { ...session, messages: sanitizedMessages };
      
      const existing = this.getChatSessions();
      const updated = [sanitizedSession, ...existing.filter(s => s.id !== session.id)];
      localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(updated));
      logger.info(`Chat session saved: ${session.id}`);
    } catch (error) {
      logger.error("Failed to save chat session", error);
    }
  }

  getChatSessions(): ChatSession[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      logger.error("Failed to load chat sessions", error);
      return [];
    }
  }

  pruneOldChatSessions(daysToKeep: number = 30): void {
    try {
      const sessions = this.getChatSessions();
      const now = new Date().getTime();
      const updated = sessions.filter(s => {
        const lastUpdated = new Date(s.lastUpdated).getTime();
        return (now - lastUpdated) < (daysToKeep * 24 * 60 * 60 * 1000);
      });
      localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(updated));
      logger.info(`Pruned ${sessions.length - updated.length} old chat sessions.`);
    } catch (error) {
      logger.error("Failed to prune chat sessions", error);
    }
  }

  // --- Handouts ---
  saveHandout(handout: SavedHandout): void {
    try {
      const existing = this.getHandouts();
      const updated = [handout, ...existing];
      localStorage.setItem(STORAGE_KEYS.HANDOUTS, JSON.stringify(updated));
    } catch (error) {
      logger.error("Failed to save handout", error);
    }
  }

  getHandouts(): SavedHandout[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HANDOUTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      logger.error("Failed to load handouts", error);
      return [];
    }
  }

  deleteHandout(id: string): void {
    try {
      const existing = this.getHandouts();
      const updated = existing.filter(h => h.id !== id);
      localStorage.setItem(STORAGE_KEYS.HANDOUTS, JSON.stringify(updated));
    } catch (error) {
      logger.error("Failed to delete handout", error);
    }
  }

  // --- Settings ---
  saveSettings(settings: any): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      logger.error("Failed to save settings", error);
    }
  }

  getSettings(): any {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error("Failed to load settings", error);
      return null;
    }
  }
  
  // --- Patients ---
  savePatient(patient: Patient): void {
    try {
      const existing = this.getPatients();
      const updated = [patient, ...existing.filter(p => p.id !== patient.id)];
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(updated));
    } catch (error) {
      logger.error("Failed to save patient", error);
    }
  }

  getPatients(): Patient[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PATIENTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      logger.error("Failed to load patients", error);
      return [];
    }
  }

  getPatientById(id: string): Patient | undefined {
    return this.getPatients().find(p => p.id === id);
  }

  deletePatient(id: string): void {
    try {
      const existing = this.getPatients();
      const updated = existing.filter(p => p.id !== id);
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(updated));
    } catch (error) {
      logger.error("Failed to delete patient", error);
    }
  }

  // --- Clinical Notes ---
  saveClinicalNote(note: ClinicalNote): void {
      try {
          const existing = this.getClinicalNotes();
          const updated = [note, ...existing.filter(n => n.id !== note.id)];
          localStorage.setItem(STORAGE_KEYS.CLINICAL_NOTES, JSON.stringify(updated));
      } catch (error) {
          logger.error("Failed to save clinical note", error);
      }
  }
  
  getClinicalNotes(patientId?: string): ClinicalNote[] {
      try {
          const data = localStorage.getItem(STORAGE_KEYS.CLINICAL_NOTES);
          const notes: ClinicalNote[] = data ? JSON.parse(data) : [];
          if (patientId) {
            return notes.filter(n => n.patientId === patientId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          }
          return notes;
      } catch (error) {
          logger.error("Failed to load clinical notes", error);
          return [];
      }
  }

  deleteClinicalNote(id: string): void {
    try {
      const existing = this.getClinicalNotes();
      const updated = existing.filter(n => n.id !== id);
      localStorage.setItem(STORAGE_KEYS.CLINICAL_NOTES, JSON.stringify(updated));
    } catch (error) {
      logger.error("Failed to delete clinical note", error);
    }
  }

  // --- Dashboard Order ---
  saveDashboardOrder(order: string[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.DASHBOARD_ORDER, JSON.stringify(order));
    } catch (error) {
      logger.error("Failed to save dashboard order", error);
    }
  }

  getDashboardOrder(): string[] | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DASHBOARD_ORDER);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error("Failed to load dashboard order", error);
      return null;
    }
  }

  // --- Quick Access Order ---
  saveQuickAccessOrder(order: string[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.QUICK_ACCESS_ORDER, JSON.stringify(order));
    } catch (error) {
      logger.error("Failed to save quick access order", error);
    }
  }

  getQuickAccessOrder(): string[] | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUICK_ACCESS_ORDER);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error("Failed to load quick access order", error);
      return null;
    }
  }

  // --- Trismus Tracker ---
  saveTrismusLog(log: TrismusLog): void {
    try {
      const existing = this.getTrismusLogs();
      const updated = [...existing, log];
      localStorage.setItem(STORAGE_KEYS.TRISMUS_LOGS, JSON.stringify(updated));
    } catch (error) {
      logger.error("Failed to save trismus log", error);
    }
  }

  getTrismusLogs(): TrismusLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRISMUS_LOGS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      logger.error("Failed to load trismus logs", error);
      return [];
    }
  }

  // --- Pediatric Milestones ---
  saveMilestoneProgress(progress: MilestoneProgress): void {
    try {
      // Simple implementation: overwrite for single child or find/replace
      // For now, let's assume single child or simple list
      localStorage.setItem(STORAGE_KEYS.PEDIATRIC_MILESTONES, JSON.stringify(progress));
    } catch (error) {
      logger.error("Failed to save milestone progress", error);
    }
  }

  getMilestoneProgress(): MilestoneProgress | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PEDIATRIC_MILESTONES);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error("Failed to load milestone progress", error);
      return null;
    }
  }
  // --- PDF Library ---
  savePDF(pdf: SavedPDF): void {
    try {
      const existing = this.getPDFs();
      
      // Check for storage quota roughly (5MB limit usually)
      // We'll cap PDF storage at ~3.5MB to leave room for other data
      const MAX_PDF_STORAGE = 3500000;
      
      let currentSize = JSON.stringify(existing).length;
      const newSize = JSON.stringify(pdf).length;
      
      // Auto-prune old PDFs if we exceed the limit
      while (currentSize + newSize > MAX_PDF_STORAGE && existing.length > 0) {
        // Remove the oldest PDF (last in the array usually, or sort by date)
        // Assuming existing is sorted new -> old, we remove the last one
        // But let's sort by date just in case to be safe
        existing.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const removed = existing.pop();
        if (removed) {
          logger.info(`Pruning old PDF to free space: ${removed.name}`);
          currentSize = JSON.stringify(existing).length;
        }
      }

      if (currentSize + newSize > MAX_PDF_STORAGE) {
         throw new Error("PDF is too large to save even after clearing old files.");
      }

      const updated = [pdf, ...existing];
      localStorage.setItem(STORAGE_KEYS.PDF_LIBRARY, JSON.stringify(updated));
    } catch (error) {
      logger.error("Failed to save PDF", error);
      throw error; // Re-throw to handle in UI
    }
  }

  getPDFs(): SavedPDF[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PDF_LIBRARY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      logger.error("Failed to load PDFs", error);
      return [];
    }
  }

  deletePDF(id: string): void {
    try {
      const existing = this.getPDFs();
      const updated = existing.filter(p => p.id !== id);
      localStorage.setItem(STORAGE_KEYS.PDF_LIBRARY, JSON.stringify(updated));
    } catch (error) {
      logger.error("Failed to delete PDF", error);
    }
  }

  // --- Phrase Bank ---
  savePhrase(phrase: SavedPhrase): void {
    try {
      const existing = this.getPhrases();
      const updated = [phrase, ...existing.filter(p => p.id !== phrase.id)];
      localStorage.setItem(STORAGE_KEYS.PHRASE_BANK, JSON.stringify(updated));
    } catch (error) {
      logger.error("Failed to save phrase", error);
    }
  }

  getPhrases(): SavedPhrase[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PHRASE_BANK);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      logger.error("Failed to load phrases", error);
      return [];
    }
  }

  deletePhrase(id: string): void {
    try {
      const existing = this.getPhrases();
      const updated = existing.filter(p => p.id !== id);
      localStorage.setItem(STORAGE_KEYS.PHRASE_BANK, JSON.stringify(updated));
    } catch (error) {
      logger.error("Failed to delete phrase", error);
    }
  }

  // --- Sync Queue ---
  addToSyncQueue(action: { type: string, payload: any }): void {
    try {
      const queue = this.getSyncQueue();
      queue.push({ ...action, timestamp: new Date().toISOString() });
      localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
      logger.info(`Action added to sync queue: ${action.type}`);
    } catch (error) {
      logger.error("Failed to add to sync queue", error);
    }
  }

  getSyncQueue(): any[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      logger.error("Failed to load sync queue", error);
      return [];
    }
  }

  clearSyncQueue(): void {
    localStorage.removeItem(STORAGE_KEYS.SYNC_QUEUE);
    logger.info("Sync queue cleared.");
  }

  // --- Generated Assets ---
  async saveGeneratedAsset(asset: { 
    id: string, 
    type: 'image' | 'video', 
    data: string, 
    date: string,
    prompt?: string,
    metadata?: any
  }): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('SLP_Nexus_DB', 1);
      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('assets')) {
          db.createObjectStore('assets', { keyPath: 'id' });
        }
      };
      request.onsuccess = (event: any) => {
        const db = event.target.result;
        const transaction = db.transaction(['assets'], 'readwrite');
        const store = transaction.objectStore('assets');
        store.put(asset);
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getGeneratedAssets(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('SLP_Nexus_DB', 1);
      request.onsuccess = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('assets')) {
          resolve([]);
          return;
        }
        const transaction = db.transaction(['assets'], 'readonly');
        const store = transaction.objectStore('assets');
        const allAssets = store.getAll();
        allAssets.onsuccess = () => resolve(allAssets.result);
        allAssets.onerror = () => reject(allAssets.error);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async deleteGeneratedAsset(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('SLP_Nexus_DB', 1);
      request.onsuccess = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('assets')) {
          resolve();
          return;
        }
        const transaction = db.transaction(['assets'], 'readwrite');
        const store = transaction.objectStore('assets');
        const deleteRequest = store.delete(id);
        deleteRequest.onsuccess = () => resolve();
        deleteRequest.onerror = () => reject(deleteRequest.error);
      };
      request.onerror = () => reject(request.error);
    });
  }
}

export const persistenceService = new PersistenceService();
