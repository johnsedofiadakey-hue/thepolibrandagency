// One-shot script: patches Firestore content doc with Book Now labels + updated success message
// Run: node scripts/patch-content-cta.mjs

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// Load env
const envPath = resolve(root, '.env');
const envRaw = readFileSync(envPath, 'utf8');
// Simple line-by-line parse; do NOT unescape \n — JSON.parse handles its own escape sequences
for (const line of envRaw.split('\n')) {
    const eq = line.indexOf('=');
    if (eq === -1 || line.startsWith('#')) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    // Strip surrounding single or double quotes (but not JSON braces)
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
    }
    if (key) process.env[key] = val;
}

const keyRaw = process.env.POLI_FIREBASE_SERVICE_ACCOUNT_KEY || process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
if (!keyRaw) { console.error('No service account key found in env'); process.exit(1); }
const serviceAccount = JSON.parse(keyRaw);

if (!getApps().length) {
    initializeApp({ credential: cert(serviceAccount) });
}
const db = getFirestore();

const snap = await db.collection('site_config').doc('content').get();
if (!snap.exists) { console.error('No content doc found in Firestore'); process.exit(1); }

const data = snap.data();

// Patch the fields
const patches = {
    'navbar.cta.label': 'Book Now',
    'pages.home.cta.apply': 'Book Now',
    'pages.services.cta.apply': 'Book Now',
    'pages.programs.bootcamp.cta': 'Book Now →',
    'pages.programs.fellowship.cta_apply': 'Book Now',
    'pages.apply.form.success.title': 'Booking Confirmed',
    'pages.apply.form.success.text': 'Thank you, {name}. Your booking is confirmed — we will give you a call shortly to discuss your {program} journey and how we can amplify your political brand.',
};

function setDeep(obj, path, value) {
    const keys = path.split('.');
    let cur = obj;
    for (let i = 0; i < keys.length - 1; i++) {
        if (!cur[keys[i]] || typeof cur[keys[i]] !== 'object') cur[keys[i]] = {};
        cur = cur[keys[i]];
    }
    cur[keys[keys.length - 1]] = value;
}

const updated = JSON.parse(JSON.stringify(data));
for (const [path, value] of Object.entries(patches)) {
    setDeep(updated, path, value);
    console.log(`  ✓ ${path} → "${value}"`);
}

await db.collection('site_config').doc('content').set(updated, { merge: false });
console.log('\nFirestore content updated successfully.');
process.exit(0);
