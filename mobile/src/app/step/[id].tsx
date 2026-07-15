import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
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

type FundingProgram = {
  id: number;
  name: string;
  type: string;
  description: string;
  eligibility: string;
  url: string | null;
};

type Step = {
  id: number;
  step_order: number;
  title: string;
  description: string;
  details: string | null;
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
  const [fundingPrograms, setFundingPrograms] = useState<FundingProgram[] | null>(null);

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

        if (data.step_order === 7) {
          const { data: programs } = await api.get('/funding');
          if (!cancelled) setFundingPrograms(programs);
        }
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
          <ThemedText type="eyebrow">
            {t('step.eyebrow')} {step.step_order}
          </ThemedText>
          <ThemedText type="title" style={styles.title}>
            {step.title}
          </ThemedText>
          <ThemedText themeColor="textSecondary">{step.description}</ThemedText>
          {step.details && <ThemedText style={styles.details}>{step.details}</ThemedText>}

          {fundingPrograms && (
            <>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                {t('step.fundingPrograms')}
              </ThemedText>
              {fundingPrograms.map((program) => (
                <Card key={program.id} onPress={() => program.url && Linking.openURL(program.url)} style={styles.stackGap}>
                  <ThemedText type="smallBold">{program.name}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {program.description}
                  </ThemedText>
                  <ThemedText type="small">{program.eligibility}</ThemedText>
                </Card>
              ))}
            </>
          )}

          <ThemedText type="subtitle" style={styles.sectionTitle}>
            {t('step.documents')}
          </ThemedText>
          {step.documents.map((doc) => (
            <Card key={doc.id} onPress={() => toggleDocument(doc)} style={styles.docRow}>
              <Ionicons
                name={doc.status === 'ready' ? 'checkbox' : 'square-outline'}
                size={20}
                color={doc.status === 'ready' ? theme.accent : theme.textSecondary}
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
            </Card>
          ))}
          {!user && (
            <ThemedText type="small" themeColor="textSecondary">
              {t('step.loginToTrack')}
            </ThemedText>
          )}

          {step.official_url && (
            <Button
              variant="secondary"
              label={t('step.openOfficial')}
              onPress={() => Linking.openURL(step.official_url!)}
              style={styles.actionSpacing}
            />
          )}

          {user && (
            <Button
              label={done ? t('step.markNotDone') : t('step.markDone')}
              onPress={toggleDone}
              style={styles.actionSpacing}
            />
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
  title: { marginBottom: 2 },
  details: { lineHeight: 22 },
  sectionTitle: { marginTop: 8 },
  stackGap: { gap: 4 },
  docRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  docText: { flex: 1, backgroundColor: 'transparent' },
  actionSpacing: { marginTop: 8 },
});
