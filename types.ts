export interface CheckInLog {
  id: string;
  name: string;
  timestamp: Date;
  status: 'success' | 'error';
  action: 'Inchecken' | 'Uitchecken';
}

export interface WebhookPayload {
  naam: string;
  tijdstip: string; // ISO string for transport
  actie: string;
}

export interface Attendee {
  naam: string;
  tijdstip: string;
}

export type ScreenState = 'welcome' | 'success' | 'admin' | 'presence';