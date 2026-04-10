import { Colors } from '@/constants/theme';
import { ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

export type QuickLogItem = {
  id: string | number;
  title: string;
  cals: number;
  p: number;
  c: number;
  f: number;
  type: 'saved' | 'recipe';
};

type Props = {
  quickLogs: QuickLogItem[]; // Now passed in as a prop
  onQuickAction: (item: QuickLogItem) => void;
};

export default function QuickAccess({ quickLogs, onQuickAction }: Props) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark'] || Colors.dark;

  return (
    <View>
      <Text style={[styles.sectionSubtitle, { color: theme.textSub || '#a0a0a0' }]}>QUICK ACCESS</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.quickAccessScroll}
      >
        {quickLogs.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={[styles.quickCard, { backgroundColor: theme.card || '#161616', borderColor: theme.border || '#2a2a2a' }]}
            onPress={() => onQuickAction(item)}
          >
            <View style={styles.quickCardHeader}>
              <Text style={[styles.quickBadge, item.type === 'saved' ? styles.badgeSaved : styles.badgeRecipe]}>
                {item.type}
              </Text>
            </View>
            <Text style={[styles.quickTitle, { color: theme.text || '#ffffff' }]} numberOfLines={1}>{item.title}</Text>
            <Text style={[styles.quickInfo, { color: theme.textSub || '#a0a0a0' }]}>{item.cals} kcal • {item.p}g P</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionSubtitle: {
    paddingHorizontal: 24,
    fontSize: 11,
    letterSpacing: 1.5,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 4,
  },
  quickAccessScroll: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    gap: 12,
  },
  quickCard: {
    width: 115,
    borderWidth: 1,
    borderRadius: 18,
    padding: 12,
    flexDirection: 'column',
    gap: 6,
  },
  quickCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  quickBadge: {
    fontSize: 8,
    fontWeight: '800',
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 5,
    textTransform: 'uppercase',
  },
  badgeSaved: {
    backgroundColor: 'rgba(57, 255, 20, 0.1)',
    color: '#39ff14',
  },
  badgeRecipe: {
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    color: '#7c3aed',
  },
  quickTitle: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 14,
    marginTop: 4,
  },
  quickInfo: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 'auto',
  },
});