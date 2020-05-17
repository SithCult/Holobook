export const createPost = (newPost) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
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
        dispatch({ type: "CREATION_SUCCESS", newPost });
        return;
      })
      .catch((err) => {
        dispatch({ type: "CREATION_ERROR", err });
      });
  };
};

export const likePost = (id, uid, likes) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();
    let localLikes = likes;

    if (localLikes) {
      if (Array.isArray(localLikes)) {
        localLikes.push({
          uid,
          timestamp: Date.now(),
        });
      } else {
        localLikes = [];
      }
    } else {
      localLikes = [];
    }

    // Create post
    firestore
      .collection("posts")
      .doc(id)
      .set(
        {
          likes: localLikes,
        },
        { merge: true }
      )
      .then(() => {
        dispatch({ type: "LIKE_SUCCESS", id });
        return;
      })
      .catch((err) => {
        dispatch({ type: "LIKE_ERROR", err });
      });
  };
};

export const unlikePost = (id, uid, likes) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();

    likes = likes.filter(function (obj) {
      return obj.uid !== uid;
    });

    // Create post
    firestore
      .collection("posts")
      .doc(id)
      .update({
        likes: likes,
      })
      .then(() => {
        dispatch({ type: "UNLIKE_SUCCESS", id });
        return;
      })
      .catch((err) => {
        dispatch({ type: "UNLIKE_ERROR", err });
      });
  };
};

export const removePost = (uid, post) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();

    if (uid === post.data.author.uid) {
      // Remove post
      firestore
        .collection("posts")
        .doc(post.id)
        .set(
          {
            visible: false,
          },
          { merge: true }
        )
        .then(() => {
          dispatch({ type: "REMOVE_SUCCESS", id: post.id });
          return;
        })
        .catch((err) => {
          dispatch({ type: "REMOVE_ERROR", err });
        });
    } else {
      dispatch({ type: "REMOVE_ERROR", err: "Not authorized." });
    }
  };
};

export const loadPosts = (amount) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();

    dispatch({ type: "LOAD_LOADING" });

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

        dispatch({ type: "LOAD_SUCCESS", results });
      })
      .catch((err) => {
        dispatch({ type: "LOAD_ERROR", err });
      });
  };
};

export const loadAllPosts = (amount) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();

    dispatch({ type: "LOAD_LOADING" });

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

        dispatch({ type: "LOAD_SUCCESS", results });
      })
      .catch((err) => {
        dispatch({ type: "LOAD_ERROR", err });
      });
  };
};

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
