import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confirmed?: boolean;
  onConfirm?: () => void;
};

export default function EstimateCard({
  calories,
  protein,
  carbs,
  fat,
  confirmed = false,
  onConfirm,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.accentEdge} />

      <View style={styles.header}>
        <Text style={styles.caloricLabel}>Logged meal</Text>
        <Text style={styles.calorieCount}>
          +{calories}{' '}
          <Text style={styles.kcalUnit}>kcal</Text>
        </Text>
      </View>

      {/* Fixed-width chips — no flex so they never truncate */}
      <View style={styles.macroRow}>
        <View style={styles.macroChip}>
          <Text style={styles.macroChipLabel}>Protein</Text>
          <Text style={[styles.macroChipValue, { color: '#8eff71' }]}>{protein}g</Text>
        </View>
        <View style={styles.macroChip}>
          <Text style={styles.macroChipLabel}>Carbs</Text>
          <Text style={[styles.macroChipValue, { color: '#00e3fd' }]}>{carbs}g</Text>
        </View>
        <View style={styles.macroChip}>
          <Text style={styles.macroChipLabel}>Fat</Text>
          <Text style={[styles.macroChipValue, { color: '#ff946e' }]}>{fat}g</Text>
        </View>
      </View>

      {confirmed ? (
        <View style={styles.confirmedRow}>
          <View style={styles.confirmedDot} />
          <Text style={styles.confirmedText}>Logged</Text>
        </View>
      ) : (
        <TouchableOpacity onPress={onConfirm} activeOpacity={0.85}>
          <LinearGradient
            colors={['#8eff71', '#2ff801']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.confirmButton}
          >
            <Text style={styles.confirmButtonText}>Confirm Log</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: 'flex-start',
    width: 260,           // explicit fixed width — no percentage collapse
    backgroundColor: '#161616',
    borderRadius: 20,
    borderBottomLeftRadius: 6,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  accentEdge: {
    position: 'absolute',
    left: 0, top: 0, bottom: 0,
    width: 2,
    backgroundColor: '#8eff71',
    opacity: 0.45,
  },
  header: {
    paddingLeft: 8,
    gap: 3,
  },
  caloricLabel: {
    color: '#767575',
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.8,
  },
  calorieCount: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -1,
    lineHeight: 32,
  },
  kcalUnit: {
    color: '#adaaaa',
    fontSize: 15,
    fontWeight: '500',
  },
  macroRow: {
    flexDirection: 'row',
    gap: 8,
    paddingLeft: 8,
  },
  macroChip: {
    width: 68,           // fixed, not flex — guarantees labels never clip
    backgroundColor: 'rgba(32,32,32,0.9)',
    borderRadius: 12,
    paddingVertical: 9,
    alignItems: 'center',
    gap: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  macroChipLabel: {
    color: '#767575',
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  macroChipValue: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  confirmButton: {
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    shadowColor: '#8eff71',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  confirmButtonText: {
    color: '#064200',
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  confirmedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 8,
    paddingVertical: 2,
  },
  confirmedDot: {
    width: 6,
    height: 6,
    borderRadius: 99,
    backgroundColor: '#8eff71',
    opacity: 0.65,
  },
  confirmedText: {
    color: '#8eff71',
    fontSize: 12,
    fontWeight: '700',
    opacity: 0.65,
    letterSpacing: 0.3,
  },
});