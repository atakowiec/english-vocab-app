import {createContext, ReactNode, useContext, useEffect} from "react";
import {useGlobalLearningContext} from "@/context/GlobalLearningContext";

type LearningModeContextType = {}

const LearningModeContext = createContext<LearningModeContextType | undefined>(undefined);

export default function LearningModeContextProvider({ children }: { children: ReactNode }) {
  const {setMode} = useGlobalLearningContext()

  useEffect(() => {
    setMode("LEARNING")
  }, []);

  return (
    <LearningModeContext.Provider value={{}}>
      {children}
    </LearningModeContext.Provider>
  )
}

export const useLearningModeContext = () => {
  const ctx = useContext(LearningModeContext);

  if (!ctx) {
    throw new Error("useLearningModeContext must be used within a LearningModeProvider");
  }

  return ctx;
}