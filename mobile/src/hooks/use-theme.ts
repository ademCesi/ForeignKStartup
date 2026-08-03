import { useThemeScheme } from '@/context/theme-context';

export function useTheme() {
  return useThemeScheme().colors;
}
