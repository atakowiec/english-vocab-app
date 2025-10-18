import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, } from "react-native";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { ReactNode } from "react";

type ThemedButtonProps = TouchableOpacityProps & {
  children: ReactNode;
  type?: "primary" | "secondary";
  size?: "small" | "medium" | "large";
};

export default function ThemedButton({
                                       style,
                                       children,
                                       type = "primary",
                                       size = "large",
                                       ...rest
                                     }: ThemedButtonProps) {
  const colors = useThemeColors()

  const backgroundColor = type === "primary" ? colors.accent_blue : colors.background_blue_2;

  return (
    <TouchableOpacity
      style={[styles.button, styles[size], { backgroundColor }, style]}
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
    borderRadius: 20,
  },
  small: {
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  medium: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  large: {
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  buttonText: {
    color: "#fff",
  }
})