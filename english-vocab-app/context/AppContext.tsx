import { createContext, ReactNode, useContext } from "react";
import { useUserDataStore } from "@/hooks/store/userDataStore";
import { useGetUserDataLazyQuery } from "@/graphql/gql-generated";

type AppContextType = {
  refreshUserData: () => Promise<void>
}

const AppContext = createContext<null | AppContextType>(null);

export default function AppContextProvider({ children }: { children: ReactNode }) {
  const userDataStore = useUserDataStore()
  const [fetchUserData] = useGetUserDataLazyQuery({fetchPolicy: "network-only"})

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

  return (
    <AppContext.Provider value={{
      refreshUserData
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }

  return context;
}