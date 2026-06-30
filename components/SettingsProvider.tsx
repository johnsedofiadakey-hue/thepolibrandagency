"use client";
import React from 'react';
import type { PoliSettingsContextValue, SiteSettings, SiteContent } from '@/lib/types';

import initialContent from '../data/content.json';

const DEFAULT_THEME: SiteSettings['theme'] = {
  primary: '#1A2B4C',
  secondary: '#F1E5D1',
  accent: '#FF6B6B',
  background: '#FAFAFC',
  text: '#2C3E50',
  heroImage: '',
  logo: '/logo.svg',
};

export const PoliSettingsContext = React.createContext<PoliSettingsContextValue>({
  theme: DEFAULT_THEME,
  typography: 'modern_minimalist',
  content: initialContent as SiteContent,
  updateSettings: () => {},
  updateContent: () => {},
  refresh: () => Promise.resolve(),
});

export function SettingsProvider({
  children,
  serverSettings,
  serverContent,
}: {
  children: React.ReactNode;
  serverSettings?: SiteSettings;
  serverContent?: SiteContent;
}) {
  const [settings, setSettings] = React.useState<SiteSettings>(() => {
    return serverSettings || { theme: DEFAULT_THEME, typography: 'modern_minimalist' };
  });

  const [content, setContent] = React.useState<SiteContent>(() => {
    return serverContent || (initialContent as SiteContent);
  });

  // serverSettings/serverContent are already fresh (layout.tsx fetches them on every
  // request with no caching). Re-fetch once on mount only to catch edits saved between
  // the SSR response leaving the server and this component hydrating in the browser —
  // never trust localStorage here, since a silently failed fetch would otherwise leave
  // a visitor stuck on arbitrarily old cached content with no indication anything's stale.
  const loadAll = React.useCallback(async () => {
    try {
      const [sRes, cRes] = await Promise.all([
        fetch('/api/settings', { cache: 'no-store' }),
        fetch('/api/content', { cache: 'no-store' })
      ]);

      if (!sRes.ok || !cRes.ok) throw new Error('API request failed');

      const sData = await sRes.json();
      const cData = await cRes.json();

      if (sData && sData.theme && !sData.error) {
        setSettings(sData);
      }

      // Ensure cData is a valid content object (not an error and has pages/navbar)
      if (cData && !cData.error && cData.pages) {
        setContent(cData);
      }
    } catch (err) {
      console.error('Failed to refresh settings/content; showing server-rendered data:', err);
    }
  }, []);

  React.useEffect(() => {
    loadAll();
  }, [loadAll]);

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const updateContent = (newContent: Partial<SiteContent>) => {
    setContent((prev) => ({ ...prev, ...newContent }));
  };

  React.useEffect(() => {
    const root = document.documentElement;
    const theme = settings.theme;
    if (!theme) return;

    // Direct style injection to ensure 'Total Control' reflects immediately
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-secondary', theme.secondary);
    root.style.setProperty('--color-accent', theme.accent);
    root.style.setProperty('--color-bg', theme.background);
    root.style.setProperty('--color-text', theme.text);
    root.style.setProperty('--hero-image', theme.heroImage ? `url(${theme.heroImage})` : 'none');
    root.style.setProperty('--color-border', theme.secondary + '20');

    // Quick primary variations
    root.style.setProperty('--color-primary-dark', theme.primary + 'e6');

    if (settings.typography) {
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

      const set = fonts[settings.typography] || fonts.modern_minimalist;
      root.style.setProperty('--font-display', set.display);
      root.style.setProperty('--font-body', set.body);
    }
  }, [settings]);

  return (
    <PoliSettingsContext.Provider value={{ ...settings, content, updateSettings, updateContent, refresh: loadAll } as PoliSettingsContextValue}>
      {children}
    </PoliSettingsContext.Provider>
  );
}
