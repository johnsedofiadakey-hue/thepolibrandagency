import { getAuth } from 'firebase-admin/auth';
import { initializeApp, cert, applicationDefault, getApps } from 'firebase-admin/app';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function initialize() {
    if (getApps().length) return getApps()[0];
    const sa = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (sa) {
        return initializeApp({
            credential: cert(JSON.parse(sa)),
            projectId: process.env.FIREBASE_PROJECT_ID || 'thepolibrandagency-d4263',
        });
    }
    return initializeApp({
        credential: applicationDefault(),
        projectId: process.env.FIREBASE_PROJECT_ID || 'thepolibrandagency-d4263',
    });
}

async function run() {
    try {
        const app = initialize();
        const auth = getAuth(app);
        const uid = '0SABdqN228PRSifaimo0Anb3S2b2';
        
        // Fetch user first to make sure they exist
        const user = await auth.getUser(uid);
        console.log(`Found user: ${user.email}`);

        // Set the admin claim
        await auth.setCustomUserClaims(uid, { admin: true });
        console.log(`Successfully set { admin: true } claim for user ${uid} (${user.email})`);
        
        process.exit(0);
    } catch (e) {
        console.error('Error setting admin claim:', e);
        process.exit(1);
    }
}

run();
