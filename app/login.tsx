import { Colors } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Appearance,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark'] || Colors.dark;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Manual Theme Toggle override
  const toggleTheme = () => {
    const nextTheme = colorScheme === 'dark' ? 'light' : 'dark';
    Appearance.setColorScheme(nextTheme);
  };

  // Sign In Logic
  const signInWithEmail = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert('Error Logging In', error.message);
    setLoading(false);
  };

  // Sign Up Logic
  const signUpWithEmail = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert('Registration Failed', error.message);
    } else {
      Alert.alert('Success!', 'Check your email for the confirmation link to complete your account setup.');
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.mainBg || '#0d0d0d' }]}
    >
      <View style={styles.content}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.primary || '#39ff14' }]}>NutriChat</Text>
          <Text style={[styles.subtitle, { color: theme.textSub || '#a0a0a0' }]}>Sign in or create an account</Text>
        </View>

        {/* Inputs */}
        <View style={styles.form}>
          <TextInput
            style={[styles.input, { backgroundColor: theme.card || '#161616', borderColor: theme.border || '#2a2a2a', color: theme.text || '#ffffff' }]}
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="email@address.com"
            placeholderTextColor={theme.textDim || '#666666'}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={[styles.input, { backgroundColor: theme.card || '#161616', borderColor: theme.border || '#2a2a2a', color: theme.text || '#ffffff' }]}
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            placeholder="Password"
            placeholderTextColor={theme.textDim || '#666666'}
            autoCapitalize="none"
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary || '#39ff14' }]}
            onPress={signInWithEmail}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#000000" /> : <Text style={styles.buttonText}>Sign In</Text>}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.buttonOutline, { borderColor: theme.primary || '#39ff14' }]}
            onPress={signUpWithEmail}
            disabled={loading}
          >
            <Text style={[styles.buttonOutlineText, { color: theme.primary || '#39ff14' }]}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        {/* Theme Toggle Button */}
        <TouchableOpacity
          onPress={toggleTheme}
          style={[styles.themeToggle, { borderColor: theme.border || '#2a2a2a' }]}
        >
          <Text style={{ color: theme.textSub || '#a0a0a0', fontWeight: '600', fontSize: 13 }}>
            Switch to {colorScheme === 'dark' ? 'Light' : 'Dark'} Mode
          </Text>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 40,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  form: {
    gap: 16,
    marginBottom: 32,
  },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 16,
    fontWeight: '500',
  },
  buttonContainer: {
    gap: 16,
    marginBottom: 40,
  },
  button: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 3,
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  buttonOutline: {
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonOutlineText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  themeToggle: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 20,
  },
});