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
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
  user: User;
};

export type GameWord = {
  __typename?: 'GameWord';
  similarEnWords: Array<Scalars['String']['output']>;
  similarPlWords: Array<Scalars['String']['output']>;
  word: WordEntity;
  wordLearnStatus?: Maybe<WordLearnStatus>;
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  login: AuthPayload;
  refreshToken: AuthPayload;
  register: Scalars['Boolean']['output'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRefreshTokenArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};

export type Query = {
  __typename?: 'Query';
  getNextWords: Array<GameWord>;
  hello: Scalars['String']['output'];
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

export type WordLearnStatus = {
  __typename?: 'WordLearnStatus';
  id: Scalars['Int']['output'];
  learned: Scalars['Boolean']['output'];
  speedModeCorrectAnswers: Scalars['Int']['output'];
  speedModeWrongAnswers: Scalars['Int']['output'];
  user: User;
  word: WordEntity;
};

export type RefreshTokenMutationVariables = Exact<{
  refreshToken: Scalars['String']['input'];
}>;


export type RefreshTokenMutation = { __typename?: 'Mutation', refreshToken: { __typename?: 'AuthPayload', accessToken: string, refreshToken: string, user: { __typename?: 'User', id: number, name: string, email: string } } };

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

export type GetNextWordsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetNextWordsQuery = { __typename?: 'Query', getNextWords: Array<{ __typename?: 'GameWord', similarEnWords: Array<string>, similarPlWords: Array<string>, word: { __typename?: 'WordEntity', id: number, definition_en?: string | null, word_en: string, word_pl: string, examples: Array<string>, type?: string | null, base_word_en?: string | null, other_forms: Array<string>, tags: Array<string> }, wordLearnStatus?: { __typename?: 'WordLearnStatus', speedModeCorrectAnswers: number, speedModeWrongAnswers: number } | null }> };


export const RefreshTokenDocument = gql`
    mutation RefreshToken($refreshToken: String!) {
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
export type RefreshTokenMutationFn = Apollo.MutationFunction<RefreshTokenMutation, RefreshTokenMutationVariables>;

/**
 * __useRefreshTokenMutation__
 *
 * To run a mutation, you first call `useRefreshTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRefreshTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [refreshTokenMutation, { data, loading, error }] = useRefreshTokenMutation({
 *   variables: {
 *      refreshToken: // value for 'refreshToken'
 *   },
 * });
 */
export function useRefreshTokenMutation(baseOptions?: Apollo.MutationHookOptions<RefreshTokenMutation, RefreshTokenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RefreshTokenMutation, RefreshTokenMutationVariables>(RefreshTokenDocument, options);
      }
export type RefreshTokenMutationHookResult = ReturnType<typeof useRefreshTokenMutation>;
export type RefreshTokenMutationResult = Apollo.MutationResult<RefreshTokenMutation>;
export type RefreshTokenMutationOptions = Apollo.BaseMutationOptions<RefreshTokenMutation, RefreshTokenMutationVariables>;
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
export const GetNextWordsDocument = gql`
    query getNextWords {
  getNextWords {
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
      speedModeCorrectAnswers
      speedModeWrongAnswers
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
 *   },
 * });
 */
export function useGetNextWordsQuery(baseOptions?: Apollo.QueryHookOptions<GetNextWordsQuery, GetNextWordsQueryVariables>) {
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