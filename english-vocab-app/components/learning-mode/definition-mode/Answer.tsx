import {ThemedText} from "@/components/theme/ThemedText";
import {StyleSheet, TouchableOpacity} from "react-native";
import {useThemeColors} from "@/hooks/theme/useThemeColor";

type Props = {
  answer: string;
  selectedWord: string | null;
  correctAnswer: string;
  onAnswerClick: (answer: string) => void;
}

export default function Answer({selectedWord, answer, correctAnswer, onAnswerClick}: Props) {
  const colors = useThemeColors();
  const isSelected = selectedWord === answer;
  const isCorrect = answer === correctAnswer;
  const hasSelection = selectedWord != null;

  const backgroundColor = !hasSelection
    ? colors.background_blue_2
    : isCorrect
      ? colors.green
      : isSelected
        ? colors.red
        : colors.background_blue_2;

  return (
    <TouchableOpacity key={answer}
                      activeOpacity={.8}
                      onPress={() => onAnswerClick(answer)}
                      style={[
                        styles.answer,
                        {backgroundColor},
                      ]}>
      <ThemedText colorKey={backgroundColor == colors.green ? "background_blue_2" : "text_secondary"}>
        {answer}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  answer: {
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  }
})