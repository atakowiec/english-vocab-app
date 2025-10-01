import { create } from "zustand";
import { GetUserDataQuery } from "@/graphql/gql-generated";

type FetchedData = GetUserDataQuery["getUserData"]
type UserDataStore = FetchedData & {
  // here I will add methods
}

export const useUserDataStore = create<UserDataStore>(set => ({
  streak: 0,
  speedModeProgress: {
    streak: 0,
    correctAnswers: 0,
    allAnswers: 0
  },
  expData: {
    level: -1,
    requiredExp: 0,
    currentExp: 0
  }
}))