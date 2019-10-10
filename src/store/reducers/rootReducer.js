//> Reducers
// Authentication
import authReducer from './authReducer'

//> Redux
import { combineReducers } from 'redux'

//> Firestore reducer
import { firestoreReducer } from 'redux-firestore'

//> Firebase reducer
import { firebaseReducer } from 'react-redux-firebase'

const rootReducer = combineReducers({
    auth: authReducer,
    firestore: firestoreReducer,
    firebase: firebaseReducer // Authentication
})

export default rootReducer;

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
