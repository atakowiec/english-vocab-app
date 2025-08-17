import { ThemedView } from '@/components/ThemedView';
import { Redirect } from "expo-router";

export default function HomeScreen() {
  return (
    <ThemedView>
      <Redirect href="/(auth)/login" />
    </ThemedView>
  );
}
