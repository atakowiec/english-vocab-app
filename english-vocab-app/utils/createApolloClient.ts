import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncStorageWrapper, persistCache } from "apollo3-cache-persist";

export default async function createApolloClient() {
  const httpLink = createHttpLink({
    uri: 'http://192.168.1.11:3000/graphql',
  });

  const authLink = setContext(async (_, { headers }) => {
    const token = await AsyncStorage.getItem('access_token');

    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  const cache = new InMemoryCache()

  await persistCache({
    cache,
    storage: new AsyncStorageWrapper(AsyncStorage),
  })

  return new ApolloClient({
    link: authLink.concat(httpLink),
    defaultOptions: {
      mutate: {
        fetchPolicy: 'no-cache',
      },
      query: {
        fetchPolicy: 'no-cache',
      }
    },
    cache
  });
}