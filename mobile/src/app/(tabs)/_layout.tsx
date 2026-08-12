import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { AppHeader } from '@/components/app-header';
import { CustomTabBar } from '@/components/custom-tab-bar';

export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...(props as Parameters<typeof CustomTabBar>[0])} />}
      screenOptions={{
        headerShown: true,
        header: () => <AppHeader />,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.roadmap'),
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'home' : 'home-outline'} size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="glossary"
        options={{
          title: t('tabs.glossary'),
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'book' : 'book-outline'} size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="blog"
        options={{
          title: t('tabs.blog'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'chatbubbles' : 'chatbubbles-outline'} size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: t('tabs.account'),
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'person' : 'person-outline'} size={20} color={color} />,
        }}
      />
    </Tabs>
  );
}
