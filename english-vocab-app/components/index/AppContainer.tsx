import { ReactNode } from "react";
import { ThemedView } from "@/components/theme/ThemedView";
import { ScrollView, StyleSheet, View } from "react-native";
import { ScrollViewProps } from "react-native/Libraries/Components/ScrollView/ScrollView";

type Props = {
  children: ReactNode;
} & ScrollViewProps;

export default function AppContainer({ children, refreshControl, contentContainerStyle }: Props) {
  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView style={{ marginBottom: 20 }}
                  contentContainerStyle={contentContainerStyle}
                  refreshControl={refreshControl}>
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