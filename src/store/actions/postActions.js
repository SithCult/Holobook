export const createPost = (newPost) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        const firebase = getFirebase();
        const firestore = getFirestore();

        // Get userId
        let uid = newPost.uid;
        // Create a unique id for the post
        let uniqueID = newPost.timestamp+uid.toString().substring(0,15);

        // Spam prevention
        firestore.collection('posts').where("uid","==",uid).limit(2).orderBy("timestamp","desc").get()
        .then((querySnapshot) => {
            let results = [];
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                results.push(doc.data());
                console.log("RESULTS",results);
            });

            if(results){
                if(results[0].content !== newPost.content){
                    console.log(results[0]);
                    // Create post
                    firestore.collection('posts').doc(uniqueID)
                    .set({
                        ...newPost
                    }).then(() => {
                        dispatch({ type: 'CREATION_SUCCESS', newPost });
                    }).catch((err) => {
                        dispatch({ type: 'CREATION_ERROR', err });
                    })
                } else {
                    dispatch({ type: 'CREATION_SPAM', err: "Spam prevention" });
                }
            }
        })
        .catch((err) => {
            dispatch({ type: 'CREATION_ERROR', err });
        });
    }
}

export const loadPosts = (amount) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        const firebase = getFirebase();
        const firestore = getFirestore();

        firestore.collection('posts').orderBy("timestamp","desc").limit(amount).get()
        .then((querySnapshot) => {
            let results = [];
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                results.push(doc.data());
                console.log(results);
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