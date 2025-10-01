import { RefreshControl, RefreshControlProps } from "react-native";
import { useThemeColors } from "@/hooks/theme/useThemeColor";


export default function ThemedRefreshControl(props: RefreshControlProps) {
  const colors = useThemeColors();

  return (
    <RefreshControl
      colors={[colors.accent_blue]}
      progressBackgroundColor={colors.background_blue_2}
      tintColor={colors.accent_blue}
      titleColor={colors.text_primary}
      title={"Refreshing..."}
      {...props}
    />
  )
}