export const createPost = (newPost) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        const firebase = getFirebase();
        const firestore = getFirestore();

        console.log(newPost);

        // Get userId
        let uid = newPost.details.author.uid;
        let uniqueID = newPost.details.timestamp+uid.toString().substring(0,15);
        
        console.log(uniqueID);

        firestore.collection('posts').doc(uniqueID)
        .set({
          ...newPost
        }).then(() => {
          console.log("Success");
            //dispatch({ type: 'CREATE_TAB', tab });
        }).catch((err) => {
          console.log(err);
            //dispatch({ type: 'CREATE_TAB_ERROR', err });
        })

    }
}

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Christian Aichner
 */