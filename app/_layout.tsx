import { SnapSentinelDarkTheme } from '@/constants/theme';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
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
  return (
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
  );
}
