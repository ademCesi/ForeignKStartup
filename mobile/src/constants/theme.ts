// Palette and type ramp ported from the showcase website
// (src/app/styles/*.scss): warm cream background, navy for headings, a
// brick-red accent, Playfair Display for display type, DM Sans for body.
import { Platform } from 'react-native';

export const Colors = {
  light: {
    background: '#f8f7f4',
    backgroundDeep: '#efe9e0',
    surface: '#ffffff',
    surfaceSelected: '#fbeae8',
    border: '#e5e7eb',
    text: '#1a1a2e',
    textSecondary: '#6b7280',
    primary: '#0A2540',
    primaryDeep: '#061626',
    accent: '#C8372D',
    accentDeep: '#8f2519',
    link: '#7C3AED',
    onPrimary: '#ffffff',
    onAccent: '#ffffff',
  },
  dark: {
    background: '#12161f',
    backgroundDeep: '#090b11',
    surface: '#1c2230',
    surfaceSelected: '#3a201d',
    border: '#2c3341',
    text: '#f5f3ee',
    textSecondary: '#9aa3b7',
    primary: '#f5f3ee',
    primaryDeep: '#ffffff',
    accent: '#e2584a',
    accentDeep: '#a83324',
    link: '#b295f5',
    onPrimary: '#12161f',
    onAccent: '#ffffff',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;
export type ThemeColors = { [K in ThemeColor]: string };

export const AppFonts = {
  display: 'PlayfairDisplay_700Bold',
  displaySemiBold: 'PlayfairDisplay_600SemiBold',
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
  card: 14,
  pill: 100,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
