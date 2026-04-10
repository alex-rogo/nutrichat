import { Colors } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';

// --- DATA STRUCTURES ---
const GOALS = [
  { id: 'lose', title: 'Lose Fat', desc: 'Caloric deficit for sustainable weight loss' },
  { id: 'maintain', title: 'Maintain / Recomp', desc: 'Stay the same weight, swap fat for muscle' },
  { id: 'gain', title: 'Build Muscle', desc: 'Caloric surplus for maximum strength' },
];

const ACTIVITY_LEVELS = [
  { id: 'sedentary', title: 'Sedentary', desc: 'Desk job, little to no exercise' },
  { id: 'light', title: 'Lightly Active', desc: 'Light exercise 1-3 days/week' },
  { id: 'moderate', title: 'Moderately Active', desc: 'Active exercise 3-5 days/week' },
  { id: 'high', title: 'Highly Active', desc: 'Heavy exercise 6-7 days/week' },
];

const GENDERS = [
  { id: 'male', title: 'Male' },
  { id: 'female', title: 'Female' },
  { id: 'other', title: 'Other' },
];

// --- ANIMATED WRAPPER FOR EACH STEP ---
const FadeInStep = ({ children, step }: { children: React.ReactNode, step: number }) => {
  const animVal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    animVal.setValue(0);
    Animated.timing(animVal, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [step]); // <-- FIX: Animation only triggers when the step number changes

  const translateY = animVal.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  return (
    <Animated.View style={{ flex: 1, opacity: animVal, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
};

export default function OnboardingScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark'] || Colors.dark as any;

  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // User Data State
  const [goal, setGoal] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [age, setAge] = useState('');
  const [activity, setActivity] = useState<string | null>(null);

  // --- HANDLERS ---
  const handleSelect = (setter: any, value: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setter(value);
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      completeOnboarding();
    }
  };

  const completeOnboarding = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // 1. Get the current logged-in user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      Alert.alert("Error", "You must be logged in to save your profile.");
      return;
    }

    // 2. Upsert the data into the profiles table
    const { error } = await supabase.from('profiles').upsert({
      id: user.id, 
      goal: goal,
      gender: gender,
      age: parseInt(age),
      activity_level: activity,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      Alert.alert("Failed to save profile", error.message);
      return;
    }

    // 3. Navigate to the dashboard
    router.replace('/(tabs)'); 
  };

  // Check if current step is valid to enable the NEXT button
  const isStepValid = () => {
    if (step === 1) return goal !== null;
    if (step === 2) return gender !== null;
    if (step === 3) return age.length > 0 && parseInt(age) > 0;
    if (step === 4) return activity !== null;
    return false;
  };

  // --- RENDERERS FOR EACH STEP ---
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <FadeInStep step={step}>
            <Text style={[styles.headerTitle, { color: theme.text || '#ffffff' }]}>What is your primary goal?</Text>
            <Text style={[styles.headerSubtitle, { color: theme.textSub || '#a0a0a0' }]}>This helps us calculate your daily targets.</Text>
            <View style={styles.optionsContainer}>
              {GOALS.map((item) => {
                const isSelected = goal === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.optionCard,
                      { backgroundColor: theme.card || '#161616', borderColor: isSelected ? theme.primary : (theme.border || '#2a2a2a') },
                      isSelected && { backgroundColor: theme.chatUserBg || '#2a2a2a' }
                    ]}
                    onPress={() => handleSelect(setGoal, item.id)}
                  >
                    <View style={styles.radioOuter}>
                      {isSelected && <View style={[styles.radioInner, { backgroundColor: theme.primary || '#39ff14' }]} />}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.optionTitle, { color: theme.text || '#ffffff' }]}>{item.title}</Text>
                      <Text style={[styles.optionDesc, { color: theme.textSub || '#a0a0a0' }]}>{item.desc}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </FadeInStep>
        );
      case 2:
        return (
          <FadeInStep step={step}>
            <Text style={[styles.headerTitle, { color: theme.text || '#ffffff' }]}>Which best describes you?</Text>
            <View style={styles.optionsContainer}>
              {GENDERS.map((item) => {
                const isSelected = gender === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.optionCard,
                      { backgroundColor: theme.card || '#161616', borderColor: isSelected ? theme.primary : (theme.border || '#2a2a2a') },
                      isSelected && { backgroundColor: theme.chatUserBg || '#2a2a2a' }
                    ]}
                    onPress={() => handleSelect(setGender, item.id)}
                  >
                    <View style={styles.radioOuter}>
                      {isSelected && <View style={[styles.radioInner, { backgroundColor: theme.primary || '#39ff14' }]} />}
                    </View>
                    <Text style={[styles.optionTitle, { color: theme.text || '#ffffff', flex: 1 }]}>{item.title}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </FadeInStep>
        );
      case 3:
        return (
          <FadeInStep step={step}>
            <Text style={[styles.headerTitle, { color: theme.text || '#ffffff' }]}>How old are you?</Text>
            <Text style={[styles.headerSubtitle, { color: theme.textSub || '#a0a0a0' }]}>Age impacts your metabolic rate.</Text>
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <TextInput
                style={[styles.numberInput, { color: theme.primary || '#39ff14', borderBottomColor: theme.border || '#2a2a2a' }]}
                keyboardType="number-pad"
                maxLength={3}
                placeholder="00"
                placeholderTextColor={theme.textDim || '#666666'}
                value={age}
                onChangeText={(val) => {
                  setAge(val.replace(/[^0-9]/g, ''));
                }}
                autoFocus
              />
              <Text style={{ color: theme.textSub || '#a0a0a0', marginTop: 10, fontSize: 16, fontWeight: '600' }}>YEARS OLD</Text>
            </View>
          </FadeInStep>
        );
      case 4:
        return (
          <FadeInStep step={step}>
            <Text style={[styles.headerTitle, { color: theme.text || '#ffffff' }]}>How active are you?</Text>
            <View style={styles.optionsContainer}>
              {ACTIVITY_LEVELS.map((item) => {
                const isSelected = activity === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.optionCard,
                      { backgroundColor: theme.card || '#161616', borderColor: isSelected ? theme.primary : (theme.border || '#2a2a2a') },
                      isSelected && { backgroundColor: theme.chatUserBg || '#2a2a2a' }
                    ]}
                    onPress={() => handleSelect(setActivity, item.id)}
                  >
                    <View style={styles.radioOuter}>
                      {isSelected && <View style={[styles.radioInner, { backgroundColor: theme.primary || '#39ff14' }]} />}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.optionTitle, { color: theme.text || '#ffffff' }]}>{item.title}</Text>
                      <Text style={[styles.optionDesc, { color: theme.textSub || '#a0a0a0' }]}>{item.desc}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </FadeInStep>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.mainBg || '#0d0d0d' }]}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        
        {/* PROGRESS BAR */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBarBg, { backgroundColor: theme.border || '#2a2a2a' }]}>
            <Animated.View 
              style={[
                styles.progressBarFill, 
                { backgroundColor: theme.primary || '#39ff14', width: `${(step / totalSteps) * 100}%` }
              ]} 
            />
          </View>
        </View>

        {/* MAIN CONTENT */}
        <View style={styles.content}>
          {renderStepContent()}
        </View>

        {/* FOOTER BUTTON */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[
              styles.nextBtn, 
              { backgroundColor: isStepValid() ? (theme.primary || '#39ff14') : (theme.card || '#161616') }
            ]}
            disabled={!isStepValid()}
            onPress={handleNext}
          >
            <Text style={[
              styles.nextBtnText, 
              { color: isStepValid() ? '#000000' : (theme.textSub || '#a0a0a0') }
            ]}>
              {step === totalSteps ? "FINISH & CALCULATE" : "CONTINUE"}
            </Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  progressContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 30,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
    lineHeight: 38,
  },
  headerSubtitle: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 32,
  },
  optionsContainer: {
    gap: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    borderWidth: 2,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#666',
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  optionDesc: {
    fontSize: 13,
  },
  numberInput: {
    fontSize: 72,
    fontWeight: '800',
    textAlign: 'center',
    borderBottomWidth: 2,
    minWidth: 120,
    paddingBottom: 10,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
  },
  nextBtn: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtnText: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1,
  },
});