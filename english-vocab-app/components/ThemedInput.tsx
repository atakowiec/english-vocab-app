import { StyleSheet, TextInput } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColor";
import { TextInputProps } from "react-native/Libraries/Components/TextInput/TextInput";

export default function ThemedInput({style, ...rest}: TextInputProps) {
  const colors = useThemeColors()

  return (
    <TextInput
      placeholderTextColor={colors.text_secondary}
      style={[style, styles.input, {backgroundColor: colors.background_blue_3}]}
      {...rest}
    />
  )
}

const styles = StyleSheet.create({
  input: {
    color: "#fff",
    paddingHorizontal: 30,
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 20,
    fontSize: 18,
  }
})