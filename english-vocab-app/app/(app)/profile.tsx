import { ThemedText } from "@/components/ThemedText";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";

export default function ProfileScreen() {
  return (
    <ThemedSafeAreaView style={{flex: 1}}>
      <ThemedText type={"title"}>
        test
      </ThemedText>
    </ThemedSafeAreaView>
  );
}
