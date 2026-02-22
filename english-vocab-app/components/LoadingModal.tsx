import {Animated, StyleSheet, View} from "react-native";
import {ThemedView} from "@/components/theme/ThemedView";
import {useThemeColors} from "@/hooks/theme/useThemeColor";
import {Easing} from "react-native-reanimated";
import {useEffect, useRef} from "react";

export default function LoadingModal() {
  const colors = useThemeColors();

  const jumpValues = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current
  ];

  useEffect(() => {
    const createJumpAnimation = (animatedValue: Animated.Value, delay: number) =>
      Animated.sequence([
        Animated.delay(delay),
        Animated.loop(
          Animated.sequence([
            Animated.timing(animatedValue, {
              toValue: -15,
              duration: 300,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(animatedValue, {
              toValue: 0,
              duration: 300,
              easing: Easing.in(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.delay(1000)
          ])
        )
      ]);

    const animations = jumpValues.map((value, index) =>
      createJumpAnimation(value, index * 150)
    );

    animations.forEach(anim => anim.start());

    return () => animations.forEach(anim => anim.stop());

  }, []);

  return (
    <View style={styles.background}>
      <ThemedView style={[{backgroundColor: colors.background_blue_2}, styles.box]}>
        {jumpValues.map((val, idx) => (
          <Animated.View
            key={idx}
            style={[
              {backgroundColor: colors.accent_blue},
              styles.dot,
              {transform: [{translateY: val}]}
            ]}
          />
        ))}
      </ThemedView>
    </View>
  )
}

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10000,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  box: {
    borderRadius: 20,
    height: 120,
    width: 120,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  dot: {
    width: 15,
    height: 15,
    borderRadius: 10,
    margin: 5,
    marginBottom: -10,
  }
})