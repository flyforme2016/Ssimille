import types from '../actions/ActionTypes';

const initialState = {
  myProfileData: null,
};

const myProfileReducer = (state = initialState, action) => {
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
