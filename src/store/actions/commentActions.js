export const createComment = (newComment) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();

    // Get userId
    let uid = newComment.author.uid;
    // Generate timestamp
    let timestamp = newComment.timestamp;

    // Create comment
    firestore
      .collection("comment")
      .doc()
      .set({
        msg: newComment.comment,
        author: newComment.author,
        timestamp: timestamp,
        pid: newComment.pid,
        cid: newComment.cid,
        visible: true,
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

// Edit Comments
export const editComment = (comment, newmsg) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();

    // Get userId
    let uid = comment.data.author.uid;
    let loggedinuid = firebase.auth().currentUser.uid;

    if (uid === loggedinuid) {
      // Edit comment
      firestore
        .collection("comment")
        .doc(comment.id)
        .set(
          {
            msg: newmsg,
            versions: {
              [new Date().getTime()]: comment.data.msg,
            },
          },
          { merge: true }
        )
        .then(() => {
          dispatch({ type: "EDITCOMMENT_SUCCESS" });
          return;
        })
        .catch((err) => {
          dispatch({ type: "EDITCOMMENT_ERROR", err });
        });
    }
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
export const removeComment = (comment) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();

    const uid = firebase.auth().currentUser.uid;

    if (uid === comment.data.author.uid) {
      // Remove comment
      firestore
        .collection("comment")
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

// Load comments
export const loadComments = () => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();

    // Apply where condition
    const comments = firestore.collection("comment");

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
        dispatch({ type: "LOADCOMMENTS_SUCCESS", results });
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
