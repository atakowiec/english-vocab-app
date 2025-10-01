import { ThemedText } from "@/components/theme/ThemedText";
import AppContainer from "@/components/index/AppContainer";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import SectionBox from "@/components/index/SectionBox";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function ModeSelectorScreen() {
  const router = useRouter();

  return (
    <AppContainer>
      <ThemedText type={"title"}>Select learning mode!</ThemedText>
      <ThemedText type={"default"} colorKey={"text_secondary"}>
        Your vocabulary adventure awaits.
      </ThemedText>
      <View style={styles.modesBox}>
        <View style={styles.modesRow}>
          <TouchableOpacity style={[styles.modeCardTouchable]} activeOpacity={.6}
                            onPress={() => router.push("/(app)/modes/speed-mode-lobby")}>
            <SectionBox style={[styles.modeCard]}>
              <View style={styles.modeNameBox}>
                <MaterialCommunityIcons name="timer" size={25} color="white"/>
                <ThemedText type={"defaultSemiBold"}>
                  Speed Test
                </ThemedText>
              </View>
              <ThemedText type={"default"} colorKey={"text_secondary"} style={{ fontSize: 14, flex: 1 }}>
                Fast recall under pressure.
              </ThemedText>
            </SectionBox>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.modeCardTouchable]} activeOpacity={.6}
                            onPress={() => router.push("/(app)/modes/speed-mode")}>
            <SectionBox style={[styles.modeCard]}>
              <View style={styles.modeNameBox}>
                <MaterialCommunityIcons name="toy-brick" size={25} color="white"/>
                <ThemedText type={"defaultSemiBold"}>
                  Word builders
                </ThemedText>
              </View>
              <ThemedText type={"default"} colorKey={"text_secondary"} style={{ fontSize: 14, flex: 1 }}>
                Build words from letters.
              </ThemedText>
            </SectionBox>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={[styles.modeCardTouchable]} activeOpacity={.6}
                          onPress={() => router.push("/(app)/modes/learning-mode")}>
          <SectionBox style={[styles.modeCard]}>
            <View style={styles.modeNameBox}>
              <Ionicons name="sparkles" size={25} color={"white"}/>
              <ThemedText type={"defaultSemiBold"}>
                Learning Mode
              </ThemedText>
            </View>
            <ThemedText type={"default"} colorKey={"text_secondary"} style={{ fontSize: 14, flex: 1 }}>
              Smart word training with rotating challenges for faster vocabulary mastery.
            </ThemedText>
          </SectionBox>
        </TouchableOpacity>
      </View>
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  modeCardTouchable: {
    borderRadius: 20,
    flex: 1,
  },
  blueButton: {
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  modesBox: {
    gap: 10,
    marginTop: 20,
  },
  modeCard: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  modesRow: {
    gap: 10,
    flexDirection: "row",
  },
  modeNameBox: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  }
})