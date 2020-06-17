// Have initial state for when state is not ready to be passed
const initState = {
  receivedUser: undefined,
  selectedDonation: undefined,
  donations: undefined,
};

const userReducer = (state = initState, action) => {
  switch (action.type) {
    case "USERLOAD_SUCCESS":
      console.log("Get user info success");
      return {
        ...state,
        receivedUser: action.results,
      };
    case "USERLOAD_ERROR":
      console.log("Get user info error", action.err);
      return {
        ...state,
        receivedUser: null,
      };
    case "GETDONATIONS_SUCCESS":
      return {
        ...state,
        donations: action.donations,
      };
    case "GET_ID":
      return {
        ...state,
        selectedDonation: action.uid,
      };
    case "USERLOAD_LOADING":
      return {
        ...state,
        receivedUser: true,
      };
    case "USERLOAD_CLEAR":
      return {
        ...state,
        receivedUser: undefined,
      };
    default:
      return state;
  }
};

export default userReducer;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
