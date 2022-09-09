import React from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { ApolloProvider } from "@apollo/react-hooks";
import { client } from "./utils/apollo";


const container = document.getElementById('root')
const root = createRoot(container);

root.render(
  <ApolloProvider client={client}>
    <App/>
  </ApolloProvider>
)


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
