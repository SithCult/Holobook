// Get user by uid
export const getUser = (uid) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();

    // Get loading
    dispatch({ type: "USERLOAD_LOADING" });

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

    firestore.collection("donations").doc().set(
      {
        timestamp: timestamp,
        sith_name,
        amount,
      },
      { merge: true }
    );
  };
};

// Store donation
export const writeDonation = (amount) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();

    // Get current timestamp
    const timestamp = new Date().getTime();

    firestore
      .collection("donations")
      .add({
        timestamp: timestamp,
        sith_name: "Unknown Sith",
        amount,
      })
      .then((docRef) => {
        dispatch({ type: "GET_ID", uid: docRef.id });
      });
  };
};

// Sends dispatch to clear received user
export const clearUser = () => {
  return (dispatch) => {
    // Clear currently selected user
    dispatch({ type: "USERLOAD_CLEAR" });
  };
};

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
