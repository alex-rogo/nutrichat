import { supabase } from '@/lib/supabase';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

type MacroRingProps = {
  percent: number;
  color: string;
  trackColor: string;
  label: string;
  value: string;
};

const RADIUS = 28;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function MacroRing({ percent, color, trackColor, label, value }: MacroRingProps) {
  const clampedPercent = Math.min(100, percent);
  const offset = CIRCUMFERENCE * (1 - clampedPercent / 100);

  return (
    <View style={styles.macroItem}>
      <View style={styles.donutWrapper}>
        <Svg width={64} height={64} viewBox="0 0 64 64" style={styles.donutSvg}>
          <Circle cx="32" cy="32" r={RADIUS} fill="none" stroke={trackColor} strokeWidth={6} />
          <Circle
            cx="32" cy="32" r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={`${CIRCUMFERENCE}`}
            strokeDashoffset={offset}
            rotation="-90"
            origin="32, 32"
          />
        </Svg>
        <Text style={styles.donutInner}>{value}</Text>
      </View>
      <Text style={styles.macroLabel}>{label}</Text>
    </View>
  );
}

type Props = {
  totals: { calories: number; protein: number; carbs: number; fat: number };
};

const CALORIE_GOAL = 2500;
const PROTEIN_GOAL = 170;
const CARBS_GOAL = 300;
const FAT_GOAL = 70;

export default function MacroHeader({ totals }: Props) {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const isOverLimit = totals.calories > CALORIE_GOAL;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionSubtitle}>DAILY MOMENTUM</Text>
      <View style={styles.caloriesRow}>
        <View style={styles.caloriesLeft}>
          <View style={styles.caloriesDisplay}>
            <Text style={[styles.caloriesCount, isOverLimit && styles.caloriesOver]}>
              {totals.calories.toLocaleString()}
            </Text>
            <Text style={styles.caloriesTotal}>/ {CALORIE_GOAL.toLocaleString()} kcal</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.macrosCard}>
        <MacroRing
          percent={(totals.protein / PROTEIN_GOAL) * 100}
          color="#39ff14" trackColor="#112211"
          label="Protein" value={`${totals.protein}g`}
        />
        <MacroRing
          percent={(totals.carbs / CARBS_GOAL) * 100}
          color="#00d2ff" trackColor="#0a1a22"
          label="Carbs" value={`${totals.carbs}g`}
        />
        <MacroRing
          percent={(totals.fat / FAT_GOAL) * 100}
          color="#ff7300" trackColor="#221105"
          label="Fats" value={`${totals.fat}g`}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 20,
    backgroundColor: '#0d0d0d',
  },
  sectionSubtitle: {
    fontSize: 10,
    letterSpacing: 1.5,
    color: '#a0a0a0',
    fontWeight: '600',
    marginBottom: 4,
    marginTop: 6,
  },
  caloriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  caloriesLeft: {},
  caloriesDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  caloriesCount: {
    fontSize: 48,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -1,
  },
  caloriesOver: {
    color: '#ff3b30',
  },
  caloriesTotal: {
    fontSize: 18,
    fontWeight: '500',
    color: '#666666',
  },
  signOutButton: {
    backgroundColor: '#1c1c1c',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  signOutText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 12,
  },
  macrosCard: {
    backgroundColor: '#161616',
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroItem: {
    alignItems: 'center',
    gap: 10,
  },
  donutWrapper: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  donutInner: {
    fontWeight: '700',
    fontSize: 11,
    color: '#ffffff',
    zIndex: 2,
  },
  macroLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#a0a0a0',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});