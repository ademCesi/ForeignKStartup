import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/hooks/use-theme';
import { api } from '@/lib/api';

type StepDocument = {
  id: number;
  name: string;
  needs_apostille: boolean;
  needs_translation: boolean;
  status?: 'pending' | 'ready';
};

type Step = {
  id: number;
  title: string;
  description: string;
  official_url: string | null;
  documents: StepDocument[];
};

export default function StepDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const theme = useTheme();
  const { user } = useAuth();
  const [step, setStep] = useState<Step | null>(null);
  const [done, setDone] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      async function load() {
        const { data } = await api.get(`/roadmap/${id}`);
        let documents = data.documents;

        if (user) {
          const { data: userDocs } = await api.get('/me/documents');
          const statusByDoc = new Map(userDocs.map((d: any) => [d.document_id, d.status]));
          documents = documents.map((doc: StepDocument) => ({ ...doc, status: statusByDoc.get(doc.id) ?? 'pending' }));

          const { data: progress } = await api.get('/me/progress');
          const current = progress.find((p: any) => p.step_id === Number(id));
          if (!cancelled) setDone(current?.status === 'done');
        }

        if (!cancelled) setStep({ ...data, documents });
      }

      load();
      return () => {
        cancelled = true;
      };
    }, [id, user])
  );

  async function toggleDocument(doc: StepDocument) {
    if (!user || !step) return;
    const nextStatus = doc.status === 'ready' ? 'pending' : 'ready';
    await api.patch(`/me/documents/${doc.id}`, { status: nextStatus });
    setStep({
      ...step,
      documents: step.documents.map((d) => (d.id === doc.id ? { ...d, status: nextStatus } : d)),
    });
  }

  async function toggleDone() {
    if (!user) return;
    const nextStatus = done ? 'not_started' : 'done';
    await api.patch(`/me/progress/${id}`, { status: nextStatus });
    setDone(!done);
  }

  if (!step) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <ThemedText type="title" style={styles.title}>
            {step.title}
          </ThemedText>
          <ThemedText themeColor="textSecondary">{step.description}</ThemedText>

          <ThemedText type="subtitle" style={styles.sectionTitle}>
            {t('step.documents')}
          </ThemedText>
          {step.documents.map((doc) => (
            <Pressable
              key={doc.id}
              onPress={() => toggleDocument(doc)}
              style={[styles.docRow, { backgroundColor: theme.backgroundElement }]}>
              <Ionicons
                name={doc.status === 'ready' ? 'checkbox' : 'square-outline'}
                size={20}
                color={doc.status === 'ready' ? theme.text : theme.textSecondary}
              />
              <ThemedView style={styles.docText}>
                <ThemedText>{doc.name}</ThemedText>
                {(doc.needs_apostille || doc.needs_translation) && (
                  <ThemedText type="small" themeColor="textSecondary">
                    {[doc.needs_apostille && t('step.needsApostille'), doc.needs_translation && t('step.needsTranslation')]
                      .filter(Boolean)
                      .join(' · ')}
                  </ThemedText>
                )}
              </ThemedView>
            </Pressable>
          ))}
          {!user && (
            <ThemedText type="small" themeColor="textSecondary">
              {t('step.loginToTrack')}
            </ThemedText>
          )}

          {step.official_url && (
            <Pressable
              style={[styles.button, { backgroundColor: theme.backgroundElement }]}
              onPress={() => Linking.openURL(step.official_url!)}>
              <ThemedText>{t('step.openOfficial')}</ThemedText>
            </Pressable>
          )}

          {user && (
            <Pressable style={[styles.button, { backgroundColor: theme.backgroundSelected }]} onPress={toggleDone}>
              <ThemedText>{done ? t('step.markNotDone') : t('step.markDone')}</ThemedText>
            </Pressable>
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scroll: { padding: 20, gap: 12 },
  title: { fontSize: 24 },
  sectionTitle: { fontSize: 18, marginTop: 8 },
  docRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 10 },
  docText: { flex: 1, backgroundColor: 'transparent' },
  button: { padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 8 },
});
