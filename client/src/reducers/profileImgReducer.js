import types from '../actions/ActionTypes';

const initialState = {
  profileImg: null,
};

const profileImgReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_PROFILE_IMG:
      return {
        ...state,
        profileImg: action.payload,
      };
    default:
      return state;
  }
};

export default profileImgReducer;
