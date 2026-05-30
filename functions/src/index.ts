import { initializeApp } from "firebase-admin/app";
import { getAuth, UserRecord } from "firebase-admin/auth";
import { getDatabase } from "firebase-admin/database";
import * as functions from "firebase-functions/v1";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

// Import Genkit core and plugins.
import { genkit, z } from "genkit";
import { googleAI, gemini } from "@genkit-ai/googleai";

// Initialize Firebase Admin SDK
initializeApp({
  databaseURL: "https://m1crossfit-5b2b9.firebaseio.com"
});

// Initialize Genkit
const ai = genkit({
  plugins: [
    googleAI(),
  ],
  model: gemini('gemini-2.5-flash'),
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
      model: gemini('gemini-2.5-flash'),
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
      model: gemini('gemini-2.5-flash'),
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

// Esponiamo i flow come Firebase Callable Functions separate (protette da autenticazione)
export const analyzeForceImage = onCall(functionOptions, async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Questo servizio richiede l'autenticazione.");
  }
  const result = await analyzeForceImageFlow(request.data);
  return result;
});

export const analyzeWodImage = onCall(functionOptions, async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Questo servizio richiede l'autenticazione.");
  }
  const result = await analyzeWodImageFlow(request.data);
  return result;
});

// --------------------------------------------------
// TRIGGER: INIZIALIZZAZIONE UTENTE SU REGISTRAZIONE
// --------------------------------------------------
export const beforeUserCreated = functions.auth.user().onCreate(async (user: UserRecord) => {
  const uid = user.uid;
  const email = user.email || "";

  logger.info(`Nuovo utente registrato: ${uid}. Inizializzazione in corso...`);

  // 1. Impostiamo il ruolo di default 'user' ed enabled false nei Custom Claims di Firebase Auth
  await getAuth().setCustomUserClaims(uid, { enabled: false, role: "user" });

  // 2. Creiamo il profilo utente di default nel database Realtime per prevenire crash
  const db = getDatabase();
  const userRef = db.ref(`userProfile/${uid}`);
  await userRef.set({
    key: uid,
    email: email,
    firstName: user.displayName ? user.displayName.split(" ")[0] : "",
    lastName: user.displayName ? user.displayName.split(" ").slice(1).join(" ") : "",
    role: "user",
    enabled: false,
    birthDate: "",
    phoneNumber: user.phoneNumber || "",
    userName: email.split("@")[0],
    weight: null,
    height: null,
    gender: "",
    featuredPrs: [],
    photoUrl: user.photoURL || ""
  });

  // 3. Creiamo la notifica per segnalare all'editor l'utente in attesa di approvazione
  const notificationsRef = db.ref(`notifications/${uid}`);
  await notificationsRef.set({
    key: uid,
    message: `Nuovo utente registrato: ${email || uid}. Richiede abilitazione.`,
    email: email,
    date: Date.now(),
    read: false
  });

  logger.info(`Inizializzazione completata per l'utente non abilitato: ${uid}`);
});

// --------------------------------------------------
// CALLABLE: GESTIONE PRIVILEGI UTENTI PER EMAIL (setClaims)
// --------------------------------------------------
export const setClaims = onCall(functionOptions, async (request) => {
  const isEmulator = process.env.FUNCTIONS_EMULATOR === "true";
  
  if (!isEmulator) {
    // 1. Verifica autenticazione
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "L'utente deve essere autenticato per questa operazione.");
    }

    // 2. Verifica privilegi admin (role === 'editor') del chiamante
    const callerUid = request.auth.uid;
    const db = getDatabase();
    const callerRef = db.ref(`userProfile/${callerUid}`);
    const callerSnapshot = await callerRef.once("value");
    const callerData = callerSnapshot.val();
    const isCallerEditor = callerData && callerData.role === "editor";

    if (!isCallerEditor) {
      throw new HttpsError("permission-denied", "Solo gli amministratori (ruolo editor) possono modificare i privilegi degli utenti.");
    }
  }

  const { email, role, enabled } = request.data;
  if (!email || !role || enabled === undefined) {
    throw new HttpsError("invalid-argument", "I parametri email, role ed enabled sono obbligatori.");
  }

  if (role !== "editor" && role !== "user") {
    throw new HttpsError("invalid-argument", "Il ruolo deve essere 'editor' o 'user'.");
  }

  logger.info(`Ricerca utente con email: ${email}...`);

  try {
    // 3. Cerca l'utente tramite email in Firebase Auth
    const userRecord = await getAuth().getUserByEmail(email);
    const targetUid = userRecord.uid;

    logger.info(`Trovato utente ${targetUid}. Aggiornamento privilegi a role: '${role}', enabled: ${enabled}...`);

    // 4. Imposta custom claims in Firebase Auth
    await getAuth().setCustomUserClaims(targetUid, { enabled, role });

    // 5. Aggiorna il profilo nel database
    const db = getDatabase();
    const targetRef = db.ref(`userProfile/${targetUid}`);
    await targetRef.update({ role, enabled });

    logger.info(`Privilegi aggiornati con successo per ${email} (${targetUid})`);

    return {
      success: true,
      message: `Privilegi impostati con successo per l'utente ${email} (${targetUid}): role='${role}', enabled=${enabled}`
    };
  } catch (error: any) {
    logger.error("Errore durante l'aggiornamento dei claims:", error);
    throw new HttpsError("internal", `Errore durante la configurazione dei privilegi: ${error.message}`);
  }
});
