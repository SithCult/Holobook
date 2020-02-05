export const createPost = (newPost) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        const firebase = getFirebase();
        const firestore = getFirestore();

        // Get userId
        let uid = newPost.uid;
        // Create a unique id for the post
        let uniqueID = newPost.timestamp+uid.toString().substring(0,15);

        // Create post
        firestore.collection('posts').doc(uniqueID)
        .set({
            ...newPost
        }).then(() => {
            dispatch({ type: 'CREATION_SUCCESS', newPost });
            return 
        }).catch((err) => {
            dispatch({ type: 'CREATION_ERROR', err });
        })
    }
}

export const loadPosts = (amount) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        const firebase = getFirebase();
        const firestore = getFirestore();
        dispatch({ type: 'LOAD_LOADING' });

        firestore.collection('posts').orderBy("timestamp","desc").limit(amount).get()
        .then((querySnapshot) => {
            let results = [];
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                results.push(doc.data());
            });
            dispatch({ type: 'LOAD_SUCCESS', results });
        })
        .catch((err) => {
            dispatch({ type: 'LOAD_ERROR', err });
        });
    }
}

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Christian Aichner
 */