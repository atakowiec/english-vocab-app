import { createContext, ReactNode, useContext } from "react";

type AppContextType = {
  // here will be sth
}

const AppContext = createContext<null | AppContextType>(null);

export default function AppContextProvider({ children }: { children: ReactNode }) {
  return (
    <AppContext.Provider value={{
      // add
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