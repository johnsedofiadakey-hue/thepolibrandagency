import type { Metadata } from 'next';
import { getContent } from '@/lib/db';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thepolibrandagency.com';

export interface PageMetaFallback {
    title: string;
    description: string;
    keywords: string;
}

/**
 * Builds per-route <title>/<meta description>/OG tags from the CMS-managed
 * content doc, falling back to hardcoded copy if that page has no `meta`
 * block yet (e.g. freshly added routes). Every public page.tsx is a client
 * component, so metadata has to be exported from a sibling server layout.tsx
 * instead of the page itself — this is the shared piece each of those calls.
 */
export async function buildPageMetadata(pageKey: string, pagePath: string, fallback: PageMetaFallback): Promise<Metadata> {
    const content = await getContent().catch(() => null) as any;
    const meta = content?.pages?.[pageKey]?.meta || {};

    const title = meta.title || fallback.title;
    const description = meta.description || fallback.description;
    const keywords = meta.keywords || fallback.keywords;
    const canonical = `${SITE_URL}${pagePath === '/' ? '' : pagePath}`;

    return {
        title,
        description,
        keywords,
        alternates: { canonical },
        openGraph: {
            title,
            description,
            url: canonical,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
    };
}

export function noIndexMetadata(title: string): Metadata {
    return {
        title,
        robots: { index: false, follow: false },
    };
}
