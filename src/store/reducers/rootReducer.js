//> Reducers
// Authentication
import authReducer from "./authReducer";
import postReducer from "./postReducer";
import userReducer from "./userReducer";
import donMsgReducer from "./donMsgReducer";

//> Redux
import { combineReducers } from "redux";

//> Firestore reducer
import { firestoreReducer } from "redux-firestore";

//> Firebase reducer
import { firebaseReducer } from "react-redux-firebase";

const rootReducer = combineReducers({
  auth: authReducer, // User authentication
  post: postReducer, // Post management
  user: userReducer, // User related functionality
  donMsg: donMsgReducer, // Donation messages
  firestore: firestoreReducer, // Database
  firebase: firebaseReducer, // Authentication
});

export default rootReducer;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
