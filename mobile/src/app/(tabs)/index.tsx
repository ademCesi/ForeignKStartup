import { Ionicons } from '@expo/vector-icons';
import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenBackground } from '@/components/screen-background';
import { ThemedText } from '@/components/themed-text';
import { BottomTabInset } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/hooks/use-theme';
import { api } from '@/lib/api';
import { emailName } from '@/lib/format';

type RoadmapStep = {
  id: number;
  step_order: number;
  title: string;
  status?: 'not_started' | 'in_progress' | 'done';
};

type FaqPreview = {
  id: number;
  question: string;
  asked_by: string;
  upvotes: number;
  created_at: string;
};

type GlossaryTip = {
  id: number;
  term_kr: string;
  romanization: string | null;
  definition_en: string;
};

export default function RoadmapScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { user } = useAuth();
  const [steps, setSteps] = useState<RoadmapStep[] | null>(null);
  const [recentPosts, setRecentPosts] = useState<FaqPreview[]>([]);
  const [tip, setTip] = useState<GlossaryTip | null>(null);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      async function load() {
        const { data: roadmap } = await api.get('/roadmap');
        if (!cancelled) {
          if (!user) {
            setSteps(roadmap);
          } else {
            const { data: progress } = await api.get('/me/progress');
            const statusByStep = new Map(progress.map((p: any) => [p.step_id, p.status]));
            setSteps(roadmap.map((step: RoadmapStep) => ({ ...step, status: statusByStep.get(step.id) })));
          }
        }

        const [{ data: posts }, { data: terms }] = await Promise.all([api.get('/faq'), api.get('/glossary')]);
        if (cancelled) return;
        const sorted = [...posts].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setRecentPosts(sorted.slice(0, 3));
        if (terms.length) setTip(terms[new Date().getDate() % terms.length]);
      }

      load();
      return () => {
        cancelled = true;
      };
    }, [user])
  );

  const doneCount = steps?.filter((s) => s.status === 'done').length ?? 0;

  return (
    <ScreenBackground style={styles.container}>
      <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <ThemedText type="eyebrow">{t('roadmap.eyebrow')}</ThemedText>
          <ThemedText type="title" style={styles.title}>
            {t('roadmap.title')}
          </ThemedText>

          {!steps ? (
            <ThemedText themeColor="textSecondary">{t('roadmap.loading')}</ThemedText>
          ) : (
            <>
              <View style={[styles.progressPill, { backgroundColor: theme.accentSoft }]}>
                <ThemedText type="smallBold" themeColor="accent">
                  {t('roadmap.stepsDone', { done: doneCount, total: steps.length })}
                </ThemedText>
              </View>
              {!user && (
                <ThemedText type="small" themeColor="textSecondary" style={styles.hint}>
                  {t('roadmap.loginHint')}
                </ThemedText>
              )}

              <View style={styles.timeline}>
                {steps.map((item, index) => {
                  const isDone = item.status === 'done';
                  const prevDone = index > 0 && steps[index - 1].status === 'done';

                  return (
                    <Link key={item.id} href={{ pathname: '/step/[id]', params: { id: item.id } }} asChild>
                      <Pressable style={styles.row}>
                        <View style={styles.timelineCol}>
                          <View
                            style={[
                              styles.line,
                              { backgroundColor: index === 0 ? 'transparent' : prevDone ? theme.success : theme.border },
                            ]}
                          />
                          <View
                            style={[
                              styles.badge,
                              {
                                backgroundColor: isDone ? theme.success : theme.surface,
                                borderColor: isDone ? theme.success : theme.border,
                              },
                            ]}>
                            {isDone ? (
                              <Ionicons name="checkmark" size={16} color={theme.onSuccess} />
                            ) : (
                              <ThemedText type="smallBold">{item.step_order}</ThemedText>
                            )}
                          </View>
                          <View
                            style={[
                              styles.line,
                              {
                                backgroundColor:
                                  index === steps.length - 1 ? 'transparent' : isDone ? theme.success : theme.border,
                              },
                            ]}
                          />
                        </View>
                        <View
                          style={{
                            ...styles.card,
                            backgroundColor: theme.surface,
                            borderColor: theme.border,
                            shadowColor: theme.shadow,
                          }}>
                          <ThemedText type="smallBold">{item.title}</ThemedText>
                        </View>
                      </Pressable>
                    </Link>
                  );
                })}
              </View>
            </>
          )}

          {recentPosts.length > 0 && (
            <>
              <View style={styles.sectionHeaderRow}>
                <ThemedText type="subtitle">{t('roadmap.community')}</ThemedText>
                <Link href="/blog" asChild>
                  <Pressable>
                    <ThemedText type="link" themeColor="link">
                      {t('roadmap.seeAll')}
                    </ThemedText>
                  </Pressable>
                </Link>
              </View>
              {recentPosts.map((post) => (
                <Link key={post.id} href={{ pathname: '/faq/[id]', params: { id: post.id } }} asChild>
                  <Pressable
                    style={{
                      ...styles.previewCard,
                      backgroundColor: theme.surface,
                      borderColor: theme.border,
                      shadowColor: theme.shadow,
                    }}>
                    <ThemedText type="smallBold" numberOfLines={2}>
                      {post.question}
                    </ThemedText>
                    <View style={styles.previewMeta}>
                      <ThemedText type="small" themeColor="textSecondary">
                        {emailName(post.asked_by)}
                      </ThemedText>
                      <View style={styles.previewMetaRight}>
                        <Ionicons name="arrow-up-circle-outline" size={14} color={theme.textSecondary} />
                        <ThemedText type="small" themeColor="textSecondary">
                          {post.upvotes}
                        </ThemedText>
                      </View>
                    </View>
                  </Pressable>
                </Link>
              ))}
            </>
          )}

          {tip && (
            <>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                {t('roadmap.tipTitle')}
              </ThemedText>
              <View style={[styles.tipCard, { backgroundColor: theme.accentSoft }]}>
                <ThemedText type="smallBold">
                  {tip.term_kr}
                  {tip.romanization ? ` (${tip.romanization})` : ''}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {tip.definition_en}
                </ThemedText>
              </View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: BottomTabInset, gap: 6 },
  title: { marginBottom: 4 },
  hint: { marginTop: 4 },
  progressPill: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100, marginTop: 2 },
  timeline: { marginTop: 16 },
  row: { flexDirection: 'row' },
  timelineCol: { width: 44, alignItems: 'center' },
  line: { width: 2, flex: 1, minHeight: 8 },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    flex: 1,
    marginLeft: 8,
    marginBottom: 14,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  sectionTitle: { marginTop: 8 },
  previewCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
    marginBottom: 10,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  previewMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  previewMetaRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  tipCard: { padding: 16, borderRadius: 18, gap: 4 },
});
