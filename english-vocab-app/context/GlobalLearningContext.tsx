import {createContext, ReactNode, RefObject, useContext, useEffect, useRef, useState} from "react";
import {
  GetWordsMutation,
  GivenAnswerInput,
  useGetWordsMutation,
  useReportWordMutation,
  useSaveAnswersMutation
} from "@/graphql/gql-generated";
import Toast from "react-native-toast-message";
import ReportModal from "@/components/speed-mode/ReportModal";

export type GameStage = "counting" | "answering" | "show_answer" | "explaination_fade_in" | "swipe_next"
export type GlobalLearningContextType = {
  stage: GameStage;
  setStage: (stage: GameStage) => void;
  showReportModal: () => void;
  wordsQueue: WordType[];
  registerAnswers: (data: Record<number, string>) => void;
  savedAnswersRef: RefObject<GivenAnswerInput[]>

  progressData: ProgressData;
  setProgressData: (data: ProgressData | ((data: ProgressData) => ProgressData)) => void;

  answerTime: number;
  setAnswerTime: (time: number) => void;
  setMode: (mode: LearnMode) => void;
  fetchNextWords: () => Promise<void>;
  nextWord: () => void;
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

      return newWords
    })

    if (savedAnswersRef.current.length < 10) {
      return
    }
    sendAnswers()
  }

  return (
    <GlobalLearningContext.Provider value={{
      stage,
      setStage,
      wordsQueue: wordsQueue,
      showReportModal,
      progressData,
      setProgressData,
      registerAnswers,
      answerTime,
      setAnswerTime,
      setMode,
      fetchNextWords,
      nextWord,
      savedAnswersRef
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