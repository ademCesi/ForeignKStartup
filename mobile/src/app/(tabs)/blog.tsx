import { Ionicons } from '@expo/vector-icons';
import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppFonts } from '@/constants/theme';
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

        {user && !composing && <Button variant="secondary" label={t('blog.ask')} onPress={() => setComposing(true)} />}

        {composing && (
          <ThemedView style={styles.composer}>
            <TextInput
              value={question}
              onChangeText={setQuestion}
              placeholder={t('blog.questionPlaceholder')}
              placeholderTextColor={theme.textSecondary}
              multiline
              style={[
                styles.input,
                { color: theme.text, backgroundColor: theme.surface, borderColor: theme.border },
              ]}
            />
            <Button label={t('blog.publish')} onPress={submit} />
          </ThemedView>
        )}

        <FlatList
          data={posts}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<ThemedText themeColor="textSecondary">{t('blog.empty')}</ThemedText>}
          renderItem={({ item }) => (
            <Link href={{ pathname: '/faq/[id]', params: { id: item.id } }} asChild>
              <Pressable
                style={{
                  ...styles.card,
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  shadowColor: theme.primary,
                }}>
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
  title: { marginTop: 2 },
  composer: { gap: 8, backgroundColor: 'transparent' },
  input: { padding: 12, borderRadius: 12, borderWidth: 1, minHeight: 80, textAlignVertical: 'top', fontFamily: AppFonts.body },
  list: { gap: 10, paddingVertical: 8 },
  card: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'transparent' },
  metaRight: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'transparent' },
});
