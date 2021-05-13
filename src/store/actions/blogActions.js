// Date formatter
function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

// Create a new post
export const createBlogPost = (newPost) => {
  return async (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    const firebase = getFirebase();

    console.log(newPost);

    const existing = await firestore
      .collection("blogPosts")
      .where("approved", "==", true)
      .get()
      .then((querySnapshot) => {
        let results = [];

        querySnapshot.forEach(function (doc) {
          let data = doc.data();

          if (
            data.title === newPost.title &&
            formatDate(data.timestamp) === formatDate(newPost.timestamp)
          )
            results.push({ id: doc.id, data });
        });
        return results;
      })
      .catch((err) => {
        return [];
      });

    if (existing.length == 0) {
      // Create post
      firestore
        .collection("blogPosts")
        .add({
          ...newPost,
          approved: false,
          visible: true,
        })
        .then(() => {
          console.log("yes");
          dispatch({ type: "BLOGPOSTCREATION_SUCCESS", newPost });
          return;
        })
        .catch((err) => {
          console.error(err);
          dispatch({ type: "BLOGPOSTCREATION_ERROR", err });
        });
    } else
      dispatch({
        type: "BLOGPOSTCREATION_ERROR",
        err: {
          code: "blogexists-err",
          message: "A blog post with this title and date already exists",
        },
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

    if (amount < 0) {
      amount = 0;
    }

    if (amount) {
      firestore
        .collection("blogPosts")
        .where("approved", "==", true)
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
    } else {
      firestore
        .collection("blogPosts")
        .where("approved", "==", true)
        .orderBy("timestamp", "desc")
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
    }
  };
};

// Load all posts
export const loadAllBlogPosts = (amount) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();

    if (amount < 0) {
      amount = 0;
    }

    if (amount) {
      firestore
        .collection("blogPosts")
        .where("visible", "==", true)
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
    } else
      firestore
        .collection("blogPosts")
        .where("visible", "==", true)
        .orderBy("timestamp", "desc")
        .get()
        .then((querySnapshot) => {
          let results = [];

          querySnapshot.forEach(function (doc) {
            let data = doc.data();

            results.push({ id: doc.id, data });
          });

          console.log(results);
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
