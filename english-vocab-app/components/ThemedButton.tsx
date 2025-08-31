import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { useThemeColors } from "@/hooks/useThemeColor";
import { ReactNode } from "react";

type ThemedButtonProps = TouchableOpacityProps & {
  children: ReactNode;
  type?: "primary" | "secondary";
};

export default function ThemedButton({ style, children, type = "primary", ...rest }: ThemedButtonProps) {
  const colors = useThemeColors()

  const backgroundColor = type === "primary" ? colors.accent_blue : colors.background_blue_2;

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }, style]}
      {...rest}
      activeOpacity={0.8}
    >
      {typeof children === "string" ? (
        <Text style={styles.buttonText}>
          {children}
        </Text>) : children}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 30,
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 20,
  },
  buttonText: {
    color: "#fff",
  }
})