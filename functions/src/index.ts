import { initializeApp } from "firebase-admin/app";
import { getAuth, UserRecord } from "firebase-admin/auth";
import { getDatabase } from "firebase-admin/database";
import { getMessaging } from "firebase-admin/messaging";
import * as functions from "firebase-functions/v1";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

import { GoogleGenAI, Type, Schema } from "@google/genai";

// Initialize Firebase Admin SDK
initializeApp({
  databaseURL: "https://m1crossfit-5b2b9.firebaseio.com"
});

// Initialize the new Google Gen AI SDK in Vertex AI mode
const ai = new GoogleGenAI({
  enterprise: true,
  project: "m1crossfit-5b2b9",
  location: "us-central1"
});

// Funzione di utilità per ripulire il base64
function extractBase64(base64Data: string): string {
  if (base64Data.startsWith('data:')) {
    const parts = base64Data.split(',');
    return parts.length === 2 ? parts[1] : base64Data;
  }
  return base64Data;
}

// Output Schema per Google Gen AI
const textLinesSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.STRING
  },
  description: "Righe di testo estratte dall'immagine"
};

// --------------------------------------------------
// Helper 1: ESTREAZIONE DELLA FORZA
// --------------------------------------------------
const analyzeForceImageFlow = async (input: { imageBufferBase64: string, mimeType?: string }) => {
  logger.info("Avvio analisi immagine Forza");
  const base64Data = extractBase64(input.imageBufferBase64);
  const mimeType = input.mimeType || "image/jpeg";
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      {
        role: 'user',
        parts: [
          { text: "Analizza questa immagine della lavagna di un allenamento CrossFit. Estrai SOLO la parte relativa alla 'Forza', pesistica, tecnica o sollevamento (es. Squat, Deadlift, Snatch, Clean & Jerk, skill work). Trascrivi ogni singola riga di testo di questa sezione esattamente come la leggi e restituiscila come elemento di un array. Ignora qualsiasi parte relativa al riscaldamento generico o al WOD finale (condizionamento metabolico). Se nell'immagine non c'è una parte di forza, restituisci un array vuoto." },
          { inlineData: { mimeType, data: base64Data } }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: textLinesSchema
    }
  });
  
  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    logger.error("Errore nel parsing JSON della risposta", e);
    return [];
  }
};

// --------------------------------------------------
// Helper 2: ESTRAZIONE DEL WOD
// --------------------------------------------------
const analyzeWodImageFlow = async (input: { imageBufferBase64: string, mimeType?: string }) => {
  logger.info("Avvio analisi immagine WOD");
  const base64Data = extractBase64(input.imageBufferBase64);
  const mimeType = input.mimeType || "image/jpeg";
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      {
        role: 'user',
        parts: [
          { text: "Analizza questa immagine della lavagna di un allenamento CrossFit. Estrai SOLO la parte finale relativa al 'WOD', circuito, AMRAP, EMOM, For Time o condizionamento metabolico. Trascrivi ogni singola riga di testo di questa sezione esattamente come la leggi e restituiscila come elemento di un array. Ignora qualsiasi parte relativa al riscaldamento iniziale, alla mobilità o all'allenamento di forza/pesistica pura. Se nell'immagine non c'è un WOD, restituisci un array vuoto." },
          { inlineData: { mimeType, data: base64Data } }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: textLinesSchema
    }
  });
  
  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    logger.error("Errore nel parsing JSON della risposta", e);
    return [];
  }
};

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

