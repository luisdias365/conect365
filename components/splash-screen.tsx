import { View, Text, Image, ActivityIndicator } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useEffect, useState } from "react";
import { useColors } from "@/hooks/use-colors";

interface SplashScreenProps {
  onFinish: () => void;
  duration?: number;
}

/**
 * Custom Splash Screen component for Conect365
 * Displays the app logo with a smooth fade-in animation and loading indicator
 */
export function SplashScreen({ onFinish, duration = 2500 }: SplashScreenProps) {
  const colors = useColors();
  const [isVisible, setIsVisible] = useState(true);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    // Animate logo scale on mount
    scale.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });

    // Hide splash screen after duration
    const timer = setTimeout(() => {
      setIsVisible(false);
      onFinish();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onFinish, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (!isVisible) {
    return null;
  }

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      style={{
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
      }}
    >
      <View className="flex-1 items-center justify-center gap-8">
        {/* Logo with animation */}
        <Animated.View style={animatedStyle}>
          <Image
            source={require("@/assets/images/icon.png")}
            style={{
              width: 120,
              height: 120,
              resizeMode: "contain",
            }}
          />
        </Animated.View>

        {/* App name */}
        <View className="items-center gap-2">
          <Text className="text-3xl font-bold text-foreground">Conect365</Text>
          <Text className="text-sm text-muted">Simulador de Financiamento</Text>
        </View>

        {/* Loading indicator */}
        <View className="mt-8">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    </Animated.View>
  );
}
