// Add user to chat
export const joinChat = (uid, chid, curUsers) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();

    // Add user to the chat users
    firestore
      .collection("chats")
      .doc(chid)
      .set({ users: [...curUsers, uid] }, { merge: true })
      .then(dispatch({ type: "JOINCHAT_SUCCESS" }));
  };
};

// Create chat
export const createChat = (name, users) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();

    // Add new chat to collection.
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

            // If a UID is given, return chat if User is a member
            // Otherwise, push data into array anyways
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

// Get chat data of a chat by ID
export const getChatDetails = (chid) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();

    // Get chat from collection
    return firestore
      .collection("chats")
      .document(chid)
      .get()
      .then((result) => {
        dispatch({
          type: "GETCHATDETAILS_SUCCESS",
          chatDetails: { id: result.id, data: result.data },
        });
      });
  };
};

// Get the chat data of a country
export const getCountryChat = (country_id) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();

    return firestore
      .collection("chats")
      .get()
      .then((querySnapshot) => {
        let countryChat;

        querySnapshot.forEach((doc) => {
          let data = { ...doc.data(), id: doc.id };

          if (data.name === country_id) {
            countryChat = data;
          }
        });

        // Return chat object
        return countryChat;
      });
  };
};

// Get array of all chat messages ordered by timestamp
export const getMessages = (chid) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const chatMessageRef = firebase.database().ref("/chats/" + chid + "/");

    // Create reference
    chatMessageRef.orderByChild("sentTimestamp").on("value", (snapshot) => {
      let chatMessages = [];

      // If messages exist, push them into the array
      if (!snapshot.empty) {
        snapshot.forEach((m) => {
          chatMessages = [...chatMessages, { data: m.val(), mid: m.key }];
        });
      }

      dispatch({
        type: "GETMESSAGES_SUCCESS",
        chatMessages,
      });
    });
  };
};

// Get array of all chat messages ordered by timestamp
export const stopGettingMessages = (chid) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const chatMessageRef = firebase.database().ref("/chats/" + chid + "/");

    // Create reference
    chatMessageRef.off("value");
  };
};

// Write a new chat message into the chat message list
export const writeMessage = (message) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const chatMessageRef = firebase
      .database()
      .ref("/chats/" + message.chid + "/");

    // Create message object
    message = {
      ...message,
      sentTimestamp: Date.now(),
      author: { uid: firebase.auth().currentUser.uid },
      visible: true,
      read: [firebase.auth().currentUser.uid],
    };

    // Push message into DB
    chatMessageRef
      .push(message)
      .then(() => dispatch({ type: "WRITEMESSAGE_SUCCESS" }));
  };
};

// Make messages invisible
export const removeMessage = (chid, mid) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const chatMessageRef = firebase
      .database()
      .ref("/chats/" + chid + "/" + mid);

    // Update state to false
    chatMessageRef
      .update({ visible: false })
      .then(() => dispatch({ type: "REMOVEMESSAGE_SUCCESS" }));
  };
};

// Make messages invisible
export const readMessage = (uid, chid, mid, read) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const chatMessageReadRef = firebase
      .database()
      .ref("/chats/" + chid + "/" + mid + "/");

    let readhandled;

    if (!read) {
      readhandled = [];
    } else {
      readhandled = read;
    }
    if (!readhandled.includes(uid)) {
      const readWithUser = [...readhandled, uid];

      // Update state to false
      chatMessageReadRef
        .update({ read: readWithUser })
        .then(() => dispatch({ type: "USERREAD_SUCCESS" }));
    }
  };
};

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
