import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Dimensions, Modal } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutRight,
  runOnJS,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { BlurView } from 'expo-blur';
import { ThemedText } from './themed-text';
import { Colors } from '@/constants/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const BAR_HEIGHT = 3;
const BAR_WIDTH = 24;
const BAR_SPACING = 5;

/**
 * A helper component to render the animated hamburger/X icon.
 * This is separated to avoid duplicating the animation logic.
 * It's animated based on a 'progress' shared value (0 = hamburger, 1 = X).
 */
const AnimatedIcon = ({ progress }: { progress: Animated.SharedValue<number> }) => {
  // `interpolate` is a helper function to map a value from one range to another.
  // Here, we map the `progress` value (0-1) to the correct `translateY` and `rotate` values.
  const topBarStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          progress.value,
          [0, 1],
          [0, BAR_HEIGHT + BAR_SPACING]
        ),
      },
      { rotate: `${interpolate(progress.value, [0, 1], [0, 45])}deg` },
    ],
  }));

  const middleBarStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.5, 1], [1, 0, 0]),
  }));

  const bottomBarStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          progress.value,
          [0, 1],
          [0, -(BAR_HEIGHT + BAR_SPACING)]
        ),
      },
      { rotate: `${interpolate(progress.value, [0, 1], [0, -45])}deg` },
    ],
  }));

  return (
    <>
      <Animated.View style={[styles.bar, topBarStyle]} />
      <Animated.View style={[styles.bar, middleBarStyle]} />
      <Animated.View style={[styles.bar, bottomBarStyle]} />
    </>
  );
};

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  // A shared value to drive all animations in this component, from the icon to the panel.
  const progress = useSharedValue(0);

  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1;
    // `withTiming` creates a duration-based animation.
    progress.value = withTiming(toValue, { duration: 300 });
    setIsOpen(!isOpen);
  };

  // A pan gesture to detect swipes on the menu panel.
  const panGesture = Gesture.Pan().onEnd((event) => {
    // If the user swipes more than 50 pixels to the right, close the menu.
    if (event.translationX > 50) {
      runOnJS(toggleMenu)();
    }
  });

  return (
    // This container positions the hamburger icon absolutely on the screen.
    <View style={styles.menuContainer}>
      {/* This is the hamburger icon, which is only visible when the menu is closed.
          We hide it when the menu is open because the Modal will cover it anyway,
          and we render a new, pressable icon inside the Modal. */}
      {!isOpen && (
        <Pressable onPress={toggleMenu} style={styles.iconContainer}>
          <AnimatedIcon progress={progress} />
        </Pressable>
      )}

      {/* The `Modal` component renders its content in a new native view on top of the app.
          This is crucial for overlays like menus and dialogs. */}
      <Modal
        transparent
        visible={isOpen}
        onRequestClose={toggleMenu} // For Android back button handling.
        animationType="none" // We handle our own animations with Reanimated.
      >
        {/* On Android, gestures inside a Modal require wrapping with GestureHandlerRootView. */}
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Animated.View
            style={styles.modalContainer}
            entering={FadeIn}
            exiting={FadeOut}
          >
            {/* This pressable acts as a full-screen backdrop that closes the menu when tapped. */}
            <Pressable style={StyleSheet.absoluteFill} onPress={toggleMenu} />

            {/* The side panel containing the menu content. */}
            <GestureDetector gesture={panGesture}>
              <Animated.View
                style={styles.panel}
                entering={SlideInRight.duration(300)}
                exiting={SlideOutRight.duration(300)}
              >
                <BlurView intensity={90} tint="dark" style={styles.blurContainer}>
                  <Pressable style={styles.menuItem} onPress={toggleMenu}>
                    <ThemedText type="defaultSemiBold">Login</ThemedText>
                  </Pressable>
                </BlurView>
              </Animated.View>
            </GestureDetector>

            {/* This is the interactive 'X' icon, visible only when the menu is open.
                It's rendered *inside* the Modal so it's on top of the backdrop and panel,
                making it pressable. It's positioned absolutely to match the original icon's location. */}
            <Pressable
              onPress={toggleMenu}
              style={[styles.iconContainer, styles.iconPosition]}
            >
              <AnimatedIcon progress={progress} />
            </Pressable>
          </Animated.View>
        </GestureHandlerRootView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    position: 'absolute',
    top: 60,
    right: 16,
    zIndex: 100, // High zIndex to ensure it's above other screen content.
  },
  // This positions the "X" icon inside the modal at the same place as the hamburger icon.
  iconPosition: {
    position: 'absolute',
    top: 60,
    right: 16,
    zIndex: 1, // Ensures the icon is on top of the sliding panel within the modal.
  },
  iconContainer: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bar: {
    width: BAR_WIDTH,
    height: BAR_HEIGHT,
    backgroundColor: Colors.dark.text,
    borderRadius: 2,
    marginVertical: BAR_SPACING / 2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  panel: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 280,
    height: SCREEN_HEIGHT,
  },
  blurContainer: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 20,
    overflow: 'hidden',
    borderRadius: 20,
  },
  menuItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
});

export default HamburgerMenu;
