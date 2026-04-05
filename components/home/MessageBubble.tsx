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
    <View style={isUser ? styles.userWrapper : styles.aiWrapper}>
      <View style={isUser ? styles.userBubble : styles.aiBubble}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  userWrapper: {
    alignItems: 'flex-end',
  },
  aiWrapper: {
    alignItems: 'flex-start',
  },
  userBubble: {
    backgroundColor: '#262626',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomRightRadius: 6,
    maxWidth: '78%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  aiBubble: {
    backgroundColor: 'rgba(26,26,26,0.9)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomLeftRadius: 6,
    maxWidth: '78%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(142,255,113,0.3)',
  },
  text: {
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
});