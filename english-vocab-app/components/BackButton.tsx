import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, TouchableOpacity } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColor";
import { useNavigation } from "expo-router";

export default function BackButton() {
  const colors = useThemeColors()
  const navigation = useNavigation()

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors.background_blue_2 }]}
      activeOpacity={0.6}
      onPress={() => navigation.goBack()}
    >
      <Ionicons name="arrow-back" size={24} color="white"/>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  }
})
