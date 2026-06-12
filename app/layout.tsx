import "./globals.css";
import { SettingsProvider } from "../components/SettingsProvider";
import { getContent, getSettings } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const metadataBase = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://thepolibrandagency-d4263.web.app");
  const [content, settings] = await Promise.all([
    getContent().catch(() => ({})),
    getSettings().catch(() => ({})),
  ]);
  
  const meta = (content as any)?.metadata || {};
  const logo = (settings as any)?.theme?.logo || "/logo.svg";
  
  return {
    metadataBase,
    title: meta.title || "The Polibrand Agency",
    description: meta.description || "Strategic branding and leadership development for women in governance.",
    keywords: meta.keywords || "political branding, women leaders, Africa",
    icons: {
      icon: logo,
      shortcut: logo,
      apple: logo,
    },
    openGraph: {
      title: meta.title || "The Polibrand Agency",
      description: meta.description || "Leading Political Branding Partner for Women Leaders",
      type: "website",
      images: [logo],
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

  const activeSettings = settings || {
    theme: {
      primary: '#1A2B4C',
      secondary: '#F1E5D1',
      accent: '#FF6B6B',
      background: '#FAFAFC',
      text: '#2C3E50',
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

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#0a1128" />
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
        <style dangerouslySetInnerHTML={{ __html: styleVariables }} />
      </head>
      <body>
        <SettingsProvider serverSettings={activeSettings} serverContent={(content ?? undefined) as import('@/lib/types').SiteContent | undefined}>
          {children}
        </SettingsProvider>
      </body>
    </html>
  );
}
