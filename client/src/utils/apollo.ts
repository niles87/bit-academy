import { ApolloCache, ApolloClient, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { InMemoryCache } from "apollo-cache-inmemory";

const link = createHttpLink({
  useGETForQueries: true,
  uri: "/graphql",
});

const cache: ApolloCache<any> = new InMemoryCache();

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(link),
  cache: cache,
});
