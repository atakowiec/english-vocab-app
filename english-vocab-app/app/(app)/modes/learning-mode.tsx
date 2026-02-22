import {LearningMode} from "@/components/learning-mode/LearningMode";
import LearningModeContextProvider from "@/context/LearningModeContext";

export default function LearningModeScreen() {
  return (
    <LearningModeContextProvider>
      <LearningMode/>
    </LearningModeContextProvider>
  );
}
