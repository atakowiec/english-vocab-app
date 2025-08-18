import { StyleSheet, TextInput,TextInputProps } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColor";
import { Ref } from "react";

type ThemedInputProps = TextInputProps & {
  ref?: Ref<TextInput>
}

export default function ThemedInput({style, ref, ...rest}: ThemedInputProps) {
  const colors = useThemeColors()

  return (
    <TextInput
      placeholderTextColor={colors.text_secondary}
      ref={ref}
      style={[styles.input, {backgroundColor: colors.background_blue_3}, style]}
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