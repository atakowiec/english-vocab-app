import { Colors, ThemeColors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/theme/useColorScheme';

export function useThemeColors(): ThemeColors {
  const colorScheme = useColorScheme();
  return Colors[colorScheme ?? 'light'];
}

