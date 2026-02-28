"use client";
import React from 'react';

import initialContent from '../data/content.json';

export const PoliSettingsContext = React.createContext({
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
  content: initialContent as any,
  updateSettings: (newSettings: any) => { },
  updateContent: (newContent: any) => { },
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = React.useState({
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
  });

  const [content, setContent] = React.useState<any>(initialContent);

  // Load from localStorage on mount
  React.useEffect(() => {
    const savedContent = localStorage.getItem('poli_content');
    if (savedContent) {
      try {
        setContent(JSON.parse(savedContent));
      } catch (e) {
        console.error('Failed to parse saved content');
      }
    }

    const savedSettings = localStorage.getItem('poli_settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Failed to parse saved settings');
      }
    }

    // Fetch theme settings from server
    fetch('/api/settings', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.theme) {
          setSettings(data);
          localStorage.setItem('poli_settings', JSON.stringify(data));
        }
      })
      .catch(err => console.error('Failed to load settings:', err));

    // Fetch content settings from server
    fetch('/api/content', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setContent(data);
          localStorage.setItem('poli_content', JSON.stringify(data));
        }
      })
      .catch(err => console.error('Failed to load content:', err));
  }, []);

  const updateSettings = (newSettings: any) => {
    setSettings(prev => {
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
    if (!settings.theme) return;

    root.style.setProperty('--color-primary', settings.theme.primary);
    root.style.setProperty('--color-secondary', settings.theme.secondary);
    root.style.setProperty('--color-accent', settings.theme.accent);
    root.style.setProperty('--color-bg', settings.theme.background);
    root.style.setProperty('--color-text', settings.theme.text);
    root.style.setProperty('--hero-image', settings.theme.heroImage ? `url(${settings.theme.heroImage})` : 'none');

    // Quick primary variations
    root.style.setProperty('--color-primary-dark', settings.theme.primary + 'e6');

    if (settings.typography) {
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

      const set = fonts[settings.typography] || fonts.institutional;
      root.style.setProperty('--font-display', set.display);
      root.style.setProperty('--font-body', set.body);
    }
  }, [settings]);

  return (
    <PoliSettingsContext.Provider value={{ ...settings, content, updateSettings, updateContent }}>
      {children}
    </PoliSettingsContext.Provider>
  );
}
