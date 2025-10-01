import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/theme/useColorScheme';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ApolloClient, ApolloProvider } from "@apollo/client";
import { AuthContextProvider } from "@/context/AuthContext";
import { View } from "react-native";
import { useThemeColors } from "@/hooks/theme/useThemeColor";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/constants/toastConfig";
import { PreferencesProvider } from "@/context/PreferencesContext";
import { useEffect, useState } from "react";
import createApolloClient from "@/utils/createApolloClient";

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const [client, setClient] = useState<ApolloClient<any> | null>(null)
  const colors = useThemeColors()

  useEffect(() => {
    async function init() {
      setClient(await createApolloClient())
    }

    init()
  }, []);

  if (!client) {
    return null
  }

  return (
    <ApolloProvider client={client}>
      <PreferencesProvider>
        <AuthContextProvider>
          <SafeAreaProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <View style={{ flex: 1, backgroundColor: colors.background_blue_1 }}>
                <Stack>
                  <Stack.Screen name="index" options={{ headerShown: false }}/>
                  <Stack.Screen name="(app)" options={{ headerShown: false }}/>
                  <Stack.Screen name="(auth)" options={{ headerShown: false }}/>
                  <Stack.Screen name="+not-found"/>
                </Stack>
                <StatusBar style="auto"/>
              </View>
              <Toast config={toastConfig} autoHide={true} visibilityTime={5000}/>
            </ThemeProvider>
          </SafeAreaProvider>
        </AuthContextProvider>
      </PreferencesProvider>
    </ApolloProvider>
  );
}
