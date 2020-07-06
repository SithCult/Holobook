// Have initial state for when state is not ready to be passed
const initState = {
  chats: null,
  chatMessages: null,
};

const chatReducer = (state = initState, action) => {
  switch (action.type) {
    case "JOINCHAT_SUCCESS":
      return {
        ...state,
      };
    case "GETCHATS_SUCCESS":
      return {
        ...state,
        chats: action.chats,
      };
    case "GETMESSAGES_SUCCESS":
      return {
        ...state,
        chatMessages: action.chatMessages,
      };
    case "WRITEMESSAGES_SUCCESS":
      return {
        ...state,
      };
    case "REMOVEMESSAGE_SUCCESS":
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default chatReducer;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
