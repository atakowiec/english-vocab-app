import { ThemedText } from "@/components/theme/ThemedText";
import AppContainer from "@/components/index/AppContainer";
import SectionBox from "@/components/index/SectionBox";
import { useAuth } from "@/context/AuthContext";
import { useUserDataStore } from "@/hooks/store/userDataStore";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { expData } = useUserDataStore();
  const colors = useThemeColors();

  const progressPercent = expData.requiredExp > 0
    ? Math.min(100, Math.max(0, (expData.currentExp / expData.requiredExp) * 100))
    : 0;

  return (
    <AppContainer>
      <ThemedText type={"title"}>
        Your Profile
      </ThemedText>
      <ThemedText type={"default"} colorKey={"text_secondary"}>
        Manage your account and preferences.
      </ThemedText>
      <View style={[styles.container, { marginTop: 20 }]}>
        <SectionBox style={styles.profileBox}>
                    <FontAwesome name="user" size={40} color={"white"} accessibilityLabel="User profile picture" />
          <View style={styles.rightBox}>
            <View style={styles.usernameRow}>
              <ThemedText type={"subtitle"}>
                {user?.name}
              </ThemedText>
              <View style={[styles.levelBadge, { backgroundColor: colors.accent_blue }]}>
                <ThemedText colorKey={"background_blue_2"} style={styles.levelText}>
                  {expData.level} level
                </ThemedText>
              </View>
            </View>

            <View style={styles.progressRow}>
              <View style={styles.progressBar}>
                <View style={[styles.progressInner, { width: `${progressPercent}%` }]}/>
              </View>
              <ThemedText colorKey={"text_secondary"} style={styles.progressLabel}>
                {expData.currentExp} / {expData.requiredExp} xp
              </ThemedText>
            </View>
          </View>
        </SectionBox>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={signOut}
          style={[styles.logoutButton, { backgroundColor: colors.accent_blue }]}
        >
          <ThemedText style={styles.logoutText} colorKey={"background_blue_2"}>
            Log out
          </ThemedText>
        </TouchableOpacity>
      </View>
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
  },
  profileBox: {
    gap: 20,
    alignItems: "center",
  },
  rightBox: {
    flex: 1,
    gap: 10,
  },
  usernameRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  levelBadge: {
    paddingHorizontal: 10,
    borderRadius: 20,
    justifyContent: "center",
  },
  levelText: {
    fontSize: 16,
    fontWeight: "600",
  },
  progressRow: {
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
  progressInner: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  progressLabel: {
    fontSize: 11,
  },
  logoutButton: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
