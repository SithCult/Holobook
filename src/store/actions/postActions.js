// Create a new post
export const createPost = (newPost) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();

    // Get userId
    let uid = newPost.author.uid;
    // Create a unique id for the post
    let uniqueID = newPost.timestamp + uid.toString().substring(0, 15);

    // Create post
    firestore
      .collection("posts")
      .doc(uniqueID)
      .set({
        ...newPost,
        likes: [],
        skin: newPost.skin ? newPost.skin : null,
        visible: true,
      })
      .then(() => {
        dispatch({ type: "POSTCREATION_SUCCESS", newPost });
        return;
      })
      .catch((err) => {
        dispatch({ type: "POSTCREATION_ERROR", err });
      });
  };
};

// Delete a post
export const removePost = (pid, uid) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();

    const curUid = firebase.auth().currentUser.uid;

    if (curUid === uid) {
      // Remove post
      firestore
        .collection("posts")
        .doc(pid)
        .set(
          {
            visible: false,
          },
          { merge: true }
        )
        .then(() => {
          dispatch({ type: "REMOVEPOST_SUCCESS", pid });
          return;
        })
        .catch((err) => {
          dispatch({ type: "REMOVEPOST_ERROR", err });
        });
    } else {
      dispatch({ type: "REMOVEPOST_ERROR", err: "Not authorized." });
    }
  };
};

// Load <amount> amount of posts
export const loadPosts = (amount) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();

    let posts = firestore.collection("posts").where("visible", "==", true);

    if (amount < 0) {
      amount = 0;
    }
    posts
      .orderBy("timestamp", "desc")
      .limit(amount)
      .get()
      .then((querySnapshot) => {
        let results = [];

        querySnapshot.forEach(function (doc) {
          let data = doc.data();

          results.push({ id: doc.id, data });
        });
        dispatch({ type: "LOADPOSTS_SUCCESS", results });
      })
      .catch((err) => {
        dispatch({ type: "LOADPOSTS_ERROR", err });
      });
  };
};

// Load all posts
export const loadAllPosts = (amount) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();

    dispatch({ type: "LOADPOSTS_LOADING" });

    let posts = firestore.collection("posts");

    if (amount < 0) {
      amount = 0;
    }

    posts
      .orderBy("timestamp", "desc")
      .limit(amount)
      .get()
      .then((querySnapshot) => {
        let results = [];

        querySnapshot.forEach(function (doc) {
          let data = doc.data();

          results.push({ id: doc.id, data });
        });

        dispatch({ type: "LOADPOSTS_SUCCESS", results });
      })
      .catch((err) => {
        dispatch({ type: "LOADPOSTS_ERROR", err });
      });
  };
};

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
