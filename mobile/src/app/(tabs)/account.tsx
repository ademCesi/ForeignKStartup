import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandMark } from '@/components/brand-mark';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { ScreenBackground } from '@/components/screen-background';
import { ThemedText } from '@/components/themed-text';
import { AppFonts, BottomTabInset } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/hooks/use-theme';
import { api } from '@/lib/api';
import { emailName } from '@/lib/format';
import { cancelReminder, scheduleReminders, type ReminderNotification } from '@/lib/notifications';

type ProgressStep = { step_id: number; status: 'not_started' | 'in_progress' | 'done' };

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86400000));
}

function reminderTitle(type: string, t: (key: string) => string) {
  const key = `account.reminderTitles.${type}`;
  const translated = t(key);
  return translated === key ? t('account.reminderTitles.default') : translated;
}

export default function AccountScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { user, login, register, logout } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<ReminderNotification[]>([]);
  const [progress, setProgress] = useState<ProgressStep[] | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (!user) return;
      let cancelled = false;

      async function load() {
        const [{ data: notifData }, { data: progressData }] = await Promise.all([
          api.get('/me/notifications'),
          api.get('/me/progress'),
        ]);
        if (cancelled) return;
        setNotifications(notifData);
        scheduleReminders(notifData);
        setProgress(progressData);
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
    const done = progress?.filter((s) => s.status === 'done').length ?? 0;
    const total = progress?.length ?? 0;
    const remaining = total - done;

    let progressMessage: string;
    if (!progress) {
      progressMessage = '';
    } else if (remaining <= 0) {
      progressMessage = t('account.progressDone');
    } else if (remaining === 1) {
      progressMessage = t('account.progressOne');
    } else if (remaining <= 2) {
      progressMessage = t('account.progressFew', { count: remaining });
    } else {
      progressMessage = t('account.progressMany', { count: remaining });
    }

    return (
      <ScreenBackground style={styles.container}>
        <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.safeAreaFlex}>
        <ScrollView contentContainerStyle={styles.safeAreaList}>
          <ThemedText type="title" style={styles.title}>
            {t('account.welcome', { name: emailName(user.email) })}
          </ThemedText>

          {!!progressMessage && (
            <View style={[styles.progressPill, { backgroundColor: theme.accentSoft }]}>
              <ThemedText type="smallBold" themeColor="accent">
                {progressMessage}
              </ThemedText>
            </View>
          )}

          <ThemedText type="subtitle" style={styles.sectionTitle}>
            {t('account.reminders')}
          </ThemedText>

          {upcoming.length === 0 ? (
            <ThemedText themeColor="textSecondary">{t('account.noReminders')}</ThemedText>
          ) : (
            <View style={styles.reminderGrid}>
              {upcoming.map((item) => {
                const days = daysUntil(item.due_date);
                const urgent = days <= 14;
                return (
                  <Card key={item.id} onPress={() => markRead(item.id)} style={styles.reminderCard}>
                    <ThemedText type="smallBold" numberOfLines={2}>
                      {reminderTitle(item.type, t)}
                    </ThemedText>
                    <View style={styles.reminderMiddle}>
                      <ThemedText
                        style={[styles.daysNumber, { color: urgent ? theme.accent : theme.link }]}>
                        {days}
                      </ThemedText>
                      <ThemedText type="small" themeColor="textSecondary">
                        {t('account.daysLeft')}
                      </ThemedText>
                    </View>
                    <ThemedText type="small" themeColor="textSecondary">
                      {new Date(item.due_date).toLocaleDateString()}
                    </ThemedText>
                  </Card>
                );
              })}
            </View>
          )}

          <Button variant="secondary" label={t('account.logout')} onPress={logout} style={styles.actionSpacing} />
        </ScrollView>
        </SafeAreaView>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground style={styles.container}>
      <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.safeArea}>
        <View style={styles.loginHeader}>
          <BrandMark size={56} />
          <ThemedText type="title" style={styles.title}>
            {t(mode === 'login' ? 'account.login' : 'account.register')}
          </ThemedText>
        </View>
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
  safeAreaFlex: { flex: 1 },
  safeAreaList: { paddingHorizontal: 20, gap: 10, paddingTop: 20, paddingBottom: BottomTabInset },
  title: { marginBottom: 2 },
  loginHeader: { alignItems: 'center', gap: 14, marginBottom: 8 },
  sectionTitle: { marginTop: 4 },
  progressPill: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100 },
  reminderGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  reminderCard: {
    width: '47%',
    aspectRatio: 1,
    justifyContent: 'space-between',
  },
  reminderMiddle: { alignItems: 'center' },
  daysNumber: { fontFamily: AppFonts.display, fontSize: 34, lineHeight: 38 },
  input: { padding: 14, borderRadius: 12, borderWidth: 1, fontFamily: AppFonts.body },
  actionSpacing: { marginTop: 8 },
  switchLink: { textAlign: 'center', marginTop: 4 },
});
