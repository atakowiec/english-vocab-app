import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePreferences } from "@/context/PreferencesContext";
import {
  GetNextWordsQuery,
  GivenAnswerInput,
  useGetNextWordsLazyQuery,
  useReportWordMutation,
  useSaveAnswersMutation
} from "@/graphql/gql-generated";
import { useUserDataStore } from "@/hooks/store/userDataStore";
import ReportModal from "@/components/speed-mode/ReportModal";
import Toast from "react-native-toast-message";

type GameStage = "counting" | "answering" | "show_answer" | "explaination_fade_in" | "swipe_next"
type ProgressData = { target: number, duration: number, stopped?: boolean }

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
  setProgressData: (data: ProgressData | ((data: ProgressData) => ProgressData)) => void;
  started: boolean;
  currentWord: WordType | undefined;
  nextWord: WordType | undefined;
  progressCallback: () => void;
  onAnswerClick: (answer: string) => void;
  showReportModal: () => void;
}

const SpeedModeContext = createContext<SpeedModeContextData | null>(null)

export const SpeedModeProvider = ({ children }: { children: ReactNode }) => {
  const { getPreference } = usePreferences()
  const difficulty = getPreference("speed-test-difficulty", "medium");
  const [stage, setStage] = useState<GameStage>("counting")
  const [progressData, setProgressData] = useState<ProgressData>({ target: 0, duration: 5000 })
  const savedAnswersRef = useRef<GivenAnswerInput[]>([])

  const [wordsQueue, setWordsQueue] = useState<WordType[]>([])
  const [fetchWordsQuery] = useGetNextWordsLazyQuery({
    fetchPolicy: "network-only",
    variables: {
      mode: "SPEED_MODE",
    }
  })
  const [saveAnswers] = useSaveAnswersMutation({ fetchPolicy: "network-only" })
  const userData = useUserDataStore()

  const [reportWord] = useReportWordMutation()
  const [reportVisible, setReportVisible] = useState(false)

  const answerTime = {
    "hard": 3,
    "medium": 5,
    "easy": 10,
  }[difficulty]

  const onProgressEnd = useCallback(() => {
    if (stage === "answering") {
      setStage("show_answer")
      setProgressData({ target: 0.0001, duration: 50 })

      // if the user didn't answer, save as incorrect
      if (savedAnswersRef.current.at(-1)?.word_id !== wordsQueue[0].word.id) {
        savedAnswersRef.current.push({
          word_id: wordsQueue[0].word.id,
          correct: false,
          date: new Date(),
          learnMode: "SPEED_MODE"
        })
        updateStreak()
      }
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

    return () => {
      sendAnswers()
    }
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

      savedAnswersRef.current.push({
        word_id: word.word.id,
        correct: word.selectedAnswer === word.correctAnswer,
        date: new Date(),
        learnMode: "SPEED_MODE"
      })

      updateStreak()

      return newWords
    })

    if (savedAnswersRef.current.length < 10) {
      return
    }
    sendAnswers()
  }

  const updateStreak = () => {
    setTimeout(() => {
      const correct = savedAnswersRef.current.at(-1)?.correct

      userData.set({
        speedModeProgress: {
          ...userData.speedModeProgress,
          streak: correct ? userData.speedModeProgress.streak + 1 : 0
        }
      })
    })
  }

  const sendAnswers = async () => {
    const input = savedAnswersRef.current;
    savedAnswersRef.current = [];

    await saveAnswers({
      variables: {
        input
      }
    })
  }

  function showReportModal() {
    setReportVisible(true)
    setProgressData(prevState => ({
      ...prevState,
      stopped: true
    }))
  }

  function onReportModalClose() {
    setReportVisible(false)
    setStage("swipe_next")
    nextWord()
    setProgressData({ target: 0.9999, duration: 500 })
  }

  async function onReportModalSubmit(reason: string) {
    const word = wordsQueue[0]

    if (!word?.word?.id) {
      return Toast.show({
        type: "error",
        text1: "Error",
        text2: "No word to report",
        visibilityTime: 2000,
      })
    }

    await reportWord({
      variables: {
        wordId: word.word.id,
        reason
      }
    })

    Toast.show({
      type: "info",
      text1: "Report submitted successfully",
      text2: "Thank you for your feedback!",
      visibilityTime: 2000,
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
      showReportModal
    }}>
      <ReportModal isVisible={reportVisible}
                   onClose={onReportModalClose}
                   onSubmit={onReportModalSubmit}
                   setVisible={setReportVisible}/>
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