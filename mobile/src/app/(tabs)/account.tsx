import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { ScreenBackground } from '@/components/screen-background';
import { ThemedText } from '@/components/themed-text';
import { AppFonts } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/hooks/use-theme';
import { api } from '@/lib/api';
import { cancelReminder, scheduleReminders, type ReminderNotification } from '@/lib/notifications';

export default function AccountScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { user, login, register, logout } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<ReminderNotification[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (!user) return;
      let cancelled = false;

      async function load() {
        const { data } = await api.get('/me/notifications');
        if (cancelled) return;
        setNotifications(data);
        scheduleReminders(data);
      }

      load();
      return () => {
        cancelled = true;
      };
    }, [user])
  );

  async function submit() {
    setError(null);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password);
      }
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'Something went wrong');
    }
  }

  async function markRead(id: number) {
    await api.patch(`/me/notifications/${id}`);
    await cancelReminder(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, sent: true } : n)));
  }

  if (user) {
    const upcoming = notifications.filter((n) => !n.sent);

    return (
      <ScreenBackground style={styles.container}>
        <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.safeAreaList}>
          <ThemedText type="title" style={styles.title}>
            {t('account.welcome', { email: user.email })}
          </ThemedText>
          <ThemedText themeColor="textSecondary">
            {t('account.language')}: {user.language}
          </ThemedText>
          <ThemedText themeColor="textSecondary">
            {t('account.targetVisa')}: {user.target_visa ?? '—'}
          </ThemedText>

          <ThemedText type="subtitle" style={styles.sectionTitle}>
            {t('account.reminders')}
          </ThemedText>
          <FlatList
            data={upcoming}
            keyExtractor={(item) => String(item.id)}
            style={styles.reminderList}
            ListEmptyComponent={<ThemedText themeColor="textSecondary">{t('account.noReminders')}</ThemedText>}
            renderItem={({ item }) => (
              <Card onPress={() => markRead(item.id)} style={styles.reminderCard}>
                <ThemedText>{item.message}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {new Date(item.due_date).toLocaleDateString()}
                </ThemedText>
              </Card>
            )}
          />

          <Button variant="secondary" label={t('account.logout')} onPress={logout} style={styles.actionSpacing} />
        </SafeAreaView>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground style={styles.container}>
      <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.safeArea}>
        <ThemedText type="title" style={styles.title}>
          {t(mode === 'login' ? 'account.login' : 'account.register')}
        </ThemedText>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder={t('account.email')}
          placeholderTextColor={theme.textSecondary}
          autoCapitalize="none"
          keyboardType="email-address"
          style={[
            styles.input,
            { color: theme.text, backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder={t('account.password')}
          placeholderTextColor={theme.textSecondary}
          secureTextEntry
          style={[
            styles.input,
            { color: theme.text, backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        />
        {error && (
          <ThemedText type="small" themeColor="accent">
            {error}
          </ThemedText>
        )}
        <Button label={t('account.submit')} onPress={submit} />
        <ThemedText
          type="link"
          themeColor="link"
          style={styles.switchLink}
          onPress={() => setMode(mode === 'login' ? 'register' : 'login')}>
          {t(mode === 'login' ? 'account.switchToRegister' : 'account.switchToLogin')}
        </ThemedText>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: 20, gap: 12, justifyContent: 'center' },
  safeAreaList: { flex: 1, paddingHorizontal: 20, gap: 8, paddingTop: 20 },
  title: { marginBottom: 6 },
  sectionTitle: { marginTop: 8 },
  reminderList: { flexGrow: 0 },
  reminderCard: { marginBottom: 8, gap: 2 },
  input: { padding: 14, borderRadius: 12, borderWidth: 1, fontFamily: AppFonts.body },
  actionSpacing: { marginTop: 8 },
  switchLink: { textAlign: 'center', marginTop: 4 },
});
