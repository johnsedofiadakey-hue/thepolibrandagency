import { buildPageMetadata } from '@/lib/seo';

export async function generateMetadata() {
    return buildPageMetadata('apply', '/apply', {
        title: 'Apply to PoliBrand | Political Branding & Leadership Programs',
        description: 'Apply to work with PoliBrand — political branding strategy, leadership training, and campaign communication support for candidates, aspirants, and institutions across Africa.',
        keywords: 'apply political branding agency, join political leadership program, political branding consultation, political branding application',
    });
}

export default function ApplyLayout({ children }: { children: React.ReactNode }) {
    return children;
}
