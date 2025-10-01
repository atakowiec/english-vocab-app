import BackButton from "@/components/BackButton";
import { StyleSheet, View } from "react-native";
import { ThemedView } from "@/components/theme/ThemedView";
import Ionicons from '@expo/vector-icons/Ionicons';
import { ThemedText } from "@/components/theme/ThemedText";
import { DifficultySelector } from "@/components/speed-mode/DifficultySelector";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import ThemedButton from "@/components/theme/ThemedButton";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState } from "react";
import { usePreferences } from "@/context/PreferencesContext";
import { router } from "expo-router";
import { useUserDataStore } from "@/hooks/store/userDataStore";

export type Difficulty = "easy" | "medium" | "hard";

export default function SpeedModeLobby() {
  const colors = useThemeColors();
  const userData = useUserDataStore()
  const { getPreference } = usePreferences();
  const [difficulty, setDifficulty] = useState<Difficulty>(getPreference("speed-test-difficulty", "medium"))

  const time = {
    "hard": 3,
    "medium": 5,
    "easy": 100,
  }[difficulty]

  return (
    <ThemedView style={{ flex: 1, padding: 10 }}>
      <View style={styles.topBox}>
        <BackButton/>
        <ThemedView colorKey={"background_blue_2"} style={styles.streakBox}>
          <Ionicons name="flame-sharp" size={30} color="#F29D38"/>
          <ThemedText style={{ fontSize: 19 }}>
            {userData?.speedModeProgress?.streak || 0}
          </ThemedText>
        </ThemedView>
      </View>
      <View style={styles.titleBox}>
        <ThemedText type={"title"}>
          Speed Test Mode
        </ThemedText>
      </View>
      <View style={styles.bottomBox}>
        <DifficultySelector difficulty={difficulty} setDifficulty={setDifficulty}/>
        <ThemedView colorKey={"background_blue_2"} style={styles.infoBox}>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle-outline" size={24} color={colors.text_secondary}/>
            <ThemedText style={{ fontWeight: "bold" }} colorKey={"text_secondary"}>
              How to play
            </ThemedText>
          </View>
          <ThemedText style={{ fontSize: 15 }} colorKey={"text_secondary"}>
            Speed Test Mode challenges you to react quickly: you’ll be shown one word and four possible answers, but you
            have only <ThemedText style={{ fontSize: 15 }}>{time} seconds</ThemedText> to choose the correct one. If the
            timer runs out, the question is lost—so stay sharp and make your choice fast
          </ThemedText>
        </ThemedView>
        <View style={styles.bottomButtons}>
          <ThemedButton style={styles.startButton} onPress={() => router.replace("/(app)/modes/speed-mode")}>
            <FontAwesome name={"play"} size={18} color={colors.background_blue_1}/>
            <ThemedText colorKey={"background_blue_1"}>
              Start
            </ThemedText>
          </ThemedButton>
        </View>
      </View>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  topBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  streakBox: {
    height: 60,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  titleBox: {
    alignItems: "center",
    flex: 1,
    marginTop: "25%"
  },
  bottomBox: {
    gap: 15,
  },
  infoBox: {
    padding: 20,
    borderRadius: 20,
    gap: 15,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  bottomButtons: {
    flexDirection: "row",
    gap: 10,
  },
  startButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  }
})