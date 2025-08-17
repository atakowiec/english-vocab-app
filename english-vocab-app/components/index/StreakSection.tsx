import SectionBox from "@/components/index/SectionBox";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

export default function StreakSection() {
  return (
    <SectionBox>
      <Ionicons name="flame" size={34} color="#FF9408"/>
      <View>
        <ThemedText type={"default"}>
          7-day streak
        </ThemedText>
        <ThemedText type={"small"} colorKey={"text_secondary"}>
          You are on fire!
        </ThemedText>
      </View>
    </SectionBox>
  )
}