import React, { createContext, useContext, useState } from 'react';

export type Theme = {
  isDark: boolean;
  bg: string; bgCard: string; bgListItem: string;
  primary: string; primaryBtn: string; primaryBtnText: string;
  textMain: string; textSub: string; textDim: string; border: string;
  ringTrackProtein: string; ringTrackCarbs: string; ringTrackFats: string;
  accentProtein: string; accentCarbs: string; accentFats: string;
  chatUserBg: string; inputBg: string; inputBorder: string;
  limitColor: string; avatarBorder: string;
  sendBtnBg: string; sendBtnIcon: string;
  glowProtein: string; glowCarbs: string; glowFats: string;
};

const dark: Theme = {
  isDark: true, bg: '#0d0d0d', bgCard: '#161616', bgListItem: '#1c1c1c',
  primary: '#39ff14', primaryBtn: '#39ff14', primaryBtnText: '#000000',
  textMain: '#ffffff', textSub: '#a0a0a0', textDim: '#666666', border: '#2a2a2a',
  ringTrackProtein: '#112211', ringTrackCarbs: '#0a1a22', ringTrackFats: '#221105',
  accentProtein: '#39ff14', accentCarbs: '#00d2ff', accentFats: '#ff7300',
  chatUserBg: '#2a2a2a', inputBg: '#161616', inputBorder: '#333333',
  limitColor: '#ff3b30', avatarBorder: '#666666',
  sendBtnBg: '#39ff14', sendBtnIcon: '#000000',
  glowProtein: 'rgba(57,255,20,0.4)', glowCarbs: 'rgba(0,210,255,0.4)', glowFats: 'rgba(255,115,0,0.4)',
};

const light: Theme = {
  isDark: false, bg: '#f0f2f0', bgCard: '#e8ebe8', bgListItem: '#ffffff',
  primary: '#124c31', primaryBtn: '#124c31', primaryBtnText: '#ffffff',
  textMain: '#222222', textSub: '#888888', textDim: '#aaaaaa', border: '#e0e0e0',
  ringTrackProtein: '#e0e0e0', ringTrackCarbs: '#e0e0e0', ringTrackFats: '#e0e0e0',
  accentProtein: '#9d5f15', accentCarbs: '#5d9e26', accentFats: '#0b682d',
  chatUserBg: '#e0e0e0', inputBg: '#ffffff', inputBorder: '#cccccc',
  limitColor: '#cc2200', avatarBorder: '#cccccc',
  sendBtnBg: '#124c31', sendBtnIcon: '#ffffff',
  glowProtein: 'transparent', glowCarbs: 'transparent', glowFats: 'transparent',
};

type ThemeContextType = { theme: Theme; toggleTheme: () => void };
const ThemeContext = createContext<ThemeContextType>({ theme: dark, toggleTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true);
  return (
    <ThemeContext.Provider value={{ theme: isDark ? dark : light, toggleTheme: () => setIsDark(v => !v) }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
