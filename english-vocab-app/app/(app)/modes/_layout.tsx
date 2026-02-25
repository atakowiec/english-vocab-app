import GlobalLearningContextProvider from "@/context/GlobalLearningContext";
import {Slot} from "expo-router";
import ReportContextProvider from "@/context/ReportContext";

export default function ModesLayout() {
  return (
    <GlobalLearningContextProvider>
      <ReportContextProvider>
        <Slot/>
      </ReportContextProvider>
    </GlobalLearningContextProvider>
  )
}