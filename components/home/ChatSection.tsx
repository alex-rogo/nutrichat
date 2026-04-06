import { generateFakeEstimate } from '@/lib/mockAI';
import { supabase } from '@/lib/supabase';
import { ChatMessage } from '@/types/chat';
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
};

export default function ChatSection({ onConfirmMeal, initialMeals }: Props) {
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

  useEffect(() => {
    if (!initialMeals || initialMeals.length === 0) return;
    const entries: LogEntry[] = initialMeals.map((meal) => ({
      id: meal.id,
      name: meal.name || 'Logged Meal',
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
      time: meal.created_at
        ? new Date(meal.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '',
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
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      isUser: true,
      type: 'text',
      text,
    };
    setMessages((prev) => [...prev, userMessage]);

    // Typing indicator
    const thinkingId = 'thinking-' + Date.now();
    const thinkingMsg: ChatMessage = {
      id: thinkingId,
      isUser: false,
      type: 'text',
      text: 'Analyzing...',
    };
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
    if (!message || !message.estimate || message.confirmed) return;

    const estimate = message.estimate;
    const foodName = (message as any)._foodName || 'Meal';

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('meals').insert({
      calories: estimate.calories,
      protein: estimate.protein,
      carbs: estimate.carbs,
      fat: estimate.fat,
      user_id: user.id,
    });

    if (error) {
      console.error('Save failed:', error.message);
      return;
    }

    onConfirmMeal(estimate);

    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, confirmed: true } : m))
    );

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newEntry: LogEntry = {
      id: id,
      name: foodName,
      calories: estimate.calories,
      protein: estimate.protein,
      carbs: estimate.carbs,
      fat: estimate.fat,
      time: timeString,
    };
    setLogEntries((prev) => [newEntry, ...prev]);

    // Close chat after a brief delay
    setTimeout(() => {
      setChatOpen(false);
    }, 800);
  };

  const openChat = () => {
    setMessages([
      {
        id: 'welcome',
        isUser: false,
        type: 'text',
        text: "Hi! Tell me what you ate, and I'll estimate the calories and macros for you.",
      },
    ]);
    setChatOpen(true);
  };

  return (
    <View style={styles.container}>
      {/* Recently Logged Section */}
      <View style={styles.recentHeader}>
        <View>
          <Text style={styles.recentTitle}>Recently Logged</Text>
          <Text style={styles.recentSubtitle}>Your nutritional journey today</Text>
        </View>
      </View>

      <ScrollView
        style={styles.logList}
        contentContainerStyle={styles.logListContent}
        showsVerticalScrollIndicator={false}
      >
        {logEntries.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No meals logged yet today.</Text>
            <Text style={styles.emptySubtext}>Tap LOG ITEM to get started!</Text>
          </View>
        ) : (
          logEntries.map((entry) => (
            <View key={entry.id} style={styles.logCard}>
              <View style={styles.foodInfo}>
                <Text style={styles.foodTitle}>{entry.name}</Text>
                <Text style={styles.foodMeta}>Just now • {entry.time}</Text>
                <View style={styles.foodMacros}>
                  <View style={styles.macroBadge}>
                    <View style={[styles.macroDot, { backgroundColor: '#39ff14' }]} />
                    <Text style={styles.macroText}>{entry.protein}g P</Text>
                  </View>
                  <View style={styles.macroBadge}>
                    <View style={[styles.macroDot, { backgroundColor: '#00d2ff' }]} />
                    <Text style={styles.macroText}>{entry.carbs}g C</Text>
                  </View>
                  <View style={styles.macroBadge}>
                    <View style={[styles.macroDot, { backgroundColor: '#ff7300' }]} />
                    <Text style={styles.macroText}>{entry.fat}g F</Text>
                  </View>
                </View>
              </View>
              <View style={styles.foodCalories}>
                <Text style={styles.caloriesVal}>{entry.calories}</Text>
                <Text style={styles.caloriesLbl}>KCAL</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Floating LOG ITEM button */}
      <View style={styles.floatingBtn}>
        <TouchableOpacity style={styles.logBtn} onPress={openChat}>
          <Text style={styles.logBtnText}>✓  LOG ITEM</Text>
        </TouchableOpacity>
      </View>

      {/* Chat Modal */}
      <Modal
        visible={chatOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setChatOpen(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={0}
        >
          {/* Chat Header */}
          <View style={styles.chatHeader}>
            <View style={styles.chatHeaderTitle}>
              <Text style={styles.chatHeaderIcon}>💬</Text>
              <Text style={styles.chatHeaderText}>NutriChat AI</Text>
            </View>
            <TouchableOpacity onPress={() => setChatOpen(false)} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Messages */}
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
                  message.type === 'estimate' ? () => handleConfirm(message.id) : undefined
                }
              />
            ))}
          </ScrollView>

          {/* Input */}
          <View style={styles.chatInputArea}>
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
    backgroundColor: '#0d0d0d',
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  recentTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 2,
  },
  recentSubtitle: {
    fontSize: 12,
    color: '#a0a0a0',
  },
  logList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  logListContent: {
    gap: 16,
    paddingBottom: 120,
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
    backgroundColor: '#1c1c1c',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  foodInfo: {
    flex: 1,
  },
  foodTitle: {
    fontWeight: '700',
    color: '#ffffff',
    fontSize: 15,
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  foodMeta: {
    fontSize: 11,
    color: '#a0a0a0',
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
    color: '#a0a0a0',
  },
  foodCalories: {
    alignItems: 'flex-end',
  },
  caloriesVal: {
    fontSize: 20,
    fontWeight: '800',
    color: '#39ff14',
  },
  caloriesLbl: {
    fontSize: 9,
    color: '#666666',
    fontWeight: '600',
  },
  floatingBtn: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 30,
    paddingBottom: 28,
    paddingTop: 16,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  logBtn: {
    backgroundColor: '#39ff14',
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 20,
  },
  logBtnText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  // Chat Modal
  modalContainer: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#161616',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  chatHeaderTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chatHeaderIcon: {
    fontSize: 20,
  },
  chatHeaderText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 17,
  },
  closeBtn: {
    padding: 4,
  },
  closeBtnText: {
    color: '#a0a0a0',
    fontSize: 20,
  },
  chatScroll: {
    flex: 1,
  },
  chatContent: {
    padding: 24,
    gap: 16,
    paddingBottom: 16,
  },
  chatInputArea: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 28,
    backgroundColor: '#0d0d0d',
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
});