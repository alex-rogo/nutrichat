import { Colors } from '@/constants/theme';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View, useColorScheme } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

// Create an animatable version of the SVG Circle
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type MacroRingProps = {
  percent: number;
  color: string;
  trackColor: string;
  label: string;
  macroValue: number;
  textColor: string;
  subTextColor: string;
};

const RADIUS = 28;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function MacroRing({ percent, color, trackColor, label, macroValue, textColor, subTextColor }: MacroRingProps) {
  const clampedPercent = Math.min(100, Math.max(0, percent || 0));
  
  const animatedPercent = useRef(new Animated.Value(0)).current;
  const animatedMacro = useRef(new Animated.Value(0)).current;
  
  const [displayVal, setDisplayVal] = useState(0);

  useEffect(() => {
    const listenerId = animatedMacro.addListener((v) => {
      setDisplayVal(Math.round(v.value));
    });

    // Run both the ring drawing and number counting simultaneously
    Animated.parallel([
      Animated.timing(animatedPercent, {
        toValue: clampedPercent,
        duration: 1500, // Increased slightly to show off the slow-down
        easing: Easing.out(Easing.cubic), // <--- THIS CREATES THE DECELERATION EFFECT
        useNativeDriver: false, 
      }),
      Animated.timing(animatedMacro, {
        toValue: macroValue || 0,
        duration: 1500,
        easing: Easing.out(Easing.cubic), // <--- MATCHING DECELERATION
        useNativeDriver: false,
      }),
    ]).start();

    return () => {
      animatedMacro.removeListener(listenerId);
    };
  }, [clampedPercent, macroValue]);

  const strokeDashoffset = animatedPercent.interpolate({
    inputRange: [0, 100],
    outputRange: [CIRCUMFERENCE, 0],
  });

  return (
    <View style={styles.macroItem}>
      <View style={styles.donutWrapper}>
        <Svg width={64} height={64} viewBox="0 0 64 64" style={styles.donutSvg}>
          <Circle cx="32" cy="32" r={RADIUS} fill="none" stroke={trackColor || '#333'} strokeWidth={6} />
          <AnimatedCircle
            cx="32" cy="32" r={RADIUS}
            fill="none"
            stroke={color || '#39ff14'}
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={`${CIRCUMFERENCE}`}
            strokeDashoffset={strokeDashoffset}
            rotation="-90"
            origin="32, 32"
          />
        </Svg>
        <Text style={[styles.donutInner, { color: textColor }]}>{displayVal}g</Text>
      </View>
      <Text style={[styles.macroLabel, { color: subTextColor }]}>{label}</Text>
    </View>
  );
}

type Props = {
  totals?: { calories: number; protein: number; carbs: number; fat: number };
};

const CALORIE_GOAL = 2500;
const PROTEIN_GOAL = 170;
const CARBS_GOAL = 300;
const FAT_GOAL = 70;

export default function MacroHeader({ totals = { calories: 0, protein: 0, carbs: 0, fat: 0 } }: Props) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark'] || Colors.dark || {}; 

  const animatedCals = useRef(new Animated.Value(0)).current;
  const [displayCals, setDisplayCals] = useState(0);

  useEffect(() => {
    const listenerId = animatedCals.addListener((v) => {
      setDisplayCals(Math.round(v.value));
    });

    Animated.timing(animatedCals, {
      toValue: totals?.calories || 0,
      duration: 1500, // Match the duration of the rings
      easing: Easing.out(Easing.cubic), // <--- SLOW DOWN AT THE END FOR CALORIES
      useNativeDriver: false,
    }).start();

    return () => {
      animatedCals.removeListener(listenerId);
    };
  }, [totals?.calories]);

  const isOverLimit = displayCals > CALORIE_GOAL;

  return (
    <View style={[styles.container, { backgroundColor: theme.mainBg || '#0d0d0d' }]}>
      <Text style={[styles.sectionSubtitle, { color: theme.textSub || '#a0a0a0' }]}>DAILY MOMENTUM</Text>
      <View style={styles.caloriesRow}>
        <View style={styles.caloriesDisplay}>
          <Text style={[styles.caloriesCount, { color: isOverLimit ? (theme.limit || '#ff3b30') : (theme.text || '#ffffff') }, isOverLimit && styles.caloriesOver]}>
            {displayCals.toLocaleString()}
          </Text>
          <Text style={[styles.caloriesTotal, { color: theme.textDim || '#666666' }]}>/ {CALORIE_GOAL.toLocaleString()} kcal</Text>
        </View>
      </View>

      <View style={[styles.macrosCard, { backgroundColor: theme.card || '#161616', shadowColor: '#000' }]}>
        <MacroRing
          percent={((totals?.protein || 0) / PROTEIN_GOAL) * 100}
          color={theme.protein || '#39ff14'} 
          trackColor={colorScheme === 'light' ? (theme.ringTrack || '#e0e0e0') : (theme.ringTrack1 || '#112211')}
          label="Protein" 
          macroValue={totals?.protein || 0}
          textColor={theme.text || '#ffffff'} subTextColor={theme.textSub || '#a0a0a0'}
        />
        <MacroRing
          percent={((totals?.carbs || 0) / CARBS_GOAL) * 100}
          color={theme.carbs || '#00d2ff'} 
          trackColor={colorScheme === 'light' ? (theme.ringTrack || '#e0e0e0') : (theme.ringTrack2 || '#0a1a22')}
          label="Carbs" 
          macroValue={totals?.carbs || 0}
          textColor={theme.text || '#ffffff'} subTextColor={theme.textSub || '#a0a0a0'}
        />
        <MacroRing
          percent={((totals?.fat || 0) / FAT_GOAL) * 100}
          color={theme.fats || '#ff7300'} 
          trackColor={colorScheme === 'light' ? (theme.ringTrack || '#e0e0e0') : (theme.ringTrack3 || '#221105')}
          label="Fats" 
          macroValue={totals?.fat || 0}
          textColor={theme.text || '#ffffff'} subTextColor={theme.textSub || '#a0a0a0'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 11,
    letterSpacing: 1.5,
    fontWeight: '600',
    marginBottom: 4,
    marginTop: 6,
    textTransform: 'uppercase',
  },
  caloriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  caloriesDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  caloriesCount: {
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: -1,
  },
  caloriesOver: {
    textShadowColor: 'rgba(255, 59, 48, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  caloriesTotal: {
    fontSize: 18,
    fontWeight: '500',
  },
  macrosCard: {
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 5,
  },
  macroItem: {
    alignItems: 'center',
    gap: 12,
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
    fontSize: 14,
    zIndex: 2,
  },
  macroLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});