import { Pressable, PressableProps, StyleProp, StyleSheet, Text, ViewStyle } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColor";
import { ReactNode } from "react";

type ThemedButtonProps = PressableProps & {
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
};

export default function ThemedButton({ style, children, ...rest }: ThemedButtonProps) {
  const colors = useThemeColors()

  return (
    <Pressable
      style={[style, styles.button, { backgroundColor: colors.accent_blue }]}
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