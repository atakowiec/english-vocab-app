import SectionBox from "@/components/index/SectionBox";
import { ThemedText } from "@/components/ThemedText";
import { TouchableOpacity, View } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

export default function TodaysWordSection() {
  return (
    <TouchableOpacity activeOpacity={0.8}>
      <SectionBox style={{ gap: 20 }}>
        <FontAwesome6 name="book" size={34} color="white"/>
        <View>
          <ThemedText type={"default"}>
            Word of the day
          </ThemedText>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <ThemedText type={"small"} colorKey={"accent_blue"}>
              ubiquitous (adj.)
            </ThemedText>
            <ThemedText type={"small"} colorKey={"text_secondary"}>
              -
            </ThemedText>
            <ThemedText type={"small"} colorKey={"text_secondary"}>
              wszechobecny
            </ThemedText>
          </View>
        </View>
      </SectionBox>
    </TouchableOpacity>
  )
}