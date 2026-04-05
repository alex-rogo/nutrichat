import ChatSection from '@/components/home/ChatSection';
import MacroHeader from '@/components/home/MacroHeader';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

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
        .eq('user_id', user.id);

      if (error) { console.error('Failed to load meals:', error.message); return; }
      if (!data) return;

      const newTotals = data.reduce(
        (acc, meal) => ({
          calories: acc.calories + meal.calories,
          protein:  acc.protein  + meal.protein,
          carbs:    acc.carbs    + meal.carbs,
          fat:      acc.fat      + meal.fat,
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
      protein:  prev.protein  + estimate.protein,
      carbs:    prev.carbs    + estimate.carbs,
      fat:      prev.fat      + estimate.fat,
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <MacroHeader totals={totals} />
      <ChatSection onConfirmMeal={handleAddMeal} initialMeals={initialMeals} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e0e0e', // void black — was '#0f172a' (navy slate-900)
  },
});