import {createContext, ReactNode, useContext, useEffect} from "react";
import {usePreferences} from "@/context/PreferencesContext";
import {GlobalLearningContextType, useGlobalLearningContext, WordType} from "@/context/GlobalLearningContext";

type SpeedModeContextData = {
  currentWord: WordType | undefined
} & GlobalLearningContextType

const SpeedModeContext = createContext<SpeedModeContextData | null>(null)

export const SpeedModeProvider = ({children}: { children: ReactNode }) => {
  const globalLearningContext = useGlobalLearningContext()

  const {getPreference} = usePreferences()
  const difficulty = getPreference("speed-test-difficulty", "medium");

  useEffect(() => {
    const answerTime = {
      "hard": 3,
      "medium": 5,
      "easy": 10,
    }[difficulty]

    globalLearningContext.setAnswerTime(answerTime)
    globalLearningContext.setMode("SPEED_TEST")
  }, [difficulty])

  return (
    <SpeedModeContext.Provider value={{
      currentWord: globalLearningContext.wordsQueue[0],
      ...globalLearningContext
    }}>
      {children}
    </SpeedModeContext.Provider>
  )
}

export const useSpeedModeData = () => {
  const context = useContext(SpeedModeContext)
  if (!context) {
    throw new Error("useSpeedModeData must be used within a SpeedModeProvider")
  }
  return context
}