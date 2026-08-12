import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Card } from '@/components/card';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ComparisonItem = {
  code?: string;
  name: string;
  tag?: string;
  summary?: string;
  idealFor?: string;
  advantages?: string[];
  requirements?: string[];
  watchOut?: string;
  cost?: string;
  includes?: string;
};

type TimelineItem = {
  title: string;
  description?: string;
  items?: string[];
  badge?: string;
  stepLink?: number;
};

type ChecklistItem = {
  icon?: string;
  title: string;
  description?: string;
  stepLink?: number;
};

type ColumnItem = {
  icon?: string;
  title: string;
  description?: string;
  items?: string[];
  note?: string;
};

type StatItem = {
  label: string;
  value: string;
  description?: string;
  stepLink?: number;
};

export type GuideSection =
  | { type: 'comparison'; eyebrow?: string; title: string; subtitle?: string; items: ComparisonItem[] }
  | { type: 'timeline'; eyebrow?: string; title: string; subtitle?: string; items: TimelineItem[] }
  | { type: 'checklist'; eyebrow?: string; title: string; subtitle?: string; items: ChecklistItem[] }
  | { type: 'columns'; eyebrow?: string; title: string; subtitle?: string; columns: ColumnItem[] }
  | { type: 'stats'; eyebrow?: string; title: string; subtitle?: string; items: StatItem[] };

// Maps the icon keys authored in the guide content (mirroring the website's
// icon set) to real Ionicons names. Unknown keys fall back gracefully.
const ICON_MAP: Record<string, keyof typeof Ionicons.glyphMap> = {
  rocket: 'rocket-outline',
  shield: 'shield-checkmark-outline',
  medal: 'ribbon-outline',
  compass: 'compass-outline',
  star: 'star-outline',
  graduation: 'school-outline',
  document: 'document-text-outline',
  'id-card': 'card-outline',
  refresh: 'refresh-outline',
  briefcase: 'briefcase-outline',
  users: 'people-outline',
  award: 'trophy-outline',
  home: 'home-outline',
  'file-text': 'document-outline',
  'map-pin': 'location-outline',
  alert: 'alert-circle-outline',
  target: 'flag-outline',
};

function resolveIcon(icon?: string): keyof typeof Ionicons.glyphMap {
  return (icon && ICON_MAP[icon]) || 'ellipse-outline';
}

function SectionHeader({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <View style={styles.header}>
      {eyebrow && <ThemedText type="eyebrow">{eyebrow}</ThemedText>}
      <ThemedText type="subtitle">{title}</ThemedText>
      {subtitle && <ThemedText themeColor="textSecondary">{subtitle}</ThemedText>}
    </View>
  );
}

function Bullets({ items, dim }: { items: string[]; dim?: boolean }) {
  return (
    <View style={styles.bullets}>
      {items.map((item, index) => (
        <View key={index} style={styles.bulletRow}>
          <ThemedText type="small" themeColor={dim ? 'textSecondary' : 'text'}>
            •
          </ThemedText>
          <ThemedText type="small" themeColor={dim ? 'textSecondary' : 'text'} style={styles.bulletText}>
            {item}
          </ThemedText>
        </View>
      ))}
    </View>
  );
}

function StepLinkPressable({
  stepLink,
  style,
  children,
}: {
  stepLink?: number;
  style?: object;
  children: React.ReactNode;
}) {
  const router = useRouter();
  if (!stepLink) return <View style={style}>{children}</View>;
  return (
    <Pressable style={style} onPress={() => router.push(`/step/${stepLink}`)}>
      {children}
    </Pressable>
  );
}

