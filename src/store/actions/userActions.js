//#region > Imports
// SHA265 algorithm
import sha256 from "js-sha256";
//#endregion

//#region > Functions
// Get user by uid
export const getUser = (uid) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();

    return firestore
      .collection("users")
      .doc(uid)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          return false;
        } else {
          return { ...doc.data(), uid: doc.id };
        }
      })
      .catch((err) => {
        return false;
      });
  };
};

// Get all users of a certain country
export const getUsersPerCountry = (cc) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();

    const country_code = cc.toUpperCase().trim();

    const users = firestore
      .collection("users")
      .where("address.country", "==", country_code);

    return users
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

// Get user by sith name
export const getUserByName = (sith_name) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();

    const users = firestore
      .collection("users")
      .where("sith_name", "==", sith_name);

    // Get comments and order them
    return users
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

// Retrieve donations from Firestore
export const getDonations = (uid) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();

    firestore
      .collection("donations")
      .get()
      .then((querySnapshot) => {
        let results = [];

        !querySnapshot.empty &&
          querySnapshot.forEach((doc) => {
            let data = { ...doc.data(), id: doc.id };

            if (uid) {
              if (data.uid == uid) {
                results.push(data);
              }
            } else {
              results.push(data);
            }
          });
        dispatch({ type: "GETDONATIONS_SUCCESS", donations: results });
      })
      .catch((err) => {
        console.error(err);
      });
  };
};

// Store donation and update user badges
export const updateBadgesDonate = (
  badges,
  details,
  credits,
  reputation,
  sith_name
) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();

    // Get the unique ID of the current user
    const uid = firebase.auth().currentUser.uid;

    let newBadges = [];

    if (badges) {
      if (!badges.includes("phase1")) {
        newBadges.push("phase1");
      }
      if (!badges.includes("founder")) {
        newBadges.push("founder");
      }

      Array.prototype.push.apply(badges, newBadges);
    }

    // Get current timestamp
    const timestamp = new Date().getTime();

    // Check amount
    const amount = details?.purchase_units[0]?.amount?.value;

    // Add Imperial Credits and reputation to the Sith user
    const newCredits = Math.round(credits + amount * 9);
    const newReputation = Math.round(reputation + amount / 2);

    firestore
      .collection("users")
      .doc(uid)
      .set(
        {
          badges: badges ? badges : ["phase1", "founder"],
          credits: newCredits,
          reputation: newReputation,
          donations: {
            [timestamp]: details,
          },
        },
        { merge: true }
      );

    // Create transaction hash
    const hash = sha256(timestamp.toString());

    firestore
      .collection("donations")
      .add({
        timestamp,
        sith_name,
        hash,
        amount,
      })
      .then((docRef) => {
        dispatch({ type: "GET_ID", uid: docRef.id });
      });
  };
};

// Store donation
export const writeDonation = (amount) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();

    // Get current timestamp
    const timestamp = new Date().getTime();

    // Create transaction hash
    const hash = sha256(timestamp.toString());

    firestore
      .collection("donations")
      .add({
        timestamp,
        sith_name: "Unknown Sith",
        hash,
        amount,
      })
      .then((docRef) => {
        dispatch({ type: "GET_ID", uid: docRef.id });
      });
  };
};

// Initialize Presence
export const initPresenceHandler = () => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();
    const uid = firebase.auth().currentUser.uid;

    const userStatusDatabaseRef = firebase.database().ref("/status/" + uid);

    // Online and offline states
    const isOfflineForDatabase = {
      uid,
      state: "offline",
      last_changed: firebase.database.ServerValue.TIMESTAMP,
    };

    const isOnlineForDatabase = {
      uid,
      state: "online",
      last_changed: firebase.database.ServerValue.TIMESTAMP,
    };
    // Create reference
    firebase
      .database()
      .ref(".info/connected")
      .on("value", function (snapshot) {
        // If we're not currently connected, don't do anything.
        if (snapshot.val() == false) {
          return;
        }

        // If we are currently connected, then use the 'onDisconnect()'
        // method to add a set which will only trigger once this
        // client has disconnected by closing the app,
        // losing internet, or any other means.
        userStatusDatabaseRef
          .onDisconnect()
          .set(isOfflineForDatabase)
          .then(function () {
            // The promise returned from .onDisconnect().set() will
            // resolve as soon as the server acknowledges the onDisconnect()
            // request, NOT once we've actually disconnected:
            // https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect

            // We can now safely set ourselves as 'online' knowing that the
            // server will mark us as offline once we lose connection.
            userStatusDatabaseRef.set(isOnlineForDatabase);
          });
      });
  };
};

// Get number of online users
export const getOnlineUserCount = () => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();

    const userStatusDatabaseRef = firebase.database().ref("/status/");

    userStatusDatabaseRef
      .orderByChild("state")
      .equalTo("online")
      .on("value", function (snapshot) {
        dispatch({
          type: "UPDATE_USERCOUNT",
          onlineusercount: snapshot.numChildren(),
        });
      });
  };
};

// Get array of all online users IDs
export const getOnlineUsers = () => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();

    const userStatusDatabaseRef = firebase.database().ref("/status/");

    userStatusDatabaseRef
      .orderByChild("state")
      .equalTo("online")
      .on("value", function (snapshot) {
        let onlineusers = [];

        !snapshot.empty &&
          snapshot.forEach((u) => {
            console.log(u.val());
            onlineusers = [...onlineusers, u.val()];
          });

        dispatch({
          type: "GETONLINEUSERS_SUCCESS",
          onlineusers: onlineusers,
        });
      });
  };
};

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
