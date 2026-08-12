// Warm, modern product design language: cream/plum surfaces, bold type, one
// consistent coral accent used everywhere, and a single berry "highlight"
// color reserved for warnings/callouts. Flat colors only - no gradients.

export const Colors = {
  light: {
    background: '#fff8f0',
    backgroundDeep: '#ffeee0',
    surface: '#ffffff',
    surfaceSelected: '#fff1e6',
    border: '#f1e4d8',
    text: '#1f1a2e',
    textSecondary: '#8d8296',
    primary: '#1f1a2e',
    primaryDeep: '#000000',

    accent: '#ff6a3d',
    accentDeep: '#e5501f',
    accentSoft: '#ffe0d1',
    onAccent: '#ffffff',

    highlight: '#e0447b',
    highlightDeep: '#b52f61',
    highlightSoft: '#fbe1ec',
    onHighlight: '#ffffff',

    link: '#8b5cf6',
    success: '#22a35c',
    shadow: '#000000',
    onPrimary: '#ffffff',
    onSuccess: '#ffffff',
  },
  dark: {
    background: '#15121c',
    backgroundDeep: '#0c0a12',
    surface: '#211d2b',
    surfaceSelected: '#2c2638',
    border: '#332c40',
    text: '#f7f3ee',
    textSecondary: '#a79bbd',
    primary: '#f7f3ee',
    primaryDeep: '#ffffff',

    accent: '#ff8a5c',
    accentDeep: '#ff6a3d',
    accentSoft: '#3a2a22',
    onAccent: '#1f1a2e',

    highlight: '#ff6fa0',
    highlightDeep: '#e0447b',
    highlightSoft: '#3a1f2b',
    onHighlight: '#1f1a2e',

    link: '#b794f6',
    success: '#3ecb7e',
    shadow: '#000000',
    onPrimary: '#15121c',
    onSuccess: '#0e0e11',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;
export type ThemeColors = { [K in ThemeColor]: string };

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

// Clearance so scrollable content doesn't sit behind the floating tab bar.
export const BottomTabInset = 110;
export const MaxContentWidth = 800;
