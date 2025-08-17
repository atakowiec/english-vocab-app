import { StyleSheet, View, ViewProps } from "react-native";
import { ReactNode } from "react";
import { useThemeColors } from "@/hooks/useThemeColor";

type Props = {
  children: ReactNode;
} & ViewProps

export default function SectionBox({ children, style, ...rest }: Props) {
  const colors = useThemeColors();

  return (
    <View style={[styles.sectionBox, { backgroundColor: colors.background_blue_2 }, style]}
          {...rest}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  sectionBox: {
    padding: 20,
    borderRadius: 20,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  }
})