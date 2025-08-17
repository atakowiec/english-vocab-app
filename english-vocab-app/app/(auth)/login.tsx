import { StyleSheet, View } from "react-native";
import { Link } from "expo-router";
import ThemedInput from "@/components/ThemedInput";
import ThemedButton from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import HeightGap from "@/components/HeightGap";

export default function LoginScreen() {
  return (
    <>
      <ThemedText type="subtitle">Login to your account</ThemedText>

      <View style={styles.inputsContainer}>
        <ThemedInput placeholder="Email" autoCapitalize="none" keyboardType="email-address" autoCorrect={false}/>
        <ThemedInput placeholder="Password" secureTextEntry/>
      </View>
      <ThemedButton>Login</ThemedButton>

      <HeightGap heightPercent={0.05}/>

      <ThemedText type="default" style={{ textAlign: "center" }} colorKey="text_secondary">
        Don&#39;t have an account?{" "}
        <ThemedText type="link" colorKey="text_secondary">
          <Link href="/(auth)/register">Sign up</Link>
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
