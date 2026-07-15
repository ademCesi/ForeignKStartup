import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { OfficesMap } from '@/components/offices-map';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppFonts } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/hooks/use-theme';
import { api } from '@/lib/api';
import { withAlpha } from '@/lib/color';

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

type Service = {
  id: number;
  name: string;
  role: string;
  operator: string;
  url: string | null;
  category: string;
  address: string | null;
  lat: string | null;
  lng: string | null;
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

// Which service categories are relevant to show (description + map) on each step,
// mirroring the "useful resources" links the showcase site attaches to each guide.
const STEP_SERVICE_CATEGORIES: Record<number, string[]> = {
  1: ['visa'],
  3: ['coworking'],
  4: ['registration'],
  6: ['tax'],
  7: ['funding', 'support'],
};

export default function StepDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const theme = useTheme();
  const { user } = useAuth();
  const [step, setStep] = useState<Step | null>(null);
  const [done, setDone] = useState(false);
  const [fundingPrograms, setFundingPrograms] = useState<FundingProgram[] | null>(null);
  const [services, setServices] = useState<Service[] | null>(null);

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

        const categories = STEP_SERVICE_CATEGORIES[data.step_order];
        if (categories) {
          const { data: allServices } = await api.get('/services');
          if (!cancelled) setServices(allServices.filter((s: Service) => categories.includes(s.category)));
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

  const pins = (services ?? [])
    .filter((s) => s.lat && s.lng)
    .map((s) => ({ id: s.id, name: s.name, lat: Number(s.lat), lng: Number(s.lng) }));

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.hero}>
            <ThemedText style={[styles.ghostNumber, { color: withAlpha(theme.accent, 0.16) }]}>
              {step.step_order}
            </ThemedText>
            <View style={styles.heroText}>
              <ThemedText type="eyebrow">{t('step.eyebrow')}</ThemedText>
              <ThemedText type="title" style={styles.title}>
                {step.title}
              </ThemedText>
            </View>
          </View>
          <ThemedText themeColor="textSecondary">{step.description}</ThemedText>
          {step.details && <ThemedText style={styles.details}>{step.details}</ThemedText>}

          {step.step_order === 1 && <VisaSection />}

          {fundingPrograms && (
            <>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                {t('step.fundingPrograms')}
              </ThemedText>
              {fundingPrograms.map((program) => (
                <Card key={program.id} onPress={() => program.url && Linking.openURL(program.url)} style={styles.cardTextGap}>
                  <ThemedText type="smallBold">{program.name}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {program.description}
                  </ThemedText>
                  <ThemedText type="small">{program.eligibility}</ThemedText>
                </Card>
              ))}
            </>
          )}

          {services && services.length > 0 && (
            <>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                {t('step.offices')}
              </ThemedText>
              <OfficesMap pins={pins} />
              {services.map((service) => (
                <Card key={service.id} onPress={() => service.url && Linking.openURL(service.url)} style={styles.cardTextGap}>
                  <ThemedText type="smallBold">{service.name}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {service.role}
                  </ThemedText>
                  {service.address && <ThemedText type="small">{service.address}</ThemedText>}
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

type Answers = {
  hasCompany?: boolean;
  ipStatus?: 'patent' | 'prototype' | 'none';
  capitalAvailable?: boolean;
  acceleratorSelected?: boolean;
  hasLongTermResidence?: boolean;
};

type Visa = { id: number; code: string; name: string; duration: string; best_for: string };

function useVisaQuestions() {
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

// The visa questionnaire is meant to be answered once: if the user already has
// a target_visa saved on their profile, jump straight to the result view.
function VisaSection() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { user, updateProfile } = useAuth();
  const questions = useVisaQuestions();
  const [answers, setAnswers] = useState<Answers>({});
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<{ recommendation: Visa; reason: string } | null>(null);
  const [allVisas, setAllVisas] = useState<Visa[] | null>(null);
  const [checkedProfile, setCheckedProfile] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      async function loadFromProfile() {
        if (user?.target_visa) {
          const { data } = await api.get(`/visas/${user.target_visa}`);
          if (!cancelled) setResult({ recommendation: data, reason: t('visa.savedReason') });
        }
        if (!cancelled) setCheckedProfile(true);
      }

      loadFromProfile();
      return () => {
        cancelled = true;
      };
    }, [user?.target_visa, t])
  );

  async function answer(key: string, value: unknown) {
    const next = { ...answers, [key]: value };
    setAnswers(next);
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      return;
    }
    const { data } = await api.post('/visas/recommend', next);
    setResult(data);
    if (user) {
      await updateProfile({ target_visa: data.recommendation.code });
    }
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

  if (!checkedProfile) return null;

  return (
    <ThemedView style={styles.sectionGap}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        {t('visa.title')}
      </ThemedText>

      {!result ? (
        <>
          <ThemedText themeColor="textSecondary">
            {t('visa.question', { current: index + 1, total: questions.length })}
          </ThemedText>
          <ThemedText type="smallBold">{questions[index].label}</ThemedText>
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
            <Card key={visa.code} style={styles.cardTextGap}>
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scroll: { padding: 20, gap: 12 },
  hero: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  ghostNumber: { fontFamily: AppFonts.display, fontSize: 64, lineHeight: 64, marginTop: -6 },
  heroText: { flex: 1, gap: 4 },
  title: { marginBottom: 2 },
  details: { lineHeight: 22 },
  sectionTitle: { marginTop: 8 },
  cardTextGap: { gap: 4 },
  sectionGap: { gap: 10 },
  docRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  docText: { flex: 1, backgroundColor: 'transparent' },
  actionSpacing: { marginTop: 8 },
  resultCard: { padding: 18, borderRadius: 14, borderWidth: 1.5, gap: 4 },
});
