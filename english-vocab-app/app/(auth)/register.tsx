import { StyleSheet, View } from "react-native";
import { Link, useRouter } from "expo-router";
import ThemedInput from "@/components/ThemedInput";
import ThemedButton from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import HeightGap from "@/components/HeightGap";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ApolloError } from "@apollo/client";
import { GraphQLFormattedError } from "@/app";

export default function RegisterScreen() {
  const [errors, setErrors] = useState<Errors>({})
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [username, setUsername] = useState("");
  const auth = useAuth();
  const router = useRouter();

  async function handleRegister() {
    const newErrors: Errors = {}
    if (!username) {
      newErrors.name = "Username is required"
    }
    if (!email) {
      newErrors.email = "Email is required"
    }

    if (username.length < 3) {
      newErrors.name = "Username must be at least 3 characters long"
    }
    if (email && !email.includes("@")) {
      newErrors.email = "Invalid email address"
    }
    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long"
    }
    if (password !== passwordConfirmation) {
      newErrors.confirm = "Passwords do not match"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return;
    }

    try {
      const registered = await auth.signUp(email, username, password);
      if (!registered) {
        setErrors({ general: "Unexpected error occurred. Please try again later." })
        return;
      }

      await auth.signIn(email, password)
    } catch (error) {
      if (error instanceof ApolloError) {
        const errors = error.graphQLErrors[0] as GraphQLFormattedError
        setErrors(errors.extensions?.errors ?? {})
      } else {
        console.log(error)
        setErrors({ general: "Unexpected error occurred. Please try again later." })
      }
      return
    }

    // here the user is signed up and logged in
    router.replace("/(app)")
  }

  return (
    <>
      <ThemedText type="subtitle">Create new account</ThemedText>
      <View style={styles.inputsContainer}>
        <ThemedInput placeholder="Username"
                     autoCapitalize="none"
                     style={[styles.input, errors.name && styles.errorInput]}
                     value={username}
                     onChangeText={setUsername}
                     autoCorrect={false}/>
        <ThemedText style={[styles.error, { display: errors.name ? "flex" : "none" }]}>
          {errors.name}
        </ThemedText>
        <ThemedInput placeholder="Email"
                     autoCapitalize="none"
                     keyboardType="email-address"
                     style={[styles.input, errors.email && styles.errorInput]}
                     value={email}
                     onChangeText={setEmail}
                     autoCorrect={false}/>
        <ThemedText style={[styles.error, { display: errors.email ? "flex" : "none" }]}>
          {errors.email}
        </ThemedText>
        <ThemedInput placeholder="Password"
                     style={[styles.input, errors.password && styles.errorInput]}
                     value={password}
                     autoCapitalize="none"
                     onChangeText={setPassword}
                     secureTextEntry/>
        <ThemedText style={[styles.error, { display: errors.password ? "flex" : "none" }]}>
          {errors.password}
        </ThemedText>
        <ThemedInput placeholder="Password confirmation"
                     style={[styles.input, errors.confirm && styles.errorInput]}
                     value={passwordConfirmation}
                     autoCapitalize="none"
                     onChangeText={setPasswordConfirmation}
                     secureTextEntry/>
        <ThemedText style={[styles.error, { display: errors.confirm ? "flex" : "none" }]}>
          {errors.confirm}
        </ThemedText>
      </View>
      <ThemedText style={[styles.generalError, { display: errors.general ? "flex" : "none" }]}>
        {errors.general}
      </ThemedText>
      <ThemedButton onPress={handleRegister}>
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

export const styles = StyleSheet.create({
  inputsContainer: {
    width: "90%",
    marginTop: 20,
    marginBottom: 20
  },
  input: {
    marginTop: 10
  },
  errorInput: {
    borderColor: "#770000",
    borderWidth: 1,
  },
  error: {
    color: "red",
    fontSize: 14,
    marginTop: 4,
    opacity: .8,
    paddingLeft: 10
  },
  generalError: {
    color: "red",
    fontSize: 14,
    marginBottom: 16,
    opacity: .8,
    paddingLeft: 10
  }
});

type Errors = {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
  general?: string;
}
