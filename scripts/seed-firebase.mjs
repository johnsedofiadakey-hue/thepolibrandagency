import fs from 'node:fs';
import path from 'node:path';
import { cert, getApps, initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const root = process.cwd();

function readJson(relativePath, fallback) {
  const filePath = path.join(root, relativePath);
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function initializeFirebase() {
  if (getApps().length) return getApps()[0];

  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT;
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (serviceAccount) {
    return initializeApp({
      credential: cert(JSON.parse(serviceAccount)),
      projectId,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
  }

  return initializeApp({
    credential: applicationDefault(),
    projectId,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

function stripSource(data) {
  if (!data || typeof data !== 'object') return data;
  const next = { ...data };
  delete next._source;
  return next;
}

const app = initializeFirebase();
const db = getFirestore(app);

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
