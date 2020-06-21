// Create a new like
export const createLike = (pid) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();

    // Get userId
    const uid = firebase.auth().currentUser.uid;

    // Create like
    firestore
      .collection("likes")
      .doc(pid + uid)
      .set({
        pid,
        uid,
        timestamp: new Date().getTime(),
      })
      .then((res) => {
        dispatch({ type: "LIKECREATION_SUCCESS", pid, uid });
      })
      .catch((err) => {
        dispatch({ type: "LIKECREATION_ERROR", err });
      });
  };
};

// Remove a like
export const removeLike = (pid) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    const firebase = getFirebase();

    // Get userId
    const uid = firebase.auth().currentUser.uid;

    // Remove like
    firestore
      .collection("likes")
      .doc(pid + uid)
      .delete()
      .then(() => {
        dispatch({ type: "REMOVELIKE_SUCCESS", pid, uid });
      })
      .catch((err) => {
        dispatch({ type: "REMOVELIKE_ERROR", err });
      });
  };
};

// Get amount of likes on a post
export const getLikeAmount = (pid) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    const firebase = getFirebase();

    // Get userId
    const uid = firebase.auth().currentUser.uid;

    let likes = firestore.collection("likes").where("pid", "==", pid);

    likes
      .get()
      .then((querySnapshot) => {
        let likecount = querySnapshot.size;

        dispatch({ type: "GETLIKES_SUCCESS", likecount });
      })
      .catch((err) => {
        dispatch({ type: "GETLIKES_ERROR", err });
      });
  };
};

// See if user has liked post already
export const hasLiked = (pid) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    const firebase = getFirebase();

    // Get userId
    const uid = firebase.auth().currentUser.uid;

    // Remove like
    return firestore
      .collection("likes")
      .doc(pid + uid)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          return true;
        } else {
          return false;
        }
      })
      .catch((err) => {
        dispatch({ type: "HASLIKED_ERROR", err });
      });
  };
};

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
