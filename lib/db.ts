/**
 * Firebase-backed data access layer.
 * - Production uses Firebase Admin SDK with Firestore and Storage.
 * - Local development can fall back to checked-in JSON files when Firebase credentials are absent.
 */

import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';
import { createRequire } from 'module';

// @ts-ignore
import localContent from '../data/content.json';
// @ts-ignore
import localSettings from '../data/settings.json';
// @ts-ignore
import localApps from '../data/applications.json';

const CONFIG_COLLECTION = 'site_config';
const CONTENT_DOC = 'content';
const SETTINGS_DOC = 'settings';
const APPLICATIONS_COLLECTION = 'applications';
const SUBSCRIBERS_COLLECTION = 'subscribers';
const DISCUSSIONS_COLLECTION = 'portal_discussions';
const PROGRESS_COLLECTION = 'portal_progress';
const DEFAULT_FIREBASE_PROJECT_ID = 'thepolibrandagency-d4263';
const DEFAULT_FIREBASE_STORAGE_BUCKET = `${DEFAULT_FIREBASE_PROJECT_ID}.firebasestorage.app`;
const nodeRequire = createRequire(import.meta.url);
let lastFirebaseAdminError: string | null = null;

function firebaseAdminModule(): any {
    return nodeRequire('firebase-admin');
}

const localContentPath = path.join(process.cwd(), 'data', 'content.json');
const localSettingsPath = path.join(process.cwd(), 'data', 'settings.json');
const localAppsPath = path.join(process.cwd(), 'data', 'applications.json');
const localSubscribersPath = path.join(process.cwd(), 'data', 'subscribers.json');
const localDiscussionsPath = path.join(process.cwd(), 'data', 'discussions.json');
const localProgressPath = path.join(process.cwd(), 'data', 'fellow_progress.json');
const METADATA_TOKEN_URL = 'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token';

function getFirebaseRuntimeConfig(): Record<string, string> {
    try {
        return process.env.FIREBASE_CONFIG ? JSON.parse(process.env.FIREBASE_CONFIG) : {};
    } catch {
        return {};
    }
}

export function describePersistenceError(error: unknown, resource = 'Firebase'): string {
    const message = error instanceof Error ? error.message : String(error || '');
    const code = typeof error === 'object' && error && 'code' in error ? String((error as { code?: unknown }).code) : '';

    if (message.includes('Firebase Admin is not configured')) {
        return `${resource} is not configured. Set Firebase Admin environment variables before saving from the admin portal.`;
    }

    if (code === '5' || message.includes('5 NOT_FOUND')) {
        return `${resource} is not initialized for this Firebase project. Create the Firestore database and seed it before saving admin changes.`;
    }

    if (message.toLowerCase().includes('bucket') || message.toLowerCase().includes('storage')) {
        return `${resource} storage is not initialized. Enable Firebase Storage before uploading images.`;
    }

    return message || `${resource} operation failed.`;
}

function stripInternalSource<T extends Record<string, unknown>>(data: T): T {
    const next = { ...data };
    delete next._source;
    return next;
}

function getFirebaseProjectId(): string | undefined {
    const runtimeConfig = getFirebaseRuntimeConfig();
    return process.env.POLI_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT || runtimeConfig.projectId || DEFAULT_FIREBASE_PROJECT_ID;
}

function getFirebaseStorageBucket(): string | undefined {
    const runtimeConfig = getFirebaseRuntimeConfig();
    return process.env.POLI_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET || runtimeConfig.storageBucket || DEFAULT_FIREBASE_STORAGE_BUCKET;
}

function hasFirebaseConfig(): boolean {
    return !!(
        getFirebaseProjectId() ||
        process.env.FIREBASE_SERVICE_ACCOUNT_KEY ||
        process.env.GOOGLE_APPLICATION_CREDENTIALS ||
        process.env.FIREBASE_CONFIG ||
        process.env.K_SERVICE
    );
}

function initializeFirebaseApp() {
    const admin = firebaseAdminModule();
    if (admin.apps.length) return admin.apps[0];

    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    const storageBucket = getFirebaseStorageBucket();

    if (serviceAccount) {
        return admin.initializeApp({
            credential: admin.credential.cert(JSON.parse(serviceAccount)),
            storageBucket,
            projectId: getFirebaseProjectId(),
        });
    }

    const projectId = getFirebaseProjectId();
    const config: Record<string, string> = {};
    if (storageBucket) config.storageBucket = storageBucket;
    if (projectId) config.projectId = projectId;

    return admin.initializeApp(Object.keys(config).length ? config : undefined);
}

