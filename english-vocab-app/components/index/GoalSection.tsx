import SectionBox from "@/components/index/SectionBox";
import { ThemedText } from "@/components/theme/ThemedText";
import { TouchableOpacity, View } from "react-native";
import CircleProgress from "@/components/index/CircleProgress";
import { useUserDataStore } from "@/hooks/store/userDataStore";
import { useEffect, useState } from "react";
import { useAnimatedReaction, useSharedValue, withTiming } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

type StatType = "learnedToday" | "learnedThisWeek" | "learnedThisMonth" | "learnedThisYear"
const statTypes: StatType[] = ["learnedToday", "learnedThisWeek", "learnedThisMonth", "learnedThisYear"]

export default function GoalSection() {
  const learningStats = useUserDataStore(store => store.learningStats)
  const [statType, setStatType] = useState<StatType>("learnedToday")
  const displayed = useSharedValue(0);
  const [animatedValue, setAnimatedValue] = useState(0)

  useEffect(() => {
    const toDisplay = learningStats?.[statType] ?? 0
    displayed.value = withTiming(toDisplay, { duration: 600, })
  }, [statType, learningStats.learnedToday, learningStats.learnedThisWeek, learningStats.learnedThisMonth, learningStats.learnedThisYear])

  useAnimatedReaction(
    () => displayed.value,
    (value) => {
      scheduleOnRN(setAnimatedValue, Math.round(value))
    }
  )

  function onClick() {
    const index = statTypes.indexOf(statType)
    const nextIndex = (index + 1) % statTypes.length
    setStatType(statTypes[nextIndex])
  }

  return (
    <TouchableOpacity activeOpacity={0.6} onPress={onClick} style={{width:"45%"}}>
      <SectionBox>
        <CircleProgress progress={40} size={34} strokeWidth={5}/>
        <View>
          <ThemedText type={"default"}>
            {{
              learnedToday: "Today",
              learnedThisWeek: "This week",
              learnedThisMonth: "This month",
              learnedThisYear: "This year",
            }[statType]}
          </ThemedText>
          <ThemedText type={"small"} colorKey={"text_secondary"}>
            {animatedValue} learned
          </ThemedText>
        </View>
      </SectionBox>
    </TouchableOpacity>
  )
}