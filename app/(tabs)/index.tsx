import ChatSection from '@/components/home/ChatSection';
import MacroHeader from '@/components/home/MacroHeader';
import QuickAccess, { QuickLogItem } from '@/components/home/QuickAccess';
import { Colors } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark'] || Colors.dark;
  
  const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [initialMeals, setInitialMeals] = useState<any[]>([]);
  const [isInsightsVisible, setIsInsightsVisible] = useState(false);
  const [externalRecipe, setExternalRecipe] = useState<any | null>(null);

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
          calories: (acc.calories || 0) + (meal?.calories || 0),
          protein: (acc.protein || 0) + (meal?.protein || 0),
          carbs: (acc.carbs || 0) + (meal?.carbs || 0),
          fat: (acc.fat || 0) + (meal?.fat || 0),
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );

      setTotals(newTotals);
      setInitialMeals(data);
    };
    loadMeals();
  }, []);

  const handleAddMeal = (estimate: { calories?: number; protein?: number; carbs?: number; fat?: number }) => {
    if (!estimate) return;
    setTotals((prev) => ({
      calories: (prev?.calories || 0) + (estimate.calories || 0),
      protein: (prev?.protein || 0) + (estimate.protein || 0),
      carbs: (prev?.carbs || 0) + (estimate.carbs || 0),
      fat: (prev?.fat || 0) + (estimate.fat || 0),
    }));
  };

  const handleQuickAction = async (item: QuickLogItem) => {
    if (item.type === 'saved') {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newMeal = {
        name: item.title,
        calories: item.cals,
        protein: item.p,
        carbs: item.c,
        fat: item.f,
        user_id: user.id,
      };

      const { data, error } = await supabase.from('meals').insert(newMeal).select().single();
      if (error) { console.error('Quick Log Failed:', error.message); return; }

      handleAddMeal(newMeal);
      setInitialMeals((prev) => [data, ...prev]);

    } else if (item.type === 'recipe') {
      const ingredients = item.title.includes('Oats')
        ? ["1/2 cup Rolled Oats", "1/2 cup Almond Milk", "1/4 cup mixed Berries", "1 tbsp Chia Seeds", "Drizzle of Honey"]
        : ["1/2 cup dry Quinoa", "2 cups fresh Spinach", "1/4 cup crumbled Feta", "2 tbsp Vinaigrette dressing"];

      setExternalRecipe({
        name: item.title,
        calories: item.cals,
        protein: item.p,
        carbs: item.c,
        fat: item.f,
        ingredients
      });
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.mainBg || '#0d0d0d' }]}>
      <View style={[styles.container, { backgroundColor: theme.mainBg || '#0d0d0d' }]}>
        
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.avatar, { borderColor: theme.border || '#2a2a2a' }]} />
            <Text style={[styles.appTitle, { color: theme.primary || '#39ff14' }]}>NutriChat</Text>
          </View>
        </View>

        <MacroHeader totals={totals} />

        {/* Clean, abstracted Quick Access component */}
        <QuickAccess onQuickAction={handleQuickAction} />

        <View style={styles.feedContainer}>
          <ChatSection 
            onConfirmMeal={handleAddMeal} 
            initialMeals={initialMeals} 
            onOpenInsights={() => setIsInsightsVisible(true)}
            externalRecipe={externalRecipe}
            onClearRecipe={() => setExternalRecipe(null)}
          />
        </View>

      </View>

      <Modal visible={isInsightsVisible} animationType="slide" presentationStyle="pageSheet">
          <View style={[styles.modalContainer, { backgroundColor: theme.mainBg || '#0d0d0d' }]}>
          <View style={[styles.modalHeader, { backgroundColor: theme.card || '#161616', borderBottomColor: theme.border || '#2a2a2a' }]}>
            <Text style={[styles.modalTitle, { color: theme.text || '#ffffff' }]}>Insights</Text>
            <TouchableOpacity onPress={() => setIsInsightsVisible(false)}>
              <Text style={{ color: theme.textSub || '#a0a0a0', fontSize: 18 }}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16, 
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
  },
  appTitle: {
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 20,
  },
  feedContainer: { flex: 1 },
  modalContainer: { flex: 1 },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
});