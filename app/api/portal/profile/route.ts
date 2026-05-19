import { NextResponse } from 'next/server';
import { getRedis } from '@/lib/db';
import fs from 'fs';
import path from 'path';

const APPS_KEY = 'poli:applications';
const DISCUSSIONS_KEY = 'poli:discussions';
const PROGRESS_KEY_PREFIX = 'poli:fellow:';

const localAppsPath = path.join(process.cwd(), 'data', 'applications.json');
const localDiscussionsPath = path.join(process.cwd(), 'data', 'discussions.json');
const localProgressPath = path.join(process.cwd(), 'data', 'fellow_progress.json');

// Helper to get all applications
async function getApplications(): Promise<any[]> {
    try {
        const redis = await getRedis();
        if (redis) {
            const rawApps = await redis.lrange(APPS_KEY, 0, -1);
            if (rawApps && rawApps.length > 0) {
                return rawApps.map((a: string) => JSON.parse(a));
            }
        }
    } catch (err) {
        console.error('Redis applications fetch error in portal API:', err);
    }

    try {
        if (fs.existsSync(localAppsPath)) {
            return JSON.parse(fs.readFileSync(localAppsPath, 'utf-8'));
        }
    } catch (e) {
        console.error('Local applications read error in portal API:', e);
    }
    return [];
}

// Default discussions to populate if empty
const defaultDiscussions = [
    {
        author: 'Jane Doe',
        email: 'jane@example.com',
        msg: 'Excited to embark on the Brand Identity module! The workbook material is exceptionally detailed.',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString() // 2 hours ago
    },
    {
        author: 'Polibrand Admin',
        email: 'admin@thepolibrandagency.com',
        msg: 'Welcome everyone to Cohort 3! Looking forward to collaborating on our strategic policy advocacy sessions.',
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString() // 5 hours ago
    },
    {
        author: 'Grace Mutuku',
        email: 'grace@example.com',
        msg: 'Found the message discipline workshop exceptionally valuable for our press release prep.',
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString() // 1 day ago
    }
];

// Helper to get discussions
async function getDiscussions(): Promise<any[]> {
    try {
        const redis = await getRedis();
        if (redis) {
            const data = await redis.get<any[]>(DISCUSSIONS_KEY);
            if (data && Array.isArray(data)) return data;
        }
    } catch (err) {
        console.error('Redis discussions fetch error:', err);
    }

    try {
        if (fs.existsSync(localDiscussionsPath)) {
            return JSON.parse(fs.readFileSync(localDiscussionsPath, 'utf-8'));
        }
    } catch (e) {
        console.error('Local discussions read error:', e);
    }

    // Default seed data
    return defaultDiscussions;
}

// Helper to save discussions
async function saveDiscussions(data: any[]): Promise<void> {
    try {
        const redis = await getRedis();
        if (redis) {
            await redis.set(DISCUSSIONS_KEY, data);
        }
    } catch (err) {
        console.error('Redis discussions save error:', err);
    }

    try {
        fs.writeFileSync(localDiscussionsPath, JSON.stringify(data, null, 2));
    } catch (e) {
        console.error('Local discussions write error:', e);
    }
}

// Helper to get progress for all fellows
async function getProgressMap(): Promise<Record<string, string[]>> {
    try {
        if (fs.existsSync(localProgressPath)) {
            return JSON.parse(fs.readFileSync(localProgressPath, 'utf-8'));
        }
    } catch (e) {
        console.error('Local progress read error:', e);
    }
    return {};
}

// Helper to get progress for a specific email
async function getFellowProgress(email: string): Promise<string[]> {
    const cleanEmail = email.toLowerCase().trim();
    try {
        const redis = await getRedis();
        if (redis) {
            const data = await redis.get<string[]>(`${PROGRESS_KEY_PREFIX}${cleanEmail}:progress`);
            if (data && Array.isArray(data)) return data;
        }
    } catch (err) {
        console.error('Redis progress fetch error:', err);
    }

    const map = await getProgressMap();
    return map[cleanEmail] || [];
}

// Helper to save fellow progress
async function saveFellowProgress(email: string, progress: string[]): Promise<void> {
    const cleanEmail = email.toLowerCase().trim();
    try {
        const redis = await getRedis();
        if (redis) {
            await redis.set(`${PROGRESS_KEY_PREFIX}${cleanEmail}:progress`, progress);
        }
    } catch (err) {
        console.error('Redis progress save error:', err);
    }

    try {
        const map = await getProgressMap();
        map[cleanEmail] = progress;
        fs.writeFileSync(localProgressPath, JSON.stringify(map, null, 2));
    } catch (e) {
        console.error('Local progress write error:', e);
    }
}

