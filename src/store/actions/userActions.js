//#region > Imports
//> Additional
// SHA265 algorithm
import sha256 from "js-sha256";
//#endregion

//#region > Exports
export const getUser = (uid) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();

    // Get loading
    dispatch({ type: "USERLOAD_LOADING" });

    firestore
      .collection("users")
      .doc(uid)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          dispatch({ type: "USERLOAD_ERROR", err: "User no longer exists." });
        } else {
          dispatch({ type: "USERLOAD_SUCCESS", results: doc.data() });
        }
      })
      .catch((err) => {
        dispatch({ type: "USERLOAD_ERROR", err });
      });
  };
};

//  Retrieve donations from Firestore
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

//  Store donation and update user badges
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

    //  Get the unique ID of the current user
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

//  Store donation
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

export const clearUser = () => {
  return (dispatch) => {
    // Clear currently selected user
    dispatch({ type: "USERLOAD_CLEAR" });
  };
};
//#endregion

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
