import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
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
          <ThemedText type="eyebrow">{t('visa.eyebrow')}</ThemedText>
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
                <Card key={String(option.value)} onPress={() => answer(questions[index].key, option.value)}>
                  <ThemedText>{option.label}</ThemedText>
                </Card>
              ))}
            </>
          ) : (
            <>
              <ThemedView
                style={[styles.resultCard, { backgroundColor: theme.surfaceSelected, borderColor: theme.accent }]}>
                <ThemedText type="eyebrow">{t('visa.recommended')}</ThemedText>
                <ThemedText type="subtitle">{result.recommendation.code}</ThemedText>
                <ThemedText>{result.recommendation.name}</ThemedText>
                <ThemedText themeColor="textSecondary">{result.reason}</ThemedText>
              </ThemedView>

              <Button variant="secondary" label={t('visa.compareAll')} onPress={loadAllVisas} />

              {allVisas?.map((visa) => (
                <Card key={visa.code} style={styles.stackGap}>
                  <ThemedText type="smallBold">
                    {visa.code} · {visa.name}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {visa.duration}
                  </ThemedText>
                  <ThemedText type="small">{visa.best_for}</ThemedText>
                </Card>
              ))}

              <Button variant="secondary" label={t('visa.startOver')} onPress={startOver} />
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
  title: { marginBottom: 2 },
  question: { marginTop: 4 },
  stackGap: { gap: 2 },
  resultCard: { padding: 18, borderRadius: 14, borderWidth: 1.5, gap: 4 },
});
