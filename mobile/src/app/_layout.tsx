import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
  DMSans_800ExtraBold,
} from '@expo-google-fonts/dm-sans';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { AuthProvider } from '@/context/auth-context';
import { ThemeSchemeProvider, useThemeScheme } from '@/context/theme-context';
import '@/i18n';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
    DMSans_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <ThemeSchemeProvider>
      <AuthProvider>
        <RootNavigation />
      </AuthProvider>
    </ThemeSchemeProvider>
  );
}

function RootNavigation() {
  const { scheme, colors } = useThemeScheme();

  const navigationTheme = {
    ...(scheme === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(scheme === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.background,
      card: colors.surface,
      text: colors.primary,
      border: colors.border,
      primary: colors.accent,
    },
  };

  const headerScreenOptions = {
    headerShown: true,
    title: '',
    headerStyle: { backgroundColor: colors.surface },
    headerTintColor: colors.accent,
    headerShadowVisible: false,
  };

  return (
    <ThemeProvider value={navigationTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="step/[id]" options={headerScreenOptions} />
        <Stack.Screen name="faq/[id]" options={headerScreenOptions} />
      </Stack>
    </ThemeProvider>
  );
}
