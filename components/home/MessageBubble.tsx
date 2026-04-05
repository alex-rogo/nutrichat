import { ChatMessage } from '@/types/chat';
import { StyleSheet, Text, View } from 'react-native';
import EstimateCard from './EstimateCard';

type Props = ChatMessage & {
  onConfirm?: () => void;
};

export default function MessageBubble({
  isUser,
  text,
  type,
  estimate,
  confirmed,
  onConfirm,
}: Props) {
  if (type === 'estimate' && estimate) {
    return (
      <EstimateCard
        calories={estimate.calories}
        protein={estimate.protein}
        carbs={estimate.carbs}
        fat={estimate.fat}
        confirmed={confirmed}
        onConfirm={onConfirm}
      />
    );
  }

  return (
    <View style={isUser ? styles.userContainer : styles.aiContainer}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  userContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 14,
    maxWidth: '80%',
  },
  aiContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#374151',
    padding: 12,
    borderRadius: 14,
    maxWidth: '80%',
  },
  text: {
    color: 'white',
  },
});