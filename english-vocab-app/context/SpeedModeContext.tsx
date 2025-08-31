import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { usePreferences } from "@/context/PreferencesContext";
import { GetNextWordsQuery, useGetNextWordsLazyQuery } from "@/graphql/gql-generated";

type GameStage = "counting" | "answering" | "show_answer" | "explaination_fade_in" | "swipe_next"
type ProgressData = { target: number, duration: number }

export type WordType = GetNextWordsQuery["getNextWords"][0] & {
  answers: string[]
  wordText: string
  selectedAnswer?: string
  correctAnswer?: string
}

type SpeedModeContextData = {
  answerTime: number;
  stage: GameStage;
  setStage: (stage: GameStage) => void;
  progressData: ProgressData;
  setProgressData: (data: ProgressData) => void;
  started: boolean;
  currentWord: WordType | undefined;
  nextWord: WordType | undefined;
  progressCallback: () => void;
  onAnswerClick: (answer: string) => void;
}

const SpeedModeContext = createContext<SpeedModeContextData | null>(null)

export const SpeedModeProvider = ({ children }: { children: ReactNode }) => {
  const { getPreference } = usePreferences()
  const difficulty = getPreference("speed-test-difficulty", "medium");
  const [stage, setStage] = useState<GameStage>("counting")
  const [progressData, setProgressData] = useState<ProgressData>({ target: 0, duration: 5000 })

  const [wordsQueue, setWordsQueue] = useState<WordType[]>([])
  const [fetchWordsQuery] = useGetNextWordsLazyQuery({
    fetchPolicy: "network-only",
  })

  const answerTime = {
    "hard": 3,
    "medium": 5,
    "easy": 100,
  }[difficulty]

  const onProgressEnd = useCallback(() => {
    if (stage === "answering") {
      setStage("show_answer")
      setProgressData({ target: 0.0001, duration: 50 })
    }
    if (stage === "show_answer") {
      setStage("explaination_fade_in")
      setProgressData({ target: 1, duration: 3000 })
    }
    if (stage === "explaination_fade_in") {
      setStage("swipe_next")
      nextWord()
      setProgressData({ target: 0.9999, duration: 500 })
    }
    if (stage === "swipe_next") {
      setStage("answering")
      setProgressData({ target: 0, duration: answerTime * 1000 })
    }
  }, [stage, answerTime])

  useEffect(() => {
    fetchNextWords()
  }, [])

  const fetchNextWords = () => {
    fetchWordsQuery()
      .then(result => {
        if (!result.data?.getNextWords) {
          throw new Error(`No words found ${result.error}`);
        }

        const words = result.data!.getNextWords.map(word => {
          const isEnMode = Math.random() > 0.5
          return {
            ...word,
            wordText: isEnMode ? word.word.word_en : word.word.word_pl,
            correctAnswer: isEnMode ? word.word.word_pl : word.word.word_en,
            answers: (isEnMode ? [word.word.word_pl, ...word.similarPlWords] : [word.word.word_en, ...word.similarEnWords]).sort(() => Math.random() - 0.5),
          } as WordType
        }).sort(() => Math.random() - 0.5)

        setWordsQueue(prev => [...prev, ...words])
      })
      .catch(error => {
        // handle error
        console.error("Error fetching words:", error);
      })
  }

  const nextWord = () => {
    setWordsQueue(prev => prev.slice(1))

    if (wordsQueue.length <= 3) {
      fetchNextWords()
    }
  }

  const onAnswerClick = (answer: string) => {
    if (stage !== "answering" || wordsQueue[0].selectedAnswer) {
      return
    }

    setProgressData({ target: 0.0001, duration: 500 })
    setWordsQueue(prev => {
      const newWords = [...prev]
      const word = { ...newWords[0] }
      if (word) {
        word.selectedAnswer = answer
      }
      newWords[0] = word
      return newWords
    })
  }

  return (
    <SpeedModeContext.Provider value={{
      answerTime,
      stage,
      setStage,
      progressData,
      setProgressData,
      started: stage !== "counting",
      currentWord: wordsQueue[0],
      nextWord: wordsQueue[1],
      progressCallback: onProgressEnd,
      onAnswerClick,
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