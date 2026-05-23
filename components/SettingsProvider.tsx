"use client";
import React from 'react';

import initialContent from '../data/content.json';

export const PoliSettingsContext = React.createContext({
  theme: {
    primary: '#1A2B4C',
    secondary: '#F1E5D1',
    accent: '#FF6B6B',
    background: '#FAFAFC',
    text: '#2C3E50',
    heroImage: '',
    logo: '/logo.png',
  },
  typography: 'modern_minimalist',
  content: initialContent as any,
  updateSettings: (newSettings: any) => { },
  updateContent: (newContent: any) => { },
  refresh: () => Promise.resolve(),
});

export function SettingsProvider({ 
  children,
  serverSettings,
  serverContent
}: { 
  children: React.ReactNode;
  serverSettings?: any;
  serverContent?: any;
}) {
  const [settings, setSettings] = React.useState(() => {
    return serverSettings || {
      theme: {
        primary: '#1A2B4C',
        secondary: '#F1E5D1',
        accent: '#FF6B6B',
        background: '#FAFAFC',
        text: '#2C3E50',
        heroImage: '',
        logo: '/logo.png',
      },
      typography: 'modern_minimalist',
    };
  });

  const [content, setContent] = React.useState<any>(() => {
    return serverContent || initialContent;
  });

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
        localStorage.setItem('poli_settings', JSON.stringify(sData));
      }
      
      // Ensure cData is a valid content object (not an error and has pages/navbar)
      if (cData && !cData.error && cData.pages) {
        setContent(cData);
        localStorage.setItem('poli_content', JSON.stringify(cData));
      }
    } catch (err) {
      console.warn('Using local/cached data as fallback:', err);
    }
  }, []);

  // Load from localStorage on mount + then fetch fresh
  React.useEffect(() => {
    const savedContent = localStorage.getItem('poli_content');
    if (savedContent) {
      try { setContent(JSON.parse(savedContent)); } catch (e) {}
    }

    const savedSettings = localStorage.getItem('poli_settings');
    if (savedSettings) {
      try { setSettings(JSON.parse(savedSettings)); } catch (e) {}
    }

    loadAll();
  }, [loadAll]);

  const updateSettings = (newSettings: any) => {
    setSettings((prev: any) => {
      const next = { ...prev, ...newSettings };
      localStorage.setItem('poli_settings', JSON.stringify(next));
      return next;
    });
  };

  const updateContent = (newContent: any) => {
    setContent((prev: any) => {
      const next = { ...prev, ...newContent };
      localStorage.setItem('poli_content', JSON.stringify(next));
      return next;
    });
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
    <PoliSettingsContext.Provider value={{ ...settings, content, updateSettings, updateContent, refresh: loadAll }}>
      {children}
    </PoliSettingsContext.Provider>
  );
}
