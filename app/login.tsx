import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSignUp = async () => {
    if (!email || !password) return;
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) { alert(error.message); return; }
    alert('Account created. Check your email if confirmation is enabled.');
  };

  const handleSignIn = async () => {
    if (!email || !password) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) alert(error.message);
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.container, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 }]}>
        {/* Ambient glow behind the form */}
        <View style={styles.ambientGreen} />
        <View style={styles.ambientCyan} />

        {/* Brand */}
        <View style={styles.brandBlock}>
          <Text style={styles.brandName}>NutriChat</Text>
          <Text style={styles.brandTagline}>Track what you eat. Stay in the zone.</Text>
        </View>

        {/* Form card */}
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="rgba(173,170,170,0.4)"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="rgba(173,170,170,0.4)"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity onPress={handleSignIn} disabled={loading} activeOpacity={0.85}>
            <LinearGradient
              colors={['#8eff71', '#2ff801']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>
                {loading ? 'Signing in…' : 'Sign In'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleSignUp} disabled={loading} activeOpacity={0.75}>
            <Text style={styles.secondaryButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0e0e0e',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  ambientGreen: {
    position: 'absolute',
    top: -80, left: -60,
    width: 280, height: 280,
    borderRadius: 999,
    backgroundColor: 'rgba(142,255,113,0.06)',
  },
  ambientCyan: {
    position: 'absolute',
    bottom: 40, right: -80,
    width: 220, height: 220,
    borderRadius: 999,
    backgroundColor: 'rgba(0,227,253,0.04)',
  },
  brandBlock: {
    marginBottom: 40,
  },
  brandName: {
    color: '#8eff71',
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: -1.5,
    lineHeight: 42,
  },
  brandTagline: {
    color: '#767575',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 6,
    letterSpacing: 0.1,
  },
  card: {
    backgroundColor: '#141414',
    borderRadius: 28,
    padding: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  input: {
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  primaryButton: {
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: '#8eff71',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#064200',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  secondaryButton: {
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  secondaryButtonText: {
    color: '#adaaaa',
    fontSize: 15,
    fontWeight: '600',
  },
});