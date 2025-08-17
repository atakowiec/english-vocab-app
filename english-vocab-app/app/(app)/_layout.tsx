import React from 'react';
import AppTabBar from "@/components/ui/AppTabBar";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { Tabs ,withLayoutContext } from "expo-router";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const { Navigator } = createMaterialTopTabNavigator();
const TopTabs = withLayoutContext(Navigator);

export default function TabLayout() {
  return (
    <ThemedSafeAreaView style={{ flex: 1 }}>
      <TopTabs tabBar={(props) => <AppTabBar {...props} />} screenOptions={{
        swipeEnabled: true,
      }}>
        <Tabs.Screen name="index" options={{ title: "Home" }}/>
        <Tabs.Screen name="mode-selector" options={{ title: "Mode" }}/>
        <Tabs.Screen name="profile" options={{ title: "Profile" }}/>
      </TopTabs>
    </ThemedSafeAreaView>
  );
}