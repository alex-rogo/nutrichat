import { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

type MealInputProps = {
  onSend: (text: string) => void;
};

export default function MealInput({ onSend }: MealInputProps) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setInput('');
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Tell NutriChat what you ate..."
        placeholderTextColor="rgba(173,170,170,0.4)"
        style={styles.input}
        value={input}
        onChangeText={setInput}
        onSubmitEditing={handleSend}
        returnKeyType="send"
        multiline={false}
      />
      <TouchableOpacity
        style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
        onPress={handleSend}
        activeOpacity={0.8}
      >
        <Text style={styles.sendIcon}>↑</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26,26,26,0.9)',
    borderRadius: 99,
    paddingLeft: 18,
    paddingRight: 6,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    gap: 8,
  },
  input: {
    flex: 1,
    color: '#ffffff',
    fontSize: 14,
    letterSpacing: 0.1,
    paddingVertical: 8,
    // No background, no border — floats inside the pill
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 99,
    backgroundColor: '#8eff71',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8eff71',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  sendButtonDisabled: {
    backgroundColor: '#262626',
    shadowOpacity: 0,
  },
  sendIcon: {
    color: '#064200',
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 20,
  },
});