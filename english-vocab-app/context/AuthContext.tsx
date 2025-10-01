import { createContext, ReactNode, useContext, useEffect, useRef } from "react";
import { getToken, removeToken, saveToken } from "@/utils/tokenStorage";
import { useRouter } from "expo-router";
import {
  AuthPayload,
  useLoginMutation,
  User,
  useRefreshTokenLazyQuery,
  useRegisterMutation
} from "@/graphql/gql-generated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserStore } from "@/hooks/store/userStore";

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
  const {user, setUser} = useUserStore()
  const accessToken = useRef<string | null>(null)
  const [refreshToken] = useRefreshTokenLazyQuery()
  const [register] = useRegisterMutation()
  const [login] = useLoginMutation()

  useEffect(() => {
    // noinspection JSIgnoredPromiseFromCall
    handleRefreshToken()
  }, [])

  useEffect(() => {
    (async () => {
      if (!accessToken.current) {
        await AsyncStorage.removeItem("access_token")
      } else {
        await AsyncStorage.setItem("access_token", accessToken.current)
      }
    })()
  }, [accessToken]);

  async function handleRefreshToken() {
    const token = await getToken()

    if (!token) {
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
        await removeToken()
        router.replace("/(auth)/login")
        return
      }

      await updateState(data)

      router.replace('/(app)/tabs')
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

    const data: AuthPayload | undefined = response.data?.login

    if (!data?.user) {
      return
    }

    await updateState(data)

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

  async function signOut() {
    await updateState()
    router.replace("/(auth)/login")
  }

  async function updateState(data: AuthPayload | null = null) {
    if (!data?.user) {
      await removeToken()
      accessToken.current = null
      setUser(null)
      return
    }

    await AsyncStorage.setItem("access_token", data.accessToken)
    await saveToken(data.refreshToken)
    accessToken.current = data.accessToken
    setUser(data.user)
  }

  return (
    <AuthContext.Provider value={{
      accessToken: accessToken.current,
      user,
      signIn,
      signOut,
      signUp,
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
