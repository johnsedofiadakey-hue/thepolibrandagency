"use client";
import React from 'react';

export const SettingsContext = React.createContext({
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
  updateSettings: (newSettings: any) => { },
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

  const updateSettings = (newSettings: any) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  React.useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data));
  }, []);

  React.useEffect(() => {
    const root = document.documentElement;
    const theme = settings.theme;
    if (theme) {
      root.style.setProperty('--color-primary', theme.primary);
      root.style.setProperty('--color-secondary', theme.secondary);
      root.style.setProperty('--color-accent', theme.accent);
      root.style.setProperty('--color-bg', theme.background);
      root.style.setProperty('--color-text', theme.text);
      root.style.setProperty('--hero-image', theme.heroImage ? `url(${theme.heroImage})` : 'none');

      // Handle dark variants using CSS color-mix for automatic contrast
      root.style.setProperty('--color-primary-dark', `color-mix(in srgb, ${theme.primary}, black 20%)`);
      root.style.setProperty('--color-secondary-dark', `color-mix(in srgb, ${theme.secondary}, black 20%)`);
    }

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
    <SettingsContext.Provider value={{ ...settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}
