export const createComment = (newComment) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();

    // Get userId
    let uid = newComment.author.uid;
    // Generate timestamp
    let timestamp = new Date().getTime();
    // Create a unique id for the comment
    let uniqueID = timestamp + uid.toString().substring(0, 15);

    // Create comment
    firestore
      .collection("comment")
      .doc(uniqueID)
      .set({
        ...newComment,
        msg: newComment.msg,
        author: newComment.author,
        timestamp: timestamp,
        pid: newComment.pid,
      })
      .then(() => {
        dispatch({ type: "CREATION_SUCCESS", newComment });
        return;
      })
      .catch((err) => {
        dispatch({ type: "CREATION_ERROR", err });
      });
  };
};

// Like a comment
export const likeComment = (id, uid, likes) => {
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

    // Create comment
    firestore
      .collection("likes")
      .doc(id)
      .set(
        {
          uid: uid,
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

// Unlike a comment
export const unlikeComment = (id, uid, likes) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();

    likes = likes.filter(function (obj) {
      return obj.uid !== uid;
    });

    // Create comment
    firestore
      .collection("likes")
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

// Delete a comment
export const removeComment = (uid, comment) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();

    if (uid === comment.data.author.uid) {
      // Remove comment
      firestore
        .collection("comments")
        .doc(comment.id)
        .set(
          {
            visible: false,
          },
          { merge: true }
        )
        .then(() => {
          dispatch({ type: "REMOVE_SUCCESS", id: comment.id });
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

// Load <amount> amount of comments
export const loadComments = (pid) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();

    // Apply where condition
    const comments = firestore.collection("comment").where("pid", "==", pid);

    // Get comments and order them
    return comments
      .orderBy("timestamp", "desc")
      .get()
      .then((querySnapshot) => {
        let results = [];

        querySnapshot.forEach(function (doc) {
          let data = doc.data();

          results.push({ id: doc.id, data });
        });

        return results;
      })
      .catch((err) => {
        console.error(err);

        return false;
      });
  };
};

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
