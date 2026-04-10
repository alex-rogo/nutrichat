import { Colors } from '@/constants/theme';
import { generateFakeEstimate } from '@/lib/mockAI';
import { supabase } from '@/lib/supabase';
import { ChatMessage } from '@/types/chat';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme
} from 'react-native';
import MealInput from './MealInput';
import MessageBubble from './MessageBubble';

type LogEntry = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
};

type Props = {
  onConfirmMeal: (estimate: { calories: number; protein: number; carbs: number; fat: number }) => void;
  initialMeals: any[];
  onOpenInsights: () => void;
  externalRecipe?: any | null;
  onClearRecipe?: () => void;
};

export default function ChatSection({ onConfirmMeal, initialMeals, onOpenInsights, externalRecipe, onClearRecipe }: Props) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = Colors[colorScheme ?? 'dark'] || Colors.dark;

  const transparentBg = isDark ? 'rgba(13, 13, 13, 0)' : 'rgba(252, 252, 252, 0)';

  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      isUser: false,
      type: 'text',
      text: "Hi! Tell me what you ate, and I'll estimate the calories and macros for you.",
    },
  ]);
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const scrollRef = useRef<ScrollView>(null);

  // INCOMING RECIPE LISTENER
  useEffect(() => {
    if (externalRecipe) {
      setMessages([
        { id: 'welcome', isUser: false, type: 'text', text: "Hi! Tell me what you ate, and I'll estimate the calories and macros for you." },
        {
          id: 'recipe-' + Date.now(),
          isUser: false,
          type: 'recipe',
          recipe: externalRecipe,
          confirmed: false,
          _foodName: externalRecipe.name
        } as any
      ]);
      setChatOpen(true);
      if (onClearRecipe) onClearRecipe();
    }
  }, [externalRecipe]);

  useEffect(() => {
    if (!initialMeals || initialMeals.length === 0) return;
    
    const entries: LogEntry[] = initialMeals
      .filter((meal) => meal != null)
      .map((meal) => ({
        id: meal.id || Math.random().toString(),
        name: meal.name || 'Logged Meal',
        calories: meal.calories || 0,
        protein: meal.protein || 0,
        carbs: meal.carbs || 0,
        fat: meal.fat || 0,
        time: meal.created_at
          ? new Date(meal.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }));
    setLogEntries(entries);
  }, [initialMeals]);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 120);
    return () => clearTimeout(timer);
  }, [messages.length]);

  const handleSend = (text: string) => {
    const userMessage: ChatMessage = { id: Date.now().toString(), isUser: true, type: 'text', text };
    setMessages((prev) => [...prev, userMessage]);

    const thinkingId = 'thinking-' + Date.now();
    const thinkingMsg: ChatMessage = { id: thinkingId, isUser: false, type: 'text', text: 'Analyzing...' };
    setMessages((prev) => [...prev, thinkingMsg]);

    setTimeout(() => {
      const estimate = generateFakeEstimate(text);
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== thinkingId),
        {
          id: (Date.now() + 1).toString(),
          isUser: false,
          type: 'estimate',
          estimate,
          confirmed: false,
          _foodName: text.length > 25 ? text.substring(0, 22) + '...' : text,
        } as any,
      ]);
    }, 1200);
  };

  const handleConfirm = async (id: string) => {
    const message = messages.find((m) => m.id === id);
    if (!message || message.confirmed) return;

    // Check if confirming an AI Estimate or a Recipe Card
    const estimateData = message.type === 'recipe' ? message.recipe : message.estimate;
    if (!estimateData) return;

    const foodName = (message as any)._foodName || 'Meal';

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('meals').insert({
      name: foodName,
      calories: estimateData.calories,
      protein: estimateData.protein,
      carbs: estimateData.carbs,
      fat: estimateData.fat,
      user_id: user.id,
    });

    if (error) { console.error('Save failed:', error.message); return; }

    onConfirmMeal(estimateData);

    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, confirmed: true } : m)));

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newEntry: LogEntry = {
      id: id,
      name: foodName,
      calories: estimateData.calories,
      protein: estimateData.protein,
      carbs: estimateData.carbs,
      fat: estimateData.fat,
      time: timeString,
    };
    setLogEntries((prev) => [newEntry, ...prev]);

    setTimeout(() => { setChatOpen(false); }, 800);
  };

  const openChat = () => {
    setMessages([{ id: 'welcome', isUser: false, type: 'text', text: "Hi! Tell me what you ate, and I'll estimate the calories and macros for you." }]);
    setChatOpen(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.recentHeader}>
        <View>
          <Text style={[styles.recentTitle, { color: theme.text || '#ffffff' }]}>Recently Logged</Text>
          <Text style={[styles.recentSubtitle, { color: theme.textSub || '#a0a0a0' }]}>Swipe left to delete • Right to save</Text>
        </View>
        <TouchableOpacity onPress={onOpenInsights}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: theme.primary || '#39ff14' }}>View History</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.logList}
        contentContainerStyle={styles.logListContent}
        showsVerticalScrollIndicator={false}
      >
        {logEntries.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No meals logged yet today.</Text>
            <Text style={styles.emptySubtext}>Tap the + button to get started!</Text>
          </View>
        ) : (
          logEntries.map((entry) => (
            <View key={entry.id} style={[styles.logCard, { backgroundColor: theme.listItem || '#1c1c1c', borderColor: theme.border || '#2a2a2a' }]}>
              <View style={styles.foodInfo}>
                <Text style={[styles.foodTitle, { color: theme.text || '#ffffff' }]}>{entry.name}</Text>
                <Text style={[styles.foodMeta, { color: theme.textSub || '#a0a0a0' }]}>Just now • {entry.time}</Text>
                <View style={styles.foodMacros}>
                  <View style={styles.macroBadge}>
                    <View style={[styles.macroDot, { backgroundColor: theme.protein || '#39ff14' }]} />
                    <Text style={[styles.macroText, { color: theme.textSub || '#a0a0a0' }]}>{entry.protein}g P</Text>
                  </View>
                  <View style={styles.macroBadge}>
                    <View style={[styles.macroDot, { backgroundColor: theme.carbs || '#00d2ff' }]} />
                    <Text style={[styles.macroText, { color: theme.textSub || '#a0a0a0' }]}>{entry.carbs}g C</Text>
                  </View>
                  <View style={styles.macroBadge}>
                    <View style={[styles.macroDot, { backgroundColor: theme.fats || '#ff7300' }]} />
                    <Text style={[styles.macroText, { color: theme.textSub || '#a0a0a0' }]}>{entry.fat}g F</Text>
                  </View>
                </View>
              </View>
              <View style={styles.foodCalories}>
                <Text style={[styles.caloriesVal, { color: theme.primary || '#39ff14' }]}>{entry.calories}</Text>
                <Text style={[styles.caloriesLbl, { color: theme.textDim || '#666666' }]}>KCAL</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <LinearGradient
        colors={[transparentBg, theme.mainBg || '#0d0d0d', theme.mainBg || '#0d0d0d']}
        locations={[0, 0.4, 1]}
        style={styles.fabContainer}
        pointerEvents="box-none"
      >
        <TouchableOpacity 
          style={[styles.fab, { backgroundColor: theme.primary || '#39ff14', shadowColor: theme.primary || '#39ff14' }]}
          onPress={openChat}
        >
          <Text style={styles.fabIcon}>+</Text> 
        </TouchableOpacity>
      </LinearGradient>

      <Modal
        visible={chatOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setChatOpen(false)}
      >
      <KeyboardAvoidingView
          style={[styles.modalContainer, { backgroundColor: theme.mainBg || '#0d0d0d' }]}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          // FIX: Add an offset specifically for iOS so the keyboard doesn't cover the input
          keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
        >
          <View style={[styles.chatHeader, { backgroundColor: theme.card || '#161616', borderBottomColor: theme.border || '#2a2a2a' }]}>
            <View style={styles.chatHeaderTitle}>
              <Text style={styles.chatHeaderIcon}>💬</Text>
              <Text style={[styles.chatHeaderText, { color: theme.text || '#ffffff' }]}>NutriChat AI</Text>
            </View>
            <TouchableOpacity onPress={() => setChatOpen(false)} style={styles.closeBtn}>
              <Text style={[styles.closeBtnText, { color: theme.textSub || '#a0a0a0' }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            ref={scrollRef}
            style={styles.chatScroll}
            contentContainerStyle={styles.chatContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                {...message}
                onConfirm={
                  message.type === 'estimate' || message.type === 'recipe' ? () => handleConfirm(message.id) : undefined
                }
              />
            ))}
          </ScrollView>

          <View style={[styles.chatInputArea, { backgroundColor: theme.mainBg || '#0d0d0d', borderTopColor: theme.border || '#2a2a2a' }]}>
            <MealInput onSend={handleSend} />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    marginBottom: 16,
    marginTop: 10,
  },
  recentTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 2,
  },
  recentSubtitle: {
    fontSize: 12,
  },
  logList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  logListContent: {
    gap: 16,
    paddingBottom: 140,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 40,
    gap: 8,
  },
  emptyText: {
    color: '#a0a0a0',
    fontSize: 15,
  },
  emptySubtext: {
    color: '#666666',
    fontSize: 13,
  },
  logCard: {
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  foodInfo: { flex: 1 },
  foodTitle: {
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  foodMeta: {
    fontSize: 11,
    marginBottom: 8,
  },
  foodMacros: {
    flexDirection: 'row',
    gap: 10,
  },
  macroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  macroDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  macroText: {
    fontSize: 11,
    fontWeight: '600',
  },
  foodCalories: { alignItems: 'flex-end' },
  caloriesVal: {
    fontSize: 20,
    fontWeight: '800',
  },
  caloriesLbl: {
    fontSize: 9,
    fontWeight: '600',
  },
  fabContainer: {
    position: 'absolute',
    bottom: -35, 
    left: 0,
    right: 0,
    height: 140, 
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40, 
    zIndex: 10,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 25,
    elevation: 5,
  },
  fabIcon: {
    fontSize: 32,
    color: '#000',
    fontWeight: '300',
    marginTop: -2,
  },
  modalContainer: { flex: 1 },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  chatHeaderTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chatHeaderIcon: { fontSize: 20 },
  chatHeaderText: {
    fontWeight: '700',
    fontSize: 17,
  },
  closeBtn: { padding: 4 },
  closeBtnText: { fontSize: 20 },
  chatScroll: { flex: 1 },
  chatContent: {
    padding: 24,
    gap: 16,
    paddingBottom: 16,
  },
  chatInputArea: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 28,
    borderTopWidth: 1,
  },
});