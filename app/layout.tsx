import "./globals.css";
import { headers } from "next/headers";
import { SettingsProvider } from "../components/SettingsProvider";
import MaintenanceScreen from "../components/MaintenanceScreen";
import { getContent, getSettings } from "@/lib/db";

export const dynamic = 'force-dynamic';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://thepolibrandagency.com";

export async function generateMetadata() {
  const metadataBase = new URL(SITE_URL);
  const [content, settings] = await Promise.all([
    getContent().catch(() => ({})),
    getSettings().catch(() => ({})),
  ]);

  // Root layout's metadata is the fallback for every route that has no route-level
  // layout.tsx override (home, not-found, etc.) — prefer the homepage-specific
  // meta block if set, then the legacy global `content.metadata`, then a hardcoded default.
  const homeMeta = (content as any)?.pages?.home?.meta || {};
  const globalMeta = (content as any)?.metadata || {};
  const meta = { ...globalMeta, ...homeMeta };
  const logo = (settings as any)?.theme?.logo || "/logo.svg";

  const title = meta.title || "The PoliBrand Agency | The Trusted Political Branding Partner";
  const description = meta.description || "PoliBrand — Africa's trusted political branding agency. Political strategy, campaign communication, and leadership branding for candidates, parties, and institutions.";

  return {
    metadataBase,
    title,
    description,
    keywords: meta.keywords || "political branding, political branding agency, political communication strategy, campaign branding, candidate branding Africa, political consulting Ghana",
    alternates: { canonical: SITE_URL },
    icons: {
      icon: logo,
      shortcut: logo,
      apple: logo,
    },
    openGraph: {
      title,
      description,
      url: SITE_URL,
      type: "website",
      images: [logo],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, content] = await Promise.all([
    getSettings().catch(() => null),
    getContent().catch(() => null)
  ]);

  const pathname = (await headers()).get('x-pathname') || '';
  const maintenanceActive = !!settings?.maintenance?.enabled && !pathname.startsWith('/admin');

  const activeSettings = settings || {
    theme: {
      primary: '#F3010A',
      secondary: '#ffa3a3',
      accent: '#F3010A',
      background: '#ffffff',
      text: '#000000',
      heroImage: '',
      logo: '/logo.svg',
    },
    typography: 'modern_minimalist',
  };

  const logo = activeSettings.theme?.logo || "/logo.svg";
  const theme = activeSettings.theme;
  const typography = activeSettings.typography || 'institutional';

  const fonts: Record<string, { display: string; body: string }> = {
    institutional: {
      display: "'Cinzel', 'Playfair Display', serif",
      body: "'Inter', sans-serif"
    },
    modern_minimalist: {
      display: "'Outfit', system-ui, sans-serif",
      body: "'Inter', system-ui, sans-serif"
    },
    modern: {
      display: "'Inter', sans-serif",
      body: "'Inter', sans-serif"
    },
    classic: {
      display: "'Playfair Display', serif",
      body: "'Inter', sans-serif"
    }
  };

  const set = fonts[typography] || fonts.modern_minimalist;

  function sanitizeColor(value: string): string {
    if (/^#([0-9a-fA-F]{3,8})$/.test(value)) return value;
    if (/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(\s*,\s*[\d.]+)?\s*\)$/.test(value)) return value;
    return '#000000';
  }

  function sanitizeImageUrl(value: string): string {
    if (!value) return '';
    if (value.startsWith('/')) return value;
    if (/^https:\/\/firebasestorage\.googleapis\.com\//.test(value)) return value;
    if (/^https:\/\/[^/]+\.firebasestorage\.app\//.test(value)) return value;
    return '';
  }

  const safeTheme = {
    primary: sanitizeColor(theme.primary),
    secondary: sanitizeColor(theme.secondary),
    accent: sanitizeColor(theme.accent),
    background: sanitizeColor(theme.background),
    text: sanitizeColor(theme.text),
    heroImage: sanitizeImageUrl(theme.heroImage || ''),
  };

  const styleVariables = `
    :root {
      --color-primary: ${safeTheme.primary};
      --color-secondary: ${safeTheme.secondary};
      --color-accent: ${safeTheme.accent};
      --color-bg: ${safeTheme.background};
      --color-text: ${safeTheme.text};
      --hero-image: ${safeTheme.heroImage ? `url(${safeTheme.heroImage})` : 'none'};
      --color-border: ${safeTheme.secondary}20;
      --color-primary-dark: ${safeTheme.primary}e6;
      --font-display: ${set.display};
      --font-body: ${set.body};
    }
  `;

  const orgDescription = (content as any)?.pages?.home?.meta?.description
    || (content as any)?.metadata?.description
    || "PoliBrand — Africa's trusted political branding agency. Political strategy, campaign communication, and leadership branding for candidates, parties, and institutions.";

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'The PoliBrand Agency',
    alternateName: 'PoliBrand',
    url: SITE_URL,
    logo: logo.startsWith('http') ? logo : `${SITE_URL}${logo}`,
    image: logo.startsWith('http') ? logo : `${SITE_URL}${logo}`,
    description: orgDescription,
    areaServed: { '@type': 'Place', name: 'Africa' },
    serviceType: ['Political branding', 'Political communication strategy', 'Campaign communication', 'Political leadership training'],
    sameAs: [] as string[],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#F3010A" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="PoliBrand" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {safeTheme.heroImage && (
          <link rel="preload" as="image" href={safeTheme.heroImage} fetchPriority="high" />
        )}
        <style dangerouslySetInnerHTML={{ __html: styleVariables }} />
      </head>
      <body>
        <SettingsProvider serverSettings={activeSettings} serverContent={(content ?? undefined) as import('@/lib/types').SiteContent | undefined}>
          {maintenanceActive ? (
            <MaintenanceScreen title={settings?.maintenance?.title} message={settings?.maintenance?.message} />
          ) : (
            children
          )}
        </SettingsProvider>
      </body>
    </html>
  );
}
