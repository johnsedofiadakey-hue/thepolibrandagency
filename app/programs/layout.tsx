import { buildPageMetadata } from '@/lib/seo';

export async function generateMetadata() {
    return buildPageMetadata('programs', '/programs', {
        title: 'Political Leadership Programs | Bootcamp, Fellowship & Training – PoliBrand',
        description: "Build political leadership skills with PoliBrand's Bootcamp, Fellowship, and Courses — practical training in political branding, communication, and campaign strategy for emerging African leaders.",
        keywords: 'political leadership training, political bootcamp, political fellowship Africa, campaign training, political branding courses, leadership development Africa',
    });
}

export default function ProgramsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
