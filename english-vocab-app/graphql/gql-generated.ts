import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
  user: User;
};

export type ExpDataDto = {
  __typename?: 'ExpDataDto';
  currentExp: Scalars['Float']['output'];
  level: Scalars['Float']['output'];
  requiredExp: Scalars['Float']['output'];
};

export type GameWord = {
  __typename?: 'GameWord';
  similarEnWords: Array<Scalars['String']['output']>;
  similarPlWords: Array<Scalars['String']['output']>;
  word: WordEntity;
  wordLearnStatus: WordLearnStatusDto;
};

export type GivenAnswerInput = {
  correct: Scalars['Boolean']['input'];
  date: Scalars['DateTime']['input'];
  learnMode: Scalars['String']['input'];
  word_id: Scalars['Float']['input'];
};

export type LearningStatsDto = {
  __typename?: 'LearningStatsDto';
  learnedThisMonth: Scalars['Float']['output'];
  learnedThisWeek: Scalars['Float']['output'];
  learnedThisYear: Scalars['Float']['output'];
  learnedToday: Scalars['Float']['output'];
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type ModeProgressDto = {
  __typename?: 'ModeProgressDto';
  allAnswers: Scalars['Float']['output'];
  correctAnswers: Scalars['Float']['output'];
  streak: Scalars['Float']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  login: AuthPayload;
  register: Scalars['Boolean']['output'];
  saveAnswers: Scalars['Boolean']['output'];
  saveWordReport: Scalars['Boolean']['output'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationSaveAnswersArgs = {
  input: Array<GivenAnswerInput>;
};


export type MutationSaveWordReportArgs = {
  reason: Scalars['String']['input'];
  wordId: Scalars['Float']['input'];
};

export type Query = {
  __typename?: 'Query';
  getNextWords: Array<GameWord>;
  getUserData: UserDataDto;
  hello: Scalars['String']['output'];
  refreshToken: AuthPayload;
  wordOfTheDay: WordEntity;
};


export type QueryGetNextWordsArgs = {
  mode: Scalars['String']['input'];
};


export type QueryRefreshTokenArgs = {
  refreshToken: Scalars['String']['input'];
};

export type RegisterInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type UserDataDto = {
  __typename?: 'UserDataDto';
  expData: ExpDataDto;
  lastPlayedMode?: Maybe<Scalars['String']['output']>;
  learningStats: LearningStatsDto;
  speedModeProgress: ModeProgressDto;
  streak: Scalars['Float']['output'];
  userId: Scalars['Float']['output'];
};

export type WordEntity = {
  __typename?: 'WordEntity';
  base_word_en?: Maybe<Scalars['String']['output']>;
  definition_en?: Maybe<Scalars['String']['output']>;
  examples: Array<Scalars['String']['output']>;
  id: Scalars['Float']['output'];
  other_forms: Array<Scalars['String']['output']>;
  tags: Array<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  word_en: Scalars['String']['output'];
  word_pl: Scalars['String']['output'];
};

export type WordLearnStatusDto = {
  __typename?: 'WordLearnStatusDto';
  allAnswers: Scalars['Float']['output'];
  correctAnswers: Scalars['Float']['output'];
  incorrectAnswers: Scalars['Float']['output'];
};

export type RefreshTokenQueryVariables = Exact<{
  refreshToken: Scalars['String']['input'];
}>;


export type RefreshTokenQuery = { __typename?: 'Query', refreshToken: { __typename?: 'AuthPayload', accessToken: string, refreshToken: string, user: { __typename?: 'User', id: number, name: string, email: string } } };

export type RegisterMutationVariables = Exact<{
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: boolean };

export type LoginMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthPayload', accessToken: string, refreshToken: string, user: { __typename?: 'User', email: string, name: string, id: number } } };

export type GetUserDataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserDataQuery = { __typename?: 'Query', getUserData: { __typename?: 'UserDataDto', lastPlayedMode?: string | null, streak: number, expData: { __typename?: 'ExpDataDto', level: number, currentExp: number, requiredExp: number }, learningStats: { __typename?: 'LearningStatsDto', learnedThisYear: number, learnedThisMonth: number, learnedThisWeek: number, learnedToday: number }, speedModeProgress: { __typename?: 'ModeProgressDto', streak: number, correctAnswers: number, allAnswers: number } } };

export type SaveAnswersMutationVariables = Exact<{
  input: Array<GivenAnswerInput> | GivenAnswerInput;
}>;


export type SaveAnswersMutation = { __typename?: 'Mutation', saveAnswers: boolean };

export type GetNextWordsQueryVariables = Exact<{
  mode: Scalars['String']['input'];
}>;


export type GetNextWordsQuery = { __typename?: 'Query', getNextWords: Array<{ __typename?: 'GameWord', similarEnWords: Array<string>, similarPlWords: Array<string>, word: { __typename?: 'WordEntity', id: number, definition_en?: string | null, word_en: string, word_pl: string, examples: Array<string>, type?: string | null, base_word_en?: string | null, other_forms: Array<string>, tags: Array<string> }, wordLearnStatus: { __typename?: 'WordLearnStatusDto', allAnswers: number, correctAnswers: number, incorrectAnswers: number } }> };

export type WordOfTheDayQueryVariables = Exact<{ [key: string]: never; }>;


export type WordOfTheDayQuery = { __typename?: 'Query', wordOfTheDay: { __typename?: 'WordEntity', word_en: string, word_pl: string, type?: string | null, definition_en?: string | null, examples: Array<string> } };

export type ReportWordMutationVariables = Exact<{
  wordId: Scalars['Float']['input'];
  reason: Scalars['String']['input'];
}>;


export type ReportWordMutation = { __typename?: 'Mutation', saveWordReport: boolean };


export const RefreshTokenDocument = gql`
    query RefreshToken($refreshToken: String!) {
  refreshToken(refreshToken: $refreshToken) {
    accessToken
    refreshToken
    user {
      id
      name
      email
    }
  }
}
    `;

/**
 * __useRefreshTokenQuery__
 *
 * To run a query within a React component, call `useRefreshTokenQuery` and pass it any options that fit your needs.
 * When your component renders, `useRefreshTokenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRefreshTokenQuery({
 *   variables: {
 *      refreshToken: // value for 'refreshToken'
 *   },
 * });
 */
export function useRefreshTokenQuery(baseOptions: Apollo.QueryHookOptions<RefreshTokenQuery, RefreshTokenQueryVariables> & ({ variables: RefreshTokenQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RefreshTokenQuery, RefreshTokenQueryVariables>(RefreshTokenDocument, options);
      }
export function useRefreshTokenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RefreshTokenQuery, RefreshTokenQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RefreshTokenQuery, RefreshTokenQueryVariables>(RefreshTokenDocument, options);
        }
export function useRefreshTokenSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<RefreshTokenQuery, RefreshTokenQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<RefreshTokenQuery, RefreshTokenQueryVariables>(RefreshTokenDocument, options);
        }
export type RefreshTokenQueryHookResult = ReturnType<typeof useRefreshTokenQuery>;
export type RefreshTokenLazyQueryHookResult = ReturnType<typeof useRefreshTokenLazyQuery>;
export type RefreshTokenSuspenseQueryHookResult = ReturnType<typeof useRefreshTokenSuspenseQuery>;
export type RefreshTokenQueryResult = Apollo.QueryResult<RefreshTokenQuery, RefreshTokenQueryVariables>;
export const RegisterDocument = gql`
    mutation Register($email: String!, $name: String!, $password: String!) {
  register(input: {email: $email, name: $name, password: $password})
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      email: // value for 'email'
 *      name: // value for 'name'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(input: {email: $email, password: $password}) {
    user {
      email
      name
      id
    }
    accessToken
    refreshToken
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const GetUserDataDocument = gql`
    query GetUserData {
  getUserData {
    expData {
      level
      currentExp
      requiredExp
    }
    lastPlayedMode
    learningStats {
      learnedThisYear
      learnedThisMonth
      learnedThisWeek
      learnedToday
    }
    streak
    speedModeProgress {
      streak
      correctAnswers
      allAnswers
    }
  }
}
    `;

/**
 * __useGetUserDataQuery__
 *
 * To run a query within a React component, call `useGetUserDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserDataQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserDataQuery(baseOptions?: Apollo.QueryHookOptions<GetUserDataQuery, GetUserDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserDataQuery, GetUserDataQueryVariables>(GetUserDataDocument, options);
      }
export function useGetUserDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserDataQuery, GetUserDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserDataQuery, GetUserDataQueryVariables>(GetUserDataDocument, options);
        }
export function useGetUserDataSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserDataQuery, GetUserDataQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserDataQuery, GetUserDataQueryVariables>(GetUserDataDocument, options);
        }
export type GetUserDataQueryHookResult = ReturnType<typeof useGetUserDataQuery>;
export type GetUserDataLazyQueryHookResult = ReturnType<typeof useGetUserDataLazyQuery>;
export type GetUserDataSuspenseQueryHookResult = ReturnType<typeof useGetUserDataSuspenseQuery>;
export type GetUserDataQueryResult = Apollo.QueryResult<GetUserDataQuery, GetUserDataQueryVariables>;
export const SaveAnswersDocument = gql`
    mutation saveAnswers($input: [GivenAnswerInput!]!) {
  saveAnswers(input: $input)
}
    `;
export type SaveAnswersMutationFn = Apollo.MutationFunction<SaveAnswersMutation, SaveAnswersMutationVariables>;

/**
 * __useSaveAnswersMutation__
 *
 * To run a mutation, you first call `useSaveAnswersMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSaveAnswersMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [saveAnswersMutation, { data, loading, error }] = useSaveAnswersMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSaveAnswersMutation(baseOptions?: Apollo.MutationHookOptions<SaveAnswersMutation, SaveAnswersMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SaveAnswersMutation, SaveAnswersMutationVariables>(SaveAnswersDocument, options);
      }
export type SaveAnswersMutationHookResult = ReturnType<typeof useSaveAnswersMutation>;
export type SaveAnswersMutationResult = Apollo.MutationResult<SaveAnswersMutation>;
export type SaveAnswersMutationOptions = Apollo.BaseMutationOptions<SaveAnswersMutation, SaveAnswersMutationVariables>;
export const GetNextWordsDocument = gql`
    query getNextWords($mode: String!) {
  getNextWords(mode: $mode) {
    word {
      id
      definition_en
      word_en
      word_pl
      examples
      type
      base_word_en
      other_forms
      tags
    }
    similarEnWords
    similarPlWords
    wordLearnStatus {
      allAnswers
      correctAnswers
      incorrectAnswers
    }
  }
}
    `;

/**
 * __useGetNextWordsQuery__
 *
 * To run a query within a React component, call `useGetNextWordsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNextWordsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNextWordsQuery({
 *   variables: {
 *      mode: // value for 'mode'
 *   },
 * });
 */
export function useGetNextWordsQuery(baseOptions: Apollo.QueryHookOptions<GetNextWordsQuery, GetNextWordsQueryVariables> & ({ variables: GetNextWordsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetNextWordsQuery, GetNextWordsQueryVariables>(GetNextWordsDocument, options);
      }
export function useGetNextWordsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetNextWordsQuery, GetNextWordsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetNextWordsQuery, GetNextWordsQueryVariables>(GetNextWordsDocument, options);
        }
export function useGetNextWordsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetNextWordsQuery, GetNextWordsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetNextWordsQuery, GetNextWordsQueryVariables>(GetNextWordsDocument, options);
        }
export type GetNextWordsQueryHookResult = ReturnType<typeof useGetNextWordsQuery>;
export type GetNextWordsLazyQueryHookResult = ReturnType<typeof useGetNextWordsLazyQuery>;
export type GetNextWordsSuspenseQueryHookResult = ReturnType<typeof useGetNextWordsSuspenseQuery>;
export type GetNextWordsQueryResult = Apollo.QueryResult<GetNextWordsQuery, GetNextWordsQueryVariables>;
export const WordOfTheDayDocument = gql`
    query wordOfTheDay {
  wordOfTheDay {
    word_en
    word_pl
    type
    definition_en
    examples
  }
}
    `;

/**
 * __useWordOfTheDayQuery__
 *
 * To run a query within a React component, call `useWordOfTheDayQuery` and pass it any options that fit your needs.
 * When your component renders, `useWordOfTheDayQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWordOfTheDayQuery({
 *   variables: {
 *   },
 * });
 */
export function useWordOfTheDayQuery(baseOptions?: Apollo.QueryHookOptions<WordOfTheDayQuery, WordOfTheDayQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WordOfTheDayQuery, WordOfTheDayQueryVariables>(WordOfTheDayDocument, options);
      }
export function useWordOfTheDayLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WordOfTheDayQuery, WordOfTheDayQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WordOfTheDayQuery, WordOfTheDayQueryVariables>(WordOfTheDayDocument, options);
        }
