import { Text, type TextProps } from 'react-native';

import { AppFonts, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'small' | 'smallBold' | 'subtitle' | 'link' | 'linkPrimary' | 'code' | 'eyebrow';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();
  const color = theme[themeColor ?? (type === 'title' || type === 'subtitle' ? 'primary' : 'text')];

  return (
    <Text
      style={[
        { color },
        type === 'default' && styles.default,
        type === 'title' && styles.title,
        type === 'small' && styles.small,
        type === 'smallBold' && styles.smallBold,
        type === 'subtitle' && styles.subtitle,
        type === 'link' && [styles.link, { color: theme.link }],
        type === 'linkPrimary' && [styles.link, { color: theme.accent }],
        type === 'code' && styles.code,
        type === 'eyebrow' && [styles.eyebrow, { color: theme.accent }],
        style,
      ]}
      {...rest}
    />
  );
}

const styles = {
  small: {
    fontFamily: AppFonts.bodyMedium,
    fontSize: 13,
    lineHeight: 19,
  },
  smallBold: {
    fontFamily: AppFonts.bodyBold,
    fontSize: 13,
    lineHeight: 19,
  },
  default: {
    fontFamily: AppFonts.body,
    fontSize: 15,
    lineHeight: 23,
  },
  title: {
    fontFamily: AppFonts.display,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: AppFonts.displaySemiBold,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.3,
  },
  link: {
    fontFamily: AppFonts.bodyMedium,
    fontSize: 14,
    lineHeight: 22,
  },
  eyebrow: {
    fontFamily: AppFonts.bodyBold,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
  },
  code: {
    fontFamily: AppFonts.bodyMedium,
    fontSize: 12,
  },
};
