import { SnapSentinelDarkTheme } from '@/constants/theme';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { ClerkProvider } from '@clerk/clerk-expo';
import messaging from '@react-native-firebase/messaging';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

// Handle background messages using setBackgroundMessageHandler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);

  // Show local notification
  await Notifications.scheduleNotificationAsync({
    content: {
      title: typeof remoteMessage.data?.title === 'string' ? remoteMessage.data.title : 'Nueva alerta',
      body: typeof remoteMessage.data?.body === 'string' ? remoteMessage.data.body : 'Se ha detectado un evento de seguridad',
      data: remoteMessage.data,
    },
    trigger: null, // Show immediately
  });
});

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};
export const unstable_settings = {
  anchor: '(tabs)',
};

// Create a new theme by extending the DefaultTheme and overriding with dark colors
const AppTheme = {
  ...DefaultTheme,
  dark: true, // Manually set to dark mode
  colors: {
    ...DefaultTheme.colors,
    ...SnapSentinelDarkTheme.colors,
  },
};

export default function RootLayout() {
  usePushNotifications();
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  if (!publishableKey) {
    throw new Error('Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env');
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider value={AppTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="modal"
              options={{
                presentation: 'transparentModal',
                headerShown: false,
                animation: 'fade',
              }}
            />
          </Stack>
          <StatusBar style="light" />
        </ThemeProvider>
      </GestureHandlerRootView>
    </ClerkProvider>
  );
}
