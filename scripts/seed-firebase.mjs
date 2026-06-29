import fs from 'node:fs';
import path from 'node:path';
import admin from 'firebase-admin';

const root = process.cwd();
const force = process.argv.includes('--force');

function readJson(relativePath, fallback) {
  const filePath = path.join(root, relativePath);
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function initializeFirebase() {
  if (admin.apps.length) return admin.apps[0];

  const projectId = process.env.POLI_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT;
  const serviceAccount = process.env.POLI_FIREBASE_SERVICE_ACCOUNT_KEY || process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (serviceAccount) {
    return admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(serviceAccount)),
      projectId,
      storageBucket: process.env.POLI_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
    });
  }

  return admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId,
    storageBucket: process.env.POLI_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
  });
}

function stripSource(data) {
  if (!data || typeof data !== 'object') return data;
  const next = { ...data };
  delete next._source;
  return next;
}

const app = initializeFirebase();
const db = admin.firestore(app);

// Safety check: refuse to overwrite existing live data without --force
if (!force) {
  const existing = await db.collection('site_config').doc('content').get();
  if (existing.exists) {
    console.error('❌ site_config/content already exists in Firestore.');
    console.error('   This script does a full REPLACE and will destroy any admin edits.');
    console.error('   Re-run with --force if you are sure you want to overwrite live data.');
    process.exit(1);
  }
}

const content = stripSource(readJson('data/content.json', {}));
const settings = stripSource(readJson('data/settings.json', {}));
const applications = readJson('data/applications.json', []);

await db.collection('site_config').doc('content').set(content, { merge: false });
await db.collection('site_config').doc('settings').set(settings, { merge: false });

for (const application of applications) {
  if (!application?.id) continue;
  await db.collection('applications').doc(String(application.id)).set(application, { merge: false });
}

console.log('Seeded Firestore: site_config/content, site_config/settings, and sample applications.');
