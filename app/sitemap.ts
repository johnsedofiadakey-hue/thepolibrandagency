import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thepolibrandagency.com';

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();

    const routes: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }> = [
        { path: '/', priority: 1.0, changeFrequency: 'weekly' },
        { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
        { path: '/services', priority: 0.9, changeFrequency: 'monthly' },
        { path: '/programs', priority: 0.8, changeFrequency: 'monthly' },
        { path: '/institutional-clients', priority: 0.7, changeFrequency: 'monthly' },
        { path: '/assessment', priority: 0.7, changeFrequency: 'monthly' },
        { path: '/apply', priority: 0.7, changeFrequency: 'monthly' },
    ];

    return routes.map((route) => ({
        url: `${SITE_URL}${route.path}`,
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
    }));
}
