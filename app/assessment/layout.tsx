import { buildPageMetadata } from '@/lib/seo';

export async function generateMetadata() {
    return buildPageMetadata('assessment', '/assessment', {
        title: 'Political Readiness Index (PRI) | Free Political Branding Assessment',
        description: "Take PoliBrand's Political Readiness Index — a free diagnostic assessment measuring your political brand strength across structure, strategy, storytelling, salience, and stewardship.",
        keywords: 'political readiness assessment, political brand audit, campaign readiness test, political branding diagnostic, political brand assessment',
    });
}

export default function AssessmentLayout({ children }: { children: React.ReactNode }) {
    return children;
}
