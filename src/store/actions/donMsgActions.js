//  Store donation message in donation
export const writeDonationMessage = (uid, donationMessage) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();

    firestore
      .collection("donations")
      .doc(uid)
      .set(
        {
          msg: donationMessage,
        },
        { merge: true }
      )
      .then(() => {
        dispatch({ type: "DONMESSAGESAVE_SUCCESS", uid });
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
