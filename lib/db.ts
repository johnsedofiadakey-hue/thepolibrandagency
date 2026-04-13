/**
 * lib/db.ts
 *
 * Unified data access layer.
 * - In production / when UPSTASH env vars are set: reads/writes to Upstash Redis (persistent).
 * - FALLBACK: Uses imported JSON files (bundled) to ensure zero-crash production behavior.
 */

import path from 'path';
import fs from 'fs';

// @ts-ignore
import localContent from '../data/content.json';
// @ts-ignore
import localSettings from '../data/settings.json';

const CONTENT_KEY = 'poli:content';
const SETTINGS_KEY = 'poli:settings';

// Check if we have Upstash credentials configured
function hasUpstashConfig(): boolean {
    return !!(
        process.env.UPSTASH_REDIS_REST_URL &&
        process.env.UPSTASH_REDIS_REST_TOKEN
    );
}

// Lazy-load the Redis client
export async function getRedis() {
    if (!hasUpstashConfig()) return null;
    try {
        const { Redis } = await import('@upstash/redis');
        const redis = new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL!,
            token: process.env.UPSTASH_REDIS_REST_TOKEN!,
        });
        return redis;
    } catch (err) {
        console.error('Redis init error:', err);
        return null;
    }
}

// Local fallback paths (only for WRITING in dev; READS use imports)
const localContentPath = path.join(process.cwd(), 'data', 'content.json');
const localSettingsPath = path.join(process.cwd(), 'data', 'settings.json');

// --- CONTENT ---

export async function getContent(): Promise<Record<string, unknown>> {
    try {
        const redis = await getRedis();
        if (redis) {
            const data = await redis.get<Record<string, unknown>>(CONTENT_KEY);
            if (data) return data;
        }
    } catch (err) {
        console.error('Redis getContent error:', err);
    }
    
    // Bundle-safe fallback: Use the directly imported JSON
    return localContent as Record<string, unknown>;
}

export async function setContent(data: Record<string, unknown>): Promise<void> {
    try {
        const redis = await getRedis();
        if (redis) {
            await redis.set(CONTENT_KEY, data);
        }
    } catch (err) {
        console.error('Redis setContent error:', err);
    }
    
    // Snapshot to local file (fails silently in prod)
    try {
        fs.writeFileSync(localContentPath, JSON.stringify(data, null, 2));
    } catch {}
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

export async function getSettings(): Promise<SiteSettings> {
    try {
        const redis = await getRedis();
        if (redis) {
            const data = await redis.get<SiteSettings>(SETTINGS_KEY);
            if (data) return data;
        }
    } catch (err) {
        console.error('Redis getSettings error:', err);
    }
    
    // Bundle-safe fallback: Use the directly imported JSON
    return localSettings as SiteSettings;
}

export async function setSettings(data: SiteSettings): Promise<void> {
    try {
        const redis = await getRedis();
        if (redis) {
            await redis.set(SETTINGS_KEY, data);
        }
    } catch (err) {
        console.error('Redis setSettings error:', err);
    }
    
    try {
        fs.writeFileSync(localSettingsPath, JSON.stringify(data, null, 2));
    } catch {}
}
