import { noIndexMetadata } from '@/lib/seo';

export async function generateMetadata() {
    return noIndexMetadata('Fellow Portal Login | PoliBrand');
}

export default function PortalLayout({ children }: { children: React.ReactNode }) {
    return children;
}