export function useWordOfTheDaySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<WordOfTheDayQuery, WordOfTheDayQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<WordOfTheDayQuery, WordOfTheDayQueryVariables>(WordOfTheDayDocument, options);
        }
export type WordOfTheDayQueryHookResult = ReturnType<typeof useWordOfTheDayQuery>;
export type WordOfTheDayLazyQueryHookResult = ReturnType<typeof useWordOfTheDayLazyQuery>;
export type WordOfTheDaySuspenseQueryHookResult = ReturnType<typeof useWordOfTheDaySuspenseQuery>;
export type WordOfTheDayQueryResult = Apollo.QueryResult<WordOfTheDayQuery, WordOfTheDayQueryVariables>;
export const ReportWordDocument = gql`
    mutation reportWord($wordId: Float!, $reason: String!) {
  saveWordReport(wordId: $wordId, reason: $reason)
}
    `;
export type ReportWordMutationFn = Apollo.MutationFunction<ReportWordMutation, ReportWordMutationVariables>;

/**
 * __useReportWordMutation__
 *
 * To run a mutation, you first call `useReportWordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReportWordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [reportWordMutation, { data, loading, error }] = useReportWordMutation({
 *   variables: {
 *      wordId: // value for 'wordId'
 *      reason: // value for 'reason'
 *   },
 * });
 */
export function useReportWordMutation(baseOptions?: Apollo.MutationHookOptions<ReportWordMutation, ReportWordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ReportWordMutation, ReportWordMutationVariables>(ReportWordDocument, options);
      }
export type ReportWordMutationHookResult = ReturnType<typeof useReportWordMutation>;
export type ReportWordMutationResult = Apollo.MutationResult<ReportWordMutation>;
export type ReportWordMutationOptions = Apollo.BaseMutationOptions<ReportWordMutation, ReportWordMutationVariables>;