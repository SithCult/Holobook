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
import notificationReducer from "./notificationReducer";
import blogReducer from "./blogReducer";

//> Redux
import { combineReducers } from "redux";

//> Firestore reducer
import { firestoreReducer } from "redux-firestore";

//> Firebase reducer
import { firebaseReducer } from "react-redux-firebase";
import blogPostReducer from "./blogReducer";
//#endregion

//#region > Config
const rootReducer = combineReducers({
  /* User authentication */
  auth: authReducer,
  /* Post management */
  post: postReducer,
  /* User related functionality */
  user: userReducer,
  /* Like of posts or comments */
  like: likeReducer,
  /* Donation messages */
  donMsg: donMsgReducer,
  /* Comments */
  comment: commentReducer,
  /* Chat */
  chat: chatReducer,
  /* Notifications */
  notifications: notificationReducer,
  /* Blog Posts */
  blog: blogPostReducer,
  /* Database */
  firestore: firestoreReducer,
  /* Authentication */
  firebase: firebaseReducer,
});
//#endregion

//#region > Exports
export default rootReducer;
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