// --------------------------------------------------
// CALLABLE: ELIMINAZIONE UTENTE PER UID (deleteUser)
// --------------------------------------------------
export const deleteUser = onCall(functionOptions, async (request) => {
  const isEmulator = process.env.FUNCTIONS_EMULATOR === "true";

  if (!isEmulator) {
    // 1. Verifica autenticazione
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "L'utente deve essere autenticato per questa operazione.");
    }

    // 2. Verifica privilegi admin (role === 'editor') del chiamante
    const callerUid = request.auth.uid;
    const isCallerEditorClaim = request.auth.token && request.auth.token.role === "editor";
    
    let isCallerEditor = isCallerEditorClaim;
    if (!isCallerEditor) {
      const db = getDatabase();
      const callerRef = db.ref(`userProfile/${callerUid}`);
      const callerSnapshot = await callerRef.once("value");
      const callerData = callerSnapshot.val();
      isCallerEditor = callerData && callerData.role === "editor";
    }

    if (!isCallerEditor) {
      throw new HttpsError("permission-denied", "Solo gli amministratori (ruolo editor) possono eliminare gli utenti.");
    }

    // 3. Prevenire auto-eliminazione
    if (request.data && request.data.targetUid === callerUid) {
      throw new HttpsError("invalid-argument", "Non puoi eliminare il tuo stesso account.");
    }
  }

  const { targetUid } = request.data || {};
  if (!targetUid) {
    throw new HttpsError("invalid-argument", "Il parametro targetUid è obbligatorio.");
  }

  logger.info(`Avvio eliminazione utente: ${targetUid}...`);

  try {
    const db = getDatabase();

    // 1. Elimina utente da Firebase Auth
    try {
      await getAuth().deleteUser(targetUid);
      logger.info(`Utente ${targetUid} rimosso da Firebase Auth.`);
    } catch (authErr: any) {
      if (authErr.code !== "auth/user-not-found") {
        logger.warn(`Nota: Errore nella rimozione da Auth per ${targetUid}:`, authErr);
      }
    }

    // 2. Elimina il profilo dal Realtime Database
    await db.ref(`userProfile/${targetUid}`).remove();

    // 3. Pulisci eventuali notifiche e token FCM associati
    await db.ref(`notifications/${targetUid}`).remove();
    await db.ref(`fcmTokens/${targetUid}`).remove();

    logger.info(`Eliminazione completata con successo per l'utente ${targetUid}`);

    return {
      success: true,
      message: `Utente ${targetUid} eliminato con successo.`
    };
  } catch (error: any) {
    logger.error("Errore durante l'eliminazione dell'utente:", error);
    throw new HttpsError("internal", `Errore durante l'eliminazione dell'utente: ${error.message}`);
  }
});

