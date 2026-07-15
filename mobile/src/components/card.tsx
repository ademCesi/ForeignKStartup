import { Pressable, View, StyleSheet, type PressableProps, type ViewProps } from 'react-native';

import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type CardProps = ViewProps & Pick<PressableProps, 'onPress'>;

export function Card({ style, onPress, ...rest }: CardProps) {
  const theme = useTheme();
  const baseStyle = [
    styles.card,
    { backgroundColor: theme.surface, borderColor: theme.border, shadowColor: theme.primary },
    style,
  ];

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [...baseStyle, pressed && styles.pressed]} {...rest} />
    );
  }

  return <View style={baseStyle} {...rest} />;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.card,
    borderWidth: 1,
    padding: 14,
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
});
