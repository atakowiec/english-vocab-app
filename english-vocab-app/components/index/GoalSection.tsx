import SectionBox from "@/components/index/SectionBox";
import { ThemedText } from "@/components/theme/ThemedText";
import { View } from "react-native";
import CircleProgress from "@/components/index/CircleProgress";

export default function GoalSection() {
  return (
    <SectionBox>
      <CircleProgress progress={40} size={34} strokeWidth={5}/>
      <View>
        <ThemedText type={"default"}>
          This week
        </ThemedText>
        <ThemedText type={"small"} colorKey={"text_secondary"}>
          42 / 50 words
        </ThemedText>
      </View>
    </SectionBox>
  )
}