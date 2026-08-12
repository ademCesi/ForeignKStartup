import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

// The app's logo mark: a flat coral badge with three ascending bars - a
// "rising path", echoing the step-by-step roadmap at the heart of the app.
// Drawn from primitives so no image asset is needed.
export function BrandMark({ size = 32 }: { size?: number }) {
  const theme = useTheme();
  const barWidth = Math.max(2, Math.round(size * 0.13));
  const gap = Math.max(1, Math.round(size * 0.08));
  const heights = [0.34, 0.52, 0.7].map((ratio) => Math.round(size * ratio));

  return (
    <View style={[styles.badge, { width: size, height: size, borderRadius: size * 0.32, backgroundColor: theme.accent }]}>
      <View style={[styles.bars, { gap }]}>
        {heights.map((height, index) => (
          <View
            key={index}
            style={{
              width: barWidth,
              height,
              borderRadius: barWidth / 2,
              backgroundColor: theme.onAccent,
              opacity: 0.55 + index * 0.225,
            }}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignItems: 'center', justifyContent: 'center' },
  bars: { flexDirection: 'row', alignItems: 'flex-end' },
});
