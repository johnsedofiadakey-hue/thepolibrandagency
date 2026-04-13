import "./globals.css";
import { SettingsProvider } from "../components/SettingsProvider";
import { getContent, getSettings } from "@/lib/db";

export async function generateMetadata() {
  const [content, settings] = await Promise.all([
    getContent().catch(() => ({})),
    getSettings().catch(() => ({})),
  ]);
  
  const meta = (content as any)?.metadata || {};
  const logo = (settings as any)?.theme?.logo || "/logo.png";
  
  return {
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SettingsProvider>
          {children}
        </SettingsProvider>
      </body>
    </html>
  );
}
