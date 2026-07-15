import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { api } from '@/lib/api';

type Answers = {
  hasCompany?: boolean;
  ipStatus?: 'patent' | 'prototype' | 'none';
  capitalAvailable?: boolean;
  acceleratorSelected?: boolean;
  hasLongTermResidence?: boolean;
};

type Visa = { id: number; code: string; name: string; duration: string; best_for: string };

function useQuestions() {
  const { t } = useTranslation();
  return [
    { key: 'hasCompany', label: t('visa.q1'), options: [{ label: t('visa.yes'), value: true }, { label: t('visa.no'), value: false }] },
    {
      key: 'ipStatus',
      label: t('visa.q2'),
      options: [
        { label: t('visa.q2_patent'), value: 'patent' },
        { label: t('visa.q2_prototype'), value: 'prototype' },
        { label: t('visa.q2_none'), value: 'none' },
      ],
    },
    { key: 'capitalAvailable', label: t('visa.q3'), options: [{ label: t('visa.yes'), value: true }, { label: t('visa.no'), value: false }] },
    { key: 'acceleratorSelected', label: t('visa.q4'), options: [{ label: t('visa.yes'), value: true }, { label: t('visa.no'), value: false }] },
    { key: 'hasLongTermResidence', label: t('visa.q5'), options: [{ label: t('visa.yes'), value: true }, { label: t('visa.no'), value: false }] },
  ] as const;
}

export default function VisaScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const questions = useQuestions();
  const [answers, setAnswers] = useState<Answers>({});
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<{ recommendation: Visa; reason: string } | null>(null);
  const [allVisas, setAllVisas] = useState<Visa[] | null>(null);

  async function answer(key: string, value: unknown) {
    const next = { ...answers, [key]: value };
    setAnswers(next);
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      return;
    }
    const { data } = await api.post('/visas/recommend', next);
    setResult(data);
  }

  async function loadAllVisas() {
    const { data } = await api.get('/visas');
    setAllVisas(data);
  }

  function startOver() {
    setAnswers({});
    setIndex(0);
    setResult(null);
    setAllVisas(null);
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <ThemedText type="title" style={styles.title}>
            {t('visa.title')}
          </ThemedText>

          {!result ? (
            <>
              <ThemedText themeColor="textSecondary">
                {t('visa.question', { current: index + 1, total: questions.length })}
              </ThemedText>
              <ThemedText type="subtitle" style={styles.question}>
                {questions[index].label}
              </ThemedText>
              {questions[index].options.map((option) => (
                <Pressable
                  key={String(option.value)}
                  style={[styles.option, { backgroundColor: theme.backgroundElement }]}
                  onPress={() => answer(questions[index].key, option.value)}>
                  <ThemedText>{option.label}</ThemedText>
                </Pressable>
              ))}
            </>
          ) : (
            <>
              <ThemedView type="backgroundElement" style={styles.resultCard}>
                <ThemedText type="small" themeColor="textSecondary">
                  {t('visa.recommended')}
                </ThemedText>
                <ThemedText type="subtitle">{result.recommendation.code}</ThemedText>
                <ThemedText>{result.recommendation.name}</ThemedText>
                <ThemedText themeColor="textSecondary">{result.reason}</ThemedText>
              </ThemedView>

              <Pressable style={[styles.button, { backgroundColor: theme.backgroundElement }]} onPress={loadAllVisas}>
                <ThemedText>{t('visa.compareAll')}</ThemedText>
              </Pressable>

              {allVisas?.map((visa) => (
                <ThemedView key={visa.code} type="backgroundElement" style={styles.visaCard}>
                  <ThemedText type="smallBold">
                    {visa.code} · {visa.name}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {visa.duration}
                  </ThemedText>
                  <ThemedText type="small">{visa.best_for}</ThemedText>
                </ThemedView>
              ))}

              <Pressable style={[styles.button, { backgroundColor: theme.backgroundSelected }]} onPress={startOver}>
                <ThemedText>{t('visa.startOver')}</ThemedText>
              </Pressable>
            </>
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
  question: { fontSize: 18, marginTop: 4 },
  option: { padding: 14, borderRadius: 10 },
  button: { padding: 14, borderRadius: 10, alignItems: 'center' },
  resultCard: { padding: 16, borderRadius: 12, gap: 4 },
  visaCard: { padding: 12, borderRadius: 10, gap: 2 },
});
