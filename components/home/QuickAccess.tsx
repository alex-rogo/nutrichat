import { Colors } from '@/constants/theme';
import { useEffect, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

export type QuickLogItem = {
  id: string | number;
  title: string;
  cals: number;
  p: number;
  c: number;
  f: number;
  type: 'saved' | 'recipe';
};

// --- ANIMATED WRAPPER ---
function AnimatedQuickCard({ item, index, onQuickAction, onDeleteQuickLog, theme }: { item: QuickLogItem, index: number, onQuickAction: any, onDeleteQuickLog: any, theme: any }) {
  const animVal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animVal, {
      toValue: 1,
      duration: 450,
      delay: index * 100, 
      useNativeDriver: true, 
    }).start();
  }, []);

  const translateX = animVal.interpolate({
    inputRange: [0, 1],
    outputRange: [40, 0],
  });

  return (
    <Animated.View style={{ opacity: animVal, transform: [{ translateX }] }}>
      <TouchableOpacity 
        style={[styles.quickCard, { backgroundColor: theme.card || '#161616', borderColor: theme.border || '#2a2a2a' }]}
        onPress={() => onQuickAction(item)}
      >
        <View style={styles.quickCardHeader}>
          <Text style={[styles.quickBadge, item.type === 'saved' ? styles.badgeSaved : styles.badgeRecipe]}>
            {item.type}
          </Text>
          {/* NEW: Delete Button */}
          <TouchableOpacity 
            onPress={() => onDeleteQuickLog(item.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Makes the button easier to tap
          >
            <Text style={{ color: theme.textSub || '#a0a0a0', fontSize: 12, fontWeight: '800' }}>✕</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.quickTitle, { color: theme.text || '#ffffff' }]} numberOfLines={1}>{item.title}</Text>
        <Text style={[styles.quickInfo, { color: theme.textSub || '#a0a0a0' }]}>{item.cals} kcal • {item.p}g P</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

type Props = {
  quickLogs: QuickLogItem[];
  onQuickAction: (item: QuickLogItem) => void;
  // NEW PROP
  onDeleteQuickLog: (id: string | number) => void;
};

export default function QuickAccess({ quickLogs, onQuickAction, onDeleteQuickLog }: Props) {
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
        {quickLogs.map((item, index) => (
          <AnimatedQuickCard 
            key={item.id} 
            item={item} 
            index={index} 
            onQuickAction={onQuickAction} 
            onDeleteQuickLog={onDeleteQuickLog} // Pass it down to the card
            theme={theme} 
          />
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
    alignItems: 'center', // Changed from flex-start to center so the X aligns nicely
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