export function getFirebaseAdmin() {
    if (!hasFirebaseConfig()) return null;
    try {
        const admin = firebaseAdminModule();
        const app = initializeFirebaseApp();
        let bucket = null;
        try {
            bucket = admin.storage(app).bucket(getFirebaseStorageBucket());
        } catch (error) {
            console.error('Firebase Storage initialization failed:', error);
        }
        lastFirebaseAdminError = null;
        return {
            app,
            auth: admin.auth(app),
            db: admin.firestore(app),
            bucket,
        };
    } catch (error) {
        console.error('Firebase Admin initialization failed:', error);
        lastFirebaseAdminError = error instanceof Error ? error.message : String(error || 'Unknown Firebase Admin initialization failure');
        return null;
    }
}

export async function verifyFirebaseIdToken(idToken: string) {
    const firebase = getFirebaseAdmin();
    if (firebase) {
        try {
            return await firebase.auth.verifyIdToken(idToken);
        } catch (error) {
            console.error('Firebase Admin token verification failed; trying Identity Toolkit:', error);
        }
    }

    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey) {
        throw new Error('Firebase web API key is not configured.');
    }

    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error(`Firebase token verification failed with ${response.status}.`);
    }

    const data = await response.json() as {
        users?: Array<{
            localId?: string;
            email?: string;
            emailVerified?: boolean;
            customAttributes?: string;
        }>;
    };
    const user = data.users?.[0];
    if (!user?.localId || !user.email) {
        throw new Error('Firebase token did not resolve to a user.');
    }

    let claims: Record<string, unknown> = {};
    try {
        claims = user.customAttributes ? JSON.parse(user.customAttributes) : {};
    } catch {
        claims = {};
    }

    return {
        uid: user.localId,
        email: user.email,
        email_verified: !!user.emailVerified,
        ...claims,
    };
}

function requireFirebaseAdmin() {
    const firebase = getFirebaseAdmin();
    if (!firebase) {
        throw new Error('Firebase Admin is not configured. Set Firebase project/service account environment variables.');
    }
    return firebase;
}

function readJsonFile<T>(filePath: string, fallback: T): T {
    try {
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
        }
    } catch (error) {
        console.error(`Failed to read ${filePath}:`, error);
    }
    return fallback;
}

function writeLocalDevJson(filePath: string, data: unknown) {
    if (process.env.NODE_ENV === 'production') return;
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error(`Failed to write ${filePath}:`, error);
    }
}

function firestoreRestDocUrl(collection: string, doc: string): string {
    const projectId = getFirebaseProjectId();
    return `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collection}/${doc}`;
}

async function getGoogleAccessToken(): Promise<string | null> {
    if (!process.env.K_SERVICE && !process.env.FIREBASE_CONFIG) return null;

    try {
        const response = await fetch(METADATA_TOKEN_URL, {
            headers: { 'Metadata-Flavor': 'Google' },
            cache: 'no-store',
        });
        if (!response.ok) throw new Error(`Metadata token request failed with ${response.status}`);
        const data = await response.json() as { access_token?: string };
        return data.access_token || null;
    } catch (error) {
        console.error('Failed to get Google metadata access token:', error);
        return null;
    }
}

async function getFirestoreRestJson(collection: string, doc: string): Promise<Record<string, unknown> | null> {
    const token = await getGoogleAccessToken();
    if (!token) return null;

    const response = await fetch(firestoreRestDocUrl(collection, doc), {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
    });

    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`Firestore REST read failed with ${response.status}: ${await response.text()}`);

    const data = await response.json() as { fields?: { json?: { stringValue?: string } } };
    const json = data.fields?.json?.stringValue;
    return json ? JSON.parse(json) as Record<string, unknown> : null;
}

async function setFirestoreRestJson(collection: string, doc: string, data: Record<string, unknown>): Promise<void> {
    const token = await getGoogleAccessToken();
    if (!token) throw new Error('Firestore REST is not configured in this runtime.');

    const response = await fetch(firestoreRestDocUrl(collection, doc), {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            fields: {
                json: { stringValue: JSON.stringify(data) },
                updatedAt: { timestampValue: new Date().toISOString() },
            },
        }),
        cache: 'no-store',
    });

    if (!response.ok) throw new Error(`Firestore REST write failed with ${response.status}: ${await response.text()}`);
}

function getFirestoreRestDocumentId(documentName = ''): string {
    return documentName.split('/').pop() || '';
}

