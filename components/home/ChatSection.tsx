import { generateFakeEstimate } from '@/lib/mockAI';
import { supabase } from '@/lib/supabase';
import { ChatMessage } from '@/types/chat';
import { useEffect, useRef, useState } from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import MealInput from './MealInput';
import MessageBubble from './MessageBubble';

type Props = {
  onConfirmMeal: (estimate: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }) => void;
  initialMeals: any[];
};

export default function ChatSection({ onConfirmMeal, initialMeals }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!initialMeals) return;
    const loadedMessages: ChatMessage[] = initialMeals.map((meal) => ({
      id: meal.id,
      isUser: false,
      type: 'estimate',
      estimate: {
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat,
      },
      confirmed: true,
    }));
    setMessages(loadedMessages);
  }, [initialMeals]);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 120);
    return () => clearTimeout(timer);
  }, [messages.length]);

  const handleSend = (text: string) => {
    Keyboard.dismiss();

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      isUser: true,
      type: 'text',
      text,
    };
    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const estimate = generateFakeEstimate(text);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        isUser: false,
        type: 'estimate',
        estimate,
        confirmed: false,
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 800);
  };

  const handleConfirm = async (id: string) => {
    const message = messages.find((m) => m.id === id);
    if (!message || !message.estimate || message.confirmed) return;

    const estimate = message.estimate;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { console.error('No user found'); return; }

    const { error } = await supabase.from('meals').insert({
      calories: estimate.calories,
      protein: estimate.protein,
      carbs: estimate.carbs,
      fat: estimate.fat,
      user_id: user.id,
    });

    if (error) { console.error('Save failed:', error.message); return; }

    onConfirmMeal(estimate);
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, confirmed: true } : m))
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={10}
    >
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.chatContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            {...message}
            onConfirm={
              message.type === 'estimate'
                ? () => handleConfirm(message.id)
                : undefined
            }
          />
        ))}
      </ScrollView>

      <View style={styles.inputWrapper}>
        <MealInput onSend={handleSend} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e0e0e',

    marginTop: 10,          // space under hero card
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,

    overflow: 'hidden',     // 🔥 clips scroll to rounded corners
  },

  scroll: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  chatContent: {
    padding: 16,
    paddingTop: 18,
    gap: 10,
    paddingBottom: 12,
  },

  inputWrapper: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 2 : 2,
    backgroundColor: '#0e0e0e',
  },
});