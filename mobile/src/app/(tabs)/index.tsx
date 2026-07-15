import { Ionicons } from '@expo/vector-icons';
import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenBackground } from '@/components/screen-background';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/hooks/use-theme';
import { api } from '@/lib/api';

type RoadmapStep = {
  id: number;
  step_order: number;
  title: string;
  status?: 'not_started' | 'in_progress' | 'done';
};

export default function RoadmapScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { user } = useAuth();
  const [steps, setSteps] = useState<RoadmapStep[] | null>(null);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      async function load() {
        const { data: roadmap } = await api.get('/roadmap');
        if (!user) {
          if (!cancelled) setSteps(roadmap);
          return;
        }
        const { data: progress } = await api.get('/me/progress');
        const statusByStep = new Map(progress.map((p: any) => [p.step_id, p.status]));
        if (!cancelled) {
          setSteps(roadmap.map((step: RoadmapStep) => ({ ...step, status: statusByStep.get(step.id) })));
        }
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
                              { backgroundColor: index === 0 ? 'transparent' : prevDone ? theme.accent : theme.border },
                            ]}
                          />
                          <View
                            style={[
                              styles.badge,
                              {
                                backgroundColor: isDone ? theme.accent : theme.surface,
                                borderColor: isDone ? theme.accent : theme.border,
                              },
                            ]}>
                            {isDone ? (
                              <Ionicons name="checkmark" size={16} color={theme.onAccent} />
                            ) : (
                              <ThemedText type="smallBold">{item.step_order}</ThemedText>
                            )}
                          </View>
                          <View
                            style={[
                              styles.line,
                              {
                                backgroundColor:
                                  index === steps.length - 1 ? 'transparent' : isDone ? theme.accent : theme.border,
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
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24, gap: 6 },
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
});
