import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';

import { useThemeScheme } from '@/context/theme-context';

const TRACK_WIDTH = 54;
const TRACK_HEIGHT = 28;
const THUMB_SIZE = 22;
const THUMB_MARGIN = 3;

export function ThemeToggle() {
  const { scheme, colors, toggle } = useThemeScheme();
  const anim = useRef(new Animated.Value(scheme === 'dark' ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: scheme === 'dark' ? 1 : 0,
      useNativeDriver: false,
      speed: 18,
      bounciness: 6,
    }).start();
  }, [scheme, anim]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [THUMB_MARGIN, TRACK_WIDTH - THUMB_SIZE - THUMB_MARGIN],
  });

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: scheme === 'dark' }}
      onPress={toggle}
      style={[styles.track, { backgroundColor: colors.surfaceSelected, borderColor: colors.border }]}>
      <Animated.View style={[styles.thumb, { backgroundColor: colors.accent, transform: [{ translateX }] }]}>
        <Ionicons name={scheme === 'dark' ? 'moon' : 'sunny'} size={13} color={colors.onAccent} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    borderWidth: 1,
    justifyContent: 'center',
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
