// Have initial state for when state is not ready to be passed
const initState = {
  postError: null,
};

const postReducer = (state = initState, action) => {
  switch (action.type) {
    case "POSTCREATION_SUCCESS":
      console.log("Creation success");

      return {
        ...state,
        postError: null,
      };
    case "POSTCREATION_ERROR":
      console.log("Creation error", action.err);

      return {
        ...state,
        postError: action.err,
      };
    case "CREATION_SPAM":
      console.log("Post is spam", action.err);

      return {
        ...state,
        postError: action.err,
      };
    case "LOADPOSTS_SUCCESS":
      return {
        ...state,
        authError: null,
        results: action.results,
        loading: false,
      };
    case "LOADPOSTS_LOADING":
      console.log("Loading...");

      return {
        ...state,
        loading: true,
      };
    case "LOADPOSTS_ERROR":
      console.log("Loading error", action.err);

      return {
        ...state,
        authError: action.err,
        loading: false,
      };
    case "REMOVEPOSTS_SUCCESS":
      console.log("Remove success");

      return {
        ...state,
      };
    case "REMOVEPOSTS_ERROR":
      console.log("Remove error", action.err);

      return {
        ...state,
      };
    case "COMMENT_SUCCESS":
      console.log("Comment created", action.postId);

      return {
        ...state,
      };
    case "COMMENT_ERROR":
      console.log("Comment not created", action.err);

      return {
        ...state,
      };
    default:
      return state;
  }
};

export default postReducer;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
