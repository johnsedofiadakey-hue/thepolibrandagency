/**
 * Firebase-backed data access layer.
 * - Production uses Firebase Admin SDK with Firestore and Storage.
 * - Local development can fall back to checked-in JSON files when Firebase credentials are absent.
 */

import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';
import { cert, getApps, initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

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

const localContentPath = path.join(process.cwd(), 'data', 'content.json');
const localSettingsPath = path.join(process.cwd(), 'data', 'settings.json');
const localAppsPath = path.join(process.cwd(), 'data', 'applications.json');
const localSubscribersPath = path.join(process.cwd(), 'data', 'subscribers.json');
const localDiscussionsPath = path.join(process.cwd(), 'data', 'discussions.json');
const localProgressPath = path.join(process.cwd(), 'data', 'fellow_progress.json');

function stripInternalSource<T extends Record<string, unknown>>(data: T): T {
    const next = { ...data };
    delete next._source;
    return next;
}

function getFirebaseProjectId(): string | undefined {
    return process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT;
}

function getFirebaseStorageBucket(): string | undefined {
    return process.env.FIREBASE_STORAGE_BUCKET || (getFirebaseProjectId() ? `${getFirebaseProjectId()}.appspot.com` : undefined);
}

function hasFirebaseConfig(): boolean {
    return !!(
        getFirebaseProjectId() ||
        process.env.FIREBASE_SERVICE_ACCOUNT_KEY ||
        process.env.GOOGLE_APPLICATION_CREDENTIALS
    );
}

function initializeFirebaseApp() {
    if (getApps().length) return getApps()[0];

    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    const storageBucket = getFirebaseStorageBucket();

    if (serviceAccount) {
        return initializeApp({
            credential: cert(JSON.parse(serviceAccount)),
            storageBucket,
            projectId: getFirebaseProjectId(),
        });
    }

    return initializeApp({
        credential: applicationDefault(),
        storageBucket,
        projectId: getFirebaseProjectId(),
    });
}

export function getFirebaseAdmin() {
    if (!hasFirebaseConfig()) return null;
    try {
        const app = initializeFirebaseApp();
        return {
            app,
            auth: getAuth(app),
            db: getFirestore(app),
            bucket: getStorage(app).bucket(),
        };
    } catch (error) {
        console.error('Firebase Admin initialization failed:', error);
        return null;
    }
}

export async function verifyFirebaseIdToken(idToken: string) {
    const firebase = requireFirebaseAdmin();
    return firebase.auth.verifyIdToken(idToken);
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

    const data = readJsonFile<Record<string, unknown>>(localContentPath, localContent as Record<string, unknown>);
    return { ...data, _source: fs.existsSync(localContentPath) ? 'local_disk' : 'local_fallback' };
}

export async function setContent(data: Record<string, unknown>): Promise<void> {
    const cleanData = stripInternalSource(data);

    try {
        const firebase = requireFirebaseAdmin();
        await firebase.db.collection(CONFIG_COLLECTION).doc(CONTENT_DOC).set(cleanData, { merge: false });
    } catch (error) {
        if (process.env.NODE_ENV === 'production') throw error;
        console.error('Firebase setContent error; using local dev fallback:', error);
        writeLocalDevJson(localContentPath, cleanData);
    }
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

    const data = readJsonFile<SiteSettings>(localSettingsPath, localSettings as SiteSettings);
    return { ...data, _source: fs.existsSync(localSettingsPath) ? 'local_disk' : 'local_fallback' };
}

export async function setSettings(data: SiteSettings): Promise<void> {
    const cleanData = stripInternalSource(data as unknown as Record<string, unknown>) as unknown as SiteSettings;

    try {
        const firebase = requireFirebaseAdmin();
        await firebase.db.collection(CONFIG_COLLECTION).doc(SETTINGS_DOC).set(cleanData, { merge: false });
    } catch (error) {
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
            return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        }
    } catch (error) {
        console.error('Firebase getApplications error:', error);
    }

    return readJsonFile<any[]>(localAppsPath, localApps || []);
}

export async function createApplication(application: Record<string, unknown>): Promise<void> {
    try {
        const firebase = requireFirebaseAdmin();
        const id = String(application.id || Date.now());
        await firebase.db.collection(APPLICATIONS_COLLECTION).doc(id).set(application, { merge: false });
    } catch (error) {
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
            return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        }
    } catch (error) {
        console.error('Firebase getSubscribers error:', error);
    }

    return readJsonFile<any[]>(localSubscribersPath, []);
}

export async function getDiscussions(defaultDiscussions: any[]): Promise<any[]> {
    try {
        const firebase = getFirebaseAdmin();
        if (firebase) {
            const snap = await firebase.db.collection(DISCUSSIONS_COLLECTION).orderBy('timestamp', 'desc').get();
            if (!snap.empty) return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
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
        await firebase.db.collection(PROGRESS_COLLECTION).doc(cleanEmail).set({
            email: cleanEmail,
            completedModuleIds,
            updatedAt: FieldValue.serverTimestamp(),
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
    const firebase = requireFirebaseAdmin();
    const bucket = firebase.bucket;
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
