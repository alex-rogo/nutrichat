import { supabase } from '@/lib/supabase';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
};

export default function MacroHeader({ totals }: Props) {
  const calorieGoal = 2500;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.title}>Today</Text>
          <Text style={styles.calories}>
            {calorieGoal - totals.calories} cal remaining
          </Text>
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.text}>Protein: {totals.protein} / 180g</Text>
        <Text style={styles.text}>Carbs: {totals.carbs} / 250g</Text>
        <Text style={styles.text}>Fat: {totals.fat} / 70g</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.38,
    padding: 20,
    justifyContent: 'center',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: '700',
  },
  calories: {
    color: '#a5f3fc',
    fontSize: 22,
    marginTop: 6,
  },
  signOutButton: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  signOutText: {
    color: 'white',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
});