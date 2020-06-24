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

    const likes = firestore.collection("likes").where("pid", "==", pid);

    return likes
      .get()
      .then((querySnapshot) => {
        return querySnapshot.size;
      })
      .catch((err) => {
        return false;
      });
  };
};

// See if user has liked post already
export const hasLiked = (pid) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    const firebase = getFirebase();

    // Get userId
    const uid = firebase.auth().currentUser?.uid;

    if (uid) {
      const likes = firestore.collection("likes").doc(pid + uid);

      // Remove like
      return likes
        .get()
        .then((docSnapshot) => {
          if (docSnapshot.exists) {
            return true;
          } else {
            return false;
          }
        })
        .catch((err) => {
          dispatch({ type: "HASLIKED_ERROR", err });
        });
    } else {
      dispatch({ type: "HASLIKED_ERROR", err: "Not logged" });
    }
  };
};

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
