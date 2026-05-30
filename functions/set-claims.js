const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getDatabase } = require('firebase-admin/database');
const fs = require('fs');
const path = require('path');

const serviceAccountPath = path.join(__dirname, 'service-account.json');
let options = {
  projectId: "m1crossfit-5b2b9",
  databaseURL: "https://m1crossfit-5b2b9.firebaseio.com"
};

if (fs.existsSync(serviceAccountPath)) {
  console.log('Loading local service-account.json...');
  options.credential = cert(require(serviceAccountPath));
} else {
  console.log('Using Application Default Credentials...');
}

// Initialize Firebase Admin SDK
initializeApp(options);

const email = process.argv[2];
const role = process.argv[3];
const enabledStr = process.argv[4];

if (!email || !role || !enabledStr) {
  console.error('Usage: node set-claims.js <email> <role> <enabled>');
  console.error('Example: node set-claims.js damicogiuseppe77@gmail.com editor true');
  process.exit(1);
}

if (role !== 'editor' && role !== 'user') {
  console.error('Error: Role must be "editor" or "user".');
  process.exit(1);
}

const enabled = enabledStr === 'true';

async function setClaims() {
  try {
    console.log(`Searching for user with email: ${email}...`);
    const userRecord = await getAuth().getUserByEmail(email);
    const uid = userRecord.uid;

    console.log(`Found user: ${uid}. Setting claims: { role: "${role}", enabled: ${enabled} }...`);
    await getAuth().setCustomUserClaims(uid, { role, enabled });

    console.log(`Updating database profile in userProfile/${uid}...`);
    const db = getDatabase();
    const userRef = db.ref(`userProfile/${uid}`);
    
    // Controlla se il profilo esiste già; in caso contrario, ne inizializziamo uno di base
    const snapshot = await userRef.once('value');
    if (snapshot.exists()) {
      await userRef.update({ role, enabled });
    } else {
      await userRef.set({
        key: uid,
        email: email,
        firstName: userRecord.displayName ? userRecord.displayName.split(' ')[0] : '',
        lastName: userRecord.displayName ? userRecord.displayName.split(' ').slice(1).join(' ') : '',
        role: role,
        enabled: enabled,
        birthDate: '',
        phoneNumber: userRecord.phoneNumber || '',
        userName: email.split('@')[0],
        weight: null,
        height: null,
        gender: '',
        featuredPrs: [],
        photoUrl: userRecord.photoURL || ''
      });
    }

    console.log(`\x1b[32mSuccess! Custom claims and database profile successfully updated for ${email} (${uid})\x1b[0m`);
    process.exit(0);
  } catch (error) {
    console.error('\x1b[31mError during operation:\x1b[0m', error);
    process.exit(1);
  }
}

setClaims();