// Modules mapping based on program type
function getProgramModules(program: string): any[] {
    const lowerProgram = program.toLowerCase();
    
    if (lowerProgram.includes('elite') || lowerProgram.includes('fellowship')) {
        return [
            { id: 'mod-1', title: 'Brand Identity & Public Persona', type: 'Strategy', week: 1 },
            { id: 'mod-2', title: 'Message Discipline & Media Control', type: 'Tactical', week: 2 },
            { id: 'mod-3', title: 'Press Relations & Crisis Management', type: 'Strategy', week: 3 },
            { id: 'mod-4', title: 'Campaign Fundraising & Finance', type: 'Tactical', week: 4 },
            { id: 'mod-5', title: 'Coalition Building & Advocacy', type: 'Strategy', week: 5 },
            { id: 'mod-6', title: 'Policy Formulation & Debate Prep', type: 'Execution', week: 6 }
        ];
    } else if (lowerProgram.includes('bootcamp') || lowerProgram.includes('leadership')) {
        return [
            { id: 'mod-1', title: 'Executive Voice & Narrative Development', type: 'Voice', week: 1 },
            { id: 'mod-2', title: 'High-Impact Public Speaking & Ethos', type: 'Performance', week: 2 },
            { id: 'mod-3', title: 'Digital Advocacy & Brand Growth', type: 'Digital', week: 3 },
            { id: 'mod-4', title: 'Leading with Influence & Political Power', type: 'Leadership', week: 4 }
        ];
    } else {
        // Digital Courses or default self-paced
        return [
            { id: 'mod-1', title: 'Foundations of Political Branding & Persona', type: 'Self-Paced', week: 1 },
            { id: 'mod-2', title: 'Direct Digital Engagement & Base Activation', type: 'Self-Paced', week: 2 }
        ];
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json({ error: 'Email parameter is required.' }, { status: 400 });
        }

        const cleanEmail = email.toLowerCase().trim();
        const apps = await getApplications();
        const app = apps.find(a => a.email.toLowerCase().trim() === cleanEmail);

        if (!app) {
            return NextResponse.json({ 
                error: 'No application record found for this email address. Please apply first.' 
            }, { status: 403 });
        }

        if (app.status !== 'Approved') {
            return NextResponse.json({ 
                error: `Your enrollment is currently ${app.status || 'Pending'}. Approvals are processed within 5-7 business days.` 
            }, { status: 403 });
        }

        const name = `${app.firstName} ${app.lastName}`;
        const program = app.program || 'The Elite Fellowship';
        const score = app.assessmentScore ? Number(app.assessmentScore) : 85;

        const programModules = getProgramModules(program);
        const completedModuleIds = await getFellowProgress(cleanEmail);

        // Map status
        const modules = programModules.map(mod => ({
            ...mod,
            completed: completedModuleIds.includes(mod.id)
        }));

        const discussions = await getDiscussions();

        return NextResponse.json({
            name,
            program,
            score,
            modules,
            completedModuleIds,
            discussions
        });

    } catch (error) {
        console.error('Portal Profile GET Error:', error);
        return NextResponse.json({ error: 'Internal server error fetching portal data.' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action, email } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
        }

        const cleanEmail = email.toLowerCase().trim();
        const apps = await getApplications();
        const app = apps.find(a => a.email.toLowerCase().trim() === cleanEmail);

        if (!app || app.status !== 'Approved') {
            return NextResponse.json({ error: 'Access denied: Profile is not approved.' }, { status: 403 });
        }

        if (action === 'toggleModule') {
            const { moduleId } = body;
            if (!moduleId) {
                return NextResponse.json({ error: 'Module ID is required.' }, { status: 400 });
            }

            let progress = await getFellowProgress(cleanEmail);
            if (progress.includes(moduleId)) {
                progress = progress.filter(id => id !== moduleId);
            } else {
                progress.push(moduleId);
            }

            await saveFellowProgress(cleanEmail, progress);
            return NextResponse.json({ success: true, completedModuleIds: progress });

        } else if (action === 'postComment') {
            const { author, msg } = body;
            if (!author || !msg) {
                return NextResponse.json({ error: 'Author and message are required.' }, { status: 400 });
            }

            const discussions = await getDiscussions();
            const newComment = {
                author,
                email: cleanEmail,
                msg,
                timestamp: new Date().toISOString()
            };

            discussions.unshift(newComment); // Newest first
            await saveDiscussions(discussions);

            return NextResponse.json({ success: true, discussions });
        }

        return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });

    } catch (error) {
        console.error('Portal Profile POST Error:', error);
        return NextResponse.json({ error: 'Internal server error processing portal action.' }, { status: 500 });
    }
}
