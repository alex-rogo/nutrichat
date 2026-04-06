import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confirmed?: boolean;
  onConfirm?: () => void;
};

export default function EstimateCard({ calories, protein, carbs, fat, confirmed = false, onConfirm }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        +<Text style={styles.calsHighlight}>{calories}</Text>
        <Text style={styles.calsLabel}> calories</Text>
      </Text>

      <View style={styles.macrosRow}>
        <Text style={styles.macroProtein}>{protein}g P</Text>
        <Text style={styles.macroDivider}>·</Text>
        <Text style={styles.macroCarbs}>{carbs}g C</Text>
        <Text style={styles.macroDivider}>·</Text>
        <Text style={styles.macroFat}>{fat}g F</Text>
      </View>

      <Text style={styles.editHint}>Tap Confirm to log this meal</Text>

      {confirmed ? (
        <View style={styles.confirmedBadge}>
          <Text style={styles.confirmedText}>✓ CONFIRMED</Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
          <Text style={styles.confirmBtnText}>✓  CONFIRM LOG</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: 'flex-start',
    backgroundColor: '#161616',
    padding: 16,
    borderRadius: 18,
    borderLeftWidth: 4,
    borderLeftColor: '#39ff14',
    maxWidth: '88%',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  calsHighlight: {
    color: '#39ff14',
    fontSize: 18,
    fontWeight: '800',
  },
  calsLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  macrosRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  macroProtein: {
    color: '#39ff14',
    fontWeight: '600',
    fontSize: 13,
  },
  macroCarbs: {
    color: '#00d2ff',
    fontWeight: '600',
    fontSize: 13,
  },
  macroFat: {
    color: '#ff7300',
    fontWeight: '600',
    fontSize: 13,
  },
  macroDivider: {
    color: '#666666',
    fontSize: 13,
  },
  editHint: {
    fontSize: 11,
    color: '#666666',
    fontStyle: 'italic',
  },
  confirmBtn: {
    backgroundColor: '#39ff14',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  confirmBtnText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 1,
  },
  confirmedBadge: {
    backgroundColor: '#14532d',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  confirmedText: {
    color: '#bbf7d0',
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 1,
  },
});