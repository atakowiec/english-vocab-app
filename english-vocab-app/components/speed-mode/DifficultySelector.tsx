import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColors } from "@/hooks/useThemeColor";
import { Difficulty } from "@/app/(modes)/speed-mode-lobby";
import { usePreferences } from "@/context/PreferencesContext";

type Props = {
  difficulty: Difficulty;
  setDifficulty: (difficulty: Difficulty) => void;
}

export const DifficultySelector = ({ difficulty, setDifficulty }: Props) => {
  const colors = useThemeColors();
  const { setPreference } = usePreferences();

  const difficultyButtons: { name: Difficulty, description: string }[] = [
    {
      name: "easy",
      description: "100s for answer",
    },
    {
      name: "medium",
      description: "5s for answer",
    },
    {
      name: "hard",
      description: "3s for answer",
    }
  ]

  async function onDifficultyClick(difficulty: Difficulty) {
    setDifficulty(difficulty);
    setPreference("speed-test-difficulty", difficulty);
  }

  return (
    <View style={styles.difficultySelector}>
      {difficultyButtons.map(diff => (
        <TouchableOpacity key={diff.name}
                          onPress={() => onDifficultyClick(diff.name)}
                          activeOpacity={0.8}
                          style={[styles.difficultyButton, { backgroundColor: difficulty === diff.name ? colors.accent_blue : colors.background_blue_2 }]}>
          <ThemedText colorKey={difficulty === diff.name ? "background_blue_1" : "text_primary"}
                      style={{ textTransform: "capitalize" }}>
            {diff.name}
          </ThemedText>
          <ThemedText type={"small"} colorKey={difficulty === diff.name ? "background_blue_2" : "text_secondary"}>
            {diff.description}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  )
}
const styles = StyleSheet.create({
  difficultySelector: {
    flexDirection: "row",
    gap: 15,
  },
  difficultyButton: {
    padding: 10,
    flex: 1,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center"
  },
})