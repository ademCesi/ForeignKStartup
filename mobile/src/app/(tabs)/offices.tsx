import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Linking, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppFonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { api } from '@/lib/api';

type Service = {
  id: number;
  name: string;
  role: string;
  operator: string;
  url: string | null;
  category: string;
  address: string | null;
};

export default function OfficesScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const handle = setTimeout(async () => {
      const { data } = await api.get('/services', { params: search ? { search } : undefined });
      setServices(data);
    }, 250);
    return () => clearTimeout(handle);
  }, [search]);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title" style={styles.title}>
          {t('offices.title')}
        </ThemedText>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder={t('offices.searchPlaceholder')}
          placeholderTextColor={theme.textSecondary}
          style={[
            styles.input,
            { color: theme.text, backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        />
        <FlatList
          data={services}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<ThemedText themeColor="textSecondary">{t('offices.empty')}</ThemedText>}
          renderItem={({ item }) => (
            <Card onPress={() => item.url && Linking.openURL(item.url)} style={styles.cardGap}>
              <ThemedText type="smallBold">{item.name}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {item.role}
              </ThemedText>
              {item.address && (
                <ThemedText type="small" themeColor="textSecondary">
                  {item.address}
                </ThemedText>
              )}
            </Card>
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
  input: { padding: 12, borderRadius: 12, borderWidth: 1, fontFamily: AppFonts.body },
  list: { gap: 10, paddingVertical: 8 },
  cardGap: { gap: 2 },
});
