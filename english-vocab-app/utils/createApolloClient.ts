import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncStorageWrapper, persistCache } from "apollo3-cache-persist";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

export default async function createApolloClient() {
  const httpLink = new HttpLink({
    uri: "http://192.168.1.45:3000/graphql",
  });

  const authLink = setContext(async (_, { headers }) => {
    const token = await AsyncStorage.getItem("access_token");

    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  // WebSocket link for subscriptions
  const wsLink = new GraphQLWsLink(
    createClient({
      url: "ws://192.168.1.45:3000/graphql",
      connectionParams: async () => {
        const token = await AsyncStorage.getItem("access_token");
        return {
          Authorization: token ? `Bearer ${token}` : "",
        };
      },
    })
  );

  // Split based on operation type
  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    authLink.concat(httpLink)
  );

  const cache = new InMemoryCache();

  await persistCache({
    cache,
    storage: new AsyncStorageWrapper(AsyncStorage),
  });

  return new ApolloClient({
    link: splitLink,
    cache,
  });
}