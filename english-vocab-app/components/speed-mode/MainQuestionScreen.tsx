import { ThemedText } from "@/components/ThemedText";
import { TouchableOpacity, View } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColor";
import { MaterialIcons } from "@expo/vector-icons";
import Answers from "@/components/speed-mode/Answers";
import { useSpeedModeData } from "@/context/SpeedModeContext";
import { styles } from "@/styles/speed-test"


export default function MainQuestionScreen() {
  const colors = useThemeColors()
  const { currentWord } = useSpeedModeData()

  function isNewMeaning() {
    return currentWord &&
      (currentWord.wordLearnEntry?.speedModeCorrectAnswers ?? 0)
      + (currentWord.wordLearnEntry?.speedModeWrongAnswers ?? 0) === 0
  }

  return (
    <View style={[styles.box, {
      backgroundColor: colors.background_blue_1,
      zIndex: 10,
    }]}>
      <View style={styles.optionsBox}>
        {
          isNewMeaning() &&
            <View style={[styles.optionButton, styles.newMeaning, {
              backgroundColor: colors.background_blue_3,
              borderColor: colors.accent_blue
            }]}>
                <ThemedText>
                    New meaning
                </ThemedText>
            </View>
        }
        <View/>
        <TouchableOpacity style={[styles.optionButton, { backgroundColor: colors.background_blue_3 }]}
                          activeOpacity={0.8}>
          <MaterialIcons name="report" size={24} color="white"/>
        </TouchableOpacity>
      </View>
      <View style={styles.wordBox}>
        <ThemedText type={"title"} style={{ textAlign: "center" }}>
          {currentWord!.wordText}
        </ThemedText>
      </View>
      <Answers/>
    </View>
  )
}