async function getFirestoreRestCollectionJson(collection: string): Promise<Array<Record<string, unknown>>> {
    const token = await getGoogleAccessToken();
    const projectId = getFirebaseProjectId();
    if (!token || !projectId) return [];

    const response = await fetch(`https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collection}?pageSize=100`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
    });

    if (response.status === 404) return [];
    if (!response.ok) throw new Error(`Firestore REST collection read failed with ${response.status}: ${await response.text()}`);

    const data = await response.json() as { documents?: Array<{ name?: string; fields?: { json?: { stringValue?: string } } }> };
    return (data.documents || [])
        .map((doc) => {
            const json = doc.fields?.json?.stringValue;
            if (!json) return null;
            const parsed = JSON.parse(json) as Record<string, unknown>;
            return { id: parsed.id || getFirestoreRestDocumentId(doc.name), ...parsed };
        })
        .filter(Boolean) as Array<Record<string, unknown>>;
}

async function storageBucketExistsRest(): Promise<boolean> {
    const token = await getGoogleAccessToken();
    const bucket = getFirebaseStorageBucket();
    if (!token || !bucket) return false;

    const response = await fetch(`https://storage.googleapis.com/storage/v1/b/${bucket}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
    });
    if (response.status === 404) return false;
    if (!response.ok) throw new Error(`Firebase Storage REST check failed with ${response.status}: ${await response.text()}`);
    return true;
}

async function uploadImageToStorageRest(file: File): Promise<string> {
    const token = await getGoogleAccessToken();
    const bucket = getFirebaseStorageBucket();
    if (!token || !bucket) throw new Error('Firebase Storage REST is not configured in this runtime.');

    const safeName = file.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
    const filename = `uploads/${Date.now()}_${safeName}`;
    const downloadToken = randomUUID();
    const boundary = `poli_${randomUUID()}`;
    const metadata = JSON.stringify({
        name: filename,
        contentType: file.type,
        metadata: {
            firebaseStorageDownloadTokens: downloadToken,
        },
    });
    const buffer = Buffer.from(await file.arrayBuffer());
    const body = Buffer.concat([
        Buffer.from(`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n`),
        Buffer.from(`--${boundary}\r\nContent-Type: ${file.type}\r\n\r\n`),
        buffer,
        Buffer.from(`\r\n--${boundary}--`),
    ]);

    const response = await fetch(`https://storage.googleapis.com/upload/storage/v1/b/${bucket}/o?uploadType=multipart`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': `multipart/related; boundary=${boundary}`,
            'Content-Length': String(body.length),
        },
        body,
    });

    if (!response.ok) throw new Error(`Firebase Storage REST upload failed with ${response.status}: ${await response.text()}`);

    return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(filename)}?alt=media&token=${downloadToken}`;
}

export async function getContent(): Promise<Record<string, unknown>> {
    try {
        const firebase = getFirebaseAdmin();
        if (firebase) {
            const snap = await firebase.db.collection(CONFIG_COLLECTION).doc(CONTENT_DOC).get();
            if (snap.exists) return { ...(snap.data() as Record<string, unknown>), _source: 'firebase' };
        }
    } catch (error) {
        console.error('Firebase getContent error:', error);
    }

    try {
        const data = await getFirestoreRestJson(CONFIG_COLLECTION, CONTENT_DOC);
        if (data) return { ...data, _source: 'firestore_rest' };
    } catch (error) {
        console.error('Firestore REST getContent error:', error);
    }

    const data = readJsonFile<Record<string, unknown>>(localContentPath, localContent as Record<string, unknown>);
    return { ...data, _source: fs.existsSync(localContentPath) ? 'local_disk' : 'local_fallback' };
}

export async function setContent(data: Record<string, unknown>): Promise<void> {
    const cleanData = stripInternalSource(data);

    try {
        const firebase = requireFirebaseAdmin();
        await firebase.db.collection(CONFIG_COLLECTION).doc(CONTENT_DOC).set(cleanData, { merge: false });
    } catch (error) {
        try {
            await setFirestoreRestJson(CONFIG_COLLECTION, CONTENT_DOC, cleanData);
            return;
        } catch (restError) {
            console.error('Firestore REST setContent error:', restError);
        }
        if (process.env.NODE_ENV === 'production') throw error;
        console.error('Firebase setContent error; using local dev fallback:', error);
        writeLocalDevJson(localContentPath, cleanData);
    }
}

export async function getPersistenceHealth() {
    const firebase = getFirebaseAdmin();
    const health = {
        firebaseAdminConfigured: !!firebase,
        firestoreConfigured: false,
        storageConfigured: false,
        contentSource: 'unknown',
        settingsSource: 'unknown',
        contentWritable: false,
        settingsWritable: false,
        storageWritable: false,
        errors: [] as string[],
        diagnostics: {
            projectIdConfigured: !!getFirebaseProjectId(),
            serviceAccountConfigured: !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
            googleCredentialsConfigured: !!process.env.GOOGLE_APPLICATION_CREDENTIALS,
            firebaseConfigConfigured: !!process.env.FIREBASE_CONFIG,
            functionRuntimeDetected: !!process.env.K_SERVICE,
            adminInitError: lastFirebaseAdminError,
        },
    };

    if (!firebase) {
        health.errors.push('Firebase Admin is not configured in this runtime.');
        const [content, settings] = await Promise.all([getContent(), getSettings()]);
        health.contentSource = String((content as { _source?: string })._source || 'unknown');
        health.settingsSource = String((settings as { _source?: string })._source || 'unknown');
        health.firestoreConfigured = health.contentSource === 'firestore_rest' || health.settingsSource === 'firestore_rest';
        try {
            await setFirestoreRestJson(CONFIG_COLLECTION, '__healthcheck', { checkedAt: new Date().toISOString() });
            health.contentWritable = true;
            health.settingsWritable = true;
            health.firestoreConfigured = true;
        } catch (error) {
            health.errors.push(describePersistenceError(error, 'Firestore REST'));
        }
        try {
            const exists = await storageBucketExistsRest();
            health.storageConfigured = exists;
            health.storageWritable = exists;
        } catch (error) {
            health.errors.push(describePersistenceError(error, 'Firebase Storage REST'));
        }
        return health;
    }

    try {
        const content = await getContent();
        health.contentSource = String((content as { _source?: string })._source || 'unknown');
        health.firestoreConfigured = health.contentSource === 'firebase';
    } catch (error) {
        health.errors.push(describePersistenceError(error, 'Firestore content'));
    }

    try {
        const settings = await getSettings();
        health.settingsSource = String((settings as { _source?: string })._source || 'unknown');
        health.firestoreConfigured = health.firestoreConfigured || health.settingsSource === 'firebase';
    } catch (error) {
        health.errors.push(describePersistenceError(error, 'Firestore settings'));
    }

    try {
        await firebase.db.collection(CONFIG_COLLECTION).doc('__healthcheck').set(
            { checkedAt: new Date().toISOString() },
            { merge: true }
        );
        health.contentWritable = true;
        health.settingsWritable = true;
        health.firestoreConfigured = true;
    } catch (error) {
        health.errors.push(describePersistenceError(error, 'Firestore'));
    }

    try {
        if (!firebase.bucket) {
            throw new Error('Firebase Storage bucket is not configured.');
        }
        await firebase.bucket.exists();
        health.storageConfigured = true;
        health.storageWritable = true;
    } catch (error) {
        try {
            const exists = await storageBucketExistsRest();
            health.storageConfigured = exists;
            health.storageWritable = exists;
        } catch (restError) {
            health.errors.push(describePersistenceError(restError, 'Firebase Storage REST'));
        }
        if (!health.storageConfigured) {
            health.errors.push(describePersistenceError(error, 'Firebase Storage'));
        }
    }

    return health;
}

export interface ThemeSettings {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    heroImage: string;
    logo: string;
}

export interface SiteSettings {
    theme: ThemeSettings;
    typography: string;
}

export async function getSettings(): Promise<SiteSettings & { _source?: string }> {
    try {
        const firebase = getFirebaseAdmin();
        if (firebase) {
            const snap = await firebase.db.collection(CONFIG_COLLECTION).doc(SETTINGS_DOC).get();
            if (snap.exists) return { ...(snap.data() as SiteSettings), _source: 'firebase' };
        }
    } catch (error) {
        console.error('Firebase getSettings error:', error);
    }

    try {
        const data = await getFirestoreRestJson(CONFIG_COLLECTION, SETTINGS_DOC);
        if (data) return { ...(data as unknown as SiteSettings), _source: 'firestore_rest' };
    } catch (error) {
        console.error('Firestore REST getSettings error:', error);
    }

    const data = readJsonFile<SiteSettings>(localSettingsPath, localSettings as SiteSettings);
    return { ...data, _source: fs.existsSync(localSettingsPath) ? 'local_disk' : 'local_fallback' };
}

export async function setSettings(data: SiteSettings): Promise<void> {
    const cleanData = stripInternalSource(data as unknown as Record<string, unknown>) as unknown as SiteSettings;

    try {
        const firebase = requireFirebaseAdmin();
        await firebase.db.collection(CONFIG_COLLECTION).doc(SETTINGS_DOC).set(cleanData, { merge: false });
    } catch (error) {
        try {
            await setFirestoreRestJson(CONFIG_COLLECTION, SETTINGS_DOC, cleanData as unknown as Record<string, unknown>);
            return;
        } catch (restError) {
            console.error('Firestore REST setSettings error:', restError);
        }
        if (process.env.NODE_ENV === 'production') throw error;
        console.error('Firebase setSettings error; using local dev fallback:', error);
        writeLocalDevJson(localSettingsPath, cleanData);
    }
}

export async function getApplications(): Promise<any[]> {
    try {
        const firebase = getFirebaseAdmin();
        if (firebase) {
            const snap = await firebase.db.collection(APPLICATIONS_COLLECTION).orderBy('timestamp', 'desc').get();
            return snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
        }
    } catch (error) {
        console.error('Firebase getApplications error:', error);
    }

    try {
        const applications = await getFirestoreRestCollectionJson(APPLICATIONS_COLLECTION);
        if (applications.length) {
            return applications.sort((a, b) => String(b.timestamp || '').localeCompare(String(a.timestamp || '')));
        }
    } catch (error) {
        console.error('Firestore REST getApplications error:', error);
    }

    return readJsonFile<any[]>(localAppsPath, localApps || []);
}

export async function createApplication(application: Record<string, unknown>): Promise<void> {
    try {
        const firebase = requireFirebaseAdmin();
        const id = String(application.id || Date.now());
        await firebase.db.collection(APPLICATIONS_COLLECTION).doc(id).set(application, { merge: false });
    } catch (error) {
        try {
            const id = String(application.id || Date.now());
            await setFirestoreRestJson(APPLICATIONS_COLLECTION, id, { ...application, id });
            return;
        } catch (restError) {
            console.error('Firestore REST createApplication error:', restError);
        }
        if (process.env.NODE_ENV === 'production') throw error;
        console.error('Firebase createApplication error; using local dev fallback:', error);
        const apps = readJsonFile<any[]>(localAppsPath, []);
        apps.unshift(application);
        writeLocalDevJson(localAppsPath, apps);
    }
}

export async function updateApplicationStatus(id: string | number, status: string): Promise<boolean> {
    try {
        const firebase = requireFirebaseAdmin();
        await firebase.db.collection(APPLICATIONS_COLLECTION).doc(String(id)).set({ status }, { merge: true });
        return true;
    } catch (error) {
        try {
            const existing = await getFirestoreRestJson(APPLICATIONS_COLLECTION, String(id));
            if (!existing) return false;
            await setFirestoreRestJson(APPLICATIONS_COLLECTION, String(id), { ...existing, id: String(id), status });
            return true;
        } catch (restError) {
            console.error('Firestore REST updateApplicationStatus error:', restError);
        }
        if (process.env.NODE_ENV === 'production') throw error;
        console.error('Firebase updateApplicationStatus error; using local dev fallback:', error);
        const apps = readJsonFile<any[]>(localAppsPath, []);
        const index = apps.findIndex((app) => Number(app.id) === Number(id));
        if (index === -1) return false;
        apps[index].status = status;
        writeLocalDevJson(localAppsPath, apps);
        return true;
    }
}

export async function createSubscriber(subscriber: Record<string, unknown>): Promise<void> {
    try {
        const firebase = requireFirebaseAdmin();
        const id = String(subscriber.id || Date.now());
        await firebase.db.collection(SUBSCRIBERS_COLLECTION).doc(id).set(subscriber, { merge: false });
    } catch (error) {
        try {
            const email = String(subscriber.email || '').toLowerCase();
            const existing = await getFirestoreRestCollectionJson(SUBSCRIBERS_COLLECTION);
            if (!existing.some((item) => String(item.email || '').toLowerCase() === email)) {
                const id = String(subscriber.id || Date.now());
                await setFirestoreRestJson(SUBSCRIBERS_COLLECTION, id, { ...subscriber, id });
            }
            return;
        } catch (restError) {
            console.error('Firestore REST createSubscriber error:', restError);
        }
        if (process.env.NODE_ENV === 'production') throw error;
        console.error('Firebase createSubscriber error; using local dev fallback:', error);
        const subscribers = readJsonFile<any[]>(localSubscribersPath, []);
        const email = String(subscriber.email || '').toLowerCase();
        if (!subscribers.some((item) => String(item.email || '').toLowerCase() === email)) {
            subscribers.unshift(subscriber);
            writeLocalDevJson(localSubscribersPath, subscribers);
        }
    }
}

export async function getSubscribers(): Promise<any[]> {
    try {
        const firebase = getFirebaseAdmin();
        if (firebase) {
            const snap = await firebase.db.collection(SUBSCRIBERS_COLLECTION).orderBy('timestamp', 'desc').get();
            return snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
        }
    } catch (error) {
        console.error('Firebase getSubscribers error:', error);
    }

    try {
        const subscribers = await getFirestoreRestCollectionJson(SUBSCRIBERS_COLLECTION);
        if (subscribers.length) {
            return subscribers.sort((a, b) => String(b.timestamp || '').localeCompare(String(a.timestamp || '')));
        }
    } catch (error) {
        console.error('Firestore REST getSubscribers error:', error);
    }

    return readJsonFile<any[]>(localSubscribersPath, []);
}

export async function getDiscussions(defaultDiscussions: any[]): Promise<any[]> {
    try {
        const firebase = getFirebaseAdmin();
        if (firebase) {
            const snap = await firebase.db.collection(DISCUSSIONS_COLLECTION).orderBy('timestamp', 'desc').get();
            if (!snap.empty) return snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
        }
    } catch (error) {
        console.error('Firebase getDiscussions error:', error);
    }

    return readJsonFile<any[]>(localDiscussionsPath, defaultDiscussions);
}

export async function saveDiscussion(comment: Record<string, unknown>): Promise<any[]> {
    try {
        const firebase = requireFirebaseAdmin();
        await firebase.db.collection(DISCUSSIONS_COLLECTION).add(comment);
        return getDiscussions([]);
    } catch (error) {
        if (process.env.NODE_ENV === 'production') throw error;
        console.error('Firebase saveDiscussion error; using local dev fallback:', error);
        const discussions = readJsonFile<any[]>(localDiscussionsPath, []);
        discussions.unshift(comment);
        writeLocalDevJson(localDiscussionsPath, discussions);
        return discussions;
    }
}

export async function getFellowProgress(email: string): Promise<string[]> {
    const cleanEmail = email.toLowerCase().trim();
    try {
        const firebase = getFirebaseAdmin();
        if (firebase) {
            const snap = await firebase.db.collection(PROGRESS_COLLECTION).doc(cleanEmail).get();
            const data = snap.data();
            if (Array.isArray(data?.completedModuleIds)) return data.completedModuleIds;
        }
    } catch (error) {
        console.error('Firebase getFellowProgress error:', error);
    }

    const map = readJsonFile<Record<string, string[]>>(localProgressPath, {});
    return map[cleanEmail] || [];
}

export async function saveFellowProgress(email: string, completedModuleIds: string[]): Promise<void> {
    const cleanEmail = email.toLowerCase().trim();
    try {
        const firebase = requireFirebaseAdmin();
        const admin = firebaseAdminModule();
        await firebase.db.collection(PROGRESS_COLLECTION).doc(cleanEmail).set({
            email: cleanEmail,
            completedModuleIds,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
    } catch (error) {
        if (process.env.NODE_ENV === 'production') throw error;
        console.error('Firebase saveFellowProgress error; using local dev fallback:', error);
        const map = readJsonFile<Record<string, string[]>>(localProgressPath, {});
        map[cleanEmail] = completedModuleIds;
        writeLocalDevJson(localProgressPath, map);
    }
}

export async function uploadImageToStorage(file: File): Promise<string> {
    let firebase = null;
    try {
        firebase = getFirebaseAdmin();
    } catch (error) {
        console.error('Firebase Admin upload path unavailable:', error);
    }

    const bucket = firebase?.bucket;
    if (!bucket) {
        return uploadImageToStorageRest(file);
    }

    const safeName = file.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
    const filename = `uploads/${Date.now()}_${safeName}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const storageFile = bucket.file(filename);

    const downloadToken = randomUUID();

    await storageFile.save(buffer, {
        metadata: {
            contentType: file.type,
            metadata: {
                firebaseStorageDownloadTokens: downloadToken,
            },
        },
        resumable: false,
    });

    return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(filename)}?alt=media&token=${downloadToken}`;
}
