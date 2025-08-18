import SectionBox from "@/components/index/SectionBox";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function ProfileSection() {
  const colors = useThemeColors();
  const router = useRouter();
  const { user } = useAuth()!

  return (
    <TouchableOpacity activeOpacity={0.6} onPress={() => router.push("/(app)/profile")}>
      <SectionBox style={styles.profileSection}>
        <FontAwesome name="user" size={40} color={"white"}/>
        <View style={styles.righBox}>
          <View style={styles.usernameBox}>
            <ThemedText type={"subtitle"}>
              {user?.name}
            </ThemedText>
            <View style={[styles.levelLabel, { backgroundColor: colors.accent_blue }]}>
              <ThemedText colorKey={"background_blue_2"} style={{ fontSize: 16, fontWeight: 600 }}>
                5 level
              </ThemedText>
            </View>
          </View>
          <View style={styles.progressBox}>
            <View style={styles.progressBar}>
              <View style={styles.progressBarInner}>
              </View>
            </View>
            <ThemedText colorKey={"text_secondary"} style={{ fontSize: 11 }}>
              1188 / 2000 xp
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
    width: "30%"
  },
  righBox: {
    flex: 1,
    gap: 10,
  },
})