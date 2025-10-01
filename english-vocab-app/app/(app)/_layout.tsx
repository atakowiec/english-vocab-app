import React from 'react';
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { Slot } from "expo-router";


export default function TabLayout() {
  return (
    <ThemedSafeAreaView style={{ flex: 1 }}>
      <Slot/>
    </ThemedSafeAreaView>
  );
}