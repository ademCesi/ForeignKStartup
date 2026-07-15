import { Pressable, View, StyleSheet, type PressableProps, type ViewProps } from 'react-native';

import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type CardProps = ViewProps & Pick<PressableProps, 'onPress'>;

export function Card({ style, onPress, ...rest }: CardProps) {
  const theme = useTheme();
  const Component = onPress ? Pressable : View;

  return (
    <Component
      onPress={onPress}
      style={[
        styles.card,
        { backgroundColor: theme.surface, borderColor: theme.border, shadowColor: theme.primary },
        style,
      ]}
      {...rest}
    />
  );
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
});
