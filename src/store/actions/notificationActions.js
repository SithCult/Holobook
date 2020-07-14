// Get array of all notifications for the user
export const getNotifs = () => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const notifRef = firebase.database().ref("/notifications/");

    // Retrieve the currently logged in users uid
    const uid = firebase.auth().currentUser.uid;

    // Create reference
    notifRef.on("value", (snapshot) => {
      let notifs = [];

      // If notifications exist, push them into the array
      if (!snapshot.empty) {
        snapshot.forEach((n) => {
          if (n.val().recipient === uid) {
            notifs = [...notifs, { data: n.val(), mid: n.key }];
          }
        });
      }

      notifs.sort((a, b) =>
        a.data && b.data
          ? a.data.sentTimestamp < b.data.sentTimestamp
            ? 1
            : -1
          : -1
      );

      dispatch({
        type: "GETNOTIFS_SUCCESS",
        notifications: notifs,
      });
    });
  };
};

// Stop getting Notifications
export const stopGettingNotifications = () => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const chatMessageRef = firebase.database().ref("/notifications/");

    // Create reference
    chatMessageRef.off("child_added");
  };
};

// Create a new notification for each recipient
export const createNotification = (details, recipients, chatName) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();

    // Retrieve the currently logged in users uid
    const uid = firebase.auth().currentUser.uid;
    const recwithoutuser = recipients.filter((r) => r !== uid);

    let newNotifs = [];

    // Create notifs object
    recwithoutuser.forEach((r) => {
      newNotifs = [
        ...newNotifs,
        { ...details, sentTimestamp: Date.now(), recipient: r, chatName },
      ];
    });

    newNotifs.forEach((n) => {
      // Push message into DB
      firebase
        .database()
        .ref("/notifications/" + details.chid + n.recipient)
        .set(n);
    });
  };
};

// Throw notification out of the DB by notification id
export const removeNotification = (nid) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const notifRef = firebase.database().ref("/notifications/" + nid);

    notifRef.remove().then(() => dispatch({ type: "DELETENOTIF_SUCCESS" }));
  };
};

// Throw notification out of the DB by chat id
export const removeNotifications = (chid) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();

    // Retrieve the currently logged in users uid
    const uid = firebase.auth().currentUser.uid;
    const notifRef = firebase.database().ref("/notifications/" + chid + uid);

    // Update state to false
    notifRef.remove().then(() => dispatch({ type: "DELETENOTIF_SUCCESS" }));
  };
};

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
