import React from 'react';
import AppTabBar from "@/components/ui/AppTabBar";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <ThemedSafeAreaView style={{ flex: 1 }}>
      <Tabs tabBar={(props) => <AppTabBar {...props} />} screenOptions={{ headerShown: false }}>
        <Tabs.Screen name="index" options={{ title: "Home" }}/>
        <Tabs.Screen name="mode-selector" options={{ title: "Mode" }}/>
        <Tabs.Screen name="profile" options={{ title: "Profile" }}/>
      </Tabs>
    </ThemedSafeAreaView>
  );
}