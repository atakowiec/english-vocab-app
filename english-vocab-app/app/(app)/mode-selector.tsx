import { ThemedText } from "@/components/ThemedText";
import AppContainer from "@/components/index/AppContainer";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import SectionBox from "@/components/index/SectionBox";
import { Image } from "expo-image";
import ProgressBar from "@/components/ui/ProgressBar";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { FontAwesome5 } from "@expo/vector-icons";

export default function ModeSelectorScreen() {
  const modes = [
    [
      {
        name: "Word Sniper",
        description: "Quick one correct answer translation.",
        progress: 0.50,
        icon: () => <Image source={require("@/assets/images/ABCD.png")} style={{ width: 25, height: 25 }}/>,
      },
      {
        name: "Word Forms",
        description: "Match translation to different word types.",
        progress: 0.20,
        icon: () => <Image source={require("@/assets/images/adj.png")} style={{ width: 25, height: 25 }}/>,
      },
    ],
    [
      {
        name: "Define It!",
        description: "Match definition to word.",
        progress: 0.90,
        icon: () => <MaterialCommunityIcons name="book-alphabet" size={25} color="white"/>,
      },
      {
        name: "Type & Go",
        description: "Quick typing correct translation.",
        progress: 0.14,
        icon: () => <MaterialIcons name="text-fields" size={25} color="white"/>,
      },
    ],
    [
      {
        name: "Fill the Gap",
        description: "Type or select missing word in context.",
        progress: 0.50,
        icon: () => <MaterialIcons name="format-color-text" size={25} color="white"/>,
      },
      {
        name: "Pic Match",
        description: "Match pictures to words.",
        progress: 0.30,
        icon: () => <FontAwesome6 name="image" size={25} color="white"/>,
      },
    ],
    [
      {
        name: "Total madness",
        description: "A mix of all game modes for an unpredictable learning challenge every time.",
        progress: 0.50,
        icon: () => <FontAwesome5 name="random" size={25} color="white"/>,
      },
    ]
  ]

  return (
    <AppContainer>
      <ThemedText type={"title"}>Select learning mode!</ThemedText>
      <ThemedText type={"default"} colorKey={"text_secondary"}>
        Your vocabulary adventure awaits.
      </ThemedText>
      <View style={styles.modesBox}>
        {
          modes.map((modeRow, index) => (
            <View style={styles.modesRow} key={index}>
              {modeRow.map((mode) => (
                <TouchableOpacity key={mode.name} style={[styles.modeCardTouchable]} activeOpacity={.6}>
                  <SectionBox style={[styles.modeCard]}>
                    <View style={styles.modeNameBox}>
                      {mode.icon()}
                      <ThemedText type={"defaultSemiBold"}>
                        {mode.name}
                      </ThemedText>
                    </View>
                    <ThemedText type={"default"} colorKey={"text_secondary"} style={{ fontSize: 14, flex: 1 }}>
                      {mode.description}
                    </ThemedText>
                    <ProgressBar progress={mode.progress} height={5}/>
                  </SectionBox>
                </TouchableOpacity>
              ))}
            </View>
          ))
        }
      </View>
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  modeCardTouchable: {
    borderRadius: 20,
    flex: 1,
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