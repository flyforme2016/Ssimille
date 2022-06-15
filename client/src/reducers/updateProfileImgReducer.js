import types from '../actions/ActionTypes';

const initialState = {
  profileImgUri: null,
};

const updateProfileImgReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_PROFILE_IMG:
      return {
        ...state,
        profileImgUri: action.payload,
      };
    default:
      return state;
  }
};

export default updateProfileImgReducer;
