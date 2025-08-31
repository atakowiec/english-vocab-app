import { Animated, ScrollView } from "react-native";
import { ThemedText } from "../ThemedText";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useSpeedModeData, WordType } from "@/context/SpeedModeContext";
import { styles } from "@/styles/speed-test"
import { useEffect, useRef } from "react";

type Props = {
  word?: WordType;
  dummy?: boolean // dummy is always visible and not animated, otherwise it's animated and controlled by stage
}

export default function Explaination({ word, dummy = false }: Props) {
  const colors = useThemeColors();
  const { stage } = useSpeedModeData();
  const animation = useRef(new Animated.Value(dummy ? 0 : 1)).current;

  useEffect(() => {
    if (dummy) return;

    if (stage === "explaination_fade_in") {
      Animated.timing(animation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start()
    }

    if (stage === "swipe_next") {
      animation.setValue(1)
    }
  }, [stage])

  if (!word) return null

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [dummy ? 0 : -150, 150],
  })

  return (
    <Animated.View style={[styles.explaination, {
      backgroundColor: colors.background_blue_3,
      transform: [{ translateY }],
    }]}>
      <ScrollView style={{ marginBottom: 10 }}>
        <ThemedText type={"defaultSemiBold"}>
          Definition:
        </ThemedText>
        <ThemedText type={"small"} colorKey={"text_secondary"}>
          {word.word.definition_en}
        </ThemedText>
        <ThemedText type={"defaultSemiBold"} style={{ marginTop: 15 }}>
          Example:
        </ThemedText>
        {word.word.examples.split("\n").map((example, i) => (
          <ThemedText type={"small"} colorKey={"text_secondary"} key={`${example}-${i}`}>
            - {example}
          </ThemedText>
        ))}
      </ScrollView>
    </Animated.View>
  )
}