import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { AuthContextProvider } from "@/context/AuthContext";

const client = new ApolloClient({
  uri: 'http://192.168.1.11:3000/graphql',
  cache: new InMemoryCache()
});

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ApolloProvider client={client}>
      <AuthContextProvider>
        <SafeAreaProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }}/>
              <Stack.Screen name="(app)" options={{ headerShown: false }}/>
              <Stack.Screen name="(auth)" options={{ headerShown: false }}/>
              <Stack.Screen name="+not-found"/>
            </Stack>
            <StatusBar style="auto"/>
          </ThemeProvider>
        </SafeAreaProvider>
      </AuthContextProvider>
    </ApolloProvider>
  );
}
