import admin from 'firebase-admin';
function initialize() {
    if (admin.apps.length) return admin.apps[0];
    const sa = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (sa) {
        return admin.initializeApp({
            credential: admin.credential.cert(JSON.parse(sa)),
            projectId: process.env.POLI_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || 'thepolibrandagency-d4263',
        });
    }
    return admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: process.env.POLI_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || 'thepolibrandagency-d4263',
    });
}

async function run() {
    try {
        const app = initialize();
        const auth = admin.auth(app);
        const uid = process.argv[2] || process.env.ADMIN_UID;

        if (!uid) {
            throw new Error('Missing admin UID. Usage: node scripts/set-admin.mjs <firebase-auth-uid>');
        }
        
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
