import { buildPageMetadata } from '@/lib/seo';

export async function generateMetadata() {
    return buildPageMetadata('services', '/services', {
        title: 'Political Branding Services | Strategy, Storytelling & Campaign Communication',
        description: "Explore PoliBrand's political branding services — identity architecture, message discipline, campaign communication, and strategic visibility for candidates, aspirants, and institutions.",
        keywords: 'political branding services, campaign communication, political messaging, candidate branding, political identity strategy, political PR, political brand strategy',
    });
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
    return children;
}
