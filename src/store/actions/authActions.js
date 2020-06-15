export const signIn = (credentials) => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();

    firebase
      .auth()
      .signInWithEmailAndPassword(credentials.email, credentials.password)
      .then(() => {
        dispatch({
          type: "LOGIN_SUCCESS",
        });
      })
      .catch((err) => {
        dispatch({
          type: "LOGIN_ERROR",
          err,
        });
      });
  };
};

export const signOut = () => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();

    firebase
      .auth()
      .signOut()
      .then(() => {
        dispatch({
          type: "SIGNOUT_SUCCESS",
        });
      });
  };
};

export const signUp = (newUser) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();

    console.log(newUser);

    // Check for Sithname duplicates
    firestore
      .collection("users")
      .get()
      .then((querySnapshot) => {
        let result = undefined;
        let duplicate = false;

        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          result = doc.data();

          if (result) {
            if (result.sith_name === newUser.sith_name) {
              duplicate = true;
              // Match found
              dispatch({
                type: "SIGNUP_DUPLICATE",
              });
            }
          }
        });

        console.log(result, duplicate);

        // Check if the Sithname is not already in use
        if (!duplicate) {
          // Set default values
          let credits,
            reputation,
            title,
            badges,
            status,
            department,
            beta,
            skin;

          credits = 1000;
          reputation = 10;
          title = "Acolyte";
          badges = [];
          status = null;
          department = null;
          beta = true;
          skin = "standard";

          if (newUser.code) {
            // Easter Egg - Feel free to use the code when enlisting
            if (newUser.code === "JGJF-8GHH-F8D7") {
              credits = 5000;
              reputation = 25;
              badges.push("Hunter");
              title = "Adept";
            }
          }

          console.log(newUser);

          // Create new user to firebase
          firebase
            .auth()
            .createUserWithEmailAndPassword(newUser.email, newUser.password)
            .then(async (response) => {
              console.log(response.user.uid);

              // Create data for user we just created
              return firestore
                .collection("test")
                .doc(response.user.uid)
                .set({
                  full_name: newUser.full_name ? newUser.full_name : null,
                  sith_name: newUser.sith_name ? newUser.sith_name : null,
                  email: newUser.email ? newUser.email : null,
                  email_sith: newUser.email_sith ? newUser.email_sith : null,
                  credits: credits ? credits : 0,
                  reputation: reputation ? reputation : 0,
                  title: title ? title : "Acolyte",
                  badges: badges ? badges : [],
                  status: status ? status : null,
                  department: department ? department : null,
                  beta: true, // Undo for further versions
                  skin: skin ? skin : "standard",
                  details: newUser.details ? newUser.details : null,
                  newsletter: newUser.newsletter ? newUser.newsletter : null,
                  letter: newUser.letter ? newUser.letter : null,
                  address: newUser.address ? newUser.address : null,
                  law: newUser.law ? newUser.law : null,
                });
            })
            .then(() => {
              console.log("Success Signup");

              dispatch({
                type: "SIGNUP_SUCCESS",
              });
            })
            .catch((err) => {
              console.log(err);

              dispatch({
                type: "SIGNUP_ERROR",
                errCode: 1,
                err,
              });
            });
        }
      });
  };
};

/**
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019-2020 Werbeagentur Christian Aichner
 */
