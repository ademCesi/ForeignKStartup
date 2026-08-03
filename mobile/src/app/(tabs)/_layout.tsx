import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, type ColorValue } from 'react-native';

import { AppHeader } from '@/components/app-header';
import { AppFonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type IconName = keyof typeof Ionicons.glyphMap;

function TabIcon({
  name,
  color,
  focused,
  tint,
}: {
  name: IconName;
  color: ColorValue;
  focused: boolean;
  tint: string;
}) {
  return (
    <View style={[styles.iconPill, focused && { backgroundColor: tint }]}>
      <Ionicons name={name} size={20} color={color} />
    </View>
  );
}

export default function TabsLayout() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        header: () => <AppHeader />,
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: [
          styles.tabBar,
          { backgroundColor: theme.surface, shadowColor: theme.shadow },
        ],
        tabBarItemStyle: styles.tabItem,
        tabBarLabelStyle: { fontFamily: AppFonts.bodyMedium, fontSize: 11 },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.roadmap'),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'map' : 'map-outline'} color={color} focused={focused} tint={theme.surfaceSelected} />
          ),
        }}
      />
      <Tabs.Screen
        name="glossary"
        options={{
          title: t('tabs.glossary'),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'book' : 'book-outline'} color={color} focused={focused} tint={theme.surfaceSelected} />
          ),
        }}
      />
      <Tabs.Screen
        name="blog"
        options={{
          title: t('tabs.blog'),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name={focused ? 'chatbubbles' : 'chatbubbles-outline'}
              color={color}
              focused={focused}
              tint={theme.surfaceSelected}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: t('tabs.account'),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'person' : 'person-outline'} color={color} focused={focused} tint={theme.surfaceSelected} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: 72,
    paddingTop: 8,
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -4 },
    elevation: 12,
  },
  tabItem: { paddingTop: 2 },
  iconPill: {
    paddingHorizontal: 18,
    paddingVertical: 4,
    borderRadius: 16,
  },
});
