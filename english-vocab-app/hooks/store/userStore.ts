import { create } from "zustand";
import { User } from "@/graphql/gql-generated";

type UserStore = {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserStore>(set => ({
  user: null,
  setUser: (user) => set({ user })
}))