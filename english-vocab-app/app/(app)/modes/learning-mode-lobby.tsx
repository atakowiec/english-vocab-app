import BackButton from "@/components/BackButton";
import {StyleSheet, View} from "react-native";
import {ThemedView} from "@/components/theme/ThemedView";
import Ionicons from '@expo/vector-icons/Ionicons';
import {ThemedText} from "@/components/theme/ThemedText";
import {useThemeColors} from "@/hooks/theme/useThemeColor";
import ThemedButton from "@/components/theme/ThemedButton";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {router} from "expo-router";
import {useGlobalLearningContext} from "@/context/GlobalLearningContext";
import {useEffect} from "react";
import {useAppContext} from "@/context/AppContext";

export default function LearningModeLobby() {
  const {setLoadingVisible} = useAppContext()
  const colors = useThemeColors();
  const {setMode, fetchNextWords} = useGlobalLearningContext()

  useEffect(() => {
    setMode("LEARNING")
  }, []);

  async function start() {
    setLoadingVisible(true);

    await fetchNextWords()

    setLoadingVisible(false);
    router.replace("/(app)/modes/learning-mode")
  }

  return (
    <ThemedView style={{flex: 1, padding: 10}}>
      <View style={styles.topBox}>
        <BackButton/>
      </View>
      <View style={styles.titleBox}>
        <ThemedText type={"title"}>
          Learning Mode
        </ThemedText>
      </View>
      <View style={styles.bottomBox}>
        <ThemedView colorKey={"background_blue_2"} style={styles.infoBox}>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle-outline" size={24} color={colors.text_secondary}/>
            <ThemedText style={{fontWeight: "bold"}} colorKey={"text_secondary"}>
              Description
            </ThemedText>
          </View>
          <ThemedText style={{fontSize: 15}} colorKey={"text_secondary"}>
            Learning Mode is your main training session: you’ll work through a set of words using different
            mini-games that test definitions, translations, input, pairing and more. The system repeats
            tough words more often and adapts to your progress, so each session helps you learn faster,
            remember better and finish with every word mastered.
          </ThemedText>
        </ThemedView>
        <View style={styles.bottomButtons}>
          <ThemedButton style={styles.startButton} onPress={start}>
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