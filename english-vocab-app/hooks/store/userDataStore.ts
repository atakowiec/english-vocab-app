import { create } from "zustand";
import { GetUserDataQuery } from "@/graphql/gql-generated";

type FetchedData = GetUserDataQuery["getUserData"]
type UserDataStore = FetchedData & {
  loaded: boolean;
  set: (data: Partial<UserDataStore>) => void;
}

export const useUserDataStore = create<UserDataStore>(set => ({
  loaded: false,
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
  },
  learningStats: {
    learnedToday: 0,
    learnedThisWeek: 0,
    learnedThisMonth: 0,
    learnedThisYear: 0
  },
  lastPlayedMode: null,
  set
}))