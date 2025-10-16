import SectionBox from "@/components/index/SectionBox";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "@/components/theme/ThemedText";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { useUserDataStore } from "@/hooks/store/userDataStore";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { useEffect, useRef, useState } from "react";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

export default function ProfileSection() {
  const router = useRouter();
  const colors = useThemeColors()
  const { user } = useAuth()!
  const userData = useUserDataStore()
  const expData = userData.expData;

  const progress = useSharedValue(0)
  const [displayedLevel, setDisplayedLevel] = useState<number>(1)
  const lastLoaded = useRef(false)

  // use effect execute once exp data changes
  useEffect(() => {
    // if its first load - animate to the current level
    if (!lastLoaded.current) {
      if (!userData.loaded)
        return;

      lastLoaded.current = true
      animateToCurrentLevel()
      return;
    }

    if (displayedLevel < expData.level) {
      // level up animation
      animateToNextLevel()
    } else {
      // normal exp gain animation
      animateToCurrentLevel()
    }

    function onFinish() {
      progress.value = 0
      setDisplayedLevel(prev => {
        const newDisplayedLevel = prev + 1;
        if (expData.level > newDisplayedLevel) {
          animateToNextLevel()
        } else {
          animateToCurrentLevel()
        }

        return newDisplayedLevel;
      })
    }

    function animateToNextLevel() {
      setTimeout(() => {
        progress.value = withTiming(1, {
          duration: 600,
          easing: Easing.linear,
        }, (finished) => {
          if (!finished)
            return;

          scheduleOnRN(onFinish)
        })
      }, 0)
    }

    function animateToCurrentLevel() {
      setDisplayedLevel(expData.level)
      setTimeout(() => {
        progress.value = withTiming(expData.currentExp / expData.requiredExp, {
          duration: 600,
          easing: Easing.inOut(Easing.ease),
        })
      }, 0)
    }
  }, [expData.currentExp, expData.requiredExp, expData.level]);

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`
  }))

  return (
    <TouchableOpacity activeOpacity={0.6} onPress={() => router.push("/(app)/tabs/profile")}>
      <SectionBox style={styles.profileSection}>
        <FontAwesome name="user" size={40} color={"white"}/>
        <View style={styles.righBox}>
          <View style={styles.usernameBox}>
            <ThemedText type={"subtitle"}>
              {user?.name}
            </ThemedText>
            <View style={[styles.levelLabel, { backgroundColor: colors.accent_blue }]}>
              <ThemedText colorKey={"background_blue_2"} style={{ fontSize: 16, fontWeight: 600 }}>
                {displayedLevel} level
              </ThemedText>
            </View>
          </View>
          <View style={styles.progressBox}>
            <View style={styles.progressBar}>
              <Animated.View style={[styles.progressBarInner, animatedProgressStyle]}>
              </Animated.View>
            </View>
            <ThemedText colorKey={"text_secondary"} style={{ fontSize: 11 }}>
              {expData.currentExp} / {expData.requiredExp} xp
            </ThemedText>
          </View>
        </View>
      </SectionBox>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  profileSection: {
    gap: 20,
  },
  usernameBox: {
    flexDirection: "row",
    gap: 10,
  },
  levelLabel: {
    paddingHorizontal: 10,
    borderRadius: 20,
    fontSize: 14,
    justifyContent: "center",
  },
  progressBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  progressBar: {
    flex: 1,
    height: 5,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#3f3f3f",
  },
  progressBarInner: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  righBox: {
    flex: 1,
    gap: 10,
  },
})