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
    }
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ ...settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}
