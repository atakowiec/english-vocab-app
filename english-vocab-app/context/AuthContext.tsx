import { createContext, ReactNode, useContext, useEffect, useRef } from "react";
import { getToken, removeToken, saveToken } from "@/utils/tokenStorage";
import { useRouter } from "expo-router";
import {
  AuthPayload, useGetUserDataLazyQuery,
  useLoginMutation,
  User,
  useRefreshTokenLazyQuery,
  useRegisterMutation
} from "@/graphql/gql-generated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserStore } from "@/hooks/store/userStore";
import { useUserDataStore } from "@/hooks/store/userDataStore";

type AuthContextPayload = {
  accessToken: string | null,
  user: User | null,
  signIn: (email: string, password: string) => Promise<undefined | AuthPayload>,
  signUp: (email: string, name: string, password: string) => Promise<boolean>,
  signOut: () => void,
  refreshUserData: () => Promise<void>,
}

const AuthContext = createContext<AuthContextPayload | null>(null);

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const {user, setUser} = useUserStore()
  const accessToken = useRef<string | null>(null)
  const [refreshToken] = useRefreshTokenLazyQuery()
  const [register] = useRegisterMutation()
  const [login] = useLoginMutation()
  const userDataStore = useUserDataStore()
  const [fetchUserData] = useGetUserDataLazyQuery({fetchPolicy: "network-only"})

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

  async function refreshUserData() {
    const data = await fetchUserData();

    if (data.error)
      throw new Error(data.error.message)

    if (!data.data?.getUserData)
      throw new Error("User data not found")

    userDataStore.set({
      ...data.data.getUserData,
      loaded: true
    })
  }

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
      await refreshUserData();

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
    await refreshUserData();

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
      refreshUserData
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
