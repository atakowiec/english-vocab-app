import { ThemedText } from "@/components/theme/ThemedText";
import { Animated, Dimensions, TouchableOpacity, View } from "react-native";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { MaterialIcons } from "@expo/vector-icons";
import { useSpeedModeData, WordType } from "@/context/SpeedModeContext";
import { styles } from "@/styles/speed-test"
import { useEffect, useRef, useState } from "react";
import Explaination from "@/components/speed-mode/Explaination";
import { ThemedView } from "@/components/theme/ThemedView";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useUserDataStore } from "@/hooks/store/userDataStore";

const WINDOW_WIDTH = Dimensions.get("window").width;

/**
 * Dummy question screen is a screen that appears just for slide animation
 * @constructor
 */
export default function DummyQuestionScreen() {
  const colors = useThemeColors()
  const { currentWord, stage } = useSpeedModeData()
  const currentWordRef = useRef<WordType>(currentWord)
  const [prevWord, setPrevWord] = useState<WordType>()
  const translateX = useRef(new Animated.Value(0)).current;
  const rotateZValue = useRef(new Animated.Value(0)).current;
  const streak = useUserDataStore(store => store.speedModeProgress.streak)

  useEffect(() => {
    setPrevWord(currentWordRef.current)

    currentWordRef.current = currentWord
  }, [currentWord]);

  useEffect(() => {
    if (stage === "swipe_next") {
      Animated.timing(translateX, {
        toValue: WINDOW_WIDTH * 1.5,
        duration: 400,
        useNativeDriver: false,
      }).start()

      Animated.timing(rotateZValue, {
        toValue: -1,
        duration: 400,
        useNativeDriver: false,
      }).start()
    }

    if (stage === "answering") {
      rotateZValue.setValue(0);
      translateX.setValue(0);
    }
  }, [stage]);

  if (stage !== "swipe_next")
    return null

  const rotateZ = rotateZValue.interpolate({
    inputRange: [-1, 0],
    outputRange: ["45deg", "0deg"]
  })

  return (
    <Animated.View style={[styles.box, {
      backgroundColor: colors.background_blue_1,
      zIndex: 1000,
      transform: [{ translateX }, { rotateZ }]
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
          {prevWord!.wordText}
        </ThemedText>
      </View>
      <View style={[styles.answersBox, {justifyContent: "flex-end", marginBottom: 10}]}>
        <TouchableOpacity style={[styles.answerButton, { backgroundColor: colors.green }]}
                          activeOpacity={0.8}>
          <ThemedText>
            {prevWord?.correctAnswer}
          </ThemedText>
        </TouchableOpacity>
      </View>
      <Explaination word={prevWord} dummy={true}/>
    </Animated.View>
  )
}