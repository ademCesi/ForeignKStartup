// Clean, soft, modern product design language: light neutral surfaces, bold
// black type, a warm coral accent, and a peach-pink-lavender gradient
// reserved for "highlight" moments (recommendations, AI-ish suggestions).
import { Platform } from 'react-native';

export const Colors = {
  light: {
    background: '#f7f7f9',
    backgroundDeep: '#eeeef2',
    surface: '#ffffff',
    surfaceSelected: '#f1f1f4',
    accentSoft: '#ffe4dc',
    border: '#ececef',
    text: '#15161a',
    textSecondary: '#8a8d93',
    primary: '#15161a',
    primaryDeep: '#000000',
    accent: '#ff6b4a',
    accentDeep: '#e0512f',
    link: '#7c6aef',
    shadow: '#000000',
    onPrimary: '#ffffff',
    onAccent: '#ffffff',
  },
  dark: {
    background: '#0e0e11',
    backgroundDeep: '#08080a',
    surface: '#1b1c20',
    surfaceSelected: '#26272c',
    accentSoft: '#3a241e',
    border: '#2a2b30',
    text: '#f5f5f7',
    textSecondary: '#9a9ca3',
    primary: '#f5f5f7',
    primaryDeep: '#ffffff',
    accent: '#ff7a5c',
    accentDeep: '#ff9478',
    link: '#a996ff',
    shadow: '#000000',
    onPrimary: '#0e0e11',
    onAccent: '#ffffff',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;
export type ThemeColors = { [K in ThemeColor]: string };

// Gradient stops for "highlight" cards (recommendations, tips) - not part of
// ThemeColors since gradients need an ordered array, not a single value.
export const HeroGradient = {
  light: ['#ffe0b2', '#ffc1cc', '#d9c6f7'] as const,
  dark: ['#4a3323', '#4a2233', '#2a2050'] as const,
};

export const AppFonts = {
  display: 'DMSans_800ExtraBold',
  displaySemiBold: 'DMSans_700Bold',
  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
  bodySemiBold: 'DMSans_600SemiBold',
  bodyBold: 'DMSans_700Bold',
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  card: 22,
  pill: 100,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
