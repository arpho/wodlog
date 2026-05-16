import { onCall } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

// Import Genkit core and plugins.
import { genkit, z } from "genkit";
import { firebase } from "@genkit-ai/firebase";
import { googleAI, gemini15Flash } from "@genkit-ai/googleai";

// Initialize Genkit
const ai = genkit({
  plugins: [
    googleAI(),
    firebase(),
  ],
  model: gemini15Flash,
});

// Input Schema condiviso per le immagini
const ImageInputSchema = z.object({
  imageBufferBase64: z.string().describe("L'immagine codificata in base64"),
  mimeType: z.string().default("image/jpeg")
});

// Output Schema: un semplice array di stringhe
const TextLinesSchema = z.array(z.string()).describe("Righe di testo estratte dall'immagine");

// Funzione di utilità per ripulire il base64
function extractBase64(base64Data: string): string {
  if (base64Data.startsWith('data:')) {
    const parts = base64Data.split(',');
    return parts.length === 2 ? parts[1] : base64Data;
  }
  return base64Data;
}

// --------------------------------------------------
// FLOW 1: ESTREAZIONE DELLA FORZA
// --------------------------------------------------
export const analyzeForceImageFlow = ai.defineFlow(
  {
    name: "analyzeForceImageFlow",
    inputSchema: ImageInputSchema,
    outputSchema: TextLinesSchema,
  },
  async (input) => {
    logger.info("Avvio analisi immagine Forza");
    const base64Data = extractBase64(input.imageBufferBase64);
    
    const response = await ai.generate({
      model: gemini15Flash,
      prompt: [
        { text: "Analizza questa immagine della lavagna di un allenamento CrossFit. Estrai SOLO la parte relativa alla 'Forza', pesistica, tecnica o sollevamento (es. Squat, Deadlift, Snatch, Clean & Jerk, skill work). Trascrivi ogni singola riga di testo di questa sezione esattamente come la leggi e restituiscila come elemento di un array. Ignora qualsiasi parte relativa al riscaldamento generico o al WOD finale (condizionamento metabolico). Se nell'immagine non c'è una parte di forza, restituisci un array vuoto." },
        { media: { url: `data:${input.mimeType};base64,${base64Data}` } }
      ],
      output: { schema: TextLinesSchema }
    });
    
    return response.output || [];
  }
);

// --------------------------------------------------
// FLOW 2: ESTRAZIONE DEL WOD
// --------------------------------------------------
export const analyzeWodImageFlow = ai.defineFlow(
  {
    name: "analyzeWodImageFlow",
    inputSchema: ImageInputSchema,
    outputSchema: TextLinesSchema,
  },
  async (input) => {
    logger.info("Avvio analisi immagine WOD");
    const base64Data = extractBase64(input.imageBufferBase64);
    
    const response = await ai.generate({
      model: gemini15Flash,
      prompt: [
        { text: "Analizza questa immagine della lavagna di un allenamento CrossFit. Estrai SOLO la parte finale relativa al 'WOD', circuito, AMRAP, EMOM, For Time o condizionamento metabolico. Trascrivi ogni singola riga di testo di questa sezione esattamente come la leggi e restituiscila come elemento di un array. Ignora qualsiasi parte relativa al riscaldamento iniziale, alla mobilità o all'allenamento di forza/pesistica pura. Se nell'immagine non c'è un WOD, restituisci un array vuoto." },
        { media: { url: `data:${input.mimeType};base64,${base64Data}` } }
      ],
      output: { schema: TextLinesSchema }
    });
    
    return response.output || [];
  }
);

// Opzioni condivise per le Cloud Functions (es. abilitazione CORS)
const functionOptions = { maxInstances: 10, cors: true };

// Esponiamo i flow come Firebase Callable Functions separate
export const analyzeForceImage = onCall(functionOptions, async (request) => {
  const result = await analyzeForceImageFlow(request.data);
  return result;
});

export const analyzeWodImage = onCall(functionOptions, async (request) => {
  const result = await analyzeWodImageFlow(request.data);
  return result;
});