// --------------------------------------------------
// CALLABLE: VERIFICA RECAPTCHA V3 E REGISTRAZIONE UTENTE
// --------------------------------------------------
export const verifyRecaptchaAndRegister = onCall(functionOptions, async (request) => {
  const { email, password, recaptchaToken } = request.data || {};

  if (!email || !password) {
    throw new HttpsError("invalid-argument", "Email e password sono campi obbligatori.");
  }

  const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY || "";

  // Se è configurata una secret key per reCAPTCHA, la verifichiamo lato server
  if (recaptchaSecret && recaptchaToken) {
    logger.info(`Verifica token reCAPTCHA v3 per email: ${email}...`);
    try {
      const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${encodeURIComponent(recaptchaSecret)}&response=${encodeURIComponent(recaptchaToken)}`;
      const response = await fetch(verifyUrl, { method: "POST" });
      const recaptchaResult: any = await response.json();

      logger.info("Esito verifica reCAPTCHA:", recaptchaResult);

      if (!recaptchaResult.success || (recaptchaResult.score !== undefined && recaptchaResult.score < 0.5)) {
        logger.warn(`Registrazione bloccata per sospetto bot (email: ${email}, score: ${recaptchaResult.score})`);
        throw new HttpsError(
          "permission-denied",
          "Registrazione bloccata dal sistema di protezione anti-bot. Se ritieni sia un errore, riprova."
        );
      }
    } catch (err: any) {
      if (err instanceof HttpsError) throw err;
      logger.error("Errore durante la comunicazione con l'API reCAPTCHA:", err);
    }
  } else if (!recaptchaToken && recaptchaSecret) {
    throw new HttpsError("invalid-argument", "Token reCAPTCHA mancante per la verifica anti-bot.");
  }

  logger.info(`Creazione utente in Firebase Auth per email: ${email}...`);

  try {
    const userRecord = await getAuth().createUser({
      email: email,
      password: password
    });

    logger.info(`Utente creato con successo su Auth: ${userRecord.uid}`);

    return {
      success: true,
      uid: userRecord.uid,
      message: "Registrazione completata con successo."
    };
  } catch (error: any) {
    logger.error("Errore nella creazione dell'utente da Cloud Function:", error);
    throw new HttpsError("internal", error.message || "Impossibile creare l'utente.");
  }
});

// --------------------------------------------------
// TRIGGER: AGGIORNAMENTO MEDIA VALUTAZIONI WOD
// --------------------------------------------------
export const onWodRatingWritten = functions.database.ref('/wodRatings/{wodKey}/{userKey}')
  .onWrite(async (change, context) => {
    const wodKey = context.params.wodKey;
    const db = getDatabase();
    const wodRatingsRef = db.ref(`/wodRatings/${wodKey}`);
    
    try {
      const snapshot = await wodRatingsRef.once('value');
      let ratingTotal = 0;
      let ratingCount = 0;
      
      snapshot.forEach(childSnapshot => {
        const data = childSnapshot.val();
        if (data && typeof data.rating === 'number') {
          ratingTotal += data.rating;
          ratingCount++;
        }
      });
      
      const wodRef = db.ref(`/wods/${wodKey}`);
      await wodRef.update({
        ratingTotal,
        ratingCount
      });
      
      logger.info(`Aggiornata media valutazioni per WOD ${wodKey}: total=${ratingTotal}, count=${ratingCount}`);
    } catch (error) {
      logger.error(`Errore nell'aggiornamento della media valutazioni per WOD ${wodKey}:`, error);
    }
  });

// --------------------------------------------------
// TRIGGER: INVIO NOTIFICHE ALLA CREAZIONE DI UN WOD
// --------------------------------------------------
export const onWodCreated = functions.database.ref('/wods/{wodKey}')
  .onCreate(async (snapshot, context) => {
    const wod = snapshot.val();
    if (!wod) {
      logger.info("Nessun dato WOD trovato per la chiave:", context.params.wodKey);
      return;
    }

    const wodName = wod.name || "Nuovo WOD";
    const wodType = wod.type ? ` [${wod.type}]` : "";
    const title = `Nuovo WOD Aggiunto! 🏋️‍♂️`;
    const body = `Vieni ad allenarti! È stato pubblicato: ${wodName}${wodType}`;

    logger.info(`Inizio invio notifiche push per il WOD: ${wodName}`);

    try {
      const db = getDatabase();

      // 1. Recuperiamo tutti gli utenti abilitati (enabled === true)
      const userProfileSnap = await db.ref('userProfile').once('value');
      if (!userProfileSnap.exists()) {
        logger.info("Nessun profilo utente trovato nel database.");
        return;
      }

      const enabledUserIds: string[] = [];
      userProfileSnap.forEach(child => {
        const profile = child.val();
        if (profile && profile.enabled === true) {
          enabledUserIds.push(child.key!);
        }
      });

      if (enabledUserIds.length === 0) {
        logger.info("Nessun utente abilitato a cui inviare notifiche.");
        return;
      }

      logger.info(`Trovati ${enabledUserIds.length} utenti abilitati. Ricerca token FCM...`);

      // 2. Raccogliamo tutti i token FCM registrati per gli utenti abilitati
      const tokens: string[] = [];
      for (const uid of enabledUserIds) {
        const tokensSnap = await db.ref(`fcmTokens/${uid}`).once('value');
        if (tokensSnap.exists()) {
          tokensSnap.forEach(tokenChild => {
            const tokenData = tokenChild.val();
            if (tokenData && tokenData.token) {
              tokens.push(tokenData.token);
            }
          });
        }
      }

      if (tokens.length === 0) {
        logger.info("Nessun token FCM registrato per gli utenti abilitati.");
        return;
      }

      const uniqueTokens = Array.from(new Set(tokens));
      logger.info(`Rilevati ${uniqueTokens.length} token FCM unici. Invio multicast...`);

      // 3. Invio della notifica tramite FCM
      const response = await getMessaging().sendEachForMulticast({
        tokens: uniqueTokens,
        notification: {
          title: title,
          body: body
        },
        android: {
          notification: {
            sound: 'default',
            clickAction: 'FCM_PLUGIN_ACTIVITY'
          }
        },
        apns: {
          payload: {
            aps: {
              sound: 'default'
            }
          }
        }
      });

      logger.info(`Invio notifiche completato: ${response.successCount} riuscite, ${response.failureCount} fallite.`);
      
      if (response.failureCount > 0) {
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            logger.warn(`Errore invio a token ${uniqueTokens[idx]}:`, resp.error);
          }
        });
      }

    } catch (error) {
      logger.error("Errore generico durante l'invio delle notifiche push per il WOD:", error);
    }
  });
