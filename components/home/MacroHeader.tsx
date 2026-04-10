import { Colors } from '@/constants/theme';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Easing, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

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

    Animated.parallel([
      Animated.timing(animatedPercent, {
        toValue: clampedPercent,
        duration: 1500, 
        easing: Easing.out(Easing.cubic), 
        useNativeDriver: false, 
      }),
      Animated.timing(animatedMacro, {
        toValue: macroValue || 0,
        duration: 1500,
        easing: Easing.out(Easing.cubic), 
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
  const theme = Colors[colorScheme ?? 'dark'] || Colors.dark as any; 

  const animatedCals = useRef(new Animated.Value(0)).current;
  const [displayCals, setDisplayCals] = useState(0);
  
  // Banner State
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    const listenerId = animatedCals.addListener((v) => {
      setDisplayCals(Math.round(v.value));
    });

    Animated.timing(animatedCals, {
      toValue: totals?.calories || 0,
      duration: 1500, 
      easing: Easing.out(Easing.cubic), 
      useNativeDriver: false,
    }).start();

    return () => {
      animatedCals.removeListener(listenerId);
    };
  }, [totals?.calories]);

  const isOverLimit = displayCals > CALORIE_GOAL;

  // --- DYNAMIC BANNER LOGIC ---
  let bannerMessage = null;
  let isActionable = false;

  // If protein progress is significantly behind calorie progress
  const proteinProgress = (totals?.protein || 0) / PROTEIN_GOAL;
  const calorieProgress = (totals?.calories || 0) / CALORIE_GOAL;

  if (totals?.calories === 0) {
    bannerMessage = "Ready to crush today? Log your first meal to get started!";
  } else if (proteinProgress < calorieProgress - 0.15) {
    bannerMessage = "Looks like you're behind on protein today. Want a quick fix?";
    isActionable = true;
  } else if (isOverLimit) {
    bannerMessage = "You've hit your daily calorie limit. Hydration is key right now!";
  }

  const handleAcceptFix = () => {
    // We will wire this up to automatically inject a shake later!
    Alert.alert("Quick Fix Triggered", "We will wire this up to log a quick protein shake!");
    setShowBanner(false);
  };

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

      {/* NEW: DYNAMIC ANNOUNCEMENT BANNER */}
      {showBanner && bannerMessage && (
        <View style={[styles.bannerContainer, { backgroundColor: theme.card || '#161616', borderColor: theme.border || '#2a2a2a' }]}>
          <Text style={[styles.bannerText, { color: theme.text || '#ffffff' }]}>{bannerMessage}</Text>
          
          {isActionable && (
            <View style={styles.bannerActions}>
              <TouchableOpacity 
                style={[styles.actionBtn, { backgroundColor: theme.chatUserBg || '#2a2a2a' }]} 
                onPress={handleAcceptFix}
              >
                <Text style={{ color: theme.success || '#39ff14', fontWeight: '800', fontSize: 16 }}>✓</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionBtn, { backgroundColor: theme.chatUserBg || '#2a2a2a' }]} 
                onPress={() => setShowBanner(false)}
              >
                <Text style={{ color: theme.limit || '#ff3b30', fontWeight: '800', fontSize: 14 }}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      <View style={[styles.macrosCard, { backgroundColor: theme.card || '#161616', shadowColor: '#000' }]}>
        <MacroRing
          percent={((totals?.protein || 0) / PROTEIN_GOAL) * 100}
          color={theme.protein || '#39ff14'} 
          trackColor={theme.ringTrack1 || '#112211'}
          label="Protein" 
          macroValue={totals?.protein || 0}
          textColor={theme.text || '#ffffff'} subTextColor={theme.textSub || '#a0a0a0'}
        />
        <MacroRing
          percent={((totals?.carbs || 0) / CARBS_GOAL) * 100}
          color={theme.carbs || '#00d2ff'} 
          trackColor={theme.ringTrack2 || '#0a1a22'}
          label="Carbs" 
          macroValue={totals?.carbs || 0}
          textColor={theme.text || '#ffffff'} subTextColor={theme.textSub || '#a0a0a0'}
        />
        <MacroRing
          percent={((totals?.fat || 0) / FAT_GOAL) * 100}
          color={theme.fats || '#ff7300'} 
          trackColor={theme.ringTrack3 || '#221105'}
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
    marginBottom: 16,
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
  
  // Banner Styles
  bannerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
    gap: 12,
  },
  bannerText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  bannerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },

macrosCard: {
    borderRadius: 24,
    
    // Split the padding here!
    paddingHorizontal: 24, // Keeps the left/right spacing the same
    paddingVertical: 22,   // Reduces the top/bottom spacing (adjust this number to taste!)
    
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