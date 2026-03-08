import WordsIndicator from "@/components/learning-mode/WordsIndicator";
import {KeyboardAvoidingView, Platform, StyleSheet} from "react-native";
import PairModeScreen from "@/components/learning-mode/PairModeScreen";

export function LearningMode() {

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <WordsIndicator/>
      <PairModeScreen/>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})