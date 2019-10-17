// Have initial state for when state is not ready to be passed
const initState = {
  postError: null,
}

const postReducer = (state = initState, action) => {
  switch(action.type){
      case 'CREATION_SUCCESS':
        console.log('Creation success');
        return {
          ...state,
          postError: null,
        }
      case 'CREATION_ERROR':
        console.log('Creation error',action.err);
        return {
          ...state,
          postError: action.err
        };
      case 'CREATION_SPAM':
        console.log('Post is spam',action.err);
        return {
          ...state,
          postError: action.err
        };
      case 'LOAD_SUCCESS':
        console.log('Loading success');
        return {
          ...state,
          authError: null,
          results: action.results
        };
      case 'LOAD_ERROR':
        console.log('Loading error');
        return {
          ...state,
          authError: action.err
        };
      default:
        return state;
  }
}

export default postReducer;

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Christian Aichner
 */
