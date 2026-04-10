import { Colors } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Slot, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import LoginScreen from './login';

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  
  // Controls the "Curtain" overlay
  const [isRouting, setIsRouting] = useState(true); 
  
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'dark'] || Colors.dark;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        checkProfileAndRoute(session);
      } else {
        setIsRouting(false);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session) {
          setIsRouting(true); // Drop the curtain!
          checkProfileAndRoute(session);
        } else {
          setIsRouting(false); // Lift the curtain if they log out
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const checkProfileAndRoute = async (activeSession: Session) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', activeSession.user.id)
        .maybeSingle(); 

      // If there is a Supabase error (like the table missing), log it so you can see it!
      if (error) console.error("Supabase Error:", error.message);

      if (!data) {
        // Give the router a tiny millisecond to ensure the Slot is ready, then fire
        setTimeout(() => router.replace('/onboarding'), 50);
      } else {
        setTimeout(() => router.replace('/(tabs)'), 50);
      }
    } catch (e) {
      console.error("Routing Exception:", e);
    } finally {
      // ALWAYS lift the curtain when finished, no matter what happens
      setIsRouting(false);
    }
  };

  // If they aren't logged in, safely show the login screen
  if (!session && !isRouting) {
    return <LoginScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* The main app routing tree */}
      <Slot />
      
      {/* The Loading Curtain: Overlays on top of the app while we check the database */}
      {isRouting && (
        <View style={[StyleSheet.absoluteFill, styles.curtain, { backgroundColor: theme.mainBg || '#0d0d0d' }]}>
          <ActivityIndicator size="large" color={theme.primary || '#39ff14'} />
        </View>
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  curtain: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999, // Guarantees it sits on top of absolutely everything
  }
});