import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Pressable } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { XCircle } from 'lucide-react-native'; // Using an icon for the close button
import { useThemeColor } from '@/hooks/use-theme-color';
import { BlurView } from 'expo-blur';

export default function ModalScreen() {
  const { imageUrl, triggerTerm } = useLocalSearchParams<{ imageUrl: string; triggerTerm: string }>();
  const router = useRouter();
  const iconColor = useThemeColor({}, 'icon');

  return (
    <ThemedView style={styles.container}>
      {/* Use a light status bar on dark background */}
      <StatusBar style="light" />

      {/* The background will be the blurred view of the content behind the modal */}
      <BlurView intensity={90} tint="dark" style={StyleSheet.absoluteFill} />

      <ThemedView style={styles.header}>
        <ThemedText type="title">{triggerTerm}</ThemedText>
        <Pressable onPress={() => router.back()} hitSlop={20}>
          <XCircle size={32} color={iconColor} />
        </Pressable>
      </ThemedView>

      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        contentFit="contain"
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent', // Important for the blur to be visible
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'rgba(28, 28, 30, 0.7)', // Semi-transparent header
  },
  image: {
    flex: 1,
    width: '100%',
  },
});

