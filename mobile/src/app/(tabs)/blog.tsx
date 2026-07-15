import { Ionicons } from '@expo/vector-icons';
import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/hooks/use-theme';
import { api } from '@/lib/api';

type FaqPost = {
  id: number;
  question: string;
  asked_by: string;
  answer_count: number;
  upvotes: number;
};

export default function BlogScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { user } = useAuth();
  const [posts, setPosts] = useState<FaqPost[]>([]);
  const [composing, setComposing] = useState(false);
  const [question, setQuestion] = useState('');

  const load = useCallback(async () => {
    const { data } = await api.get('/faq');
    setPosts(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function submit() {
    if (!question.trim()) return;
    await api.post('/faq', { question });
    setQuestion('');
    setComposing(false);
    load();
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title" style={styles.title}>
          {t('blog.title')}
        </ThemedText>

        {user && !composing && (
          <Pressable style={[styles.button, { backgroundColor: theme.backgroundElement }]} onPress={() => setComposing(true)}>
            <ThemedText>{t('blog.ask')}</ThemedText>
          </Pressable>
        )}

        {composing && (
          <ThemedView style={styles.composer}>
            <TextInput
              value={question}
              onChangeText={setQuestion}
              placeholder={t('blog.questionPlaceholder')}
              placeholderTextColor={theme.textSecondary}
              multiline
              style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }]}
            />
            <Pressable style={[styles.button, { backgroundColor: theme.backgroundSelected }]} onPress={submit}>
              <ThemedText>{t('blog.publish')}</ThemedText>
            </Pressable>
          </ThemedView>
        )}

        <FlatList
          data={posts}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<ThemedText themeColor="textSecondary">{t('blog.empty')}</ThemedText>}
          renderItem={({ item }) => (
            <Link href={{ pathname: '/faq/[id]', params: { id: item.id } }} asChild>
              <Pressable style={{ ...styles.card, backgroundColor: theme.backgroundElement }}>
                <ThemedText type="smallBold">{item.question}</ThemedText>
                <ThemedView style={styles.metaRow}>
                  <ThemedText type="small" themeColor="textSecondary">
                    {item.asked_by}
                  </ThemedText>
                  <ThemedView style={styles.metaRight}>
                    <Ionicons name="chatbubble-outline" size={14} color={theme.textSecondary} />
                    <ThemedText type="small" themeColor="textSecondary">
                      {item.answer_count}
                    </ThemedText>
                    <Ionicons name="arrow-up-outline" size={14} color={theme.textSecondary} />
                    <ThemedText type="small" themeColor="textSecondary">
                      {item.upvotes}
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
              </Pressable>
            </Link>
          )}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: 20, gap: 10 },
  title: { fontSize: 24, marginTop: 8 },
  button: { padding: 14, borderRadius: 10, alignItems: 'center' },
  composer: { gap: 8, backgroundColor: 'transparent' },
  input: { padding: 12, borderRadius: 10, minHeight: 80, textAlignVertical: 'top' },
  list: { gap: 10, paddingVertical: 8 },
  card: { padding: 14, borderRadius: 12, gap: 8 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'transparent' },
  metaRight: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'transparent' },
});
