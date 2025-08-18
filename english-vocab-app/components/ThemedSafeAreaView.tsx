import { type ViewProps } from 'react-native';

import { useThemeColors } from '@/hooks/useThemeColor';
import { SafeAreaView } from "react-native-safe-area-context";

export type ThemedViewProps = ViewProps & {
  colorKey?: keyof ReturnType<typeof useThemeColors>;
};

export function ThemedSafeAreaView({ style, colorKey, ...otherProps }: ThemedViewProps) {
  const colors = useThemeColors();
  const backgroundColor = colors[colorKey ?? "background_blue_1"];

  return <SafeAreaView style={[{ backgroundColor, flex: 1 }, style]} {...otherProps} />;
}
