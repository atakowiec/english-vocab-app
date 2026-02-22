import GlobalLearningContextProvider from "@/context/GlobalLearningContext";
import {Slot} from "expo-router";

export default function ModesLayout() {
  return (
    <GlobalLearningContextProvider>
      <Slot/>
    </GlobalLearningContextProvider>
  )
}