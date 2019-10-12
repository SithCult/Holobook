export const signIn = (credentials) => {
    return (dispatch, getState, {getFirebase}) => {
        const firebase = getFirebase();

        firebase.auth().signInWithEmailAndPassword(
            credentials.email,
            credentials.password
        ).then(() => {
            dispatch({
                type: 'LOGIN_SUCCESS'
            })
        }).catch((err) => {
            dispatch({
                type: 'LOGIN_ERROR',
                err
            })
        });
    }
}

export const signOut = () => {
    return (dispatch, getState, {getFirebase}) => {
        const firebase = getFirebase();

        firebase.auth().signOut().then(() => {
            dispatch({
                type: 'SIGNOUT_SUCCESS'
            })
        });
    }
}

export const signUp = (newUser) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        const firebase = getFirebase();
        const firestore = getFirestore();

        console.log(newUser);

        let test = 1;

        // Check for Sithname duplicates
        firestore.collection('users').get()
        .then((querySnapshot) => {
            let result = undefined;
            let duplicate = false;
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                result = doc.data();
                if(result){
                    if(result.sith_name === newUser.sith_name){
                        duplicate = true;
                        // Match found
                        dispatch({
                            type: 'SIGNUP_DUPLICATE'
                        });
                    }
                }
            });

            if(!duplicate){
                // Create new user to firebase
                firebase.auth().createUserWithEmailAndPassword(
                    newUser.email,
                    newUser.password
                ).then((response) => {
                    // Create data for user we just created
                    return firestore.collection('users').doc(response.user.uid).set({
                        full_name: newUser.full_name,
                        sith_name: newUser.sith_name,
                        email: newUser.email,
                        tracking: newUser.tracking,
                        details: newUser.details,
                        newsletter: newUser.newsletter,
                        letter: newUser.letter,
                        address: newUser.address,
                        law: newUser.law
                    })
                }).then(() => {
                    dispatch({
                        type: 'SIGNUP_SUCCESS'
                    })
                }).catch((err) => {
                    dispatch({
                        type: 'SIGNUP_ERROR',
                        errCode: 1,
                        err
                    })
                })
            }
        });
    }
}

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Christian Aichner
 */