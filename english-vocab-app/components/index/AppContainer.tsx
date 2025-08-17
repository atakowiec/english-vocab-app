import { ReactNode } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ScrollView, View, StyleSheet } from "react-native";

export default function AppContainer({ children }: { children: ReactNode }) {
  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView style={{marginBottom: 20}}>
        <View style={styles.container}>
          {children}
        </View>
      </ScrollView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 50,
    padding: 10,
  }
})