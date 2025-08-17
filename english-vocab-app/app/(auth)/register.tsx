import { StyleSheet, View } from "react-native";
import { Link } from "expo-router";
import ThemedInput from "@/components/ThemedInput";
import ThemedButton from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import HeightGap from "@/components/HeightGap";

export default function RegisterScreen() {
  return (
    <>
      <ThemedText type="subtitle">Create new account</ThemedText>
      <View style={styles.inputsContainer}>
        <ThemedInput placeholder="Username" autoCapitalize="none" keyboardType="email-address" autoCorrect={false}/>
        <ThemedInput placeholder="Email" autoCapitalize="none" keyboardType="email-address" autoCorrect={false}/>
        <ThemedInput placeholder="Password" secureTextEntry/>
        <ThemedInput placeholder="Password confirmation" secureTextEntry/>
      </View>
      <ThemedButton>
        Create account
      </ThemedButton>
      <HeightGap heightPercent={0.05}/>

      <ThemedText type="default" style={{ textAlign: "center" }} colorKey="text_secondary">
        Already have an account?{" "}
        <ThemedText type="link" colorKey="text_secondary">
          <Link href="/(auth)/login">Login</Link>
        </ThemedText>
      </ThemedText>
    </>
  );
}

const styles = StyleSheet.create({
  inputsContainer: {
    width: "90%",
    marginTop: 20,
    gap: 16,
    marginBottom: 20
  }
});
