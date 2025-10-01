import { ThemedText } from "@/components/theme/ThemedText";
import { StyleSheet, View } from "react-native";
import ThemedButton from "@/components/theme/ThemedButton";

type Props = {
  count: number;
  skipCountdown: () => void;
}

export default function CountdownScreen({ count, skipCountdown }: Props) {
  return (
    <View style={styles.box}>
      <ThemedText style={[styles.text]} colorKey={count > 0 && count < 4 ? "red" : "green"} type={"defaultSemiBold"}>
        {count === 0 ? "GO!" : (count > 0 ? count : "")}
      </ThemedText>
      {count > 0 && <ThemedText type={"subtitle"} colorKey={"text_secondary"}>
          Get ready!
      </ThemedText>}
      {count > 0 && <ThemedButton type={"secondary"} style={{ marginTop: 20 }} onPress={skipCountdown}>
        Pomiń
      </ThemedButton>}
    </View>
  )
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  text: {
    fontSize: 100,
  }
})