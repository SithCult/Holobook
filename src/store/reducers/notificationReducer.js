// Have initial state for when state is not ready to be passed
const initState = {
  notifications: null,
};

const notificationReducer = (state = initState, action) => {
  switch (action.type) {
    case "GETNOTIFS_SUCCESS":
      return {
        ...state,
        notifications: action.notifications,
      };
    case "DELETENOTIF_SUCCESS":
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default notificationReducer;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
