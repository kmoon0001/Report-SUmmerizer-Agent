type CollaborationEvent = 
  | { type: 'VIEW_CHANGED'; view: string }
  | { type: 'PATIENT_UPDATED'; profileId: string }
  | { type: 'CURSOR_MOVED'; x: number; y: number; userId: string };

class CollaborationService {
  private channel: BroadcastChannel;
  private listeners: ((event: CollaborationEvent) => void)[] = [];

  constructor() {
    this.channel = new BroadcastChannel('slp_portal_collab');
    this.channel.onmessage = (event) => {
      this.listeners.forEach(listener => listener(event.data));
    };
  }

  broadcast(event: CollaborationEvent) {
    this.channel.postMessage(event);
  }

  subscribe(listener: (event: CollaborationEvent) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
}

export const collabService = new CollaborationService();
