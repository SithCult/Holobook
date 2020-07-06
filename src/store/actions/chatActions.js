// Add user to chat
export const joinChat = (uid, chid) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();

    firestore
      .collection("chats")
      .document(chid)
      .set({ users: [uid] }, { merge: true })
      .then(dispatch({ type: "JOINCHAT_SUCCESS" }));
  };
};

// Create chat
export const createChat = (name, users) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();

    return firestore
      .collection("chats")
      .add({ name: name, users: users })
      .then((response) => {
        return response.id;
      });
  };
};

// Get chats either with uid for users chats or without for all available chats
export const getChats = (uid) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();

    return firestore
      .collection("chats")
      .get()
      .then((querySnapshot) => {
        let results = [];

        !querySnapshot.empty &&
          querySnapshot.forEach((doc) => {
            let data = { ...doc.data(), id: doc.id };

            if (uid) {
              if (data.users.includes(uid)) {
                results.push(data);
              }
            } else {
              results.push(data);
            }
          });
        dispatch({ type: "GETCHATS_SUCCESS", chats: results });
      });
  };
};

// Get array of all chat messages ordered by timestamp
export const getMessages = (chid, amount) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const chatMessageRef = firebase.database().ref("/chats/" + chid + "/");

    chatMessageRef.orderByChild("sentTimestamp").on("value", (snapshot) => {
      let chatMessages = [];

      if (!snapshot.empty) {
        snapshot.forEach((m) => {
          chatMessages = [...chatMessages, m.val()];
        });
      }

      dispatch({
        type: "GETMESSAGES_SUCCESS",
        chatMessages: chatMessages.reverse(),
      });
    });
  };
};

// Write a new chat message into the chat message list
export const writeMessage = (message) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const chatMessageRef = firebase
      .database()
      .ref("/chats/" + message.chid + "/");

    message = {
      ...message,
      sentTimestamp: Date.now(),
      author: { uid: firebase.auth().currentUser.uid },
      visible: true,
      read: [firebase.auth().currentUser.uid],
    };

    chatMessageRef
      .push(message)
      .then(() => dispatch({ type: "WRITEMESSAGE_SUCCESS" }));
  };
};

export const removeMessage = (chid, mid) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const chatMessageRef = firebase
      .database()
      .ref("/chats/" + chid + "/" + mid);

    chatMessageRef
      .update({ visible: false })
      .then(() => dispatch({ type: "REMOVEMESSAGE_SUCCESS" }));
  };
};

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
