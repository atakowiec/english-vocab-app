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
import { useEffect, useRef } from "react";


export default function MainQuestionScreen() {
  const colors = useThemeColors()
  const { currentWord, setProgressData, progressData, stage, showReportModal } = useSpeedModeData()
  const streak = useUserDataStore(store => store.speedModeProgress.streak)
  const canPause = stage === "explaination_fade_in"
  const showAnswersTime = useRef(0) // this stores the time when the answers have been shown
  const showAnswersTimeLeft = useRef(0) // this stores the time left when pausing

  useEffect(() => {
    if (stage === "explaination_fade_in") {
      showAnswersTime.current = Date.now()
      showAnswersTimeLeft.current = progressData.duration
    }
  }, [stage]);

  function toggle() {
    // these calculations are done to keep the time left when pausing and resuming (by default, resuming was resetting 5000 ms timer)
    const stopped = !progressData.stopped
    const now = Date.now()

    if (stopped) {
      const elapsed = now - showAnswersTime.current
      showAnswersTimeLeft.current -= elapsed
    } else {
      showAnswersTime.current = now
    }

    setProgressData(prev => ({
      ...prev,
      duration: showAnswersTimeLeft.current,
      stopped: !prev.stopped
    }))
  }

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
        <View style={styles.optionsBox}>
          {canPause && <TouchableOpacity style={[styles.optionButton, { backgroundColor: colors.background_blue_3 }]}
                                         onPress={toggle}
                                         activeOpacity={0.8}>
              <MaterialIcons name={progressData.stopped ? "play-arrow" : "pause"} size={24} color="white"/>
          </TouchableOpacity>}
          <TouchableOpacity style={[styles.optionButton, { backgroundColor: colors.background_blue_3 }]}
                            onPress={showReportModal}
                            activeOpacity={0.8}>
            <MaterialIcons name="report" size={24} color="white"/>
          </TouchableOpacity>
        </View>
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