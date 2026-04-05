import { supabase } from '@/lib/supabase';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Easing,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';

// Create an animated version of the SVG Circle
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
};

const CALORIE_GOAL = 2500;
const PROTEIN_GOAL = 180;
const CARBS_GOAL = 250;
const FAT_GOAL = 70;

const SIZE = 210;
const CENTER = SIZE / 2;
const STROKE = 9;
const GLOW_STROKE = 14;

const OUTER_RADIUS = 92;
const MIDDLE_RADIUS = 76;
const INNER_RADIUS = 60;

const getCircumference = (radius: number) => 2 * Math.PI * radius;

export default function MacroHeader({ totals }: Props) {
  const targetCaloriesRemaining = Math.max(CALORIE_GOAL - totals.calories, 0);

  // Ring animation values (0 to 1)
  const proteinRingAnim = useRef(new Animated.Value(0)).current;
  const carbsRingAnim = useRef(new Animated.Value(0)).current;
  const fatRingAnim = useRef(new Animated.Value(0)).current;

  // Number animation values
  const caloriesNumberAnim = useRef(new Animated.Value(targetCaloriesRemaining)).current;
  const proteinNumberAnim = useRef(new Animated.Value(totals.protein)).current;
  const carbsNumberAnim = useRef(new Animated.Value(totals.carbs)).current;
  const fatNumberAnim = useRef(new Animated.Value(totals.fat)).current;

  // Rendered animated numbers
  const [displayCalories, setDisplayCalories] = useState(targetCaloriesRemaining);
  const [displayProtein, setDisplayProtein] = useState(totals.protein);
  const [displayCarbs, setDisplayCarbs] = useState(totals.carbs);
  const [displayFat, setDisplayFat] = useState(totals.fat);

  useEffect(() => {
    const animateRing = (value: Animated.Value, toValue: number) => {
      Animated.timing(value, {
        toValue: Math.max(0, Math.min(toValue, 1)),
        duration: 1200,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }).start();
    };

    const animateNumber = (value: Animated.Value, toValue: number) => {
      Animated.timing(value, {
        toValue,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    };

    animateRing(proteinRingAnim, totals.protein / PROTEIN_GOAL);
    animateRing(carbsRingAnim, totals.carbs / CARBS_GOAL);
    animateRing(fatRingAnim, totals.fat / FAT_GOAL);

    animateNumber(caloriesNumberAnim, targetCaloriesRemaining);
    animateNumber(proteinNumberAnim, totals.protein);
    animateNumber(carbsNumberAnim, totals.carbs);
    animateNumber(fatNumberAnim, totals.fat);
  }, [
    totals,
    targetCaloriesRemaining,
    proteinRingAnim,
    carbsRingAnim,
    fatRingAnim,
    caloriesNumberAnim,
    proteinNumberAnim,
    carbsNumberAnim,
    fatNumberAnim,
  ]);

  useEffect(() => {
    const caloriesId = caloriesNumberAnim.addListener(({ value }) => {
      setDisplayCalories(Math.round(value));
    });
    const proteinId = proteinNumberAnim.addListener(({ value }) => {
      setDisplayProtein(Math.round(value));
    });
    const carbsId = carbsNumberAnim.addListener(({ value }) => {
      setDisplayCarbs(Math.round(value));
    });
    const fatId = fatNumberAnim.addListener(({ value }) => {
      setDisplayFat(Math.round(value));
    });

    return () => {
      caloriesNumberAnim.removeListener(caloriesId);
      proteinNumberAnim.removeListener(proteinId);
      carbsNumberAnim.removeListener(carbsId);
      fatNumberAnim.removeListener(fatId);
    };
  }, [caloriesNumberAnim, proteinNumberAnim, carbsNumberAnim, fatNumberAnim]);

  const getDashOffset = (anim: Animated.Value, radius: number) => {
    const circumference = getCircumference(radius);
    return anim.interpolate({
      inputRange: [0, 1],
      outputRange: [circumference, 0],
    });
  };

  const handleReset = async () => {
    Alert.alert(
      'Reset totals?',
      'This will delete all saved meals for your current account.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            const {
              data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
              Alert.alert('Error', 'No signed-in user found.');
              return;
            }

            const { error } = await supabase
              .from('meals')
              .delete()
              .eq('user_id', user.id);

            if (error) {
              Alert.alert('Reset failed', error.message);
              return;
            }

            Alert.alert('Reset complete', 'Reload the app to refresh totals.');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.brand}>NutriChat</Text>

        <View style={styles.topRight}>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>

          <View style={styles.profileCircle} />
        </View>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.centerGlow} />

        <View style={styles.ringWrapper}>
          <Svg width={SIZE} height={SIZE} style={styles.rings}>
            {[OUTER_RADIUS, MIDDLE_RADIUS, INNER_RADIUS].map((r, i) => (
              <Circle
                key={i}
                cx={CENTER}
                cy={CENTER}
                r={r}
                stroke="#1a1a1a"
                strokeWidth={STROKE}
                fill="none"
              />
            ))}

            <AnimatedCircle
              cx={CENTER}
              cy={CENTER}
              r={OUTER_RADIUS}
              stroke="#8eff71"
              strokeWidth={GLOW_STROKE}
              fill="none"
              strokeDasharray={getCircumference(OUTER_RADIUS)}
              strokeDashoffset={getDashOffset(proteinRingAnim, OUTER_RADIUS)}
              strokeLinecap="round"
              opacity={0.15}
              rotation="-90"
              origin={`${CENTER}, ${CENTER}`}
            />
            <AnimatedCircle
              cx={CENTER}
              cy={CENTER}
              r={OUTER_RADIUS}
              stroke="#8eff71"
              strokeWidth={STROKE}
              fill="none"
              strokeDasharray={getCircumference(OUTER_RADIUS)}
              strokeDashoffset={getDashOffset(proteinRingAnim, OUTER_RADIUS)}
              strokeLinecap="round"
              rotation="-90"
              origin={`${CENTER}, ${CENTER}`}
            />

            <AnimatedCircle
              cx={CENTER}
              cy={CENTER}
              r={MIDDLE_RADIUS}
              stroke="#00e3fd"
              strokeWidth={GLOW_STROKE}
              fill="none"
              strokeDasharray={getCircumference(MIDDLE_RADIUS)}
              strokeDashoffset={getDashOffset(carbsRingAnim, MIDDLE_RADIUS)}
              strokeLinecap="round"
              opacity={0.15}
              rotation="-90"
              origin={`${CENTER}, ${CENTER}`}
            />
            <AnimatedCircle
              cx={CENTER}
              cy={CENTER}
              r={MIDDLE_RADIUS}
              stroke="#00e3fd"
              strokeWidth={STROKE}
              fill="none"
              strokeDasharray={getCircumference(MIDDLE_RADIUS)}
              strokeDashoffset={getDashOffset(carbsRingAnim, MIDDLE_RADIUS)}
              strokeLinecap="round"
              rotation="-90"
              origin={`${CENTER}, ${CENTER}`}
            />

            <AnimatedCircle
              cx={CENTER}
              cy={CENTER}
              r={INNER_RADIUS}
              stroke="#ff946e"
              strokeWidth={GLOW_STROKE}
              fill="none"
              strokeDasharray={getCircumference(INNER_RADIUS)}
              strokeDashoffset={getDashOffset(fatRingAnim, INNER_RADIUS)}
              strokeLinecap="round"
              opacity={0.15}
              rotation="-90"
              origin={`${CENTER}, ${CENTER}`}
            />
            <AnimatedCircle
              cx={CENTER}
              cy={CENTER}
              r={INNER_RADIUS}
              stroke="#ff946e"
              strokeWidth={STROKE}
              fill="none"
              strokeDasharray={getCircumference(INNER_RADIUS)}
              strokeDashoffset={getDashOffset(fatRingAnim, INNER_RADIUS)}
              strokeLinecap="round"
              rotation="-90"
              origin={`${CENTER}, ${CENTER}`}
            />
          </Svg>

          <View style={styles.centerText}>
            <Text style={styles.calorieNumber}>
              {displayCalories.toLocaleString()}
            </Text>
            <Text style={styles.calorieLabel}>CALORIES REMAINING</Text>
          </View>
        </View>

        <View style={styles.macroRow}>
          <MacroItem label="PROTEIN" value={displayProtein} color="#8eff71" />
          <MacroItem label="CARBS" value={displayCarbs} color="#00e3fd" />
          <MacroItem label="FATS" value={displayFat} color="#ff946e" />
        </View>
      </View>
    </View>
  );
}

