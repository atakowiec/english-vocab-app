import {ThemedText} from "@/components/theme/ThemedText";
import DragDropBoard from "@/components/learning-mode/pair-mode/DragDropBoard";
import {useLearningModeContext} from "@/context/LearningModeContext";
import {useMemo} from "react";

export default function PairModeScreen() {
  const {wordsQueue} = useLearningModeContext()

  const words = useMemo(() => {
    return wordsQueue.slice(0, 4);
  }, [wordsQueue])

  return (
    <>
      <ThemedText type={"small"} colorKey={"text_secondary"} style={{textAlign: "center"}}>
        Match each word with its translation.
      </ThemedText>
      <ThemedText type={"small"} colorKey={"text_secondary"} style={{textAlign: "center"}}>
        Press word on the left to see its definition and examples.
      </ThemedText>
      <DragDropBoard words={words}/>
    </>
  )
}