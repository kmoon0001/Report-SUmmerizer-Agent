export interface NewsItem {
  id: string;
  title: string;
  content?: string;
  contentSnippet?: string;
  link?: string;
  source?: string;
  updated_at?: string;
}

export interface NetworkingEvent {
  id: string;
  title: string;
  description?: string;
  date?: string;
  location?: string;
  link?: string;
  source?: string;
  updated_at?: string;
}

export interface WhatsAppMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
}