// Comparison cards get a colored left rail and a monogram badge for the
// item's code/initial, so they read as distinct profiles rather than plain
// paragraphs stacked in identical boxes.
function ComparisonSection({ items }: { items: ComparisonItem[] }) {
  const theme = useTheme();
  return (
    <View style={styles.stack}>
      {items.map((item, index) => (
        <Card key={index} style={[styles.comparisonCard, { borderLeftWidth: 4, borderLeftColor: theme.accent }]}>
          <View style={styles.comparisonHeading}>
            <View style={[styles.monogram, { backgroundColor: theme.accentSoft }]}>
              <ThemedText type="smallBold" themeColor="accent">
                {(item.code ?? item.name).slice(0, 2)}
              </ThemedText>
            </View>
            <View style={styles.comparisonHeadingText}>
              <ThemedText type="smallBold">{item.code ? `${item.code} · ${item.name}` : item.name}</ThemedText>
              {item.tag && <ThemedText type="small" themeColor="textSecondary">{item.tag}</ThemedText>}
            </View>
          </View>
          {item.summary && <ThemedText type="small">{item.summary}</ThemedText>}
          {item.cost && (
            <ThemedText type="small">
              <ThemedText type="smallBold">{item.cost}</ThemedText>
            </ThemedText>
          )}
          {item.includes && (
            <ThemedText type="small" themeColor="textSecondary">
              {item.includes}
            </ThemedText>
          )}
          {item.idealFor && (
            <ThemedText type="small" themeColor="textSecondary">
              {item.idealFor}
            </ThemedText>
          )}
          {item.advantages && <Bullets items={item.advantages} />}
          {item.requirements && <Bullets items={item.requirements} dim />}
          {item.watchOut && (
            <View style={styles.watchOutRow}>
              <Ionicons name="alert-circle-outline" size={14} color={theme.highlight} />
              <ThemedText type="small" themeColor="highlight" style={styles.bulletText}>
                {item.watchOut}
              </ThemedText>
            </View>
          )}
        </Card>
      ))}
    </View>
  );
}

function TimelineSection({ items }: { items: TimelineItem[] }) {
  const theme = useTheme();
  return (
    <View style={styles.stack}>
      {items.map((item, index) => (
        <StepLinkPressable key={index} stepLink={item.stepLink}>
          <View style={styles.timelineRow}>
            <View style={styles.timelineCol}>
              <View style={[styles.timelineDot, { backgroundColor: theme.accentSoft, borderColor: theme.accent }]}>
                <ThemedText type="small" themeColor="accent">
                  {index + 1}
                </ThemedText>
              </View>
              {index < items.length - 1 && <View style={[styles.timelineLine, { backgroundColor: theme.border }]} />}
            </View>
            <Card style={styles.timelineCard}>
              <ThemedText type="smallBold">{item.title}</ThemedText>
              {item.description && (
                <ThemedText type="small" themeColor="textSecondary">
                  {item.description}
                </ThemedText>
              )}
              {item.items && <Bullets items={item.items} dim />}
              {item.badge && (
                <View style={[styles.tag, styles.badgeTag, { backgroundColor: theme.surfaceSelected }]}>
                  <ThemedText type="small" themeColor="textSecondary">
                    {item.badge}
                  </ThemedText>
                </View>
              )}
            </Card>
          </View>
        </StepLinkPressable>
      ))}
    </View>
  );
}

// A light, list-like treatment (no boxed cards) so a run of checklist items
// doesn't read as "more of the same stacked cards" right after a comparison
// or timeline section.
function ChecklistSection({ items }: { items: ChecklistItem[] }) {
  const theme = useTheme();
  return (
    <View style={[styles.checklistGroup, { borderColor: theme.border, backgroundColor: theme.surface }]}>
      {items.map((item, index) => (
        <StepLinkPressable key={index} stepLink={item.stepLink}>
          <View style={[styles.checklistRow, index < items.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border }]}>
            <View style={[styles.checklistIcon, { backgroundColor: theme.accentSoft }]}>
              <Ionicons name={resolveIcon(item.icon)} size={16} color={theme.accent} />
            </View>
            <View style={styles.checklistText}>
              <ThemedText type="smallBold">{item.title}</ThemedText>
              {item.description && (
                <ThemedText type="small" themeColor="textSecondary">
                  {item.description}
                </ThemedText>
              )}
            </View>
          </View>
        </StepLinkPressable>
      ))}
    </View>
  );
}

