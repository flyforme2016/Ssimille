import types from '../actions/ActionTypes';

const initialState = {
  userLocation: null,
};

const userLocationReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SAVE_USER_LOCATION:
      return {
        ...state,
        userLocation: action.payload,
      };
    default:
      return state;
  }
};

export default userLocationReducer;