const MacroItem = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) => (
  <View style={styles.macroItem}>
    <Text style={styles.macroLabel}>{label}</Text>
    <Text style={[styles.macroValue, { color }]}>{value}g</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
    
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  brand: {
    color: '#8eff71',
    fontSize: 22,
    fontWeight: '900',
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resetButton: {
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
  },
  resetText: {
    color: '#ff6464',
    fontSize: 12,
    fontWeight: '700',
  },
  profileCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#ffd8cc',
  },
heroCard: {
  backgroundColor: 'rgba(26,26,26,0.9)', // ✅ MATCH AI BUBBLE

  borderRadius: 35,
  paddingTop: 5,
  paddingBottom: 20,
  paddingHorizontal: 20,
  alignItems: 'center',

  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.05)', // ✅ MATCH AI BUBBLE

  overflow: 'hidden',

  // subtle depth (same feel as chat bubbles)
  shadowColor: '#000',
  shadowOpacity: 0.25,
  shadowRadius: 16,
  shadowOffset: { width: 0, height: 6 },

  elevation: 6,
},
  centerGlow: {
    position: 'absolute',
    top: 20,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(142,255,113,0.04)',
  },
  ringWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: SIZE,
    marginTop: 10,
  },
  rings: {
    position: 'absolute',
  },
  centerText: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  calorieNumber: {
    color: 'white',
    fontSize: 50,
    fontWeight: '900',
    letterSpacing: -1,
  },
  calorieLabel: {
    color: '#666',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginTop: -6,
  },
  macroRow: {
    flexDirection: 'row',
    marginTop: 10,
    width: '100%',
  },
  macroItem: {
    flex: 1,
    alignItems: 'center',
  },
  macroLabel: {
    color: '#444',
    fontSize: 10,
    fontWeight: '900',
    marginBottom: 4,
  },
  macroValue: {
    fontSize: 20,
    fontWeight: '900',
  },
});