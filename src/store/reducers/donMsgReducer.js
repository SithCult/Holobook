// Have initial state for when state is not ready to be passed
const initState = {
  donationid: undefined,
  donationMessages: undefined,
  receivedDonMessage: false,
};

const donMsgReducer = (state = initState, action) => {
  switch (action.type) {
    case "DONMESSAGESAVE_SUCCESS":
      console.log("Message successfully stored!");
      return {
        ...state,
        donationid: action.donationid,
      };
    case "DONMESSAGESAVE_ERROR":
      console.log("An error occured while storing message", action.err);
      return {
        ...state,
        donationid: undefined,
      };
    case "DONMESSAGELOAD_LOADING":
      return {
        ...state,
        receivedDonMessage: true,
      };
    case "DONMESSAGELOAD_SUCCESS":
      console.log(
        "Donation Messages successfully loaded",
        action.donationMessages
      );
      return {
        ...state,
        donationMessages: action.donationMessages,
      };
    case "DONMESSAGELOAD_ERROR":
      console.log("Error occured while loading donation messages", action.err);
      return {
        ...state,
        donationMessages: undefined,
      };
    default:
      return state;
  }
};

export default donMsgReducer;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
