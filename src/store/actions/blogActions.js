// Create a new post
export const createBlogPost = (newPost) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    const firebase = getFirebase();

    console.log(firebase.auth().currentUser);

    // Create post
    firestore
      .collection("blogPosts")
      .add({
        ...newPost,
        approved: false,
        visible: true,
      })
      .then(() => {
        dispatch({ type: "BLOGPOSTCREATION_SUCCESS", newPost });
        return;
      })
      .catch((err) => {
        dispatch({ type: "BLOGPOSTCREATION_ERROR", err });
      });
  };
};

// Approve a post
export const approveBlogPost = (postId) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    const firebase = getFirebase();

    console.log(firebase.auth().currentUser);

    // Create post
    firestore
      .collection("blogPosts")
      .doc(postId)
      .set(
        {
          approved: true,
        },
        { merge: true }
      )
      .then(() => {
        dispatch({ type: "BLOGPOSTAPPROVAL_SUCCESS" });
        return;
      })
      .catch((err) => {
        dispatch({ type: "BLOGPOSTAPPROVAL_ERROR", err });
      });
  };
};

// Approve a post
export const disapproveBlogPost = (postId) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    const firebase = getFirebase();

    console.log(firebase.auth().currentUser);

    // Create post
    firestore
      .collection("blogPosts")
      .doc(postId)
      .set(
        {
          approved: false,
          visible: false,
        },
        { merge: true }
      )
      .then(() => {
        dispatch({ type: "BLOGPOSTDISAPPROVAL_SUCCESS" });
        return;
      })
      .catch((err) => {
        dispatch({ type: "BLOGPOSTDISAPPROVAL_ERROR", err });
      });
  };
};

// Load <amount> amount of posts
export const loadBlogPosts = (amount) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();

    let posts = firestore.collection("blogPosts").where("approved", "==", true);

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
        dispatch({ type: "LOADBLOGPOSTS_SUCCESS", results });
      })
      .catch((err) => {
        dispatch({ type: "LOADBLOGPOSTS_ERROR", err });
      });
  };
};

// Load all posts
export const loadAllBlogPosts = (amount) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();

    let posts = firestore.collection("blogPosts").where("visible", "==", true);

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

        dispatch({ type: "LOADBLOGPOSTS_SUCCESS", results });
      })
      .catch((err) => {
        dispatch({ type: "LOADBLOGPOSTS_ERROR", err });
      });
  };
};

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
