import {createContext, ReactNode, useContext, useEffect} from "react";
import {GlobalLearningContextType, useGlobalLearningContext} from "@/context/GlobalLearningContext";

type LearningModeContextType = GlobalLearningContextType & {}

const LearningModeContext = createContext<LearningModeContextType | undefined>(undefined);

export default function LearningModeContextProvider({children}: { children: ReactNode }) {
  const globalLearningContext = useGlobalLearningContext()
  const {setMode} = globalLearningContext

  useEffect(() => {
    setMode("LEARNING")
  }, []);

  return (
    <LearningModeContext.Provider value={{
      ...globalLearningContext
    }}>
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