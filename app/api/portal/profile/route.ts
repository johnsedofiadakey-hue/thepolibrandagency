import { NextResponse } from 'next/server';
import {
    getApplications,
    getDiscussions,
    getFellowProgress,
    saveDiscussion,
    saveFellowProgress,
} from '@/lib/db';
import { requirePortal } from '@/lib/session';
import { rateLimit } from '@/lib/rate-limit';

const defaultDiscussions = [
    {
        author: 'Jane Doe',
        email: 'jane@example.com',
        msg: 'Excited to embark on the Brand Identity module! The workbook material is exceptionally detailed.',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
        author: 'Polibrand Admin',
        email: 'admin@thepolibrandagency.com',
        msg: 'Welcome everyone to Cohort 3! Looking forward to collaborating on our strategic policy advocacy sessions.',
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
    {
        author: 'Grace Mutuku',
        email: 'grace@example.com',
        msg: 'Found the message discipline workshop exceptionally valuable for our press release prep.',
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
];

function getProgramModules(program: string): any[] {
    const lowerProgram = program.toLowerCase();

    if (lowerProgram.includes('elite') || lowerProgram.includes('fellowship')) {
        return [
            { id: 'mod-1', title: 'Brand Identity & Public Persona', type: 'Strategy', week: 1 },
            { id: 'mod-2', title: 'Message Discipline & Media Control', type: 'Tactical', week: 2 },
            { id: 'mod-3', title: 'Press Relations & Crisis Management', type: 'Strategy', week: 3 },
            { id: 'mod-4', title: 'Campaign Fundraising & Finance', type: 'Tactical', week: 4 },
            { id: 'mod-5', title: 'Coalition Building & Advocacy', type: 'Strategy', week: 5 },
            { id: 'mod-6', title: 'Policy Formulation & Debate Prep', type: 'Execution', week: 6 },
        ];
    }

    if (lowerProgram.includes('bootcamp') || lowerProgram.includes('leadership')) {
        return [
            { id: 'mod-1', title: 'Executive Voice & Narrative Development', type: 'Voice', week: 1 },
            { id: 'mod-2', title: 'High-Impact Public Speaking & Ethos', type: 'Performance', week: 2 },
            { id: 'mod-3', title: 'Digital Advocacy & Brand Growth', type: 'Digital', week: 3 },
            { id: 'mod-4', title: 'Leading with Influence & Political Power', type: 'Leadership', week: 4 },
        ];
    }

    return [
        { id: 'mod-1', title: 'Foundations of Political Branding & Persona', type: 'Self-Paced', week: 1 },
        { id: 'mod-2', title: 'Direct Digital Engagement & Base Activation', type: 'Self-Paced', week: 2 },
    ];
}

export async function GET(request: Request) {
    const limited = rateLimit(request, { scope: 'portal-profile-read', limit: 60, windowMs: 15 * 60 * 1000 });
    if (limited) return limited;

    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json({ error: 'Email parameter is required.' }, { status: 400 });
        }

        const cleanEmail = email.toLowerCase().trim();
        const unauthorized = await requirePortal(request, cleanEmail);
        if (unauthorized) return unauthorized;

        const apps = await getApplications();
        const app = apps.find((item) => item.email?.toLowerCase().trim() === cleanEmail);

        if (!app) {
            return NextResponse.json({ error: 'No application record found for this email address. Please apply first.' }, { status: 403 });
        }

        if (app.status !== 'Approved') {
            return NextResponse.json({ error: `Your enrollment is currently ${app.status || 'Pending'}. Approvals are processed within 5-7 business days.` }, { status: 403 });
        }

        const name = `${app.firstName} ${app.lastName}`;
        const program = app.program || 'The Elite Fellowship';
        const score = app.assessmentScore ? Number(app.assessmentScore) : 85;
        const completedModuleIds = await getFellowProgress(cleanEmail);
        const modules = getProgramModules(program).map((mod) => ({
            ...mod,
            completed: completedModuleIds.includes(mod.id),
        }));
        const discussions = await getDiscussions(defaultDiscussions);

        return NextResponse.json({
            name,
            program,
            score,
            modules,
            completedModuleIds,
            discussions,
        });
    } catch (error) {
        console.error('Portal Profile GET Error:', error);
        return NextResponse.json({ error: 'Internal server error fetching portal data.' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const limited = rateLimit(request, { scope: 'portal-profile-write', limit: 30, windowMs: 15 * 60 * 1000 });
    if (limited) return limited;

    try {
        const body = await request.json();
        const { action, email } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
        }

        const cleanEmail = email.toLowerCase().trim();
        const unauthorized = await requirePortal(request, cleanEmail);
        if (unauthorized) return unauthorized;

        const apps = await getApplications();
        const app = apps.find((item) => item.email?.toLowerCase().trim() === cleanEmail);

        if (!app || app.status !== 'Approved') {
            return NextResponse.json({ error: 'Access denied: Profile is not approved.' }, { status: 403 });
        }

        if (action === 'toggleModule') {
            const { moduleId } = body;
            if (!moduleId) {
                return NextResponse.json({ error: 'Module ID is required.' }, { status: 400 });
            }

            let progress = await getFellowProgress(cleanEmail);
            progress = progress.includes(moduleId)
                ? progress.filter((id) => id !== moduleId)
                : [...progress, moduleId];

            await saveFellowProgress(cleanEmail, progress);
            return NextResponse.json({ success: true, completedModuleIds: progress });
        }

        if (action === 'postComment') {
            const { author, msg } = body;
            if (!author || !msg) {
                return NextResponse.json({ error: 'Author and message are required.' }, { status: 400 });
            }

            const newComment = {
                author,
                email: cleanEmail,
                msg,
                timestamp: new Date().toISOString(),
            };
            const discussions = await saveDiscussion(newComment);

            return NextResponse.json({ success: true, discussions });
        }

        return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
    } catch (error) {
        console.error('Portal Profile POST Error:', error);
        return NextResponse.json({ error: 'Internal server error processing portal action.' }, { status: 500 });
    }
}
