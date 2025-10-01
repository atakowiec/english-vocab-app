import SectionBox from "@/components/index/SectionBox";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useMemo } from "react";

const hasStreakTexts = [
  "Great start!",
  "You are on fire!",
  "Keep it up!",
  "Amazing!",
  "Incredible!",
  "Unstoppable!",
  "Legendary!",
  "Mythical!",
  "Godlike!",
  "Immortal!",
  "Eternal!",
  "Timeless!",
  "Infinite!",
  "Boundless!",
  "Limitless!",
  "Everlasting!",
  "Perpetual!",
  "Endless!",
  "Ceaseless!",
  "Unending!",
  "Unceasing!",
  "Relentless!",
  "Unwavering!",
  "Steadfast!",
  "Indomitable!",
  "Unyielding!",
  "Inexorable!",
]

export default function StreakSection() {
  const { userData } = useAuth()
  const streak = userData?.streak || 0
  const hasStreak = streak > 0
  const streakText = useMemo(() => {
    if (!userData || !hasStreak)
      return "Start today!"

    return hasStreakTexts[Math.min(streak - 1, hasStreakTexts.length - 1)]
  }, [userData])

  return (
    <SectionBox>
      <Ionicons name="flame" size={34} color="#FF9408"/>
      <View>
        <ThemedText type={"default"}>
          {hasStreak ? `${streak} day streak` : "No streak yet"}
        </ThemedText>
        <ThemedText type={"small"} colorKey={"text_secondary"}>
          {streakText}
        </ThemedText>
      </View>
    </SectionBox>
  )
}