import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle, type PressableProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AppFonts, Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ButtonProps = Omit<PressableProps, 'style'> & {
  label: string;
  variant?: 'primary' | 'secondary';
  style?: StyleProp<ViewStyle>;
};

export function Button({ label, variant = 'primary', style, ...rest }: ButtonProps) {
  const theme = useTheme();

  if (variant === 'secondary') {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border },
          pressed && styles.pressed,
          style,
        ]}
        {...rest}>
        <ThemedText style={{ color: theme.primary, fontFamily: AppFonts.bodySemiBold }}>{label}</ThemedText>
      </Pressable>
    );
  }

  return (
    <Pressable style={({ pressed }) => [pressed && styles.pressed, style]} {...rest}>
      <LinearGradient
        colors={[theme.accent, theme.accentDeep]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.button, styles.glow, { shadowColor: theme.accent }]}>
        <ThemedText style={{ color: theme.onAccent, fontFamily: AppFonts.bodySemiBold }}>{label}</ThemedText>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: Radius.pill,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  glow: {
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
});
