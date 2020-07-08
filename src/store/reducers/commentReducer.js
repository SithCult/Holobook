// Have initial state for when state is not ready to be passed
const initState = {
  commentError: null,
};

const commentReducer = (state = initState, action) => {
  switch (action.type) {
    case "EDITCOMMENT_SUCCESS":
      console.log("Edit Success");

      return {
        ...state,
        commentError: null,
      };
    case "EDITCOMMENT_ERROR":
      console.log("Edit error", action.err);

      return {
        ...state,
        commentError: action.err,
      };
    case "CREATION_SPAM":
      console.log("comment is spam", action.err);

      return {
        ...state,
        commentError: action.err,
      };
    case "LOADCOMMENTS_SUCCESS":
      return {
        ...state,
        authError: null,
        results: action.results,
        loading: false,
      };
    case "LOAD_LOADING":
      console.log("Loading...");

      return {
        ...state,
        loading: true,
      };
    case "LOAD_ERROR":
      console.log("Loading error", action.err);

      return {
        ...state,
        authError: action.err,
        loading: false,
      };
    case "REMOVE_SUCCESS":
      console.log("Remove success");

      return {
        ...state,
      };
    case "REMOVE_ERROR":
      console.log("Remove error", action.err);

      return {
        ...state,
      };
    case "COMMENT_SUCCESS":
      console.log("Comment created", action.commentId);

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

export default commentReducer;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
