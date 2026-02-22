import {createContext, ReactNode, useCallback, useContext, useEffect} from "react";
import {usePreferences} from "@/context/PreferencesContext";
import {
  GlobalLearningContextType,
  useGlobalLearningContext,
  WordType
} from "@/context/GlobalLearningContext";
import {useUserDataStore} from "@/hooks/store/userDataStore";

type SpeedModeContextData = {
  currentWord: WordType | undefined,
  onAnswerClick: (answer: string) => void

  progressCallback: () => void;
} & GlobalLearningContextType

const SpeedModeContext = createContext<SpeedModeContextData | null>(null)

export const SpeedModeProvider = ({children}: { children: ReactNode }) => {
  const userData = useUserDataStore()
  const globalLearningContext = useGlobalLearningContext()
  const {
    stage,
    wordsQueue,
    registerAnswers,
    setStage,
    answerTime,
    nextWord,
    savedAnswersRef,
    setProgressData
  } = globalLearningContext

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

  const setStreak = (newStreak: number) => {
    setTimeout(() => {
      userData.set({
        speedModeProgress: {
          ...userData.speedModeProgress,
          streak: newStreak
        }
      })
    })
  }

  const onProgressEnd = useCallback(() => {
    if (stage === "answering") {
      setStage("show_answer")
      setProgressData({target: 0.0001, duration: 50})

      // if the user didn't answer, save as incorrect
      if (savedAnswersRef.current.at(-1)?.word_id !== wordsQueue[0].word.id) {
        savedAnswersRef.current.push({
          word_id: wordsQueue[0].word.id,
          correct: false,
          date: new Date(),
          learnMode: "SPEED_TEST",
          distractors: [],
          language: wordsQueue[0].language
        })
        setStreak(0)
      }
    }
    if (stage === "show_answer") {
      setStage("explaination_fade_in")
      setProgressData({target: 1, duration: 3000})
    }
    if (stage === "explaination_fade_in") {
      setStage("swipe_next")
      nextWord()
      setProgressData({target: 0.9999, duration: 500})
    }
    if (stage === "swipe_next") {
      setStage("answering")
      setProgressData({target: 0, duration: answerTime * 1000})
    }
  }, [stage, answerTime])

  const onAnswerClick = (answer: string) => {
    if (stage !== "answering" || wordsQueue[0].selectedAnswer) {
      return
    }

    setProgressData({target: 0.0001, duration: 500})
    registerAnswers({
      [wordsQueue[0].word.id]: answer
    })
    if (wordsQueue[0].correctAnswer === answer) {
      setStreak(userData.speedModeProgress.streak + 1)
    }
  }

  return (
    <SpeedModeContext.Provider value={{
      currentWord: globalLearningContext.wordsQueue[0],
      onAnswerClick,
      progressCallback: onProgressEnd,
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