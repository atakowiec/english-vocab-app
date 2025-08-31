import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type PreferencesContextType = {
  getPreference: <T>(key: string, defaultValue?: T) => T;
  setPreference: (key: string, value: any) => void;
  removePreference: (key: string) => void;
};

const PreferencesContext = createContext<PreferencesContextType | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    AsyncStorage.getItem("preferences")
      .then((item) => {
        setPreferences(item ? JSON.parse(item) : {});
      })
  }, []);

  function setPreference(key: string, value: any) {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));

    AsyncStorage.setItem("preferences", JSON.stringify(preferences))
      .catch(console.error);
  }

  function removePreference(key: string) {
    setPreferences((prev) => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });

    AsyncStorage.setItem("preferences", JSON.stringify(preferences))
      .catch(console.error);
  }

  function getPreference<T>(key: string, defaultValue?: T): T {
    return preferences[key] as T || defaultValue as T;
  }

  return <PreferencesContext.Provider value={{
    removePreference,
    setPreference,
    getPreference
  }}>
    {children}
  </PreferencesContext.Provider>
}

export function usePreferences(): PreferencesContextType {
  const context = useContext(PreferencesContext) as PreferencesContextType
  if (!context) {
    throw new Error("usePreferences must be used within a PreferencesProvider")
  }

  return context;
}