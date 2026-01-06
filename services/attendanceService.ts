import { WebhookPayload, Attendee } from '../types';

// V-- VOEG DEZE REGEL TOE
const WEBHOOK_URL = ""; 
// ^-- Hierdoor weet de code dat de URL leeg is, en slaat hij de Google Sheet over.

export const sendCheckIn = async (name: string, action: 'Inchecken' | 'Uitchecken'): Promise<boolean> => {
  const sheetAction = action === 'Inchecken' ? 'Aanwezig' : 'Afgemeld';

  const payload: WebhookPayload = {
    naam: name,
    tijdstip: new Date().toISOString(),
    actie: sheetAction
  };

  // Omdat WEBHOOK_URL nu leeg is (""), is deze conditie WAAR.
  // De code gaat hier naar binnen, logt de simulatie en stopt (return true).
  if (!WEBHOOK_URL) {
    console.log("Geen WEBHOOK_URL ingesteld. Simuleer succesvolle check-in:", payload);
    await new Promise(resolve => setTimeout(resolve, 1500));
    return true;
  }

  try {
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
  // Ook hier wordt direct gestopt en een lege lijst teruggegeven.
  if (!WEBHOOK_URL) {
    await new Promise(resolve => setTimeout(resolve, 500)); 
    return []; 
  }

  try {
    const response = await fetch(`${WEBHOOK_URL}?action=getToday`);
    
    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn("Kon aanwezigen niet ophalen.", error);
    return [];
  }
};
