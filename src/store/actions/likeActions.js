// Create a new post
export const createLike = (pid) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();

    // Get userId
    const uid = firebase.auth().currentUser.uid;

    // Create like
    firestore
      .collection("likes")
      .add({
        pid,
        uid,
        timestamp: new Date().getTime(),
      })
      .then((res) => {
        dispatch({ type: "CREATION_SUCCESS", pid, uid });
      })
      .catch((err) => {
        dispatch({ type: "CREATION_ERROR", err });
      });
  };
};

// Remove a like
export const removeLike = (lid) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();

    // Remove like
    firestore
      .collection("likes")
      .doc(lid)
      .delete()
      .then(() => {
        dispatch({ type: "REMOVE_SUCCESS", lid });
      })
      .catch((err) => {
        dispatch({ type: "REMOVE_ERROR", err });
      });
  };
};

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
