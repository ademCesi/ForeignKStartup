import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/hooks/use-theme';
import { api } from '@/lib/api';

type Answer = { id: number; answer: string; answered_by: string; upvotes: number };
type Post = { id: number; question: string; asked_by: string; upvotes: number; answers: Answer[] };

export default function FaqDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const theme = useTheme();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [answer, setAnswer] = useState('');

  const load = useCallback(async () => {
    const { data } = await api.get(`/faq/${id}`);
    setPost(data);
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function upvotePost() {
    await api.post(`/faq/${id}/upvote`);
    load();
  }

  async function upvoteAnswer(answerId: number) {
    await api.post(`/faq/${id}/answers/${answerId}/upvote`);
    load();
  }

  async function submitAnswer() {
    if (!answer.trim()) return;
    await api.post(`/faq/${id}/answers`, { answer });
    setAnswer('');
    load();
  }

  if (!post) {
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
          <ThemedText type="subtitle" style={styles.question}>
            {post.question}
          </ThemedText>
          <ThemedView style={styles.metaRow}>
            <ThemedText type="small" themeColor="textSecondary">
              {post.asked_by}
            </ThemedText>
            <Pressable style={styles.upvote} onPress={upvotePost}>
              <Ionicons name="arrow-up-outline" size={16} color={theme.textSecondary} />
              <ThemedText type="small" themeColor="textSecondary">
                {post.upvotes}
              </ThemedText>
            </Pressable>
          </ThemedView>

          {post.answers.map((a) => (
            <ThemedView key={a.id} type="backgroundElement" style={styles.answerCard}>
              <ThemedText>{a.answer}</ThemedText>
              <ThemedView style={styles.metaRow}>
                <ThemedText type="small" themeColor="textSecondary">
                  {a.answered_by}
                </ThemedText>
                <Pressable style={styles.upvote} onPress={() => upvoteAnswer(a.id)}>
                  <Ionicons name="arrow-up-outline" size={14} color={theme.textSecondary} />
                  <ThemedText type="small" themeColor="textSecondary">
                    {a.upvotes}
                  </ThemedText>
                </Pressable>
              </ThemedView>
            </ThemedView>
          ))}

          {user && (
            <ThemedView style={styles.composer}>
              <TextInput
                value={answer}
                onChangeText={setAnswer}
                placeholder={t('blog.answerPlaceholder')}
                placeholderTextColor={theme.textSecondary}
                multiline
                style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }]}
              />
              <Pressable style={[styles.button, { backgroundColor: theme.backgroundSelected }]} onPress={submitAnswer}>
                <ThemedText>{t('blog.submitAnswer')}</ThemedText>
              </Pressable>
            </ThemedView>
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
  question: { fontSize: 20 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'transparent' },
  upvote: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  answerCard: { padding: 12, borderRadius: 10, gap: 6 },
  composer: { gap: 8, marginTop: 8, backgroundColor: 'transparent' },
  input: { padding: 12, borderRadius: 10, minHeight: 70, textAlignVertical: 'top' },
  button: { padding: 14, borderRadius: 10, alignItems: 'center' },
});
