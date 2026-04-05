import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Slot } from 'expo-router';
import { useEffect, useState } from 'react';
import LoginScreen from './login';

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return null;
  }

  if (!session) {
    return <LoginScreen />;
  }

  return <Slot />;
}