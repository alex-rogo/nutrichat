import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) alert(error.message);
  };

  const handleSignUp = async () => {
    if (!email || !password) return;
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) { alert(error.message); return; }
    alert('Account created! Check your email if confirmation is enabled.');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <TouchableOpacity style={[styles.themeToggle, { backgroundColor: theme.bgCard }]} onPress={toggleTheme}>
        <Text style={{ fontSize: 18 }}>{theme.isDark ? '☀️' : '🌙'}</Text>
      </TouchableOpacity>

      <View style={styles.logoArea}>
        <Text style={[styles.logoMark, { color: theme.primary }]}>◈</Text>
        <Text style={[styles.title, { color: theme.primary }]}>NutriChat</Text>
        <Text style={[styles.subtitle, { color: theme.textSub }]}>Track your nutrition with a simple chat</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={[styles.input, { backgroundColor: theme.bgCard, borderColor: theme.border, color: theme.textMain }]}
          placeholder="Email address"
          placeholderTextColor={theme.textDim}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={[styles.input, { backgroundColor: theme.bgCard, borderColor: theme.border, color: theme.textMain }]}
          placeholder="Password"
          placeholderTextColor={theme.textDim}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: theme.primaryBtn }]}
          onPress={handleSignIn} disabled={loading}
        >
          <Text style={[styles.primaryButtonText, { color: theme.primaryBtnText }]}>
            {loading ? 'Loading...' : 'Sign In'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.secondaryButton, { backgroundColor: theme.bgCard, borderColor: theme.border }]}
          onPress={handleSignUp} disabled={loading}
        >
          <Text style={[styles.secondaryButtonText, { color: theme.textMain }]}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 28, justifyContent: 'center', gap: 40 },
  themeToggle: {
    position: 'absolute', top: 60, right: 28,
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
  },
  logoArea: { gap: 8 },
  logoMark: { fontSize: 36, marginBottom: 4 },
  title: { fontSize: 32, fontWeight: '800', lineHeight: 38 },
  subtitle: { fontSize: 15 },
  form: { gap: 14 },
  input: {
    borderRadius: 16, paddingHorizontal: 18, paddingVertical: 16,
    fontSize: 16, borderWidth: 1,
  },
  primaryButton: {
    paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 6,
  },
  primaryButtonText: { fontSize: 16, fontWeight: '700', letterSpacing: 1 },
  secondaryButton: {
    paddingVertical: 16, borderRadius: 16, alignItems: 'center', borderWidth: 1,
  },
  secondaryButtonText: { fontSize: 16, fontWeight: '600' },
});