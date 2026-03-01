import {View} from "react-native";
import styles from "@/styles/learning-mode";
import {ThemedView} from "@/components/theme/ThemedView";

export default function WordsIndicator() {
  const getWordColor = (num: number) => {
    if (num < 5) {
      return "green"
    }
    if (num < 8) {
      return "red"
    }

    return "background_blue_3"
  }

  return (
    <View style={styles.wordIndicator}>
      {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
        <ThemedView style={[styles.indicatorEntry]} colorKey={getWordColor(num)} key={num}/> // todo finish someday
      ))}
    </View>
  )
}