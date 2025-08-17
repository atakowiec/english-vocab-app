import { Pressable, PressableProps, StyleProp, StyleSheet, Text, ViewStyle } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColor";
import { ReactNode } from "react";

type ThemedButtonProps = PressableProps & {
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
  type: "primary" | "secondary";
};

export default function ThemedButton({ style, children, type, ...rest }: ThemedButtonProps) {
  const colors = useThemeColors()

  const backgroundColor = type === "primary" ? colors.accent_blue : colors.background_blue_2;

  return (
    <Pressable
      style={[styles.button, { backgroundColor }, style]}
      {...rest}
    >
      {typeof children === "string" ? (
        <Text style={styles.buttonText}>
          {children}
        </Text>) : children}
    </Pressable>
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