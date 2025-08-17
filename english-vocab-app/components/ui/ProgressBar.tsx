import React from "react";
import { StyleSheet, View } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColor";

type ProgressBarProps = {
  progress: number; // between 0 and 1
  height?: number;
  backgroundColor?: string;
  fillColor?: string;
  borderRadius?: number;
};

export default function ProgressBar({
                                      progress,
                                      height = 12,
                                      backgroundColor = "#e0e0e0",
                                      fillColor = undefined,
                                      borderRadius = 8,
                                    }: ProgressBarProps) {
  const colors = useThemeColors();
  fillColor = fillColor ?? colors.accent_blue;

  return (
    <View
      style={[
        styles.container,
        { height, backgroundColor, borderRadius },
      ]}
    >
      <View
        style={{
          width: `${Math.min(Math.max(progress, 0), 1) * 100}%`,
          backgroundColor: fillColor,
          borderRadius,
          height: "100%",
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    overflow: "hidden",
  },
});
