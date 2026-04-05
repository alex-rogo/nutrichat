import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
        placeholder="Type what you ate..."
        placeholderTextColor="#888"
        style={styles.input}
        value={input}
        onChangeText={setInput}
      />

      <TouchableOpacity style={styles.button} onPress={handleSend}>
        <Text style={styles.buttonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#1f2937',
    color: 'white',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});