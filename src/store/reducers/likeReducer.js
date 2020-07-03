// Have initial state for when state is not ready to be passed
const initState = {
  postError: null,
  liked: false,
  likecount: null,
};

const likeReducer = (state = initState, action) => {
  switch (action.type) {
    case "LIKECREATION_SUCCESS":
      return {
        ...state,
        postError: null,
      };
    case "LIKECREATION_ERROR":
      console.log("Creation error", action.err);

      return {
        ...state,
        postError: action.err,
      };
    case "REMOVELIKE_SUCCESS":
      return {
        ...state,
        postError: null,
      };
    case "REMOVELIKE_ERROR":
      console.log("Removal error", action.err);

      return {
        ...state,
        postError: action.err,
      };
    case "HASLIKED_SUCCESS":
      console.log("hasliked success");

      return {
        ...state,
        liked: action.liked,
      };
    case "HASLIKED_ERROR":
      console.log("hasliked error", action.err);

      return {
        ...state,
        liked: false,
      };
    default:
      return state;
  }
};

export default likeReducer;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
