import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { UpvoteButton } from '@/components/upvote-button';
import { AppFonts } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/hooks/use-theme';
import { api } from '@/lib/api';

type Answer = { id: number; answer: string; answered_by: string; upvotes: number; upvoted: boolean };
type Post = { id: number; question: string; asked_by: string; upvotes: number; upvoted: boolean; answers: Answer[] };

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

  async function toggleUpvotePost() {
    if (!post) return;
    const optimistic = { upvoted: !post.upvoted, upvotes: post.upvotes + (post.upvoted ? -1 : 1) };
    setPost({ ...post, ...optimistic });
    try {
      const { data } = await api.post(`/faq/${id}/upvote`);
      setPost((prev) => (prev ? { ...prev, upvoted: data.upvoted, upvotes: data.upvotes } : prev));
    } catch {
      setPost((prev) => (prev ? { ...prev, upvoted: post.upvoted, upvotes: post.upvotes } : prev));
    }
  }

  async function toggleUpvoteAnswer(target: Answer) {
    if (!post) return;
    const optimistic = { upvoted: !target.upvoted, upvotes: target.upvotes + (target.upvoted ? -1 : 1) };
    setPost({ ...post, answers: post.answers.map((a) => (a.id === target.id ? { ...a, ...optimistic } : a)) });
    try {
      const { data } = await api.post(`/faq/${id}/answers/${target.id}/upvote`);
      setPost((prev) =>
        prev
          ? { ...prev, answers: prev.answers.map((a) => (a.id === target.id ? { ...a, upvoted: data.upvoted, upvotes: data.upvotes } : a)) }
          : prev
      );
    } catch {
      setPost((prev) =>
        prev
          ? { ...prev, answers: prev.answers.map((a) => (a.id === target.id ? { ...a, upvoted: target.upvoted, upvotes: target.upvotes } : a)) }
          : prev
      );
    }
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
            <UpvoteButton count={post.upvotes} upvoted={post.upvoted} onToggle={toggleUpvotePost} />
          </ThemedView>

          {post.answers.map((a) => (
            <Card key={a.id} style={styles.answerCard}>
              <ThemedText>{a.answer}</ThemedText>
              <ThemedView style={styles.metaRow}>
                <ThemedText type="small" themeColor="textSecondary">
                  {a.answered_by}
                </ThemedText>
                <UpvoteButton count={a.upvotes} upvoted={a.upvoted} onToggle={() => toggleUpvoteAnswer(a)} size={16} />
              </ThemedView>
            </Card>
          ))}

          {user && (
            <ThemedView style={styles.composer}>
              <TextInput
                value={answer}
                onChangeText={setAnswer}
                placeholder={t('blog.answerPlaceholder')}
                placeholderTextColor={theme.textSecondary}
                multiline
                style={[
                  styles.input,
                  { color: theme.text, backgroundColor: theme.surface, borderColor: theme.border },
                ]}
              />
              <Button label={t('blog.submitAnswer')} onPress={submitAnswer} />
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
  answerCard: { gap: 6 },
  composer: { gap: 8, marginTop: 8, backgroundColor: 'transparent' },
  input: { padding: 12, borderRadius: 12, borderWidth: 1, minHeight: 70, textAlignVertical: 'top', fontFamily: AppFonts.body },
});
