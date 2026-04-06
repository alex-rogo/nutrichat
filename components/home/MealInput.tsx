import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Props = { onSend: (text: string) => void };

export default function MealInput({ onSend }: Props) {
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
        placeholder="e.g. A chicken bowl and rice..."
        placeholderTextColor="#666"
        style={styles.input}
        value={input}
        onChangeText={setInput}
        onSubmitEditing={handleSend}
        returnKeyType="send"
      />
      <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
        {/* Paper-plane send icon */}
        <Text style={styles.sendIcon}>➤</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#161616',
    color: '#ffffff',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  sendBtn: {
    width: 48,
    height: 48,
    backgroundColor: '#39ff14',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendIcon: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
  },
});