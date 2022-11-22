/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

import { setContext } from "apollo-link-context";

const authLink = setContext((_, { headers }) => {
  // get the authentication token from ApplicationSettings if it exists
  const token = localStorage.getItem("shirts_token");
  console.log("token", token);
  // return the headers to the context so HTTP link can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      // mode: "cors",
    },
  };
});

export default new ApolloClient({
  link: authLink.concat(
    new HttpLink({ uri: "https://shirts-api.herokuapp.com/graphql" })
  ),
  cache: new InMemoryCache(),
});
