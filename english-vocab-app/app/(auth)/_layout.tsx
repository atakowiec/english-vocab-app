import { Slot } from 'expo-router';
import React from 'react';

import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback
} from "react-native";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import HeightGap from "@/components/HeightGap";
import Logo from "@/components/Logo";

export default function TabLayout() {
  return (
    <ThemedSafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={[styles.keyboardAvoidingView]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <HeightGap heightPercent={0.15}/>
            <Logo/>
            <HeightGap heightPercent={0.05}/>
            <Slot/>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ThemedSafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
    paddingBottom: 20,
    height: "100%",
    flexDirection: 'column',
    justifyContent: 'center'
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
  },
});