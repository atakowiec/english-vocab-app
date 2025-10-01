import { ThemedText } from "@/components/theme/ThemedText";
import AppContainer from "@/components/index/AppContainer";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import ProfileSection from "@/components/index/ProfileSection";
import StreakSection from "@/components/index/StreakSection";
import GoalSection from "@/components/index/GoalSection";
import TodaysWordSection from "@/components/index/TodaysWordSection";
import { useAppContext } from "@/context/AppContext";
import { useCallback, useEffect, useState } from "react";
import ThemedRefreshControl from "@/components/theme/ThemedRefreshControl";

export default function HomeScreen() {
  const colors = useThemeColors();
  const { refreshUserData } = useAppContext()
  const [refreshing, setRefreshing] = useState(false)

  const refresh = useCallback(async () => {
    setRefreshing(true)
    try {
      await refreshUserData()
    } finally {
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    setTimeout(refresh, 1000)
  }, []);

  return (
    <AppContainer
      refreshControl={
        <ThemedRefreshControl refreshing={refreshing} onRefresh={refresh}/>
      }
    >
      <ThemedText type={"title"}>Welcome back!</ThemedText>
      <ThemedText type={"default"} colorKey={"text_secondary"}>
        Keep up your streak and learn more today.
      </ThemedText>
      <View style={styles.container}>
        <ProfileSection/>
        <View style={styles.row}>
          <StreakSection/>
          <GoalSection/>
        </View>
        <TodaysWordSection/>
        <TouchableOpacity style={[styles.continueButton, { backgroundColor: colors.accent_blue }]} activeOpacity={0.8}>
          <FontAwesome name={"play"} size={18} color={colors.background_blue_2}/>
          <Text style={[{ color: colors.background_blue_2 }, styles.continueButtonText]}>
            Continue Learning
          </Text>
        </TouchableOpacity>
      </View>
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginTop: 20
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  continueButton: {
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  continueButtonText: {
    fontSize: 18,
  },
})
