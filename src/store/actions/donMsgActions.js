export const loadDonationMessages = (donid) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();

    // Get loading
    dispatch({ type: "USERLOAD_LOADING" });

    firestore
      .collection("donationMessages")
      .doc()
      .get(donid)
      .then((doc) => {
        if (!doc.exists) {
          dispatch({
            type: "DONMESSAGELOAD_ERROR",
            err: "Donation has no message",
          });
        } else {
          dispatch({
            type: "DONMESSAGELOAD_SUCCESS",
            donationMessages: doc.data(),
          });
        }
      })
      .catch((err) => {
        dispatch({ type: "DONMESSAGELOAD_ERROR", err });
      });
  };
};

export const writeDonationMessage = (donationid, donationMessage) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();

    // Get current timestamp
    const timestamp = new Date().getTime();

    firestore
      .collection("donationMessages")
      .doc()
      .set(
        {
          donationid,
          donationMessage,
        },
        { merge: true }
      )
      .then(() => {
        dispatch({ type: "DONMESSAGESAVE_SUCCESS", donationid });
      })
      .catch((err) => {
        dispatch({ type: "DONMESSAGESAVE_ERROR", err });
      });
  };
};

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