// Side-by-side when there are exactly two columns (the common case) so this
// section reads as a genuine comparison layout, not another stacked card.
function ColumnsSection({ columns }: { columns: ColumnItem[] }) {
  const theme = useTheme();
  const sideBySide = columns.length === 2;
  return (
    <View style={sideBySide ? styles.columnsRow : styles.stack}>
      {columns.map((column, index) => (
        <Card key={index} style={[styles.columnCard, sideBySide && styles.columnCardHalf]}>
          <View style={[styles.columnIconHeader, { backgroundColor: theme.accentSoft }]}>
            <Ionicons name={resolveIcon(column.icon)} size={16} color={theme.accent} />
          </View>
          <ThemedText type="smallBold">{column.title}</ThemedText>
          {column.description && (
            <ThemedText type="small" themeColor="textSecondary">
              {column.description}
            </ThemedText>
          )}
          {column.items && <Bullets items={column.items} />}
          {column.note && (
            <ThemedText type="small" themeColor="textSecondary">
              {column.note}
            </ThemedText>
          )}
        </Card>
      ))}
    </View>
  );
}

// Bold number tiles in a 2-column grid instead of label/value rows - reads
// like a stat dashboard, a deliberately different rhythm from the text-heavy
// sections around it.
function StatsSection({ items }: { items: StatItem[] }) {
  const theme = useTheme();
  return (
    <View style={styles.statsGrid}>
      {items.map((item, index) => (
        <StepLinkPressable key={index} stepLink={item.stepLink} style={styles.statTile}>
          <Card style={styles.statTileCard}>
            <ThemedText type="title" themeColor="accent" style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>
              {item.value}
            </ThemedText>
            <ThemedText type="smallBold">{item.label}</ThemedText>
            {item.description && (
              <ThemedText type="small" themeColor="textSecondary">
                {item.description}
              </ThemedText>
            )}
          </Card>
        </StepLinkPressable>
      ))}
    </View>
  );
}

export function GuideSections({ sections }: { sections: GuideSection[] | null | undefined }) {
  if (!sections || sections.length === 0) return null;

  return (
    <View style={styles.container}>
      {sections.map((section, index) => (
        <View key={index} style={styles.section}>
          <SectionHeader eyebrow={section.eyebrow} title={section.title} subtitle={section.subtitle} />
          {section.type === 'comparison' && <ComparisonSection items={section.items} />}
          {section.type === 'timeline' && <TimelineSection items={section.items} />}
          {section.type === 'checklist' && <ChecklistSection items={section.items} />}
          {section.type === 'columns' && <ColumnsSection columns={section.columns} />}
          {section.type === 'stats' && <StatsSection items={section.items} />}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.four },
  section: { gap: Spacing.two },
  header: { gap: 2, marginBottom: Spacing.one },
  stack: { gap: Spacing.two },
  bullets: { gap: 4, marginTop: 2 },
  bulletRow: { flexDirection: 'row', gap: 6, alignItems: 'flex-start' },
  bulletText: { flex: 1 },
  comparisonCard: { gap: 6 },
  comparisonHeading: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  comparisonHeadingText: { flex: 1, gap: 1 },
  monogram: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.pill },
  badgeTag: { alignSelf: 'flex-start', marginTop: 4 },
  watchOutRow: { flexDirection: 'row', gap: 6, alignItems: 'flex-start', marginTop: 2 },
  timelineRow: { flexDirection: 'row', gap: 12 },
  timelineCol: { alignItems: 'center', width: 28 },
  timelineDot: { width: 28, height: 28, borderRadius: 14, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  timelineLine: { width: 2, flex: 1, marginVertical: 4 },
  timelineCard: { flex: 1, gap: 4, marginBottom: Spacing.two },
  checklistGroup: { borderRadius: Radius.card, borderWidth: 1, overflow: 'hidden' },
  checklistRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  checklistIcon: { width: 32, height: 32, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  checklistText: { flex: 1, gap: 2 },
  columnsRow: { flexDirection: 'row', gap: Spacing.two },
  columnCard: { gap: 6 },
  columnCardHalf: { flex: 1 },
  columnIconHeader: { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statTile: { width: '48%', marginBottom: Spacing.two },
  statTileCard: { gap: 2 },
  statValue: { marginBottom: 2 },
});
