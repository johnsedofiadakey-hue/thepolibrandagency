"use client";
import React from 'react';

export const SettingsContext = React.createContext({
  theme: {
    primary: '#1F6F3E',
    secondary: '#C9A227',
    accent: '#B22222',
    background: '#F9F6F1',
    text: '#111111',
  },
  typography: 'institutional',
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = React.useState({
    theme: {
      primary: '#1F6F3E',
      secondary: '#C9A227',
      accent: '#B22222',
      background: '#F9F6F1',
      text: '#111111',
    },
    typography: 'institutional',
  });

  React.useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data));
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}
