import { buildPageMetadata } from '@/lib/seo';

export async function generateMetadata() {
    return buildPageMetadata('about', '/about', {
        title: 'About PoliBrand | Political Branding Strategists Building African Leaders',
        description: "Meet the team behind PoliBrand's 5S Framework — the political branding methodology helping African leaders win trust through structure, strategy, storytelling, salience, and stewardship.",
        keywords: 'political branding agency, political branding team, 5S framework, political strategist Africa, political communication experts, PoliBrand founder',
    });
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return children;
}
