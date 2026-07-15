import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/hooks/use-theme';

export default function AccountScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { user, login, register, logout } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

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

  if (user) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ThemedText type="title" style={styles.title}>
            {t('account.welcome', { email: user.email })}
          </ThemedText>
          <ThemedText themeColor="textSecondary">
            {t('account.language')}: {user.language}
          </ThemedText>
          <ThemedText themeColor="textSecondary">
            {t('account.targetVisa')}: {user.target_visa ?? '—'}
          </ThemedText>
          <Pressable style={[styles.button, { backgroundColor: theme.backgroundElement }]} onPress={logout}>
            <ThemedText>{t('account.logout')}</ThemedText>
          </Pressable>
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
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
          style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }]}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder={t('account.password')}
          placeholderTextColor={theme.textSecondary}
          secureTextEntry
          style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }]}
        />
        {error && (
          <ThemedText type="small" style={styles.error}>
            {error}
          </ThemedText>
        )}
        <Pressable style={[styles.button, { backgroundColor: theme.backgroundSelected }]} onPress={submit}>
          <ThemedText>{t('account.submit')}</ThemedText>
        </Pressable>
        <Pressable onPress={() => setMode(mode === 'login' ? 'register' : 'login')}>
          <ThemedText type="link" themeColor="textSecondary">
            {t(mode === 'login' ? 'account.switchToRegister' : 'account.switchToLogin')}
          </ThemedText>
        </Pressable>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: 20, gap: 12, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 8 },
  input: { padding: 14, borderRadius: 10 },
  button: { padding: 14, borderRadius: 10, alignItems: 'center' },
  error: { color: '#d9534f' },
});
