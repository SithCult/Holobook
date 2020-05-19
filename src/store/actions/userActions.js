export const getUser = (uid) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();

    // Get loading
    dispatch({ type: "USERLOAD_LOADING" });

    firestore
      .collection("users")
      .doc(uid)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          dispatch({ type: "USERLOAD_ERROR", err: "User no longer exists." });
        } else {
          dispatch({ type: "USERLOAD_SUCCESS", results: doc.data() });
        }
      })
      .catch((err) => {
        dispatch({ type: "USERLOAD_ERROR", err });
      });
  };
};

export const clearUser = () => {
  return (dispatch) => {
    // Clear currently selected user
    dispatch({ type: "USERLOAD_CLEAR" });
  };
};

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
