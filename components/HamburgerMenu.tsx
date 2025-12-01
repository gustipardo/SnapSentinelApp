import { Colors } from '@/constants/theme';
import { BlurView } from 'expo-blur';
import React, { useState } from 'react';
import { Dimensions, Modal, Pressable, StyleSheet, View } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  FadeOut,
  SharedValue,
  SlideInRight,
  SlideOutRight,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ThemedText } from './themed-text';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const BAR_HEIGHT = 3;
const BAR_WIDTH = 24;
const BAR_SPACING = 5;

/**
 * A helper component to render the animated hamburger/X icon.
 * This is separated to avoid duplicating the animation logic.
 * It's animated based on a 'progress' shared value (0 = hamburger, 1 = X).
 */
const AnimatedIcon = ({ progress }: { progress: SharedValue<number> }) => {
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

import { SignedIn, SignedOut, useClerk, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

// ... (imports)

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const progress = useSharedValue(0);
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1;
    progress.value = withTiming(toValue, { duration: 300 });
    setIsOpen(!isOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    toggleMenu();
  };

  const handleNavigation = (path: any) => {
    toggleMenu();
    router.push(path);
  };

  const panGesture = Gesture.Pan().onEnd((event) => {
    if (event.translationX > 50) {
      runOnJS(toggleMenu)();
    }
  });

  return (
    <View style={styles.menuContainer}>
      {!isOpen && (
        <Pressable onPress={toggleMenu} style={styles.iconContainer}>
          <AnimatedIcon progress={progress} />
        </Pressable>
      )}

      <Modal
        transparent
        visible={isOpen}
        onRequestClose={toggleMenu}
        animationType="none"
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Animated.View
            style={styles.modalContainer}
            entering={FadeIn}
            exiting={FadeOut}
          >
            <Pressable style={StyleSheet.absoluteFill} onPress={toggleMenu} />

            <GestureDetector gesture={panGesture}>
              <Animated.View
                style={styles.panel}
                entering={SlideInRight.duration(300)}
                exiting={SlideOutRight.duration(300)}
              >
                <BlurView intensity={90} tint="dark" style={styles.blurContainer}>
                  <SignedIn>
                    <View style={styles.userInfo}>
                      <ThemedText style={styles.userEmail}>{user?.primaryEmailAddress?.emailAddress}</ThemedText>
                    </View>
                    <Pressable style={styles.menuItem} onPress={handleSignOut}>
                      <ThemedText type="defaultSemiBold">Sign Out</ThemedText>
                    </Pressable>
                  </SignedIn>
                  <SignedOut>
                    <Pressable style={styles.menuItem} onPress={() => handleNavigation('/(auth)/sign-in')}>
                      <ThemedText type="defaultSemiBold">Sign In</ThemedText>
                    </Pressable>
                    <Pressable style={styles.menuItem} onPress={() => handleNavigation('/(auth)/sign-up')}>
                      <ThemedText type="defaultSemiBold">Sign Up</ThemedText>
                    </Pressable>
                  </SignedOut>
                </BlurView>
              </Animated.View>
            </GestureDetector>

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
    zIndex: 100,
  },
  iconPosition: {
    position: 'absolute',
    top: 60,
    right: 16,
    zIndex: 1,
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
  userInfo: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 10,
  },
  userEmail: {
    fontSize: 14,
    color: '#ccc',
  },
});

export default HamburgerMenu;
