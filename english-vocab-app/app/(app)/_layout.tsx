import React from 'react';
import { ThemedSafeAreaView } from "@/components/theme/ThemedSafeAreaView";
import { Slot } from "expo-router";
import AppContextProvider from "@/context/AppContext";


export default function TabLayout() {
  return (
    <AppContextProvider>
      <ThemedSafeAreaView style={{ flex: 1 }}>
        <Slot/>
      </ThemedSafeAreaView>
    </AppContextProvider>
  );
}