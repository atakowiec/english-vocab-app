import { createContext, ReactNode, useContext } from "react";
import { useAuth } from "@/context/AuthContext";

type AppContextType = {
  refreshUserData: () => Promise<void>
}

const AppContext = createContext<null | AppContextType>(null);

export default function AppContextProvider({ children }: { children: ReactNode }) {
  const { refreshUserData } = useAuth()

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