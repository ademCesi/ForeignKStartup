import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemeToggle } from '@/components/theme-toggle';
import { AppFonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function AppHeader() {
  const theme = useTheme();

  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: theme.background }}>
      <View style={styles.row}>
        <Text style={styles.wordmark}>
          <Text style={{ fontFamily: AppFonts.bodySemiBold, color: theme.textSecondary }}>Foreign</Text>
          <Text style={{ fontFamily: AppFonts.display, color: theme.primary }}> K-Startup</Text>
          <Text style={{ fontFamily: AppFonts.display, color: theme.accent, fontSize: 22 }}>*</Text>
        </Text>
        <ThemeToggle />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },
  wordmark: {
    fontSize: 17,
  },
});
