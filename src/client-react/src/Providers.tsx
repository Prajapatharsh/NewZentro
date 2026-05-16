import { Provider } from "react-redux";
import { store } from "./store/store";
import { ApolloProvider } from "@apollo/client/react/index.js";
import client from "./lib/apolloClient";
import Toast from "./components/feedback/Toast";
import AuthProvider from "./components/HOC/AuthProvider";
import { BrowserRouter } from "react-router-dom";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <BrowserRouter>
          <AuthProvider>{children}</AuthProvider>
          <Toast />
        </BrowserRouter>
      </Provider>
    </ApolloProvider>
  );
}
