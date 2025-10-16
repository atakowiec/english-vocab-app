import { ThemedText } from "@/components/theme/ThemedText";
import { TouchableOpacity, View } from "react-native";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { MaterialIcons } from "@expo/vector-icons";
import Answers from "@/components/speed-mode/Answers";
import { useSpeedModeData } from "@/context/SpeedModeContext";
import { styles } from "@/styles/speed-test"
import { ThemedView } from "@/components/theme/ThemedView";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useUserDataStore } from "@/hooks/store/userDataStore";


export default function MainQuestionScreen() {
  const colors = useThemeColors()
  const { currentWord } = useSpeedModeData()
  const streak = useUserDataStore(store => store.speedModeProgress.streak)

  return (
    <View style={[styles.box, {
      backgroundColor: colors.background_blue_1,
      zIndex: 10,
    }]}>
      <View style={styles.optionsBox}>
        <ThemedView colorKey={"background_blue_3"} style={[styles.streakBox]}>
          <Ionicons name="flame-sharp" size={26} color="#F29D38"/>
          <ThemedText style={{ fontSize: 19 }}>
            {streak}
          </ThemedText>
        </ThemedView>
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