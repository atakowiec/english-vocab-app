import {createContext, ReactNode, useContext, useState} from "react"
import {useReportWordMutation} from "@/graphql/gql-generated";
import {useGlobalLearningContext} from "@/context/GlobalLearningContext";
import ReportModal from "@/components/speed-mode/ReportModal";
import Toast from "react-native-toast-message";

type ReportContextType = {
  showReportModal: () => void
}

const ReportContext = createContext<ReportContextType | undefined>(undefined)

export default function ReportContextProvider({children}: { children: ReactNode }) {
  const [reportWord] = useReportWordMutation()
  const [reportVisible, setReportVisible] = useState(false)
  const {nextWord, setStage, wordsQueue, setProgressData} = useGlobalLearningContext()

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

  return (
    <ReportContext.Provider value={{
      showReportModal
    }}>
      <ReportModal isVisible={reportVisible}
                   onClose={onReportModalClose}
                   onSubmit={onReportModalSubmit}
                   setVisible={setReportVisible}/>
      {children}
    </ReportContext.Provider>
  )
}

export const useReportContext = () => {
  const ctx = useContext(ReportContext)
  if (!ctx) {
    throw new Error("useReportContext must be used within a ReportContextProvider")
  }
  return ctx;
}