import {createContext, ReactNode, useContext, useState} from "react";
import {useAuth} from "@/context/AuthContext";
import LoadingModal from "@/components/LoadingModal";

type AppContextType = {
  refreshUserData: () => Promise<void>,
  setLoadingVisible: (visible: boolean) => void
}

const AppContext = createContext<null | AppContextType>(null);

export default function AppContextProvider({children}: { children: ReactNode }) {
  const [loadingVisible, setLoadingVisible] = useState<boolean>(false)
  const {refreshUserData} = useAuth()

  return (
    <AppContext.Provider value={{
      refreshUserData,
      setLoadingVisible
    }}>
      {children}
      {loadingVisible && <LoadingModal/>}
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