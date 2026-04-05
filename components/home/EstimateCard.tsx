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
      <Text style={styles.title}>{calories} calories</Text>

      <View style={styles.row}>
        <Text style={styles.text}>Protein: {protein}g</Text>
        <Text style={styles.text}>Carbs: {carbs}g</Text>
        <Text style={styles.text}>Fat: {fat}g</Text>
      </View>

      {confirmed ? (
        <View style={styles.confirmedBadge}>
          <Text style={styles.confirmedText}>Confirmed</Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.button} onPress={onConfirm}>
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: 'flex-start',
    backgroundColor: '#1e293b',
    padding: 14,
    borderRadius: 16,
    maxWidth: '85%',
    gap: 10,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  text: {
    color: '#cbd5e1',
    fontSize: 14,
  },
  button: {
    marginTop: 4,
    backgroundColor: '#22c55e',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
  },
  confirmedBadge: {
    marginTop: 4,
    backgroundColor: '#14532d',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  confirmedText: {
    color: '#bbf7d0',
    fontWeight: '700',
  },
});