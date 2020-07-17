// Add user to chat
export const joinChat = (users, chid, curUsers) => {
  return async (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    const firebase = getFirebase();
    let usersToAdd = [];

    // Get chat from collection
    const currentData = await firestore
      .collection("chats")
      .doc(chid)
      .get()
      .then((result) => {
        return { id: result.id, data: result.data() };
      });

    users.forEach((u) => {
      if (!currentData.data.users.includes(u)) {
        usersToAdd = [...usersToAdd, u];
      }
    });

    // Add user to the chat users
    return firestore
      .collection("chats")
      .doc(chid)
      .set({ users: [...curUsers, ...usersToAdd] }, { merge: true })
      .then(() => {
        const chatUserRef = firebase.database().ref("/chatusers/" + chid);

        chatUserRef.set({ users: [...curUsers, ...usersToAdd] });

        return true;
      })
      .catch(() => {
        return false;
      });
  };
};

export const leaveChat = (uid, chatDetails) => {
  return async (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    const firebase = getFirebase();

    const messageRef = firebase
      .database()
      .ref("/chats/" + chatDetails.id + "/");
    const chatRef = firebase.database().ref("/chats/" + chatDetails.id);
    const chatUserRef = firebase.database().ref("/chatusers/" + chatDetails.id);

    // Get chat from collection
    const currentData = await firestore
      .collection("chats")
      .doc(chatDetails.id)
      .get()
      .then((result) => {
        return { id: result.id, data: result.data() };
      });

    let newUsers = currentData.data.users.filter((u) => u !== uid);

    if (newUsers.length === 0) {
      return messageRef.once("value", (snapshot) => {
        let chatMessages = [];

        // If messages exist, push them into the array
        if (!snapshot.empty) {
          snapshot.forEach((m) => {
            chatMessages = [...chatMessages, { data: m.val(), mid: m.key }];
          });
        }

        if (chatMessages) {
          chatUserRef.remove();
          chatRef.remove();
        }

        return firestore
          .collection("chats")
          .doc(chatDetails.id)
          .set({ chatMessages, users: [] }, { merge: true })
          .then(() => {
            return true;
          });
      });
    } else {
      return firestore
        .collection("chats")
        .doc(chatDetails.id)
        .set({ users: newUsers }, { merge: true })
        .then(() => {
          const chatUserRef = firebase
            .database()
            .ref("/chatusers/" + chatDetails.id);

          chatUserRef.set({ users: newUsers });

          return true;
        })
        .catch(() => {
          return false;
        });
    }
  };
};

// Create chat
export const createChat = (name, users) => {
  return async (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();
    const firebase = getFirebase();

    const existingChat = await firestore
      .collection("chats")
      .get()
      .then((querySnapshot) => {
        let isDupe = false;

        !querySnapshot.empty &&
          querySnapshot.forEach((doc) => {
            if (
              name.split(process.env.REACT_APP_ACTION_CHAT_BINDER).length ===
                2 &&
              areArraysEqualSets(
                doc.data().name.split(process.env.REACT_APP_ACTION_CHAT_BINDER),
                name.split(process.env.REACT_APP_ACTION_CHAT_BINDER)
              )
            ) {
              isDupe = doc.id;
            } else if (
              name.toLowerCase().trim() === doc.data().name.toLowerCase().trim()
            ) {
              isDupe = doc.id;
            }
          });

        return isDupe;
      });

    if (!existingChat) {
      // Add new chat to collection.
      return firestore
        .collection("chats")
        .add({ name: name, users: users, createTimestamp: Date.now() })
        .then((response) => {
          const chatUserRef = firebase
            .database()
            .ref("/chatusers/" + response.id);

          chatUserRef.set({ users: users });
          return { status: true, chid: response.id };
        });
    } else {
      return { status: false, chid: existingChat };
    }
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

            /**
             * If a UID is given, return chat if User is a member,
             * otherwise push data into array anyways
             */
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
          chatDetails: { id: result.id, data: result.data() },
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
        chatMessages: chatMessages,
        chid,
      });
    });
  };
};

// Stop getting messages
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

// Adds user to read list of a message
export const readMessage = (uid, chid, mid, read) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const chatMessageReadRef = firebase
      .database()
      .ref("/chats/" + chid + "/" + mid + "/");

    let readhandled;

    // If the read array does not exist, make it
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

export const getChatUsers = (chid) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const chatUserRef = firebase.database().ref("/chatusers/" + chid + "/");

    // Create reference
    chatUserRef.on("value", (snapshot) => {
      if (!snapshot.empty && snapshot.val() !== null) {
        dispatch({
          type: "GETCHATUSERS_SUCCESS",
          chatUsers: snapshot.val().users,
          chid,
        });
      }
    });
  };
};

export const stopGettingChatUsers = (chid) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const chatUserRef = firebase.database().ref("/chatusers/" + chid + "/");

    // Destroy reference
    chatUserRef.off("value");
  };
};

/**
 * @function
 * Assumes array elements are primitive types
 * check whether 2 arrays are equal sets.
 * @param  {Array} a1 All chat names parts
 * @param  {Array} a2 Current chat name parts
 */
function areArraysEqualSets(a1, a2) {
  const arr1 = a1.concat().sort();
  const arr2 = a2.concat().sort();

  if (arr1.length !== arr2.length) return false;

  for (let i = arr1.length; i--; ) {
    if (arr1[i] !== arr2[i]) return false;
  }

  return true;
}

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
