import {ThemedText} from "@/components/theme/ThemedText";
import {useLearningModeContext} from "@/context/LearningModeContext";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import ThemedInput from "@/components/theme/ThemedInput";
import {useThemeColors} from "@/hooks/theme/useThemeColor";
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInputChangeEvent,
  TouchableWithoutFeedback,
  View
} from "react-native";
import {levenshtein} from "@/utils/utils";

export default function InputModeScreen() {
  const colors = useThemeColors();
  const {wordsQueue} = useLearningModeContext()
  const [input, setInput] = useState("")
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  const word = useMemo(() => {
    return wordsQueue[0]
  }, [wordsQueue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      checkAnswers(input)
    }, 500);

    return () => clearTimeout(timeout);
  }, [input]);

  const checkAnswers = (input: string) => {
    if(levenshtein(input, word.word.word_en) > 2) {
      Animated.sequence([
        Animated.timing(shakeAnimation, {toValue: 10, duration: 25, useNativeDriver: true,}),
        Animated.timing(shakeAnimation, {toValue: -10, duration: 50, useNativeDriver: true,}),
        Animated.timing(shakeAnimation, {toValue: 10, duration: 50, useNativeDriver: true,}),
        Animated.timing(shakeAnimation, {toValue: 0, duration: 25, useNativeDriver: true,})
      ]).start()

      return
    }

    // todo git
  }

  const handleInput = useCallback((event: TextInputChangeEvent) => {
    setInput(event.nativeEvent.text)
  }, [])

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{flex: 1}}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{flex: 1}}>
          <ThemedText type={"small"} colorKey={"text_secondary"} style={{textAlign: "center"}}>
            Type the translation of the given word.
          </ThemedText>
          <View style={[styles.wordContainer, {flex: 1, justifyContent: "flex-end"}]}>
            <ThemedText type={"title"} colorKey={"text_primary"}>
              {word.word.word_pl}
            </ThemedText>
          </View>
          <View style={styles.wordContainer}>
            <ThemedText type={"small"} colorKey={"text_secondary"}>
              In meaning:
            </ThemedText>
            <ThemedText type={"small"} colorKey={"text_secondary"} style={{textAlign: "center", padding: 10}}>
              {word.word.definition_en}
            </ThemedText>
          </View>
          <Animated.View style={[styles.inputContainer, {transform: [{translateY: shakeAnimation}]}]}>
            <ThemedInput
              style={[styles.input, {borderBottomColor: colors.accent_blue, }]}
              onChange={handleInput}
              autoFocus={true}
            />
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  wordContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    flex: 1,
    padding: 15,
  },
  input: {
    borderBottomWidth: 2,
    borderRadius: 0,
    paddingHorizontal: 0,
  }
})