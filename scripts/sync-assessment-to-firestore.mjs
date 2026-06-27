import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load env vars
const envPath = path.join(__dirname, '../.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local not found');
  process.exit(1);
}

const env = {};
fs.readFileSync(envPath, 'utf-8').split('\n').forEach(line => {
  const [key, ...value] = line.split('=');
  if (key && !key.startsWith('#')) {
    env[key.trim()] = value.join('=').trim();
  }
});

// Initialize Firebase Admin
try {
  const serviceAccount = {
    type: env.FIREBASE_TYPE,
    project_id: env.FIREBASE_PROJECT_ID,
    private_key_id: env.FIREBASE_PRIVATE_KEY_ID,
    private_key: env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: env.FIREBASE_CLIENT_EMAIL,
    client_id: env.FIREBASE_CLIENT_ID,
    auth_uri: env.FIREBASE_AUTH_URI,
    token_uri: env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: env.FIREBASE_CLIENT_X509_CERT_URL,
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  const db = admin.firestore();
  const contentPath = path.join(__dirname, '../data/content.json');
  const content = JSON.parse(fs.readFileSync(contentPath, 'utf-8'));

  // Update Firestore
  await db.collection('config').doc('content').set(content, { merge: true });

  console.log('✅ Successfully synced assessment to Firestore!');
  console.log(`   Assessment now has ${content.pages.assessment.categories.length} categories`);
  content.pages.assessment.categories.forEach((cat, i) => {
    console.log(`   ${i + 1}. ${cat.label}`);
  });

  process.exit(0);
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
