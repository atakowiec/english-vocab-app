import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColors } from '@/hooks/theme/useThemeColor';
import { ThemeColors } from "@/constants/Colors";

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'small';
  colorKey?: keyof ThemeColors;
};

export function ThemedText({style, colorKey = "text_primary", type = 'default', ...rest}: ThemedTextProps) {
  const color = useThemeColors()[colorKey];

  return (
    <Text
      style={[
        { color },
        type === 'small' ? styles.small : undefined,
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  small: {
    fontSize: 13,
  },
  default: {
    fontSize: 16,
  },
  defaultSemiBold: {
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
