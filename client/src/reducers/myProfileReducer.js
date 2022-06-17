import types from '../actions/ActionTypes';

const initialState = {
  myProfileData: null,
};

const myProfileReducer = (state = initialState, action) => {
  console.log('enter profile reducer');
  console.log('action.payload: ', action.payload);
  switch (action.type) {
    case types.SAVE_USER_PROFILE:
      return {
        ...state,
        myProfileData: action.payload,
      };
    default:
      return state;
  }
};

export default myProfileReducer;
