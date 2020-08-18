// Have initial state for when state is not ready to be passed
const initState = {
  blogPostError: null,
  loading: false,
  results: null,
};

const blogPostReducer = (state = initState, action) => {
  switch (action.type) {
    case "BLOGPOSTCREATION_SUCCESS":
      console.log("Creation success");

      return {
        ...state,
        created: action.newPost,
        blogPostError: null,
      };
    case "BLOGPOSTCREATION_ERROR":
      return {
        ...state,
        blogPostError: action.err,
      };
    case "LOADBLOGPOSTS_SUCCESS":
      return {
        ...state,
        blogPostError: null,
        results: action.results,
        loading: false,
      };
    case "LOADBLOGPOSTS_LOADING":
      return {
        ...state,
        loading: true,
      };
    case "LOADBLOGPOSTS_ERROR":
      return {
        ...state,
        blogPostError: action.err,
        loading: false,
      };
    case "BLOGPOSTAPPROVAL_SUCCESS":
      return {
        ...state,
      };
    case "BLOGPOSTAPPROVAL_ERROR":
      return {
        ...state,
      };
    case "BLOGPOSTDISAPPROVAL_SUCCESS":
      return {
        ...state,
      };
    case "BLOGPOSTDISAPPROVAL_ERROR":
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default blogPostReducer;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
