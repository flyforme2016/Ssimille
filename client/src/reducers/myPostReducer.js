import types from '../actions/ActionTypes';

const initialState = {
  myPosts: null,
};

const myPostReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SAVE_MY_POST:
      return {
        ...state,
        myPosts: action.payload,
      };
    default:
      return state;
  }
};

export default myPostReducer;
