import {createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState} from "react";
import {
  GetWordsMutation,
  GivenAnswerInput,
  useGetWordsMutation,
  useReportWordMutation,
  useSaveAnswersMutation
} from "@/graphql/gql-generated";
import Toast from "react-native-toast-message";
import ReportModal from "@/components/speed-mode/ReportModal";
import {useUserDataStore} from "@/hooks/store/userDataStore";

export type GameStage = "counting" | "answering" | "show_answer" | "explaination_fade_in" | "swipe_next"
export type GlobalLearningContextType = {
  stage: GameStage;
  setStage: (stage: GameStage) => void;
  showReportModal: () => void;
  wordsQueue: WordType[];
  registerAnswers: (data: Record<number, string>) => void;

  progressData: ProgressData;
  setProgressData: (data: ProgressData | ((data: ProgressData) => ProgressData)) => void;
  progressCallback: () => void;
  answerTime: number;
  setAnswerTime: (time: number) => void;
  setMode: (mode: LearnMode) => void;
  fetchNextWords: () => Promise<void>;
}

export type WordType = GetWordsMutation["getWords"][0] & {
  answers: string[]
  wordText: string
  selectedAnswer?: string
  correctAnswer?: string
  language: "en" | "pl"
}

export type ProgressData = { target: number, duration: number, stopped?: boolean }

export type LearnMode = "SPEED_TEST" | "LEARNING"

type Props = {
  children: ReactNode
}

const GlobalLearningContext = createContext<GlobalLearningContextType | undefined>(undefined);

export default function GlobalLearningContextProvider({children}: Props) {
  const [mode, setMode] = useState<LearnMode>("LEARNING")
  const userData = useUserDataStore()
  const [stage, setStage] = useState<GameStage>("counting")

  const [progressData, setProgressData] = useState<ProgressData>({target: 0, duration: 5000})

  const [reportWord] = useReportWordMutation()
  const [reportVisible, setReportVisible] = useState(false)

  const [answerTime, setAnswerTime] = useState(0)
  const [saveAnswers] = useSaveAnswersMutation({fetchPolicy: "network-only"})
  const savedAnswersRef = useRef<GivenAnswerInput[]>([])

  const [wordsQueue, setWordsQueue] = useState<WordType[]>([])
  const [fetchWordsMutation] = useGetWordsMutation({
    fetchPolicy: "network-only",
    variables: {mode}
  })

  useEffect(() => {
    return () => {
      sendAnswers()
    }
  }, [])

  function onReportModalClose() {
    setReportVisible(false)
    setStage("swipe_next")
    nextWord()
    setProgressData({target: 0.9999, duration: 500})
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

  function showReportModal() {
    setReportVisible(true)
    setProgressData(prevState => ({
      ...prevState,
      stopped: true
    }))
  }

  const fetchNextWords = async () => {
    try {
      const result = await fetchWordsMutation()

      if (!result.data?.getWords) {
        throw new Error(`No words found ${result.errors?.[0]}`);
      }

      const words = result.data!.getWords.map(word => {
        const isEnMode = Math.random() > 0.5
        return {
          ...word,
          wordText: isEnMode ? word.word.word_en : word.word.word_pl,
          correctAnswer: isEnMode ? word.word.word_pl : word.word.word_en,
          answers: (isEnMode ? [word.word.word_pl, ...word.similarPlWords] : [word.word.word_en, ...word.similarEnWords]).sort(() => Math.random() - 0.5),
          language: isEnMode ? "en" : "pl",
        } as WordType
      }).sort(() => Math.random() - 0.5)

      setWordsQueue(prev => [...prev, ...words])
    } catch (error) {
      console.error("Error fetching words:", error);
    }
  }

  const sendAnswers = async () => {
    if (savedAnswersRef.current.length == 0)
      return

    const input = savedAnswersRef.current;
    savedAnswersRef.current = [];

    await saveAnswers({
      variables: {
        input
      }
    })
  }

  const nextWord = () => {
    setWordsQueue(prev => prev.slice(1))

    if (wordsQueue.length <= 3) {
      fetchNextWords()
    }
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
          learnMode: mode,
          distractors: [],
          language: wordsQueue[0].language
        })
        updateStreak()
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

  const registerAnswers = (data: Record<number, string>) => {
    setWordsQueue(prev => {
      const newWords = [...prev]

      for (const [index, word] of prev.entries()) {
        if (!data[word.word.id])
          continue;

        newWords[index] = {...word, selectedAnswer: data[word.word.id]}

        savedAnswersRef.current.push({
          word_id: word.word.id,
          correct: word.selectedAnswer === word.correctAnswer,
          date: new Date(),
          learnMode: mode,
          language: word.language,
          distractors: word.answers
        })
      }

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

  return (
    <GlobalLearningContext.Provider value={{
      stage,
      setStage,
      wordsQueue: wordsQueue,
      showReportModal,
      progressData,
      setProgressData,
      progressCallback: onProgressEnd,
      registerAnswers,
      answerTime,
      setAnswerTime,
      setMode,
      fetchNextWords,
    }}>
      <ReportModal isVisible={reportVisible}
                   onClose={onReportModalClose}
                   onSubmit={onReportModalSubmit}
                   setVisible={setReportVisible}/>
      {children}
    </GlobalLearningContext.Provider>
  )
}

export const useGlobalLearningContext = () => {
  const ctx = useContext(GlobalLearningContext);

  if (!ctx) {
    throw new Error("useGlobalLearningContext must be used within a GlobalLearningContextProvider");
  }

  return ctx;
}