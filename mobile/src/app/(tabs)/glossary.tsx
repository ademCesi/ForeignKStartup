import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LayoutAnimation,
  Platform,
  Pressable,
  SectionList,
  StyleSheet,
  TextInput,
  UIManager,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenBackground } from '@/components/screen-background';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppFonts, BottomTabInset, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { api } from '@/lib/api';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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

function groupByLetter(terms: GlossaryEntry[]) {
  const groups = new Map<string, GlossaryEntry[]>();
  for (const term of terms) {
    const letter = (term.romanization ?? term.term_kr).charAt(0).toUpperCase();
    if (!groups.has(letter)) groups.set(letter, []);
    groups.get(letter)!.push(term);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([letter, data]) => ({ title: letter, data }));
}

export default function GlossaryScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [lang, setLang] = useState<Lang>('en');
  const [terms, setTerms] = useState<GlossaryEntry[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    const handle = setTimeout(async () => {
      const { data } = await api.get('/glossary', { params: search ? { search } : undefined });
      setTerms(data);
    }, 250);
    return () => clearTimeout(handle);
  }, [search]);

  const sections = useMemo(() => groupByLetter(terms), [terms]);

  function toggle(id: number) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId((current) => (current === id ? null : id));
  }

  return (
    <ScreenBackground style={styles.container}>
      <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.safeArea}>
        <ThemedText type="title" style={styles.title}>
          {t('glossary.title')}
        </ThemedText>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder={t('glossary.searchPlaceholder')}
          placeholderTextColor={theme.textSecondary}
          style={[
            styles.input,
            { color: theme.text, backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        />
        <ThemedView style={styles.langRow}>
          {LANGS.map((code) => (
            <Pressable
              key={code}
              onPress={() => setLang(code)}
              style={[
                styles.langButton,
                lang === code
                  ? { backgroundColor: theme.accentSoft, borderColor: theme.accent }
                  : { backgroundColor: theme.surface, borderColor: theme.border },
              ]}>
              <ThemedText type="smallBold" themeColor={lang === code ? 'accent' : 'text'}>
                {code.toUpperCase()}
              </ThemedText>
            </Pressable>
          ))}
        </ThemedView>
        <SectionList
          sections={sections}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section }) => (
            <ThemedText type="title" themeColor="accent" style={styles.sectionLetter}>
              {section.title}
            </ThemedText>
          )}
          renderItem={({ item, index, section }) => {
            const expanded = expandedId === item.id;
            const isLast = index === section.data.length - 1;
            return (
              <Pressable
                onPress={() => toggle(item.id)}
                style={[styles.row, !isLast && { borderBottomWidth: 1, borderBottomColor: theme.border }]}>
                <View style={styles.rowHeader}>
                  <ThemedText type="smallBold" style={styles.rowTerm}>
                    {item.term_kr}
                    {item.romanization ? ` (${item.romanization})` : ''}
                  </ThemedText>
                  <Ionicons
                    name={expanded ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color={expanded ? theme.accent : theme.textSecondary}
                  />
                </View>
                {expanded && (
                  <ThemedText type="small" themeColor="textSecondary" style={styles.rowDefinition}>
                    {definitionFor(item, lang)}
                  </ThemedText>
                )}
              </Pressable>
            );
          }}
        />
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: 20, paddingTop: 20, gap: 10 },
  title: { marginTop: 2 },
  input: { padding: 12, borderRadius: 12, borderWidth: 1, fontFamily: AppFonts.body },
  langRow: { flexDirection: 'row', gap: 8, backgroundColor: 'transparent' },
  langButton: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 100, borderWidth: 1 },
  list: { paddingVertical: 8, paddingBottom: BottomTabInset },
  sectionLetter: { marginTop: Spacing.three, marginBottom: Spacing.one },
  row: { paddingVertical: 14, paddingHorizontal: 20, marginHorizontal: -20 },
  rowHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  rowTerm: { flex: 1 },
  rowDefinition: { marginTop: 10, lineHeight: 21 },
});
