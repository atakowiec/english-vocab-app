import { ThemedText } from "@/components/theme/ThemedText";
import AppContainer from "@/components/index/AppContainer";

export default function ProfileScreen() {
  return (
    <AppContainer>
      <ThemedText type={"title"}>
        Your Profile
      </ThemedText>
      <ThemedText type={"default"} colorKey={"text_secondary"}>
        You look great today!
      </ThemedText>
    </AppContainer>
  );
}
