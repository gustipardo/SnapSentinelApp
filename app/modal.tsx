import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Pressable, View, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  ZoomInEasyUp,
} from "react-native-reanimated";
import { ThemedText } from "@/components/themed-text";

const AnimatedImage = Animated.createAnimatedComponent(Image);

const API_URL = 'https://5tunl41q86.execute-api.us-east-1.amazonaws.com/alerts';

export default function ModalScreen() {
  // Now we receive `alertId` instead of `imageUrl`.
  const { alertId } = useLocalSearchParams<{ alertId: string }>();
  const router = useRouter();

  // State for managing the fetched image URL and loading status.
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // This effect runs when the component mounts to fetch fresh data for the specific alert.
  useEffect(() => {
    const fetchAlertDetails = async () => {
      if (!alertId) return;
      try {
        setIsLoading(true);
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to connect to the API.");
        
        const data = await response.json();
        // Inefficient, but required by the current API design.
        // We fetch all alerts and find the one we need by its ID.
        const alert = data.items.find((item: any) => item.id === alertId);

        if (alert && alert.image_url) {
          setImageUrl(alert.image_url);
        } else {
          throw new Error("Alert not found.");
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAlertDetails();
  }, [alertId]);
  
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedScale = useSharedValue(1);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const handleDismiss = () => {
    router.back();
  };

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      const isZoomed = savedScale.value > 1;
      if (isZoomed) {
        translateX.value = savedTranslateX.value + e.translationX;
        translateY.value = savedTranslateY.value + e.translationY;
      } else {
        translateY.value = e.translationY;
      }
    })
    .onEnd((e) => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
      if (Math.abs(translateY.value) > 100 && scale.value <= 1) {
        runOnJS(handleDismiss)();
        return;
      }
      if (scale.value < 1) {
        savedScale.value = 1;
        scale.value = withSpring(1);
      }
      if (scale.value <= 1) {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" />;
    }
    if (error) {
      return <ThemedText>Error: {error}</ThemedText>;
    }
    if (imageUrl) {
      return (
        <GestureDetector gesture={composedGesture}>
          <AnimatedImage
            source={{ uri: imageUrl }}
            style={[StyleSheet.absoluteFill, animatedStyle]}
            contentFit="contain"
            entering={ZoomInEasyUp}
          />
        </GestureDetector>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Pressable style={StyleSheet.absoluteFill} onPress={handleDismiss}>
        <BlurView intensity={90} tint="dark" style={StyleSheet.absoluteFill} />
      </Pressable>
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
});
