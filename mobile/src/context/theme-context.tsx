import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { Colors, type ThemeColors } from '@/constants/theme';
import { storage } from '@/lib/storage';

const THEME_KEY = 'fks_theme_override';
type SchemeOverride = 'light' | 'dark' | null;

type ThemeContextValue = {
  scheme: 'light' | 'dark';
  colors: ThemeColors;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeSchemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [override, setOverrideState] = useState<SchemeOverride>(null);

  useEffect(() => {
    (async () => {
      const stored = await storage.getItem(THEME_KEY);
      if (stored === 'light' || stored === 'dark') setOverrideState(stored);
    })();
  }, []);

  const scheme: 'light' | 'dark' = override ?? (systemScheme === 'dark' ? 'dark' : 'light');

  function toggle() {
    const next = scheme === 'dark' ? 'light' : 'dark';
    setOverrideState(next);
    storage.setItem(THEME_KEY, next);
  }

  const value = useMemo(() => ({ scheme, colors: Colors[scheme], toggle }), [scheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeScheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useThemeScheme must be used within a ThemeSchemeProvider');
  }
  return ctx;
}
