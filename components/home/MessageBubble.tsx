import { Colors } from '@/constants/theme';
import * as Haptics from 'expo-haptics'; // <-- NEW HAPTICS IMPORT
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';

// --- PREMIUM ANIMATED BUTTON (Original Style) ---
const AnimatedConfirmButton = ({ onConfirm, confirmed, theme, colorScheme }: any) => {
  const [isLogging, setIsLogging] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Listen for the database confirmation
  useEffect(() => {
    if (confirmed) {
      setIsLogging(false);
      // Trigger a satisfying "Success" double-vibration when the database finishes!
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [confirmed]);

  const handlePressIn = () => {
    if (!confirmed && !isLogging) {
      Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start();
    }
  };

  const handlePressOut = () => {
    if (!confirmed && !isLogging) {
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
    }
  };

  const handlePress = () => {
    if (isLogging || confirmed) return;
    
    // Trigger a light physical tap the moment they press the button
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    setIsLogging(true);
    if (onConfirm) onConfirm();
  };

  // Keep the text color contrasting properly based on light/dark mode
  const btnTextColor = colorScheme === 'dark' ? '#000000' : '#ffffff';

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], marginTop: 12 }}>
      <TouchableOpacity
        activeOpacity={0.85} 
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        // Restored your original solid background color
        style={[styles.confirmBtn, { backgroundColor: theme.primary || '#39ff14' }]}
      >
        {isLogging ? (
          <ActivityIndicator color={btnTextColor} />
        ) : (
          <Text style={[styles.confirmBtnText, { color: btnTextColor }]}>
            {confirmed ? '✓ LOGGED SECURELY' : '✓ CONFIRM LOG'}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

// --- MAIN BUBBLE COMPONENT ---
export default function MessageBubble(props: any) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark'] || Colors.dark as any;
  const { type, text, estimate, recipe, isUser, confirmed, onConfirm } = props;

  // USER MESSAGE
  if (isUser) {
    return (
      <View style={[styles.bubbleUser, { backgroundColor: theme.chatUserBg || '#2a2a2a' }]}>
        <Text style={[styles.textMain, { color: theme.text || '#ffffff' }]}>{text}</Text>
      </View>
    );
  }

  // SYSTEM MESSAGE
  return (
    <View style={[styles.bubbleSys, { backgroundColor: theme.card || '#161616', borderLeftColor: theme.chatSysBorder || '#39ff14' }]}>
      
      {/* Standard Text Response */}
      {type === 'text' && (
        <Text style={[styles.textMain, { color: theme.text || '#ffffff' }]}>{text}</Text>
      )}

      {/* AI Estimate Card */}
      {type === 'estimate' && estimate && (
        <View>
          <Text style={[styles.textMain, { color: theme.text || '#ffffff', marginBottom: 8 }]}>
            Got it! That looks like <Text style={{ color: theme.primary || '#39ff14', fontWeight: '700' }}>{estimate.calories} calories</Text>.
          </Text>
          <Text style={[styles.macroText, { color: theme.textSub || '#a0a0a0' }]}>
            (Protein: <Text style={{ color: theme.protein }}>{estimate.protein}g</Text>, Carbs: <Text style={{ color: theme.carbs }}>{estimate.carbs}g</Text>, Fats: <Text style={{ color: theme.fats }}>{estimate.fat}g</Text>)
          </Text>
          <AnimatedConfirmButton onConfirm={onConfirm} confirmed={confirmed} theme={theme} colorScheme={colorScheme} />
        </View>
      )}

      {/* Recipe Card */}
      {type === 'recipe' && recipe && (
        <View>
          <Text style={[styles.textMain, { color: theme.text || '#ffffff', marginBottom: 8 }]}>
            Here is the recipe for <Text style={{ color: theme.primary || '#39ff14', fontWeight: '700' }}>{recipe.name}</Text>:
          </Text>
          <View style={{ marginBottom: 12, marginLeft: 8 }}>
            {recipe.ingredients?.map((ing: string, i: number) => (
              <Text key={i} style={{ color: theme.textSub || '#a0a0a0', fontSize: 13, marginBottom: 4, lineHeight: 18 }}>• {ing}</Text>
            ))}
          </View>
          <Text style={[styles.macroText, { color: theme.textSub || '#a0a0a0' }]}>
            Macros: {recipe.calories} kcal ({recipe.protein}g P, {recipe.carbs}g C, {recipe.fat}g F)
          </Text>
          <AnimatedConfirmButton onConfirm={onConfirm} confirmed={confirmed} theme={theme} colorScheme={colorScheme} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bubbleUser: {
    maxWidth: '85%',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 18,
    borderBottomRightRadius: 4,
    alignSelf: 'flex-end',
  },
  bubbleSys: {
    maxWidth: '85%',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    borderLeftWidth: 4,
    alignSelf: 'flex-start',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 3,
  },
  textMain: {
    fontSize: 15,
    lineHeight: 22,
  },
  macroText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  confirmBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    minHeight: 44, 
  },
  confirmBtnText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
});