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

        // Create new user to firebase
        firebase.auth().createUserWithEmailAndPassword(
            newUser.email,
            newUser.password
        ).then((response) => {
            // Create data for user we just created
            return firestore.collection('users').doc(response.user.uid).set({
                full_name: newUser.full_name,
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
                err
            })
        })
    }
}

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Christian Aichner
 */