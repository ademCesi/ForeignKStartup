import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

export function ScreenBackground({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const theme = useTheme();

  return (
    <LinearGradient colors={[theme.background, theme.backgroundDeep]} style={style}>
      {children}
    </LinearGradient>
  );
}
