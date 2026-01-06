import { WEBHOOK_URL } from '../constants';
import { WebhookPayload, Attendee } from '../types';

export const sendCheckIn = async (name: string, action: 'Inchecken' | 'Uitchecken'): Promise<boolean> => {
  // We vertalen de interne actie naar de termen die in de Google Sheet moeten komen
  const sheetAction = action === 'Inchecken' ? 'Aanwezig' : 'Afgemeld';

  const payload: WebhookPayload = {
    naam: name,
    tijdstip: new Date().toISOString(),
    actie: sheetAction
  };

  if (!WEBHOOK_URL) {
    console.log("Geen WEBHOOK_URL ingesteld. Simuleer succesvolle check-in:", payload);
    await new Promise(resolve => setTimeout(resolve, 1500));
    return true;
  }

  try {
    // We gebruiken 'no-cors' omdat Google Apps Script webhooks standaard geen CORS headers meesturen
    // tenzij specifiek geconfigureerd. Met 'no-cors' krijgen we een opaque response,
    // wat betekent dat we de status code niet kunnen lezen, maar het verzoek wordt wel verstuurd.
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return true;
  } catch (error) {
    console.error("Fout bij inchecken:", error);
    return false;
  }
};

export const getAttendees = async (): Promise<Attendee[]> => {
  if (!WEBHOOK_URL) {
    // Geen URL = geen externe data. We retourneren een lege lijst zodat de app
    // alleen lokale check-ins toont (indien doorgegeven) of leeg blijft.
    await new Promise(resolve => setTimeout(resolve, 500)); 
    return []; 
  }

  try {
    // We proberen een GET request naar de script URL
    // Noot: Je Google Apps Script moet een doGet(e) functie hebben die JSON teruggeeft
    const response = await fetch(`${WEBHOOK_URL}?action=getToday`);
    
    if (!response.ok) {
      // Als de server faalt (bijv. 404 of 500), retourneren we leeg.
      return [];
    }

    const data = await response.json();
    // Verwacht formaat van backend: [{ naam: "...", tijdstip: "..." }]
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn("Kon aanwezigen niet ophalen. Mogelijk CORS issues of geen doGet implementatie.", error);
    // Bij netwerkfouten retourneren we leeg, zodat we geen foutmelding tonen,
    // maar gewoon een lege lijst (of alleen lokale data).
    return [];
  }
};