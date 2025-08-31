import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from "@apollo/client";
import { AuthContextProvider } from "@/context/AuthContext";
import { PreferencesProvider } from "@/context/PreferencesContext";
import { View } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColor";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: 'http://192.168.1.11:3000/graphql',
});

const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem('access_token');

  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const colors = useThemeColors()

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
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
                  <Stack.Screen name="(modes)" options={{ headerShown: false }}/>
                  <Stack.Screen name="(auth)" options={{ headerShown: false }}/>
                  <Stack.Screen name="+not-found"/>
                </Stack>
                <StatusBar style="auto"/>
              </View>
            </ThemeProvider>
          </SafeAreaProvider>
        </AuthContextProvider>
      </PreferencesProvider>
    </ApolloProvider>
  );
}
