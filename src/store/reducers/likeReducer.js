// Have initial state for when state is not ready to be passed
const initState = {
  postError: null,
};

const likeReducer = (state = initState, action) => {
  switch (action.type) {
    case "CREATION_SUCCESS":
      console.log("Creation success");
      return {
        ...state,
        postError: null,
      };
    case "CREATION_ERROR":
      console.log("Creation error", action.err);
      return {
        ...state,
        postError: action.err,
      };
    case "REMOVE_SUCCESS":
      console.log("Removal success");
      return {
        ...state,
        postError: null,
      };
    case "REMOVE_ERROR":
      console.log("Removal error", action.err);
      return {
        ...state,
        postError: action.err,
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
