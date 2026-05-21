import "./globals.css";
import { SettingsProvider } from "../components/SettingsProvider";
import { getContent, getSettings } from "@/lib/db";

export async function generateMetadata() {
  const metadataBase = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://thepolibrandagency-d4263.web.app");
  const [content, settings] = await Promise.all([
    getContent().catch(() => ({})),
    getSettings().catch(() => ({})),
  ]);
  
  const meta = (content as any)?.metadata || {};
  const logo = (settings as any)?.theme?.logo || "/logo.png";
  
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
      primary: '#1F6F3E',
      secondary: '#C9A227',
      accent: '#B22222',
      background: '#F9F6F1',
      text: '#111111',
      heroImage: '',
      logo: '/logo.png',
    },
    typography: 'institutional',
  };

  const logo = activeSettings.theme?.logo || "/logo.png";
  const theme = activeSettings.theme;
  const typography = activeSettings.typography || 'institutional';

  const fonts: Record<string, { display: string; body: string }> = {
    institutional: {
      display: "'Cinzel', 'Playfair Display', serif",
      body: "'Inter', sans-serif"
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

  const set = fonts[typography] || fonts.institutional;

  const styleVariables = `
    :root {
      --color-primary: ${theme.primary};
      --color-secondary: ${theme.secondary};
      --color-accent: ${theme.accent};
      --color-bg: ${theme.background};
      --color-text: ${theme.text};
      --hero-image: ${theme.heroImage ? `url(${theme.heroImage})` : 'none'};
      --color-border: ${theme.secondary}20;
      --color-primary-dark: ${theme.primary}e6;
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
        
        {/* Force Favicon Sync */}
        <link rel="icon" href={logo} />
        <link rel="shortcut icon" href={logo} />
        <link rel="apple-touch-icon" href={logo} />
        
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{ __html: styleVariables }} />
      </head>
      <body>
        <SettingsProvider serverSettings={activeSettings} serverContent={content}>
          {children}
        </SettingsProvider>
      </body>
    </html>
  );
}
