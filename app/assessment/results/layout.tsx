import { noIndexMetadata } from '@/lib/seo';

export async function generateMetadata() {
    return noIndexMetadata('Your Political Readiness Index Results | PoliBrand');
}

export default function AssessmentResultsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
