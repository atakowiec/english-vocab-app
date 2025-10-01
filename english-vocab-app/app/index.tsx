import { ThemedSafeAreaView } from "@/components/theme/ThemedSafeAreaView";
import Logo from "@/components/Logo";
import { StyleSheet } from "react-native";
import HeightGap from "@/components/HeightGap";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Index() {
  return (
    <ThemedSafeAreaView style={styles.container}>
      <HeightGap heightPercent={.2}/>
      <Logo/>
      <HeightGap heightPercent={.15}/>
      <LoadingSpinner/>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
})