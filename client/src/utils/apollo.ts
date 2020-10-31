import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const link = createHttpLink({
  useGETForQueries: true,
  uri: "/graphql",
});

const cache = new InMemoryCache();

const authLink = setContext((_, { headers }) => {
  const token = sessionStorage.getItem("id");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(link),
  cache,
});
