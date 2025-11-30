import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { type Alert } from '@/hooks/use-alerts';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

type AlertItemProps = {
  item: Alert;
  index: number;
};

const AlertItem = ({ item, index }: AlertItemProps) => {
  return (
    // `Link` from `expo-router` is the React Native equivalent of an `<a>` tag for navigation.
    // It enables navigation to a specific route, in this case, the '/modal' screen.
    // The `params` object passes data to the destination screen.
    // The `asChild` prop is a powerful pattern that forwards the navigation logic to its
    // direct child, allowing us to use a custom component (like `Pressable`) as the link trigger.
    <Link href={{ pathname: '/modal', params: { alertId: item.id, triggerTerm: item.triggerTerm } }} asChild>
      <Pressable>
        {({ pressed }) => (
          // This View is animated. `react-native-reanimated` provides the `entering` prop
          // which defines an animation to run when the component is first rendered.
          // `FadeInDown` makes the item fade in and slide from the top.
          // We use the `index` prop passed from the FlatList to create a staggered delay,
          // so each item appears slightly after the one before it.
          <Animated.View
            style={[styles.container, pressed && styles.pressed]}
            entering={FadeInDown.delay(index * 50).duration(300)}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.image} contentFit="cover" />
            <View style={styles.infoContainer}>
              <ThemedText type="defaultSemiBold">Trigger: {item.triggerTerm}</ThemedText>
              <ThemedText type="secondary" style={styles.dateTimeText}>
                {item.date} at {item.time}
              </ThemedText>
            </View>
          </Animated.View>
        )}
      </Pressable>
    </Link>
  );
};

// Styling in React Native uses JavaScript objects. `flexDirection: 'row'` is equivalent to
// `display: flex; flex-direction: row;` in web CSS.
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    marginVertical: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#3A3A3C',
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  image: {
    width: 100,
    height: 100,
  },
  infoContainer: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  dateTimeText: {
    marginTop: 4,
    fontSize: 12,
  },
});

export default AlertItem;
