import {ThemedText} from "@/components/theme/ThemedText";
import {useLearningModeContext} from "@/context/LearningModeContext";
import {useMemo, useState} from "react";
import {StyleSheet, View} from "react-native";
import {useThemeColors} from "@/hooks/theme/useThemeColor";
import Answer from "@/components/learning-mode/definition-mode/Answer";

export default function DefinitionModeScreen() {
  const colors = useThemeColors();
  const {wordsQueue} = useLearningModeContext()
  const [selectedWord, setSelectedWord] = useState<string | null>(null)

  const word = useMemo(() => {
    return wordsQueue[0]
  }, [wordsQueue])

  const correctAnswer = word.word.word_en

  const answers: string[] = useMemo(() => {
    if (!word)
      return []


    return [...word.similarEnWords, word.word.word_en].sort(() => Math.random() - 0.5)
  }, [word])

  function onAnswerClick(word: string) {
    if (!selectedWord)
      setSelectedWord(word)
  }

  return (
    <>
      <ThemedText type={"small"} colorKey={"text_secondary"} style={{textAlign: "center"}}>
        Match the definition with the word.
      </ThemedText>
      <View style={styles.definitionContainer}>
        <ThemedText colorKey={"accent_blue"} style={[styles.definitionText, {borderColor: colors.accent_blue}]}>
          {word.word.definition_en}
        </ThemedText>
      </View>
      <View style={styles.answersContainer}>
        {
          answers.map(answer =>
            <Answer answer={answer}
                    selectedWord={selectedWord}
                    correctAnswer={correctAnswer}
                    onAnswerClick={onAnswerClick}/>)
        }
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  definitionContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  definitionText: {
    margin: 15,
    padding: 15,
    borderLeftWidth: 4,
  },
  answersContainer: {
    gap: 10,
    padding: 15,
    paddingTop: 10
  }
})