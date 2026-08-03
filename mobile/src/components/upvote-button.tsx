import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/hooks/use-theme';

type UpvoteButtonProps = {
  count: number;
  upvoted: boolean;
  onToggle: () => void;
  size?: number;
};

export function UpvoteButton({ count, upvoted, onToggle, size = 18 }: UpvoteButtonProps) {
  const theme = useTheme();
  const { user } = useAuth();
  const { t } = useTranslation();
  const scale = useRef(new Animated.Value(1)).current;
  const [showNotice, setShowNotice] = useState(false);

  function handlePress() {
    if (!user) {
      setShowNotice(true);
      setTimeout(() => setShowNotice(false), 2200);
      return;
    }

    Animated.sequence([
      Animated.spring(scale, { toValue: 1.35, useNativeDriver: true, speed: 50, bounciness: 14 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 6 }),
    ]).start();
    onToggle();
  }

  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={handlePress}
        hitSlop={10}
        style={styles.container}
        accessibilityRole="button"
        accessibilityLabel={upvoted ? 'Remove upvote' : 'Upvote'}
        accessibilityState={{ selected: upvoted }}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <Ionicons
            name={upvoted ? 'arrow-up-circle' : 'arrow-up-circle-outline'}
            size={size}
            color={upvoted ? theme.accent : theme.textSecondary}
          />
        </Animated.View>
        <ThemedText type="small" themeColor={upvoted ? 'accent' : 'textSecondary'}>
          {count}
        </ThemedText>
      </Pressable>

      {showNotice && (
        <View style={[styles.notice, { backgroundColor: theme.primary }]}>
          <ThemedText type="small" style={{ color: theme.onPrimary }}>
            {t('blog.loginRequired')}
          </ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: 'relative' },
  container: { flexDirection: 'row', alignItems: 'center', gap: 4, padding: 4 },
  notice: {
    position: 'absolute',
    bottom: '100%',
    right: 0,
    marginBottom: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.card,
    minWidth: 160,
    zIndex: 10,
  },
});
