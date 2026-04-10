import { Platform } from 'react-native';

const primaryGreenDark = '#39ff14';
const primaryGreenLight = '#124c31';

export const Colors = {
  light: {
    text: '#222222',
    textSub: '#888888',
    textDim: '#aaaaaa',
    background: '#e9ecef', 
    mainBg: '#fcfcfc',     
    card: '#f5f5f5',
    listItem: '#ffffff',
    border: '#e0e0e0',
    primary: primaryGreenLight,
    protein: '#9d5f15',
    carbs: '#5d9e26',
    fats: '#0b682d',
    ringTrack: '#e0e0e0',
    ringTrack1: '#e0e0e0',
    ringTrack2: '#e0e0e0',
    ringTrack3: '#e0e0e0',
    limit: '#ff3b30',
  },
  dark: {
    text: '#ffffff',
    textSub: '#a0a0a0',
    textDim: '#666666',
    background: '#222222',
    mainBg: '#0d0d0d',
    card: '#161616',
    listItem: '#1c1c1c',
    border: '#2a2a2a',
    primary: primaryGreenDark,
    protein: primaryGreenDark,
    carbs: '#00d2ff',
    fats: '#ff7300',
    ringTrack: '#112211',
    ringTrack1: '#112211',
    ringTrack2: '#0a1a22',
    ringTrack3: '#221105',
    limit: '#ff3b30',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});