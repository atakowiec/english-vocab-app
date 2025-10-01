import { ThemedText } from "@/components/theme/ThemedText";
import AppContainer from "@/components/index/AppContainer";

export default function LearningModeScreen() {
  return (
    <AppContainer>
      <ThemedText type={"title"}>
        Learning Mode
      </ThemedText>
      <ThemedText type={"default"} colorKey={"text_secondary"}>
        Here will be the Learning Mode screen.
      </ThemedText>
    </AppContainer>
  );
}
