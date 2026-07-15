import { Ionicons } from '@expo/vector-icons';
import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
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
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title" style={styles.title}>
          {t('roadmap.title')}
        </ThemedText>

        {!steps ? (
          <ThemedText themeColor="textSecondary">{t('roadmap.loading')}</ThemedText>
        ) : (
          <>
            <ThemedText themeColor="textSecondary">
              {t('roadmap.stepsDone', { done: doneCount, total: steps.length })}
            </ThemedText>
            {!user && (
              <ThemedText type="small" themeColor="textSecondary" style={styles.hint}>
                {t('roadmap.loginHint')}
              </ThemedText>
            )}
            <FlatList
              data={steps}
              keyExtractor={(item) => String(item.id)}
              contentContainerStyle={styles.list}
              renderItem={({ item }) => (
                <Link href={{ pathname: '/step/[id]', params: { id: item.id } }} asChild>
                  <Pressable style={{ ...styles.row, backgroundColor: theme.backgroundElement }}>
                    <Ionicons
                      name={item.status === 'done' ? 'checkbox' : 'square-outline'}
                      size={22}
                      color={item.status === 'done' ? theme.text : theme.textSecondary}
                    />
                    <ThemedText style={styles.rowText}>
                      {item.step_order}. {item.title}
                    </ThemedText>
                  </Pressable>
                </Link>
              )}
            />
          </>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: 20, gap: 8 },
  title: { fontSize: 28, marginTop: 8 },
  hint: { marginTop: 4 },
  list: { gap: 10, paddingVertical: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 12 },
  rowText: { flex: 1 },
});
