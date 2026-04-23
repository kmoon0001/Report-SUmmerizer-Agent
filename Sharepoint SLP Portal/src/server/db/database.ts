import Database from "better-sqlite3";
import path from "path";

const db = new Database("clinical_library.db");

// NIST/ONC Compliance: Ensure data integrity and secure storage
db.exec(`
  CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    hash TEXT -- For data integrity verification
  );
  CREATE TABLE IF NOT EXISTS chunks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    doc_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    FOREIGN KEY(doc_id) REFERENCES documents(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS patients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    diagnosis TEXT NOT NULL,
    goals TEXT NOT NULL, -- JSON string array
    lastSession TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS progress_notes (
    id TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL,
    date TEXT NOT NULL,
    type TEXT NOT NULL,
    content TEXT NOT NULL, -- JSON string or raw text
    FOREIGN KEY(patient_id) REFERENCES patients(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS therapy_sets (
    id TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL,
    config TEXT NOT NULL, -- JSON string of GameConfig
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(patient_id) REFERENCES patients(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS session_results (
    id TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL,
    therapy_set_id TEXT,
    date TEXT NOT NULL,
    duration INTEGER NOT NULL, -- in seconds
    accuracy REAL NOT NULL, -- percentage
    cues_given TEXT NOT NULL, -- e.g., "minimal verbal", "moderate visual"
    notes TEXT,
    FOREIGN KEY(patient_id) REFERENCES patients(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS networking_events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    date TEXT,
    location TEXT,
    link TEXT,
    source TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS news_items (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    link TEXT,
    source TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS whatsapp_messages (
    id TEXT PRIMARY KEY,
    sender TEXT NOT NULL,
    text TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

import { NetworkingEvent, NewsItem, WhatsAppMessage } from "../../types";

export const dbService = {
  // Networking Events
  getNetworkingEvents: (): NetworkingEvent[] => {
    return db.prepare('SELECT * FROM networking_events ORDER BY date ASC').all() as NetworkingEvent[];
  },
  
  upsertNetworkingEvent: (event: NetworkingEvent) => {
    const stmt = db.prepare(`
      INSERT INTO networking_events (id, title, description, date, location, link, source, updated_at)
      VALUES (@id, @title, @description, @date, @location, @link, @source, CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET
        title=excluded.title,
        description=excluded.description,
        date=excluded.date,
        location=excluded.location,
        link=excluded.link,
        source=excluded.source,
        updated_at=CURRENT_TIMESTAMP
    `);
    stmt.run(event);
  },

  // News Items
  getNewsItems: (): NewsItem[] => {
    return db.prepare('SELECT * FROM news_items ORDER BY updated_at DESC').all() as NewsItem[];
  },

  upsertNewsItem: (news: NewsItem) => {
    const stmt = db.prepare(`
      INSERT INTO news_items (id, title, content, link, source, updated_at)
      VALUES (@id, @title, @content, @link, @source, CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET
        title=excluded.title,
        content=excluded.content,
        link=excluded.link,
        source=excluded.source,
        updated_at=CURRENT_TIMESTAMP
    `);
    stmt.run(news);
  },

  // WhatsApp Messages
  getWhatsAppMessages: (): WhatsAppMessage[] => {
    return db.prepare('SELECT * FROM whatsapp_messages ORDER BY timestamp DESC LIMIT 20').all() as WhatsAppMessage[];
  },

  upsertWhatsAppMessage: (message: WhatsAppMessage) => {
    const stmt = db.prepare(`
      INSERT INTO whatsapp_messages (id, sender, text, timestamp)
      VALUES (@id, @sender, @text, @timestamp)
      ON CONFLICT(id) DO UPDATE SET
        sender=excluded.sender,
        text=excluded.text,
        timestamp=excluded.timestamp
    `);
    stmt.run(message);
  },

  deleteOldWhatsAppMessages: (days: number) => {
    const stmt = db.prepare('DELETE FROM whatsapp_messages WHERE timestamp < datetime("now", ?)');
    stmt.run(`-${days} days`);
  }
};

export default db;
