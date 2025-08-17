import { View, type ViewProps } from 'react-native';

import { useThemeColors } from '@/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  colorKey?: keyof ReturnType<typeof useThemeColors>;
};

export function ThemedView({ style, colorKey, ...otherProps }: ThemedViewProps) {
  const colors = useThemeColors();
  const backgroundColor = colors[colorKey ?? "background_blue_1"];

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
