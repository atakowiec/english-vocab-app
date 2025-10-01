import { Animated, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/theme/ThemedText";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { styles } from "@/styles/speed-test";
import { useSpeedModeData } from "@/context/SpeedModeContext";
import { useEffect, useRef, useState } from "react";

type LayoutData = { height: number, y: number }

type Props = {
  answer: string;
  parentLayoutData: LayoutData
};

export default function Answer({ answer, parentLayoutData: parent }: Props) {
  const colors = useThemeColors();
  const { onAnswerClick, currentWord, stage } = useSpeedModeData();
  const [layoutData, setLayoutData] = useState<LayoutData>({ height: 0, y: 0 });

  const animation = useRef(new Animated.Value(0)).current;

  const showAnswers = stage === "show_answer" || stage === "explaination_fade_in";
  const selected = answer === currentWord?.selectedAnswer;
  const anySelected = !!currentWord?.selectedAnswer;
  const valid = answer === currentWord?.correctAnswer;

  const backgroundColor =
    !showAnswers && !anySelected || (!selected && !valid)
      ? colors.background_blue_3
      : valid
        ? colors.green
        : colors.red;

  useEffect(() => {
    if (stage === "explaination_fade_in") {
      Animated.timing(animation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }

    if (stage === "swipe_next") {
      animation.stopAnimation(() => {
        animation.setValue(0);
      });
    }
  }, [stage]);

  const targetY = parent.height - layoutData.height - layoutData.y + parent.y - 160;

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, targetY],
  })

  const opacity = valid ? 1 : animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, -4],
  })

  return (
    <Animated.View
      style={{
        overflow: "hidden",
        transform: [{ translateY }],
        opacity: opacity
      }}
      onLayout={(e) => {
        const { height, y } = e.nativeEvent.layout;
        setLayoutData({ height, y });
      }}
    >
      <TouchableOpacity
        style={[styles.answerButton, { backgroundColor, zIndex: valid ? 100 : 0 }]}
        onPress={() => onAnswerClick(answer)}
        activeOpacity={0.8}>
        <ThemedText style={{ textAlign: "center" }}>{answer}</ThemedText>
      </TouchableOpacity>
    </Animated.View>
  );
}
