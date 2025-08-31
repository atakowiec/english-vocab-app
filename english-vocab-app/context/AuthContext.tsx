import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { getToken, removeToken, saveToken } from "@/utils/tokenStorage";
import { useRouter } from "expo-router";
import {
  AuthPayload,
  useLoginMutation,
  User,
  useRefreshTokenMutation,
  useRegisterMutation
} from "@/graphql/gql-generated";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContextPayload = {
  accessToken: string | null,
  user: User | null,
  signIn: (email: string, password: string) => Promise<undefined | AuthPayload>,
  signUp: (email: string, name: string, password: string) => Promise<boolean>,
  signOut: () => void,
}

const AuthContext = createContext<AuthContextPayload | null>(null);


export function AuthContextProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [refreshToken] = useRefreshTokenMutation()
  const [register] = useRegisterMutation()
  const [login] = useLoginMutation()

  useEffect(() => {
    // noinspection JSIgnoredPromiseFromCall
    handleRefreshToken()
  }, [])

  useEffect(() => {
    (async () => {
      if (!accessToken) {
        await AsyncStorage.removeItem("access_token")
      } else {
        await AsyncStorage.setItem("access_token", accessToken)
      }
    })()
  }, [accessToken]);

  async function handleRefreshToken() {
    const token = await getToken()

    if (!token) {
      console.log("no token")
      router.replace("/(auth)/login")
      return
    }

    try {

      const refresh = await refreshToken({
        variables: {
          refreshToken: token,
        },
        fetchPolicy: "network-only",
      })
      const data = refresh.data?.refreshToken

      if (!data?.user) {
        console.log("no user")
        await removeToken()
        router.replace("/(auth)/login")
        return
      }

      await saveToken(data.refreshToken)

      setAccessToken(data.accessToken)
      setUser(data.user)

      router.replace('/(app)')
    } catch {
      await removeToken()
      router.replace("/(auth)/login")
    }
  }

  async function signIn(email: string, password: string): Promise<undefined | AuthPayload> {
    const response = await login({
      variables: {
        email,
        password
      }
    })

    const data = response.data?.login

    if (!data?.user) {
      return
    }

    await saveToken(data.refreshToken)
    setAccessToken(data.accessToken)
    setUser(data.user)

    return data
  }

  async function signUp(email: string, name: string, password: string) {
    const response = await register({
      variables: {
        email,
        name,
        password
      }
    })

    return !!response.data
  }

  function signOut() {

  }

  return (
    <AuthContext.Provider value={{
      accessToken,
      user,
      signIn,
      signOut,
      signUp
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextPayload {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }

  return context;
}
