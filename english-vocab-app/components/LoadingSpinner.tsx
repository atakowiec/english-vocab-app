import AntDesign from '@expo/vector-icons/AntDesign';
import { Animated, useAnimatedValue } from "react-native";
import { useEffect } from "react";

export default function LoadingSpinner({ size = 40 }: { size?: number }) {
  const spinValue = useAnimatedValue(0)

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  }, [spinValue])

  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "720deg"],
  });

  return (
    <Animated.View style={{ transform: [{ rotate }] }}>
      <AntDesign name="loading" size={size} color="white"/>
    </Animated.View>
  )
}