import { buildPageMetadata } from '@/lib/seo';

export async function generateMetadata() {
    return buildPageMetadata('institutional', '/institutional-clients', {
        title: 'Institutional Partnerships | Political Branding for Parties & Institutions',
        description: 'PoliBrand partners with political parties, NGOs, and development institutions to scale political branding, governance communication, and leadership development across Africa.',
        keywords: 'institutional political branding, party branding, political party communication, governance partnerships Africa, NGO political strategy, political branding partners',
    });
}

export default function InstitutionalLayout({ children }: { children: React.ReactNode }) {
    return children;
}
