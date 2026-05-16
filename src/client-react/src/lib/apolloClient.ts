import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client/index.js";
import { onError } from "@apollo/client/link/error";
import { GRAPHQL_URL } from "./constants/config";

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    console.error(
      "GraphQL Error:",
      graphQLErrors.map((e) => e.message).join(", ")
    );
  if (networkError) {
    const message = networkError.message || (typeof networkError === 'object' ? JSON.stringify(networkError) : String(networkError));
    console.error("Network Error:", message);
    if ("statusCode" in networkError && (networkError as any).statusCode === 401) {
      console.error("Authentication required or token expired.");
    }
  }
});

console.log("GRAPHQL_URL: ", GRAPHQL_URL);

export const initializeApollo = (initialState = null) => {
  const httpLink = new HttpLink({
    uri: GRAPHQL_URL,
    credentials: "include",
  });

  // Create or reuse Apollo Client instance
  const client = new ApolloClient({
    link: from([errorLink, httpLink]),
    cache: new InMemoryCache({
      typePolicies: {
        Product: {
          fields: {
            variants: {
              merge: true,
            },
          },
        },
      },
    }).restore(initialState || {}),
  });

  return client;
};

export default initializeApollo(); // Default export for client-side usage
