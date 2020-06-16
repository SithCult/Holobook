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
            let data = doc.data();
            if (uid) {
              if (data.uid == uid) {
                results.push(data);
              }
            } else {
              results.push(data);
            }
          });
        console.log(results);
        dispatch({ type: "GETDONATIONS_SUCCESS", donations: results });
      })
      .catch((err) => {
        console.error(err);
      });
  };
};

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

export const writeDonation = (amount) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firestore = getFirestore();

    // Get current timestamp
    const timestamp = new Date().getTime();

    firestore.collection("donations").doc().set(
      {
        timestamp: timestamp,
        sith_name: "Unknown Sith",
        amount,
      },
      { merge: true }
    );
  };
};

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
