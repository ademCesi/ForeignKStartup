import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { api } from '@/lib/api';

type GlossaryEntry = {
  id: number;
  term_kr: string;
  romanization: string | null;
  definition_en: string;
  definition_fr: string;
  definition_kr: string | null;
};

const LANGS = ['en', 'fr', 'kr'] as const;
type Lang = (typeof LANGS)[number];

function definitionFor(entry: GlossaryEntry, lang: Lang) {
  if (lang === 'fr') return entry.definition_fr;
  if (lang === 'kr') return entry.definition_kr ?? entry.definition_en;
  return entry.definition_en;
}

export default function GlossaryScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [lang, setLang] = useState<Lang>('en');
  const [terms, setTerms] = useState<GlossaryEntry[]>([]);

  useEffect(() => {
    const handle = setTimeout(async () => {
      const { data } = await api.get('/glossary', { params: search ? { search } : undefined });
      setTerms(data);
    }, 250);
    return () => clearTimeout(handle);
  }, [search]);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title" style={styles.title}>
          {t('glossary.title')}
        </ThemedText>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder={t('glossary.searchPlaceholder')}
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }]}
        />
        <ThemedView style={styles.langRow}>
          {LANGS.map((code) => (
            <Pressable
              key={code}
              onPress={() => setLang(code)}
              style={[
                styles.langButton,
                { backgroundColor: lang === code ? theme.backgroundSelected : theme.backgroundElement },
              ]}>
              <ThemedText type="smallBold">{code.toUpperCase()}</ThemedText>
            </Pressable>
          ))}
        </ThemedView>
        <FlatList
          data={terms}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ThemedView type="backgroundElement" style={styles.card}>
              <ThemedText type="smallBold">
                {item.term_kr}
                {item.romanization ? ` (${item.romanization})` : ''}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {definitionFor(item, lang)}
              </ThemedText>
            </ThemedView>
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
  input: { padding: 12, borderRadius: 10 },
  langRow: { flexDirection: 'row', gap: 8, backgroundColor: 'transparent' },
  langButton: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 8 },
  list: { gap: 10, paddingVertical: 8 },
  card: { padding: 14, borderRadius: 12, gap: 4 },
});
