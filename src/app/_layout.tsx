import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUser, UserProvider } from '../hooks/useUser';
import { PremiumModalProvider } from '../components/PremiumModal';
import { ActivityIndicator, View } from 'react-native';
import { Colors } from '../constants/Colors';

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { session, profile, loading } = useUser();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    console.log('RootLayoutNav - Segments:', segments, 'Session:', !!session, 'Profile:', !!profile, 'Loading:', loading);
    if (loading) return;

    const inLogin = segments[0] === 'login';
    const inSignup = segments[0] === 'signup';
    const isRoot = segments[0] === undefined || (segments[0] as string) === '';

    if (isRoot) {
      // Allow splash screen to display on startup
      return;
    }

    if (!session) {
      // Not authenticated: send to login screen
      if (!inLogin) {
        router.replace('/login');
      }
    } else if (!profile) {
      // Authenticated but profile is not completed: send to signup details form
      if (!inSignup) {
        router.replace('/signup');
      }
    } else {
      // Complete user: send to tabs if they try to visit auth screens
      if (inLogin || inSignup) {
        router.replace('/(tabs)');
      }
    }
  }, [session, profile, loading, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.bg, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.gold} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="login" options={{ gestureEnabled: false }} />
        <Stack.Screen name="signup" options={{ gestureEnabled: false }} />
        <Stack.Screen name="details/[sign]" options={{ presentation: 'modal' }} />
        <Stack.Screen name="astrologer/[id]" options={{ presentation: 'modal' }} />
        <Stack.Screen name="horoscope-detail/[sign]" />
        <Stack.Screen name="chat/[id]" />
        <Stack.Screen name="kundli" />
        <Stack.Screen name="blog/index" />
        <Stack.Screen name="blog/[id]" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <PremiumModalProvider>
          <RootLayoutNav />
        </PremiumModalProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}
