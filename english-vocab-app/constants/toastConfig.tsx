import React from "react";
import { View } from "react-native";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import { ToastConfig, ToastConfigParams } from "react-native-toast-message";
import { ThemedText } from "@/components/theme/ThemedText";
import FontAwesome from "@expo/vector-icons/FontAwesome"; // you can use your theme system

export const toastConfig: ToastConfig = {
  success: Alert,
  error: Alert,
  info: Alert,
};

function Alert({ text1, text2, type }: ToastConfigParams<any>) {
  const colors = useThemeColors();

  const color: string = {
    "success": colors.green,
    "error": colors.red,
    "info": colors.background_blue_3,
  }[type as "success" | "error" | "info"]

  const icon: any = {
    "success": "check",
    "error": "close",
    "info": "info",
  }[type as "success" | "error" | "info"]

  return (
    <View style={{
      width: "100%",
      paddingHorizontal: 10
    }}>
      <View
        style={{
          padding: 20,
          backgroundColor: color,
          borderRadius: 15,
          flexDirection: "row",
          alignItems: "center",
          gap: 20,
        }}
      >
        <FontAwesome name={icon} size={24} color={"white"}/>
        <View>
          <ThemedText type={"defaultSemiBold"}>
            {text1}
          </ThemedText>
          {text2 && (
            <ThemedText type={"small"}>
              {text2}
            </ThemedText>
          )}
        </View>
      </View>
    </View>
  )
}