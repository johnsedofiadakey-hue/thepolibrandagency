/**
 * lib/db.ts
 *
 * Unified data access layer.
 * - In production / when UPSTASH env vars are set: reads/writes to Upstash Redis (persistent).
 * - In development (no env vars): reads/writes to local JSON files.
 */

import path from 'path';
import fs from 'fs';

const CONTENT_KEY = 'poli:content';
const SETTINGS_KEY = 'poli:settings';

// Check if we have Upstash credentials configured
function hasUpstashConfig(): boolean {
    return !!(
        process.env.UPSTASH_REDIS_REST_URL &&
        process.env.UPSTASH_REDIS_REST_TOKEN
    );
}

// Lazy-load the Redis client to avoid errors when not configured
async function getRedis() {
    if (!hasUpstashConfig()) return null;
    try {
        const { Redis } = await import('@upstash/redis');
        return new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL!,
            token: process.env.UPSTASH_REDIS_REST_TOKEN!,
        });
    } catch {
        return null;
    }
}

// Local fallback paths (used in dev)
const localContentPath = path.join(process.cwd(), 'data', 'content.json');
const localSettingsPath = path.join(process.cwd(), 'data', 'settings.json');

// --- CONTENT ---

export async function getContent(): Promise<Record<string, unknown>> {
    const redis = await getRedis();
    if (redis) {
        const data = await redis.get<Record<string, unknown>>(CONTENT_KEY);
        if (data) return data;
    }
    // Fallback to local file
    try {
        const raw = fs.readFileSync(localContentPath, 'utf-8');
        return JSON.parse(raw);
    } catch {
        return {};
    }
}

export async function setContent(data: Record<string, unknown>): Promise<void> {
    const redis = await getRedis();
    if (redis) {
        await redis.set(CONTENT_KEY, data);
    }
    // Also write local file (for dev snapshot; fails silently in prod)
    try {
        fs.writeFileSync(localContentPath, JSON.stringify(data, null, 2));
    } catch {
        // Ignore — read-only fs in prod is expected
    }
}

// --- SETTINGS ---

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

const defaultSettings: SiteSettings = {
    theme: {
        primary: '#1F6F3E',
        secondary: '#C9A227',
        accent: '#B22222',
        background: '#F9F6F1',
        text: '#111111',
        heroImage: '',
        logo: '/logo.png',
    },
    typography: 'institutional',
};

export async function getSettings(): Promise<SiteSettings> {
    const redis = await getRedis();
    if (redis) {
        const data = await redis.get<SiteSettings>(SETTINGS_KEY);
        if (data) return data;
    }
    // Fallback to local file
    try {
        if (fs.existsSync(localSettingsPath)) {
            const raw = fs.readFileSync(localSettingsPath, 'utf-8');
            return JSON.parse(raw);
        }
    } catch {
        // ignore
    }
    return defaultSettings;
}

export async function setSettings(data: SiteSettings): Promise<void> {
    const redis = await getRedis();
    if (redis) {
        await redis.set(SETTINGS_KEY, data);
    }
    try {
        fs.writeFileSync(localSettingsPath, JSON.stringify(data, null, 2));
    } catch {
        // Ignore in prod
    }
}
