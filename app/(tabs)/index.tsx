import ChatSection from '@/components/home/ChatSection';
import MacroHeader from '@/components/home/MacroHeader';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [initialMeals, setInitialMeals] = useState<any[]>([]);

  useEffect(() => {
    const loadMeals = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('meals')
        .select()
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) { console.error('Failed to load meals:', error.message); return; }
      if (!data) return;

      const newTotals = data.reduce(
        (acc, meal) => ({
          calories: acc.calories + meal.calories,
          protein: acc.protein + meal.protein,
          carbs: acc.carbs + meal.carbs,
          fat: acc.fat + meal.fat,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );

      setTotals(newTotals);
      setInitialMeals(data);
    };
    loadMeals();
  }, []);

  const handleAddMeal = (estimate: { calories: number; protein: number; carbs: number; fat: number }) => {
    setTotals((prev) => ({
      calories: prev.calories + estimate.calories,
      protein: prev.protein + estimate.protein,
      carbs: prev.carbs + estimate.carbs,
      fat: prev.fat + estimate.fat,
    }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* App Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar} />
            <Text style={styles.appTitle}>NutriChat</Text>
          </View>
        </View>

        {/* Macro summary */}
        <MacroHeader totals={totals} />

        {/* Feed + Chat */}
        <ChatSection onConfirmMeal={handleAddMeal} initialMeals={initialMeals} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#0d0d0d',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#333',
    borderWidth: 2,
    borderColor: '#666',
  },
  appTitle: {
    color: '#39ff14',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
  },
});