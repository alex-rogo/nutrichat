import { Colors } from '@/constants/theme';
import { ChatMessage } from '@/types/chat';
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import EstimateCard from './EstimateCard';

type Props = ChatMessage & { onConfirm?: () => void };

export default function MessageBubble({ isUser, text, type, estimate, recipe, confirmed, onConfirm }: Props) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark'] || Colors.dark;

  // Render standard AI macro estimate
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

  // Render the special HTML-style Recipe Card
  if (type === 'recipe' && recipe) {
    return (
      <View style={[styles.aiContainer, { backgroundColor: theme.card || '#161616', borderLeftColor: theme.primary || '#39ff14' }]}>
        <Text style={[styles.text, { color: theme.text || '#ffffff' }]}>
          Here is the recipe for <Text style={{ color: theme.primary || '#39ff14', fontWeight: '700' }}>{recipe.name}</Text>:
        </Text>

        <View style={styles.recipeList}>
          {recipe.ingredients.map((ing, i) => (
            <Text key={i} style={[styles.recipeItem, { color: theme.textSub || '#a0a0a0' }]}>• {ing}</Text>
          ))}
        </View>

        <Text style={[styles.text, { color: theme.text || '#ffffff', marginBottom: 12 }]}>
          Mix ingredients in a bowl. Enjoy your healthy meal!
        </Text>

        <Text style={[styles.recipeMacros, { color: theme.textSub || '#a0a0a0' }]}>
          Macros: {recipe.calories} kcal ({recipe.protein}g P, {recipe.carbs}g C, {recipe.fat}g F)
        </Text>

        {!confirmed ? (
          <TouchableOpacity
            style={[styles.logBtn, { backgroundColor: theme.primary || '#39ff14' }]}
            onPress={onConfirm}
          >
            <Text style={styles.logBtnText}>✓ LOG THIS RECIPE</Text>
          </TouchableOpacity>
        ) : (
          <View style={[styles.logBtn, { backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.primary || '#39ff14' }]}>
            <Text style={[styles.logBtnText, { color: theme.primary || '#39ff14' }]}>✓ LOGGED</Text>
          </View>
        )}
      </View>
    );
  }

  // Render standard text bubble
  return (
    <View style={isUser ? [styles.userContainer, { backgroundColor: theme.border || '#2a2a2a' }] : [styles.aiContainer, { backgroundColor: theme.card || '#161616', borderLeftColor: theme.primary || '#39ff14' }]}>
      <Text style={[styles.text, { color: theme.text || '#ffffff' }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  userContainer: {
    alignSelf: 'flex-end',
    padding: 14,
    borderRadius: 18,
    borderBottomRightRadius: 4,
    maxWidth: '80%',
  },
  aiContainer: {
    alignSelf: 'flex-start',
    padding: 14,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    borderLeftWidth: 4,
    maxWidth: '85%',
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
  },
  recipeList: {
    marginVertical: 12,
    paddingLeft: 8,
    gap: 4,
  },
  recipeItem: {
    fontSize: 13,
  },
  recipeMacros: {
    fontSize: 13,
    marginBottom: 12,
  },
  logBtn: {
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  logBtnText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 1,
  },
});