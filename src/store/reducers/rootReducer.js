//#region > Imports
//> Reducers
// Authentication
import authReducer from "./authReducer";
import postReducer from "./postReducer";
import userReducer from "./userReducer";
import likeReducer from "./likeReducer";
import donMsgReducer from "./donMsgReducer";
import commentReducer from "./commentReducer";
import chatReducer from "./chatReducer";

//> Redux
import { combineReducers } from "redux";

//> Firestore reducer
import { firestoreReducer } from "redux-firestore";

//> Firebase reducer
import { firebaseReducer } from "react-redux-firebase";
//#endregion

//#region > Config
const rootReducer = combineReducers({
  auth: authReducer, // User authentication
  post: postReducer, // Post management
  user: userReducer, // User related functionality
  like: likeReducer, // Like of posts or comments
  donMsg: donMsgReducer, // Donation messages
  comment: commentReducer, // Comments
  chat: chatReducer, // Chat
  firestore: firestoreReducer, // Database
  firebase: firebaseReducer, // Authentication
});
//#endregion

//#region > Exports
export default rootReducer;
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
