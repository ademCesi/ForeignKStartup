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
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: isPrimary ? theme.primary : theme.surfaceSelected,
          shadowColor: theme.shadow,
        },
        isPrimary && styles.shadow,
        pressed && styles.pressed,
        style,
      ]}
      {...rest}>
      <ThemedText
        style={{ color: isPrimary ? theme.onPrimary : theme.text, fontFamily: AppFonts.bodySemiBold }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: Radius.pill,
    paddingVertical: 15,
    paddingHorizontal: 22,
    alignItems: 'center',
  },
  shadow: {
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
});
