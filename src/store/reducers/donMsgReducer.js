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
    default:
      return state;
  }
};

export default donMsgReducer;

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
