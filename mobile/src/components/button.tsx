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
      style={[
        styles.button,
        {
          backgroundColor: isPrimary ? theme.accent : theme.surface,
          borderColor: isPrimary ? theme.accent : theme.border,
        },
        style,
      ]}
      {...rest}>
      <ThemedText style={{ color: isPrimary ? theme.onAccent : theme.primary, fontFamily: AppFonts.bodySemiBold }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderRadius: Radius.pill,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
});
