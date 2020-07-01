//> React
// Contains all the functionality necessary to define React components
import React from "react";
// This serves as an entry point to the DOM and server renderers for React
import ReactDOM from "react-dom";

//> Font Awesome
// Font Awesome is an awesome icon library
import "@fortawesome/fontawesome-free/css/all.min.css";

//> Bootstrap
import "bootstrap-css-only/css/bootstrap.min.css";

//> MDB
// "Material Design for Bootstrap" is a great UI design framework
import "mdbreact/dist/css/mdb.css";

//> CSS
// Root SCSS file
import "./index.scss";

//> Components
// Root component
import App from "./App";

import { unregister } from "./registerServiceWorker";

//> Redux
// Store, Middleware, Compose
import { createStore, applyMiddleware, compose } from "redux";
// Provider
import { Provider } from "react-redux";
// Thunk
import thunk from "redux-thunk";
// Reducer
import rootReducer from "./store/reducers/rootReducer";

//> Firestore
// Firestore is the DB of Firebase
import { reduxFirestore, getFirestore } from "redux-firestore";

//> Firebase
// React-Redux interface for Firebase
import { reactReduxFirebase, getFirebase } from "react-redux-firebase";
// Firebase config
import fbInit from "./config/fbInit";

// Unregister registerServiceWorker to display latest version
unregister();

/**
 * Create Redux data-store and store it in store
 * Apply thunk middle ware
 */
const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(
      thunk.withExtraArgument({
        getFirebase, // Firebase
        getFirestore, // Cloud DB
      })
    ),
    reduxFirestore(fbInit),
    reactReduxFirebase(fbInit, {
      useFirestoreForProfile: true, // Sync user data to user profile
      userProfile: "users", // Tell Redux Firebase where our users are stored
      attachAuthIsReady: true, // Enable firebase initializing before DOM rendering
    })
  )
);

// Wait until firebase is initialized, then render the DOM
store.firebaseAuthIsReady.then(() => {
  // Render the DOM
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById("root")
  );
});

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
