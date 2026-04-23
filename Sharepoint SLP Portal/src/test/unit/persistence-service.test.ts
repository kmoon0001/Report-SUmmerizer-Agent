/**
 * Unit Tests — PersistenceService
 * Covers localStorage CRUD for all data types
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { persistenceService } from "../../services/persistence-service";
import type {
  SavedHandout,
  SavedPhrase,
  SavedPDF,
  TrismusLog,
  MilestoneProgress,
  ChatSession,
} from "../../services/persistence-service";

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

// ── Chat Sessions ─────────────────────────────────────────────────────────────
describe("PersistenceService — Chat Sessions", () => {
  const session: ChatSession = {
    id: "sess-1",
    docId: "doc-1",
    messages: [
      { role: "user", content: "Hello", timestamp: "2026-01-01T00:00:00Z" },
      { role: "ai", content: "Hi there", timestamp: "2026-01-01T00:00:01Z" },
    ],
    lastUpdated: "2026-01-01T00:00:01Z",
  };

  it("saves and retrieves a chat session", async () => {
    await persistenceService.saveChatSession(session);
    const sessions = await persistenceService.getChatSessions();
    expect(sessions).toHaveLength(1);
    expect(sessions[0]!.id).toBe("sess-1");
  });

  it("deduplicates sessions by id on save", async () => {
    await persistenceService.saveChatSession(session);
    await persistenceService.saveChatSession({
      ...session,
      lastUpdated: "2026-01-02T00:00:00Z",
    });
    expect(await persistenceService.getChatSessions()).toHaveLength(1);
  });

  it("returns empty array when no sessions", async () => {
    expect(await persistenceService.getChatSessions()).toEqual([]);
  });

  it("prunes sessions older than daysToKeep", async () => {
    const old: ChatSession = {
      ...session,
      id: "old",
      lastUpdated: "2020-01-01T00:00:00Z",
    };
    const recent: ChatSession = {
      ...session,
      id: "recent",
      lastUpdated: new Date().toISOString(),
    };
    await persistenceService.saveChatSession(old);
    await persistenceService.saveChatSession(recent);
    await persistenceService.pruneOldChatSessions(30);
    const remaining = await persistenceService.getChatSessions();
    expect(remaining.some((s) => s.id === "old")).toBe(false);
    expect(remaining.some((s) => s.id === "recent")).toBe(true);
  });

  it("handles corrupt localStorage gracefully", async () => {
    localStorage.setItem("slp_nexus_chat_history", "not-json");
    expect(await persistenceService.getChatSessions()).toEqual([]);
  });
});

// ── Handouts ──────────────────────────────────────────────────────────────────
describe("PersistenceService — Handouts", () => {
  const handout: SavedHandout = {
    id: "h1",
    title: "HEP",
    content: "Exercise content",
    date: "2026-01-01",
    docId: "doc-1",
    type: "hep",
    subspecialty: "orthopedic",
  };

  it("saves and retrieves handouts", () => {
    persistenceService.saveHandout(handout);
    expect(persistenceService.getHandouts()).toHaveLength(1);
    expect(persistenceService.getHandouts()[0]!.id).toBe("h1");
  });

  it("deletes a handout by id", () => {
    persistenceService.saveHandout(handout);
    persistenceService.deleteHandout("h1");
    expect(persistenceService.getHandouts()).toHaveLength(0);
  });

  it("returns empty array when no handouts", () => {
    expect(persistenceService.getHandouts()).toEqual([]);
  });
});

// ── Settings ──────────────────────────────────────────────────────────────────
describe("PersistenceService — Settings", () => {
  it("saves and retrieves settings", () => {
    persistenceService.saveSettings({ theme: "dark", fontSize: 14 });
    expect(persistenceService.getSettings()).toEqual({
      theme: "dark",
      fontSize: 14,
    });
  });

  it("returns null when no settings", () => {
    expect(persistenceService.getSettings()).toBeNull();
  });
});

// ── Clinical Notes ────────────────────────────────────────────────────────────
describe("PersistenceService — Clinical Notes", () => {
  it("saves and retrieves clinical notes", async () => {
    await persistenceService.saveClinicalNote({ id: "n1", text: "SOAP note" });
    const notes = await persistenceService.getClinicalNotes();
    expect(notes).toHaveLength(1);
    expect(notes[0]!.id).toBe("n1");
  });

  it("returns empty array when no notes", async () => {
    expect(await persistenceService.getClinicalNotes()).toEqual([]);
  });
});

// ── Dashboard & Quick Access Order ───────────────────────────────────────────
describe("PersistenceService — Order Preferences", () => {
  it("saves and retrieves dashboard order", () => {
    persistenceService.saveDashboardOrder(["a", "b", "c"]);
    expect(persistenceService.getDashboardOrder()).toEqual(["a", "b", "c"]);
  });

  it("returns null when no dashboard order", () => {
    expect(persistenceService.getDashboardOrder()).toBeNull();
  });

  it("saves and retrieves quick access order", () => {
    persistenceService.saveQuickAccessOrder(["x", "y"]);
    expect(persistenceService.getQuickAccessOrder()).toEqual(["x", "y"]);
  });

  it("returns null when no quick access order", () => {
    expect(persistenceService.getQuickAccessOrder()).toBeNull();
  });
});

// ── Trismus Logs ──────────────────────────────────────────────────────────────
describe("PersistenceService — Trismus Logs", () => {
  const log: TrismusLog = {
    id: "tl1",
    date: "2026-01-01",
    measurement: 35,
    notes: "Baseline",
  };

  it("saves and retrieves trismus logs", () => {
    persistenceService.saveTrismusLog(log);
    expect(persistenceService.getTrismusLogs()).toHaveLength(1);
    expect(persistenceService.getTrismusLogs()[0]!.measurement).toBe(35);
  });

  it("returns empty array when no logs", () => {
    expect(persistenceService.getTrismusLogs()).toEqual([]);
  });
});

// ── Milestone Progress ────────────────────────────────────────────────────────
describe("PersistenceService — Milestone Progress", () => {
  const progress: MilestoneProgress = {
    childName: "Test Child",
    dob: "2022-01-01",
    checkedMilestones: ["m1", "m2"],
  };

  it("saves and retrieves milestone progress", () => {
    persistenceService.saveMilestoneProgress(progress);
    const result = persistenceService.getMilestoneProgress();
    expect(result?.childName).toBe("Test Child");
    expect(result?.checkedMilestones).toContain("m1");
  });

  it("returns null when no progress", () => {
    expect(persistenceService.getMilestoneProgress()).toBeNull();
  });
});

// ── PDF Library ───────────────────────────────────────────────────────────────
describe("PersistenceService — PDF Library", () => {
  const pdf: SavedPDF = {
    id: "pdf1",
    name: "HEP Form",
    category: "orthopedic",
    data: "data:application/pdf;base64,abc",
    date: "2026-01-01",
    size: 1024,
  };

  it("saves and retrieves PDFs", () => {
    persistenceService.savePDF(pdf);
    expect(persistenceService.getPDFs()).toHaveLength(1);
    expect(persistenceService.getPDFs()[0]!.name).toBe("HEP Form");
  });

  it("deletes a PDF by id", () => {
    persistenceService.savePDF(pdf);
    persistenceService.deletePDF("pdf1");
    expect(persistenceService.getPDFs()).toHaveLength(0);
  });

  it("returns empty array when no PDFs", () => {
    expect(persistenceService.getPDFs()).toEqual([]);
  });
});

// ── Phrase Bank ───────────────────────────────────────────────────────────────
describe("PersistenceService — Phrase Bank", () => {
  const phrase: SavedPhrase = {
    id: "p1",
    label: "Greeting",
    text: "Hello",
    category: "social",
  };

  it("saves and retrieves phrases", () => {
    persistenceService.savePhrase(phrase);
    expect(persistenceService.getPhrases()).toHaveLength(1);
  });

  it("deduplicates phrases by id", () => {
    persistenceService.savePhrase(phrase);
    persistenceService.savePhrase({ ...phrase, text: "Hi" });
    expect(persistenceService.getPhrases()).toHaveLength(1);
    expect(persistenceService.getPhrases()[0]!.text).toBe("Hi");
  });

  it("deletes a phrase by id", () => {
    persistenceService.savePhrase(phrase);
    persistenceService.deletePhrase("p1");
    expect(persistenceService.getPhrases()).toHaveLength(0);
  });
});

// ── Sync Queue ────────────────────────────────────────────────────────────────
describe("PersistenceService — Sync Queue", () => {
  it("adds to and retrieves sync queue", () => {
    persistenceService.addToSyncQueue({
      type: "SAVE_NOTE",
      payload: { id: "n1" },
    });
    const queue = persistenceService.getSyncQueue();
    expect(queue).toHaveLength(1);
    expect(queue[0]!.type).toBe("SAVE_NOTE");
  });

  it("clears sync queue", () => {
    persistenceService.addToSyncQueue({ type: "SAVE_NOTE", payload: {} });
    persistenceService.clearSyncQueue();
    expect(persistenceService.getSyncQueue()).toHaveLength(0);
  });

  it("returns empty array when no queue", () => {
    expect(persistenceService.getSyncQueue()).toEqual([]);
  });
});
