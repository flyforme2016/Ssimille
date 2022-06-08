import types from '../actions/ActionTypes';

const initialState = {
  profileImg: null,
};

const uploadProfileImgReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.UPLOAD_PROFILE_IMG:
      console.log('Enter upload profile image reducer');
      return {
        ...state,
        profileImg: action.payload,
      };
    default:
      return state;
  }
};

export default uploadProfileImgReducer;
