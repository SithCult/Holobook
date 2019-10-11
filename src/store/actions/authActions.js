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

        // Create new user to firebase
        firebase.auth().createUserWithEmailAndPassword(
            newUser.email,
            newUser.password
        ).then((response) => {
            // Create data for user we just created
            /*let split_name = newUser.name.split(" ");
            return firestore.collection('users').doc(response.user.uid).set({
                first_name: split_name[0],
                last_name: split_name[split_name.length - 1],
                full_name: newUser.name,
                initials: split_name[0].charAt(0) + split_name[split_name.length - 1].charAt(0),
                tier: 0, // 0: Basic, 1: Personal, 2: Family,
                tabSlots: 4, // 3 tabs for basic program (+ Dashboard)
                tabs: [
                    {editable: false, icon: "columns", title: "Dashboard", color: "#ffffff", createdAt: new Date()} // Initial Dashboard tab
                ]
            })*/
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