const { initializeApp, cert } = require('firebase-admin/app');
const { getDatabase } = require('firebase-admin/database');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');
const path = require('path');

const serviceAccountPath = path.join(__dirname, 'service-account.json');
let options = {
  projectId: "m1crossfit-5b2b9",
  databaseURL: "https://m1crossfit-5b2b9.firebaseio.com"
};

if (fs.existsSync(serviceAccountPath)) {
  console.log('Caricamento delle credenziali da service-account.json...');
  options.credential = cert(require(serviceAccountPath));
} else {
  console.log('Nessun file service-account.json trovato. Uso delle credenziali predefinite di gcloud/firebase...');
}

// Se il database '(default)' è in modalità Datastore, puoi creare un database con nome
// (ad esempio 'wodlog-db') in modalità Firestore Native ed inserire qui l'ID del database.
// Imposta null o stringa vuota per usare il database '(default)'.
const FIRESTORE_DATABASE_ID = 'wodlog-db';

// Inizializza l'SDK Admin di Firebase
initializeApp(options);

const rdb = getDatabase();
const firestore = FIRESTORE_DATABASE_ID ? getFirestore(FIRESTORE_DATABASE_ID) : getFirestore();

async function migrate() {
  console.log("--- INIZIO MIGRAZIONE DA REALTIME DATABASE A CLOUD FIRESTORE ---");
  
  // 1. Migrazione userProfile -> users (Collezione radice)
  console.log("\n1. Migrazione degli utenti in corso...");
  const usersSnapshot = await rdb.ref('userProfile').once('value');
  if (usersSnapshot.exists()) {
    const usersData = usersSnapshot.val();
    for (const [uid, user] of Object.entries(usersData)) {
      await firestore.collection('users').doc(uid).set(user);
      console.log(`   [OK] Utente migrato: ${user.email || uid}`);
    }
  } else {
    console.log("   Nessun utente trovato nel Realtime Database.");
  }

  // 2. Migrazione activities -> users/$uid/activities (Sotto-collezione)
  console.log("\n2. Migrazione delle attività degli atleti...");
  const activitiesSnapshot = await rdb.ref('activities').once('value');
  if (activitiesSnapshot.exists()) {
    const activitiesData = activitiesSnapshot.val();
    for (const [uid, userActivities] of Object.entries(activitiesData)) {
      for (const [activityId, activity] of Object.entries(userActivities)) {
        await firestore.collection('users').doc(uid).collection('activities').doc(activityId).set(activity);
      }
      console.log(`   [OK] Attività migrate per l'utente UID: ${uid}`);
    }
  } else {
    console.log("   Nessuna attività trovata nel Realtime Database.");
  }

  // 3. Migrazione wods -> wods (Collezione radice)
  console.log("\n3. Migrazione dei WOD...");
  const wodsSnapshot = await rdb.ref('wods').once('value');
  if (wodsSnapshot.exists()) {
    const wodsData = wodsSnapshot.val();
    for (const [wodId, wod] of Object.entries(wodsData)) {
      await firestore.collection('wods').doc(wodId).set(wod);
    }
    console.log("   [OK] Tutti i WOD sono stati migrati con successo.");
  } else {
    console.log("   Nessun WOD trovato nel Realtime Database.");
  }

  // 4. Migrazione results -> results (Collezione radice per query globali di statistiche)
  console.log("\n4. Migrazione dei risultati/PR...");
  const resultsSnapshot = await rdb.ref('results').once('value');
  if (resultsSnapshot.exists()) {
    const resultsData = resultsSnapshot.val();
    for (const [resultId, result] of Object.entries(resultsData)) {
      await firestore.collection('results').doc(resultId).set(result);
    }
    console.log("   [OK] Tutti i risultati sono stati migrati con successo.");
  } else {
    console.log("   Nessun risultato trovato nel Realtime Database.");
  }

  // 5. Migrazione notifications -> notifications (Collezione radice)
  console.log("\n5. Migrazione delle notifiche...");
  const notificationsSnapshot = await rdb.ref('notifications').once('value');
  if (notificationsSnapshot.exists()) {
    const notificationsData = notificationsSnapshot.val();
    for (const [notifId, notif] of Object.entries(notificationsData)) {
      await firestore.collection('notifications').doc(notifId).set(notif);
    }
    console.log("   [OK] Tutte le notifiche sono state migrate con successo.");
  } else {
    console.log("   Nessuna notifica trovata nel Realtime Database.");
  }

  console.log("\n--- MIGRAZIONE COMPLETATA CON SUCCESSO! ---");
  process.exit(0);
}

migrate().catch(err => {
  console.error("\n[ERRORE] Migrazione fallita:", err);
  process.exit(1);
});
