import { View } from "react-native";
import { Link, useRouter } from "expo-router";
import ThemedInput from "@/components/ThemedInput";
import ThemedButton from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import HeightGap from "@/components/HeightGap";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ApolloError } from "@apollo/client";
import { GraphQLFormattedError } from "@/app";
import { styles } from "@/app/(auth)/register";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const auth = useAuth();
  const router = useRouter();

  async function handleLogin() {
    const newErrors: Errors = {}
    if (!email) {
      newErrors.name = "Username is required"
    }
    if (!password) {
      newErrors.password = "Password is required"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return;
    }

    try {
      await auth.signIn(email, password)
      router.replace("/(app)")
    } catch (error) {
      if (error instanceof ApolloError) {
        const errors = error.graphQLErrors[0] as GraphQLFormattedError
        setErrors(errors.extensions?.errors ?? {})
      } else {
        setErrors({ general: "Unexpected error occurred. Please try again later." })
      }
      return
    }
  }

  return (
    <>
      <ThemedText type="subtitle">Login to your account</ThemedText>

      <View style={styles.inputsContainer}>
        <ThemedInput placeholder="Email"
                     autoCapitalize="none"
                     keyboardType="email-address"
                     style={[styles.input, errors.name && styles.errorInput]}
                     autoCorrect={false}
                     value={email}
                     onChangeText={setEmail}/>
        <ThemedText style={[styles.error, { display: errors.name ? "flex" : "none" }]}>
          {errors.name}
        </ThemedText>
        <ThemedInput placeholder="Password"
                     secureTextEntry
                     autoCapitalize="none"
                     style={[styles.input, errors.name && styles.errorInput]}
                     value={password}
                     onChangeText={setPassword}/>
        <ThemedText style={[styles.error, { display: errors.password ? "flex" : "none" }]}>
          {errors.password}
        </ThemedText>
      </View>
      <ThemedText style={[styles.generalError, { display: errors.general ? "flex" : "none" }]}>
        {errors.general}
      </ThemedText>
      <ThemedButton onPress={handleLogin}>Login</ThemedButton>

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

type Errors = {
  name?: string;
  password?: string;
  general?: string;
}
